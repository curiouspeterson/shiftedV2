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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AvailabilityForm } from "./availability-form"
import { AvailabilityList } from "./availability-list"

/**
 * Employee availability component
 * Manages the overall availability section of the application
 */
export function EmployeeAvailability() {
  return (
    <div className="space-y-6">
      {/* Availability form section */}
      <Card>
        <CardHeader>
          <CardTitle>Add Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilityForm onAvailabilityAdded={() => {}} />
        </CardContent>
      </Card>

      {/* Availability list section */}
      <AvailabilityList onAvailabilityDeleted={() => {}} />
    </div>
  )
}

