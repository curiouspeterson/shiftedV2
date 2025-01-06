import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shift Requirements",
  description: "Manage recurring shift requirements",
}

export default function ShiftsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 