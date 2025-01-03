import { Metadata } from "next"
import { WeeklySchedule } from "@/components/schedule/weekly-schedule"
import { GenerateScheduleButton } from './components/generate-schedule-button'

export const metadata: Metadata = {
  title: "Schedule",
  description: "View and manage employee schedules",
}

export default function SchedulePage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <GenerateScheduleButton />
      </div>
      <WeeklySchedule />
    </div>
  )
}