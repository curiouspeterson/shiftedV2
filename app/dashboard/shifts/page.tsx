import { Metadata } from "next"
import { ShiftRequirements } from "./components/shift-requirements"

export const metadata: Metadata = {
  title: "Shift Requirements",
  description: "Manage recurring shift requirements",
}

export default function ShiftsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Shift Requirements</h2>
      </div>
      <ShiftRequirements />
    </div>
  )
}