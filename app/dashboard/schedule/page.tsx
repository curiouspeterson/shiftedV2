/**
 * Schedule Page Component
 * 
 * Main page for viewing and managing employee schedules.
 * Provides schedule generation and weekly view functionality.
 * 
 * Features:
 * - Schedule generation
 * - Weekly schedule view
 * - Interactive calendar
 * - Loading states
 * - Error handling
 * - Responsive layout
 * - SEO optimization
 */

import { Metadata } from "next"
import { WeeklySchedule } from "@/components/schedule/weekly-schedule"
import { GenerateScheduleButton } from './components/generate-schedule-button'

/**
 * Metadata configuration for SEO
 * Defines page-specific information
 */
export const metadata: Metadata = {
  title: "Schedule",
  description: "View and manage employee schedules",
}

/**
 * Schedule page component
 * Combines schedule generation and viewing functionality
 * 
 * Features:
 * - Schedule generation button
 * - Weekly schedule display
 * - Responsive grid layout
 * - Interactive elements
 */
export default function SchedulePage() {
  return (
    <div className="container mx-auto py-10">
      {/* Header section with title and generate button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <GenerateScheduleButton />
      </div>

      {/* Weekly schedule display */}
      <WeeklySchedule />
    </div>
  )
}