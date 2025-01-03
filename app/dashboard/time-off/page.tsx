"use client"

import { TimeOffRequestForm } from "@/components/time-off-request-form"
import { TimeOffRequestsList } from "@/components/time-off-requests-list"

export default function TimeOffPage() {
  const handleRequestSubmitted = () => {
    // Force a re-render of the list component
    const list = document.querySelector('[data-component="time-off-requests-list"]')
    if (list) {
      list.setAttribute('data-refresh', Date.now().toString())
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Time Off Requests</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <TimeOffRequestForm onSubmit={handleRequestSubmitted} />
        <TimeOffRequestsList data-component="time-off-requests-list" />
      </div>
    </div>
  )
}

