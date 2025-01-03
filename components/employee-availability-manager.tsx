"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" }
]

interface Availability {
  id: string
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

interface Employee {
  id: string
  full_name: string
}

export function EmployeeAvailabilityManager() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [dayOfWeek, setDayOfWeek] = useState<string>("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (selectedEmployee) {
      fetchAvailabilities()
    }
  }, [selectedEmployee])

  const fetchEmployees = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('is_active', true)
        .order('full_name')

      if (error) throw error
      setEmployees(data || [])
    } catch (error) {
      toast({
        title: "Error fetching employees",
        description: error instanceof Error ? error.message : "Failed to fetch employees",
        variant: "destructive"
      })
    }
  }

  const fetchAvailabilities = async () => {
    if (!selectedEmployee) return

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data, error } = await supabase
        .from('employee_availability')
        .select('*')
        .eq('profile_id', selectedEmployee)
        .order('day_of_week')

      if (error) throw error
      setAvailabilities(data || [])
    } catch (error) {
      toast({
        title: "Error fetching availabilities",
        description: error instanceof Error ? error.message : "Failed to fetch availabilities",
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee || !dayOfWeek || !startTime || !endTime) return

    setIsLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase
        .from('employee_availability')
        .insert([
          {
            profile_id: selectedEmployee,
            day_of_week: parseInt(dayOfWeek),
            start_time: startTime,
            end_time: endTime
          }
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Availability added successfully"
      })

      // Reset form
      setDayOfWeek("")
      setStartTime("")
      setEndTime("")

      // Refresh availabilities
      fetchAvailabilities()
    } catch (error) {
      toast({
        title: "Error adding availability",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { error } = await supabase
        .from('employee_availability')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Availability deleted successfully"
      })

      // Refresh availabilities
      fetchAvailabilities()
    } catch (error) {
      toast({
        title: "Error deleting availability",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="employee">Employee</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Select an employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEmployee && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Day of Week</Label>
                <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Availability"}
            </Button>
          </form>
        )}
      </div>

      {selectedEmployee && availabilities.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availabilities.map((availability) => (
              <TableRow key={availability.id}>
                <TableCell>
                  {DAYS_OF_WEEK[availability.day_of_week].label}
                </TableCell>
                <TableCell>{availability.start_time}</TableCell>
                <TableCell>{availability.end_time}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(availability.id)}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

