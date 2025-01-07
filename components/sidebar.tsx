/**
 * Sidebar Navigation Component
 * 
 * Main navigation component for the dashboard.
 * Provides links to different sections and user actions.
 */

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from 'react'
import { supabaseBrowserClient } from '@/lib/supabase/browserClient'

interface SidebarProps {
  className?: string
  userId: string
  isManager: boolean
}

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/employees", label: "Employees", managerOnly: true },
  { href: "/dashboard/shifts", label: "Shifts", managerOnly: true },
  { href: "/dashboard/schedule", label: "Schedule" },
  { href: "/dashboard/availability", label: "Availability" },
  { href: "/dashboard/time-off", label: "Time Off" },
  { href: "/dashboard/status", label: "Status" },
]

export function Sidebar({ className, userId, isManager: initialIsManager }: SidebarProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isManager, setIsManager] = useState(initialIsManager)

  useEffect(() => {
    // Set up subscription cleanup
    const cleanupSubscription = supabaseBrowserClient.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => {
          console.log('Database change detected')
        }
      )
      .subscribe()

    return () => {
      cleanupSubscription.unsubscribe()
      console.log('Cleanup: unsubscribed from realtime changes')
    }
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.push('/login')
      router.refresh()
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
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            {navItems
              .filter(item => !item.managerOnly || isManager)
              .map(item => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            <Button
              variant="ghost"
              className="w-full justify-start px-3"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

