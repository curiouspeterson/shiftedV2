"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export function AddShiftForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Shift</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="date">Date</label>
            <Input type="date" id="date" />
          </div>
          <div className="space-y-2">
            <label htmlFor="startTime">Start Time</label>
            <Input type="time" id="startTime" />
          </div>
          <div className="space-y-2">
            <label htmlFor="endTime">End Time</label>
            <Input type="time" id="endTime" />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button>Add Shift</Button>
      </CardFooter>
    </Card>
  )
}

