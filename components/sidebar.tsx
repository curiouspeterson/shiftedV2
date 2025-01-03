"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Calendar, Users, Settings, LogOut, Clock, Clock4, Activity } from 'lucide-react'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", icon: Calendar, label: "Dashboard" },
  { href: "/dashboard/schedule", icon: Clock, label: "Schedule" },
  { href: "/dashboard/employees", icon: Users, label: "Employees" },
  { href: "/dashboard/shifts", icon: Clock4, label: "Shifts" },
  { href: "/dashboard/availability", icon: Clock, label: "Availability" },
  { href: "/dashboard/time-off", icon: Calendar, label: "Time Off" },
  { href: "/dashboard/status", icon: Activity, label: "Status" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
        return
      }
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <nav className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">Schedule Manager</h1>
      </div>
      <ul className="space-y-2 p-4 flex-grow">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 rounded-md p-2 text-gray-600 hover:bg-gray-100",
                  isActive && "bg-gray-100 text-gray-900 font-medium"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="p-4">
        <Button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center"
          variant="destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  )
}

