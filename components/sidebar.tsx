/**
 * Sidebar Navigation Component
 * 
 * Main navigation component for the dashboard.
 * Provides links to different sections and user actions.
 */

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  Calendar,
  Clock,
  Home,
  LogOut,
  Users,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

/**
 * Navigation item structure
 * @property href - Route path
 * @property label - Display text
 * @property managerOnly - Whether the item is only visible to managers
 */
interface NavItem {
  href: string
  label: string
  managerOnly?: boolean
}

/**
 * Navigation items configuration
 * Defines available routes and their properties
 */
const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/schedule", label: "Schedule" },
  { href: "/dashboard/availability", label: "Availability" },
  { href: "/dashboard/time-off", label: "Time Off" },
  { href: "/dashboard/employees", label: "Employees", managerOnly: true },
  { href: "/dashboard/shifts", label: "Shifts", managerOnly: true },
  { href: "/dashboard/status", label: "Status" },
]

/**
 * Component props
 * @property isManager - Whether the current user has manager role
 */
interface SidebarProps {
  isManager: boolean
}

/**
 * Sidebar navigation component
 * Manages navigation state and user actions
 */
export function Sidebar({ isManager }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  /**
   * Handles user logout
   * Signs out the user and redirects to login page
   */
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Navigation links */}
      <nav className="space-y-2 flex-1">
        {navItems
          .filter(item => !item.managerOnly || isManager)
          .map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded-md hover:bg-accent",
                pathname === item.href && "bg-accent"
              )}
            >
              {item.label}
            </Link>
          ))}
      </nav>

      {/* Logout button */}
      <Button
        variant="ghost"
        className="w-full justify-start px-3"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  )
}

