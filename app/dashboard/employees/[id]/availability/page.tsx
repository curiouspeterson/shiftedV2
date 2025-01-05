/**
 * Employee Availability Page Component
 * 
 * Displays and manages availability settings for a specific employee.
 * Allows managers to view and modify employee availability slots.
 * 
 * Features:
 * - Dynamic routing based on employee ID
 * - Availability management interface
 * - Real-time updates
 * - Loading states
 * - Error handling
 * - Access control
 * - Responsive layout
 */

import { EmployeeAvailabilityManager } from "@/components/employee-availability-manager"
import { Card } from "@/components/ui/card"

/**
 * Page parameters interface
 * @property params.id - Employee ID from dynamic route
 */
interface PageProps {
  params: {
    id: string
  }
}

/**
 * Employee availability page component
 * Provides interface for managing individual employee availability
 * 
 * @param props - Page properties containing employee ID
 */
export default function EmployeeAvailabilityPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-6">
      {/* Page header */}
      <h1 className="text-2xl font-bold mb-6">Employee Availability</h1>
      
      {/* Availability management card */}
      <Card className="p-6">
        <EmployeeAvailabilityManager employeeId={params.id} />
      </Card>
    </div>
  )
}

