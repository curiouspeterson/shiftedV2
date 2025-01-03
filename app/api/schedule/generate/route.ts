import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { addDays, format, parseISO, startOfWeek } from 'date-fns'
import { ShiftRequirement, ShiftAssignment } from '@/types/shift'

interface Employee {
  id: string
  full_name: string
  weekly_hour_limit: number
}

interface EmployeeAvailability {
  employee_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export async function POST(req: Request) {
  try {
    const { startDate } = await req.json()
    const cookieStore = cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // Get the start of the week
    const weekStart = startOfWeek(parseISO(startDate), { weekStartsOn: 0 })

    // 1. Get all shift requirements
    const { data: shiftRequirements, error: shiftError } = await supabase
      .from('shift_requirements')
      .select('*')
      .order('day_of_week, start_time')

    if (shiftError) throw new Error('Error fetching shift requirements')

    // 2. Get all active employees
    const { data: employees, error: employeeError } = await supabase
      .from('profiles')
      .select('id, full_name, weekly_hour_limit')
      .eq('is_active', true)

    if (employeeError) throw new Error('Error fetching employees')

    // 3. Get employee availability
    const { data: availability, error: availabilityError } = await supabase
      .from('employee_availability')
      .select('*')

    if (availabilityError) throw new Error('Error fetching employee availability')

    // Delete existing assignments for the week
    const weekEnd = addDays(weekStart, 6)
    const { error: deleteError } = await supabase
      .from('shift_assignments')
      .delete()
      .gte('date', format(weekStart, 'yyyy-MM-dd'))
      .lte('date', format(weekEnd, 'yyyy-MM-dd'))

    if (deleteError) throw new Error('Error deleting existing assignments')

    // Generate schedule for each day of the week
    const assignments: ShiftAssignment[] = []
    const conflicts: string[] = []

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDate = addDays(weekStart, dayOffset)
      const dayOfWeek = currentDate.getDay()
      
      // Get requirements for this day
      const dayRequirements = shiftRequirements.filter(
        (req: ShiftRequirement) => req.day_of_week === dayOfWeek
      )

      // Track employee hours for the week
      const employeeHours: Record<string, number> = {}

      for (const requirement of dayRequirements) {
        const availableEmployees = employees.filter((employee: Employee) => {
          // Check if employee is available for this shift
          const isAvailable = availability.some(
            (a: EmployeeAvailability) =>
              a.employee_id === employee.id &&
              a.day_of_week === dayOfWeek &&
              a.start_time <= requirement.start_time &&
              a.end_time >= requirement.end_time
          )

          // Calculate shift duration in hours
          const startHour = parseInt(requirement.start_time.split(':')[0])
          const endHour = parseInt(requirement.end_time.split(':')[0])
          const shiftDuration = endHour - startHour

          // Check if adding this shift would exceed weekly hours
          const currentHours = employeeHours[employee.id] || 0
          const wouldExceedLimit = currentHours + shiftDuration > employee.weekly_hour_limit

          return isAvailable && !wouldExceedLimit
        })

        // Assign employees to the shift
        for (let i = 0; i < requirement.required_count; i++) {
          if (availableEmployees.length > 0) {
            // Select employee with least hours
            const selectedEmployee = availableEmployees.reduce((min, emp) => 
              (employeeHours[emp.id] || 0) < (employeeHours[min.id] || 0) ? emp : min
            )

            // Create assignment
            const assignment: ShiftAssignment = {
              id: crypto.randomUUID(),
              employee_id: selectedEmployee.id,
              shift_requirement_id: requirement.id,
              date: format(currentDate, 'yyyy-MM-dd')
            }
            assignments.push(assignment)

            // Update employee hours
            const shiftDuration = 
              parseInt(requirement.end_time.split(':')[0]) - 
              parseInt(requirement.start_time.split(':')[0])
            employeeHours[selectedEmployee.id] = 
              (employeeHours[selectedEmployee.id] || 0) + shiftDuration

            // Remove employee from available pool for this shift
            const index = availableEmployees.indexOf(selectedEmployee)
            availableEmployees.splice(index, 1)
          } else {
            conflicts.push(
              `Unable to fill shift on ${format(currentDate, 'yyyy-MM-dd')} at ${requirement.start_time}`
            )
          }
        }
      }
    }

    // Insert new assignments
    if (assignments.length > 0) {
      const { error: insertError } = await supabase
        .from('shift_assignments')
        .insert(assignments)

      if (insertError) throw new Error('Error inserting assignments')
    }

    return NextResponse.json({
      success: true,
      assignmentsCount: assignments.length,
      conflicts
    })
  } catch (error) {
    console.error('Schedule generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate schedule' },
      { status: 500 }
    )
  }
} 