import { EmployeeScheduleManager } from "@/components/employee-schedule-manager"

export default function EmployeeSchedulePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manage Employee Schedule</h1>
      <EmployeeScheduleManager employeeId={params.id} />
    </div>
  )
}

