"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, Trash2, Edit, ShieldCheck } from 'lucide-react'

const SUPER_ADMIN_ID = "c134de5f-8915-46b6-96d1-7e5f4069b142";

type Availability = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
}

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

export function EmployeeAvailabilityManager({ employeeId }: { employeeId: string }) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [roleLoading, setRoleLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newAvailability, setNewAvailability] = useState({
    day_of_week: "",
    start_time: "",
    end_time: ""
  })
  const [userRole, setUserRole] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchUserRole();
    fetchAvailabilities();
    async function getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
      setIsSuperAdmin(user?.id === SUPER_ADMIN_ID);
    }
    getCurrentUser();
  }, [employeeId])

  async function fetchUserRole() {
    try {
      setRoleLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No authenticated user found")

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setUserRole(data.role)
    } catch (error) {
      console.error('Error fetching user role:', error)
      toast({
        title: "Error fetching user role",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setRoleLoading(false)
    }
  }

  async function fetchAvailabilities() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employee_availability')
        .select('*')
        .eq('user_id', employeeId)
        .order('day_of_week', { ascending: true })
    
      if (error) throw error
      setAvailabilities(data || [])
    } catch (error) {
      console.error('Error fetching availabilities:', error)
      toast({
        title: "Error fetching availabilities",
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  async function createAvailability(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('employee_availability')
        .insert([
          { 
            user_id: employeeId,
            day_of_week: parseInt(newAvailability.day_of_week),
            start_time: newAvailability.start_time,
            end_time: newAvailability.end_time
          }
        ])
        .select()
      
      if (error) throw error
      
      toast({
        title: "Availability added",
        description: "The new availability has been added successfully."
      })
      
      setNewAvailability({ day_of_week: "", start_time: "", end_time: "" })
      setAvailabilities(prev => [...prev, ...(data as Availability[])])
    } catch (error) {
      console.error('Error adding availability:', error)
      toast({
        title: "Error adding availability",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      })
    }
  }

  async function updateAvailability(id: string, updatedData: Partial<Availability>) {
    try {
      const { data, error } = await supabase
        .from('employee_availability')
        .update(updatedData)
        .eq('id', id)
        .select()
      
      if (error) throw error
      
      toast({
        title: "Availability updated",
        description: "The availability has been updated successfully."
      })
      
      setEditingId(null)
      setAvailabilities(prev => prev.map(item => item.id === id ? (data[0] as Availability) : item))
    } catch (error) {
      console.error('Error updating availability:', error)
      toast({
        title: "Error updating availability",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      })
    }
  }

  async function deleteAvailability(id: string) {
    try {
      const { error } = await supabase
        .from('employee_availability')
        .delete()
        .eq('id', id)
    
      if (error) throw error
      
      toast({
        title: "Availability deleted",
        description: "The availability has been deleted successfully."
      })
      
      setAvailabilities(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting availability:', error)
      toast({
        title: "Error deleting availability",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive"
      })
    }
  }

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const canManageAvailability = userRole === 'manager' || employeeId === currentUserId || isSuperAdmin;

  return (
    <div className="space-y-6">
      {isSuperAdmin && (
        <div className="flex items-center justify-center bg-yellow-100 p-2 rounded-md">
          <ShieldCheck className="h-5 w-5 text-yellow-600 mr-2" />
          <span className="text-yellow-600 font-semibold">Super Admin Mode</span>
        </div>
      )}
      
      {canManageAvailability && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createAvailability} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="day_of_week">Day of Week</Label>
                  <Select
                    value={newAvailability.day_of_week}
                    onValueChange={(value) => setNewAvailability({ ...newAvailability, day_of_week: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day, index) => (
                        <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={newAvailability.start_time}
                    onChange={(e) => setNewAvailability({ ...newAvailability, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={newAvailability.end_time}
                    onChange={(e) => setNewAvailability({ ...newAvailability, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add Availability
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Availabilities</CardTitle>
        </CardHeader>
        <CardContent>
          {availabilities.length === 0 ? (
            <p>No availabilities set for this employee.</p>
          ) : (
            <div className="space-y-4">
              {availabilities.map((availability) => (
                <Card key={availability.id}>
                  <CardContent className="p-4">
                    {editingId === availability.id && canManageAvailability ? (
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        updateAvailability(availability.id, {
                          day_of_week: parseInt((e.target as any).day_of_week.value),
                          start_time: (e.target as any).start_time.value,
                          end_time: (e.target as any).end_time.value
                        })
                      }} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`day_of_week_${availability.id}`}>Day of Week</Label>
                            <Select
                              name="day_of_week"
                              defaultValue={availability.day_of_week.toString()}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {daysOfWeek.map((day, index) => (
                                  <SelectItem key={index} value={index.toString()}>{day}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`start_time_${availability.id}`}>Start Time</Label>
                            <Input
                              id={`start_time_${availability.id}`}
                              name="start_time"
                              type="time"
                              defaultValue={availability.start_time}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`end_time_${availability.id}`}>End Time</Label>
                            <Input
                              id={`end_time_${availability.id}`}
                              name="end_time"
                              type="time"
                              defaultValue={availability.end_time}
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
                          <p className="font-medium">{daysOfWeek[availability.day_of_week]}</p>
                          <p className="text-sm text-muted-foreground">
                            {availability.start_time} - {availability.end_time}
                          </p>
                        </div>
                        {canManageAvailability && (
                          <div className="space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingId(availability.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteAvailability(availability.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
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

