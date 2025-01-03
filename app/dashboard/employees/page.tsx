import { Metadata } from "next"
import { EmployeesList } from "./components/employees-list"

export const metadata: Metadata = {
  title: "Employees",
  description: "Manage employee information and availability",
}

export default function EmployeesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
      </div>
      <EmployeesList />
    </div>
  )
}