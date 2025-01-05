import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { parseISO, startOfWeek, addDays } from 'date-fns'
import { Database } from '@/types/supabase'

type DbProfile = Database['public']['Tables']['profiles']['Row']
type DbEmployeeAvailability = Database['public']['Tables']['employee_availability']['Row']
type DbShiftRequirement = Database['public']['Tables']['shift_requirements']['Row']
type DbShiftAssignment = Database['public']['Tables']['shift_assignments']['Insert']

interface ProfileWithAvailability extends DbProfile {
  availability: DbEmployeeAvailability[]
  weekly_hour_limit: number
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const { startDate } = await req.json()

    if (!startDate) {
      return NextResponse.json(
        { error: 'startDate is required' },
        { status: 400 }
      )
    }

    const parsedStartDate = parseISO(startDate)
    if (isNaN(parsedStartDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid startDate format' },
        { status: 400 }
      )
    }

    // Get the start of the week
    const weekStart = startOfWeek(parsedStartDate, { weekStartsOn: 0 }) // Sunday as first day

    // Fetch all shift requirements
    const { data: shiftRequirements, error: shiftError } = await supabase
      .from('shift_requirements')
      .select('*')
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })
      .returns<DbShiftRequirement[]>()

    if (shiftError || !shiftRequirements) {
      throw new Error('Error fetching shift requirements')
    }

    // Fetch all active employees with their availability
    const { data: employeesData, error: employeesError } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        role,
        is_active,
        created_at,
        updated_at,
        weekly_hour_limit,
        availability:employee_availability (
          id,
          profile_id,
          day_of_week,
          start_time,
          end_time,
          created_at
        )
      `)
      .eq('is_active', true)

    if (employeesError || !employeesData) {
      throw new Error('Error fetching employees')
    }

    // Transform the Supabase response into our Employee type
    const employees: ProfileWithAvailability[] = employeesData.map((data: any) => ({
      ...data,
      weekly_hour_limit: data.weekly_hour_limit || 40, // Default to 40 hours if not set
      availability: data.availability || [],
    }))

    const schedule: {
      [date: string]: DbShiftAssignment[]
    } = {}

    // Helper function to calculate hours between two times
    const calculateHours = (start: string, end: string): number => {
      const [startHour, startMinute] = start.split(':').map(Number)
      const [endHour, endMinute] = end.split(':').map(Number)
      return endHour - startHour + (endMinute - startMinute) / 60
    }

    // Initialize employee hours tracker
    const employeeHours: { [employeeId: string]: number } = {}
    employees.forEach((emp) => {
      employeeHours[emp.id] = 0
    })

    // Iterate over each day of the week
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(weekStart, i)
      const dateStr = currentDate.toISOString().split('T')[0] // YYYY-MM-DD
      const dayOfWeek = currentDate.getDay() // 0 = Sunday

      const shiftsForDay = shiftRequirements.filter(
        (shift) => shift.day_of_week === dayOfWeek
      )

      schedule[dateStr] = []

      for (const shift of shiftsForDay) {
        let assignedCount = 0
        const availableEmployees = employees.filter((employee) => {
          // Check if employee is available for this shift
          return employee.availability.some((slot) => {
            if (slot.day_of_week !== dayOfWeek) return false
            return (
              slot.start_time <= shift.start_time &&
              slot.end_time >= shift.end_time
            )
          })
        })

        // Sort employees by least hours worked to balance workload
        availableEmployees.sort(
          (a, b) => employeeHours[a.id] - employeeHours[b.id]
        )

        for (const employee of availableEmployees) {
          if (assignedCount >= shift.required_count) break

          const shiftHours = calculateHours(shift.start_time, shift.end_time)
          if (
            employeeHours[employee.id] + shiftHours <=
            employee.weekly_hour_limit
          ) {
            const assignment: DbShiftAssignment = {
              shift_requirement_id: shift.id,
              profile_id: employee.id,
              date: dateStr,
              start_time: shift.start_time,
              end_time: shift.end_time,
            }
            schedule[dateStr].push(assignment)
            employeeHours[employee.id] += shiftHours
            assignedCount++
          }
        }

        // Handle understaffing
        if (assignedCount < shift.required_count) {
          console.warn(
            `Understaffed shift on ${dateStr} for shift_requirement_id ${shift.id}`
          )
        }
      }
    }

    // Insert the generated schedule into shift_assignments
    const assignmentsToInsert = Object.values(schedule).flat()

    const { error: insertError } = await supabase
      .from('shift_assignments')
      .insert(assignmentsToInsert as any)

    if (insertError) {
      throw new Error('Error inserting shift assignments')
    }

    return NextResponse.json(
      { message: 'Schedule generated successfully', schedule },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error generating schedule:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
} 