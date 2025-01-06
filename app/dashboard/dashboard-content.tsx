"use client"

import * as React from "react"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { AddShiftForm } from "@/components/add-shift-form"

export interface DashboardContentProps {
  userEmail: string | null
}

export function DashboardContent({ userEmail }: DashboardContentProps) {
  return (
    <>
      {userEmail && <p className="text-gray-600">Logged in as: {userEmail}</p>}
      
      <div className="grid gap-6 md:grid-cols-2">
        <ScheduleCalendar />
        <AddShiftForm />
      </div>
    </>
  )
} 