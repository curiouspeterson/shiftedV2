/**
 * Shifts Page Component
 * 
 * Main page component for managing shift requirements.
 * Provides an interface for viewing and managing recurring shift schedules.
 * 
 * Features:
 * - Shift requirements management
 * - Page metadata
 * - Responsive layout
 * - SEO optimization
 */

import { Metadata } from "next"
import { ShiftRequirements } from "./components/shift-requirements"

/**
 * Page metadata configuration
 * Defines title and description for SEO
 */
export const metadata: Metadata = {
  title: "Shift Requirements",
  description: "Manage recurring shift requirements",
}

/**
 * Shifts management page component
 * Renders the shift requirements interface
 */
export default function ShiftsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Page header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Shift Requirements</h2>
      </div>
      {/* Shift requirements component */}
      <ShiftRequirements />
    </div>
  )
}