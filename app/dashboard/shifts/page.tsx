"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { format, parseISO } from "date-fns"
import { Loader2, Plus, Trash2 } from 'lucide-react'

type Shift = {
  id: string
  name: string
  description: string
  start_time: string
  end_time: string
}

type Employee = {
  id: string
  full_name: string;
  user_email: string
}

type ShiftAssignment = {
  id: string
  shift_id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([])
  const [newShift, setNewShift] = useState({
    name: "",
    description: "",
    start_time: "09:00",
    end_time: "17:00"
  })
  const [loading, setLoading] = useState(true)
  const [assigningShift, setAssigningShift] = useState<string | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  useEffect(() => {
    fetchShifts()
    fetchEmployees()
    fetchAssignments()
  }, [])

  async function fetchShifts() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .order('start_time', { ascending: true })
      
      if (error) throw error
      setShifts(data || [])
    } catch (error) {
      console.error('Error fetching shifts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchEmployees() {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, user_email')
      
      if (error) throw error
      setEmployees(profiles || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  async function fetchAssignments() {
    try {
      const { data, error } = await supabase
        .from('shift_assignments')
        .select('*')
      
      if (error) throw error
      setAssignments(data || [])
    } catch (error) {
      console.error('Error fetching assignments:', error)
    }
  }

  async function createShift(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('shifts')
        .insert([newShift])
      
      if (error) throw error
      
      fetchShifts()
      setNewShift({
        name: "",
        description: "",
        start_time: "09:00",
        end_time: "17:00"
      })
    } catch (error) {
      console.error('Error creating shift:', error)
    }
  }

  async function deleteShift(id: string) {
    try {
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      fetchShifts()
      fetchAssignments()
    } catch (error) {
      console.error('Error deleting shift:', error)
    }
  }

  async function assignShift(shiftId: string, employeeId: string) {
    try {
      const { error } = await supabase
        .from('shift_assignments')
        .insert([{ shift_id: shiftId, user_id: employeeId, status: 'pending' }])
      
      if (error) throw error
      fetchAssignments()
      setAssigningShift(null)
      setSelectedEmployee(null)
    } catch (error) {
      console.error('Error assigning shift:', error)
    }
  }

  function calculateHours(start: string, end: string) {
    const startDate = parseISO(`2000-01-01T${start}`)
    const endDate = parseISO(`2000-01-01T${end}`)
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
    return Math.abs(hours)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shift Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createShift} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="shiftName">Shift Name</Label>
                <Input
                  id="shiftName"
                  placeholder="Shift Name"
                  value={newShift.name}
                  onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="shiftDescription">Description</Label>
                <Input
                  id="shiftDescription"
                  placeholder="Shift Description"
                  value={newShift.description}
                  onChange={(e) => setNewShift({ ...newShift, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newShift.start_time}
                    onChange={(e) => setNewShift({ ...newShift, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newShift.end_time}
                    onChange={(e) => setNewShift({ ...newShift, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <Button type="submit">Create Shift</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Shifts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : shifts.length === 0 ? (
            <p>No shifts created yet.</p>
          ) : (
            <div className="space-y-4">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between border-b border-gray-200 py-4 last:border-0"
                >
                  <div>
                    <h3 className="font-medium">{shift.name}</h3>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(`2000-01-01T${shift.start_time}`), 'h:mm a')} - {format(parseISO(`2000-01-01T${shift.end_time}`), 'h:mm a')}
                      {' '}({calculateHours(shift.start_time, shift.end_time)} hours)
                    </p>
                    {shift.description && (
                      <p className="text-sm text-gray-600 mt-1">{shift.description}</p>
                    )}
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Assigned Employees:</h4>
                      <ul className="text-sm text-gray-600">
                        {assignments
                          .filter(a => a.shift_id === shift.id)
                          .map(assignment => {
                            const employee = employees.find(e => e.id === assignment.user_id)
                            return employee ? (
                              <li key={assignment.id}>{employee.user_email} - {assignment.status}</li>
                            ) : null
                          })
                        }
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {assigningShift === shift.id ? (
                      <div className="flex items-center space-x-2">
                        <Select value={selectedEmployee || ''} onValueChange={setSelectedEmployee}>
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.user_email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={() => selectedEmployee && assignShift(shift.id, selectedEmployee)}
                          disabled={!selectedEmployee}
                        >
                          Assign
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setAssigningShift(shift.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteShift(shift.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

