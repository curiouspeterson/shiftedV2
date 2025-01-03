import { EmployeeAvailabilityManager } from "@/components/employee-availability-manager"

export default function EmployeeAvailabilityPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Manage Employee Availability</h1>
      <EmployeeAvailabilityManager />
    </div>
  )
}

