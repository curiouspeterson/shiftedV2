"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { AddShiftForm } from "@/components/add-shift-form"

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
    }
    getUserEmail()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Employee Schedule</h1>
      {userEmail && <p className="text-gray-600">Logged in as: {userEmail}</p>}
      <div className="grid gap-6 md:grid-cols-2">
        <ScheduleCalendar />
        <AddShiftForm />
      </div>
    </div>
  )
}


