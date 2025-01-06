/**
 * Schedule Generation API Route
 * 
 * This API endpoint handles the automatic generation of employee work schedules.
 * It takes into account:
 * - Employee availability
 * - Weekly hour limits
 * - Shift requirements for each day
 * - Fair distribution of hours among employees
 * 
 * The algorithm attempts to create an optimal schedule while respecting all constraints
 * and warns about any understaffing situations.
 */

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { parseISO, startOfWeek, addDays } from 'date-fns'
import { Database } from '@/types/supabase'

// Type definitions for database entities
type DbProfile = Database['public']['Tables']['profiles']['Row']
type DbEmployeeAvailability = Database['public']['Tables']['employee_availability']['Row']
type DbShiftRequirement = Database['public']['Tables']['shift_requirements']['Row']
type DbShiftAssignment = Database['public']['Tables']['shift_assignments']['Insert']

/**
 * Extended profile interface that includes availability and hour constraints
 */
interface ProfileWithAvailability extends DbProfile {
  availability: DbEmployeeAvailability[]
  weekly_hour_limit: number
}

export async function POST(req: Request) {
  try {
    const supabase = createAdminClient()
    const { startDate } = await req.json()

    // Input validation for required startDate
    if (!startDate) {
      return NextResponse.json(
        { error: 'startDate is required' },
        { status: 400 }
      )
    }

    // Validate date format
    const parsedStartDate = parseISO(startDate)
    if (isNaN(parsedStartDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid startDate format' },
        { status: 400 }
      )
    }

    // Normalize to start of week for consistent scheduling
    const weekStart = startOfWeek(parsedStartDate, { weekStartsOn: 0 }) // Sunday as first day

    // Fetch shift requirements ordered by day and time
    const { data: shiftRequirements, error: shiftError } = await supabase
      .from('shift_requirements')
      .select()
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    if (shiftError || !shiftRequirements) {
      throw new Error('Error fetching shift requirements')
    }

    const typedShiftRequirements: DbShiftRequirement[] = shiftRequirements

    // Fetch active employees with their availability preferences
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

    // Transform employee data and set default hour limits
    const employees: ProfileWithAvailability[] = employeesData.map((data: any) => ({
      ...data,
      weekly_hour_limit: data.weekly_hour_limit || 40, // Default to 40 hours if not set
      availability: data.availability || [],
    }))

    const schedule: {
      [date: string]: DbShiftAssignment[]
    } = {}

    /**
     * Helper function to calculate hours between two time strings
     * @param start - Start time in HH:MM format
     * @param end - End time in HH:MM format
     * @returns Number of hours between start and end times
     */
    const calculateHours = (start: string, end: string): number => {
      const [startHour, startMinute] = start.split(':').map(Number)
      const [endHour, endMinute] = end.split(':').map(Number)
      return endHour - startHour + (endMinute - startMinute) / 60
    }

    // Initialize tracking of weekly hours for each employee
    const employeeHours: { [employeeId: string]: number } = {}
    employees.forEach((emp) => {
      employeeHours[emp.id] = 0
    })

    // Generate schedule for each day of the week
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(weekStart, i)
      const dateStr = currentDate.toISOString().split('T')[0] // YYYY-MM-DD
      const dayOfWeek = currentDate.getDay() // 0 = Sunday

      // Get shifts needed for current day
      const shiftsForDay = typedShiftRequirements.filter(
        (shift) => shift.day_of_week === dayOfWeek
      )

      schedule[dateStr] = []

      // Assign employees to each shift
      for (const shift of shiftsForDay) {
        let assignedCount = 0
        // Filter employees available for this specific shift
        const availableEmployees = employees.filter((employee) => {
          return employee.availability.some((slot) => {
            if (slot.day_of_week !== dayOfWeek) return false
            return (
              slot.start_time <= shift.start_time &&
              slot.end_time >= shift.end_time
            )
          })
        })

        // Sort by least hours worked for fair distribution
        availableEmployees.sort(
          (a, b) => employeeHours[a.id] - employeeHours[b.id]
        )

        // Assign shifts while respecting hour limits
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

        // Log warning if shift is understaffed
        if (assignedCount < shift.required_count) {
          console.warn(
            `Understaffed shift on ${dateStr} for shift_requirement_id ${shift.id}`
          )
        }
      }
    }

    // Persist generated schedule to database
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