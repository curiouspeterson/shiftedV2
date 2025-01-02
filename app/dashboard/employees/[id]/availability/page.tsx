import { EmployeeAvailabilityManager } from "@/components/employee-availability-manager"

export default function EmployeeAvailabilityPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Employee Availability</h1>
      <EmployeeAvailabilityManager employeeId={params.id} />
    </div>
  )
}

