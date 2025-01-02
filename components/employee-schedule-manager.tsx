"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, Edit } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Schedule = {
  id: string
  date: string
  start_time: string
  end_time: string
}

type Shift = {
  id: string
  name: string
  start_time: string
  end_time: string
}

export function EmployeeScheduleManager({ employeeId }: { employeeId: string }) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newSchedule, setNewSchedule] = useState({
    date: new Date(),
    shiftId: ""
  })

  useEffect(() => {
    fetchSchedules()
    fetchShifts()
  }, [employeeId])

  async function fetchSchedules() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employee_schedules')
        .select('*')
        .eq('user_id', employeeId)
        .order('date', { ascending: true })
    
      if (error) {
        console.error('Error fetching schedules:', error)
        throw error
      }
      setSchedules(data || [])
    } catch (error) {
      console.error('Error fetching schedules:', error)
      toast({
        title: "Error fetching schedules",
        description: "Please check the console for more details and try again later.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function fetchShifts() {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .order('name', { ascending: true })
    
      if (error) {
        console.error('Error fetching shifts:', error)
        throw error
      }
      setShifts(data || [])
    } catch (error) {
      console.error('Error fetching shifts:', error)
      toast({
        title: "Error fetching shifts",
        description: "Please check the console for more details and try again later.",
        variant: "destructive"
      })
    }
  }

  async function createSchedule(e: React.FormEvent) {
    e.preventDefault()
    try {
      const selectedShift = shifts.find(shift => shift.id === newSchedule.shiftId)
      if (!selectedShift) {
        throw new Error("Selected shift not found")
      }

      const scheduleData = { 
        user_id: employeeId,
        date: format(newSchedule.date, 'yyyy-MM-dd'),
        start_time: selectedShift.start_time,
        end_time: selectedShift.end_time
      }

      const { data, error } = await supabase
        .from('employee_schedules')
        .insert([scheduleData])
        .select()
    
      if (error) {
        console.error('Error adding schedule:', error)
        throw error
      }
    
      if (!data || data.length === 0) {
        throw new Error('No data returned from insert operation')
      }

      toast({
        title: "Schedule added",
        description: "The new schedule has been added successfully."
      })
    
      setNewSchedule({ date: new Date(), shiftId: "" })
      setSchedules(prev => [...prev, ...(data as Schedule[])])
    } catch (error) {
      console.error('Error adding schedule:', error)
      toast({
        title: "Error adding schedule",
        description: "Please check the console for more details and try again.",
        variant: "destructive"
      })
    }
  }

  async function updateSchedule(id: string, updatedData: Partial<Schedule>) {
    try {
      const { data, error } = await supabase
        .from('employee_schedules')
        .update(updatedData)
        .eq('id', id)
        .select()
      
      if (error) {
        console.error('Error updating schedule:', error)
        throw error
      }
      
      toast({
        title: "Schedule updated",
        description: "The schedule has been updated successfully."
      })
      
      setEditingId(null)
      setSchedules(prev => prev.map(item => item.id === id ? (data[0] as Schedule) : item))
    } catch (error) {
      console.error('Error updating schedule:', error)
      toast({
        title: "Error updating schedule",
        description: "Please check the console for more details and try again.",
        variant: "destructive"
      })
    }
  }

  async function deleteSchedule(id: string) {
    try {
      const { error } = await supabase
        .from('employee_schedules')
        .delete()
        .eq('id', id)
    
      if (error) {
        console.error('Error deleting schedule:', error)
        throw error
      }
      
      toast({
        title: "Schedule deleted",
        description: "The schedule has been deleted successfully."
      })
      
      setSchedules(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting schedule:', error)
      toast({
        title: "Error deleting schedule",
        description: "Please check the console for more details and try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createSchedule} className="space-y-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={newSchedule.date}
                onSelect={(date) => setNewSchedule({ ...newSchedule, date: date || new Date() })}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shift">Shift</Label>
              <Select
                value={newSchedule.shiftId}
                onValueChange={(value) => setNewSchedule({ ...newSchedule, shiftId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a shift" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.name} ({shift.start_time} - {shift.end_time})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={!newSchedule.shiftId}>
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <p>No schedules set for this employee.</p>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <Card key={schedule.id}>
                  <CardContent className="p-4">
                    {editingId === schedule.id ? (
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        updateSchedule(schedule.id, {
                          start_time: (e.target as any).start_time.value,
                          end_time: (e.target as any).end_time.value
                        })
                      }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`start_time_${schedule.id}`}>Start Time</Label>
                            <Input
                              id={`start_time_${schedule.id}`}
                              name="start_time"
                              type="time"
                              defaultValue={schedule.start_time}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`end_time_${schedule.id}`}>End Time</Label>
                            <Input
                              id={`end_time_${schedule.id}`}
                              name="end_time"
                              type="time"
                              defaultValue={schedule.end_time}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="submit">Save</Button>
                          <Button type="button" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{format(parseISO(schedule.date), 'MMMM d, yyyy')}</p>
                          <p className="text-sm text-muted-foreground">
                            {schedule.start_time} - {schedule.end_time}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingId(schedule.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteSchedule(schedule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

