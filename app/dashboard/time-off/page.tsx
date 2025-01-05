/**
 * Time Off Page Component
 * 
 * Main page component for managing employee time off requests.
 * Provides a form for submitting new requests and a list view of existing requests.
 * 
 * Features:
 * - Time off request submission
 * - Request list display
 * - Real-time updates
 * - Responsive layout
 * - Component refresh handling
 */

"use client"

import { TimeOffRequestForm } from "@/components/time-off-request-form"
import { TimeOffRequestsList } from "@/components/time-off-requests-list"

/**
 * Time off management page component
 * Coordinates the request form and list components
 */
export default function TimeOffPage() {
  /**
   * Handles successful request submission
   * Forces a refresh of the requests list component
   */
  const handleRequestSubmitted = () => {
    // Force a re-render of the list component
    const list = document.querySelector('[data-component="time-off-requests-list"]')
    if (list) {
      list.setAttribute('data-refresh', Date.now().toString())
    }
  }

  return (
    <div className="container mx-auto py-10">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-8">Time Off Requests</h1>
      {/* Two-column layout for form and list */}
      <div className="grid gap-6 md:grid-cols-2">
        <TimeOffRequestForm onSubmit={handleRequestSubmitted} />
        <TimeOffRequestsList data-component="time-off-requests-list" />
      </div>
    </div>
  )
}

