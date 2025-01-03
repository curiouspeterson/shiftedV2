import { Metadata } from "next"
import { WeeklySchedule } from "@/components/schedule/weekly-schedule"

export const metadata: Metadata = {
  title: "Schedule",
  description: "View and manage employee schedules",
}

export default function SchedulePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
      </div>
      <WeeklySchedule />
    </div>
  )
}