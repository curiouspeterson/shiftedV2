"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScheduleCalendar } from "@/components/schedule-calendar"
import { AddShiftForm } from "@/components/add-shift-form"

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUserEmail(user?.email ?? null)
      } catch (error) {
        console.error('Error fetching user:', error)
        setUserEmail(null)
      }
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


