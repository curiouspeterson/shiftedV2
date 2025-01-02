"use client"

import { TimeOffRequestForm } from "@/components/time-off-request-form"
import { TimeOffRequestsList } from "@/components/time-off-requests-list"

export default function TimeOffPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Time Off Requests</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <TimeOffRequestForm onRequestSubmitted={() => {
          // Force a re-render of the list component
          const list = document.querySelector('[data-component="time-off-requests-list"]')
          if (list) {
            list.classList.add('force-update')
            setTimeout(() => list.classList.remove('force-update'), 0)
          }
        }} />
        <div data-component="time-off-requests-list">
          <TimeOffRequestsList />
        </div>
      </div>
    </div>
  )
}

