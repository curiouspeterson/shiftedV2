"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

interface ScheduleEditorProps {
  date: Date
  onSave: (data: any) => void
}

export function ScheduleEditor({ date, onSave }: ScheduleEditorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Schedule</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit Schedule for {format(date, "EEEE, MMMM dd, yyyy")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Coverage Requirements Editor */}
          <div>
            <h3 className="font-medium mb-4">Coverage Requirements</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <Input type="time" />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input type="time" />
                </div>
                <div>
                  <Label>Position</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="barista">Barista</SelectItem>
                      <SelectItem value="server">Server</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Required</Label>
                  <Input type="number" min="1" />
                </div>
              </div>
              <Button variant="outline">+ Add Requirement</Button>
            </div>
          </div>

          {/* Shift Assignments Editor */}
          <div>
            <h3 className="font-medium mb-4">Shift Assignments</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Employee</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Position</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="barista">Barista</SelectItem>
                      <SelectItem value="server">Server</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Start Time</Label>
                  <Input type="time" />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input type="time" />
                </div>
              </div>
              <Button variant="outline">+ Add Shift</Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            // Handle save
            setOpen(false)
          }}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 