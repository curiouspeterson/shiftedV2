"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
]

export function AvailabilityList({ availabilities, onAvailabilityUpdated, onAvailabilityDeleted }) {
  const [editingId, setEditingId] = useState(null)
  const [editStartTime, setEditStartTime] = useState("")
  const [editEndTime, setEditEndTime] = useState("")

  const handleEdit = (availability) => {
    setEditingId(availability.id)
    setEditStartTime(availability.start_time)
    setEditEndTime(availability.end_time)
  }

  const handleUpdate = async (id) => {
    try {
      const { error } = await supabase
        .from('employee_availability')
        .update({ start_time: editStartTime, end_time: editEndTime })
        .eq('id', id)
      
      if (error) throw error
      
      setEditingId(null)
      onAvailabilityUpdated()
    } catch (error) {
      console.error('Error updating availability:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('employee_availability')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      onAvailabilityDeleted()
    } catch (error) {
      console.error('Error deleting availability:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Availabilities</CardTitle>
      </CardHeader>
      <CardContent>
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
                <TableCell>{daysOfWeek[availability.day_of_week]}</TableCell>
                <TableCell>
                  {editingId === availability.id ? (
                    <Input
                      type="time"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                    />
                  ) : (
                    availability.start_time
                  )}
                </TableCell>
                <TableCell>
                  {editingId === availability.id ? (
                    <Input
                      type="time"
                      value={editEndTime}
                      onChange={(e) => setEditEndTime(e.target.value)}
                    />
                  ) : (
                    availability.end_time
                  )}
                </TableCell>
                <TableCell>
                  {editingId === availability.id ? (
                    <Button onClick={() => handleUpdate(availability.id)}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEdit(availability)}>Edit</Button>
                  )}
                  <Button variant="destructive" onClick={() => handleDelete(availability.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

