/**
 * Employee Availability Component
 * 
 * A container component that combines the availability form and list.
 * Provides a complete interface for managing employee availability.
 * 
 * Features:
 * - Add new availability slots
 * - View existing availability
 * - Real-time updates
 * - State synchronization between form and list
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AvailabilityForm } from "./availability-form"
import { AvailabilityList } from "./availability-list"

/**
 * Employee availability component
 * Manages the overall availability section of the application
 */
export function EmployeeAvailability() {
  // State to force refresh of the list
  const [refreshKey, setRefreshKey] = useState(0)

  // Handlers for form submission and deletion
  const handleAvailabilityAdded = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleAvailabilityDeleted = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Availability form section */}
      <Card>
        <CardHeader>
          <CardTitle>Add Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilityForm onAvailabilityAdded={handleAvailabilityAdded} />
        </CardContent>
      </Card>

      {/* Availability list section */}
      <AvailabilityList 
        key={refreshKey}
        onAvailabilityDeleted={handleAvailabilityDeleted} 
      />
    </div>
  )
}

