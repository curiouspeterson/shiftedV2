"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

export function EmployeeCard({ employee }: { employee: any }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDeactivate = async () => {
    try {
      setIsLoading(true)
      
      // Update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ status: 'inactive' })
        .eq('id', employee.id)

      if (profileError) throw profileError

      toast({
        title: "Employee deactivated",
        description: "The employee has been successfully deactivated.",
      })
      
      // Optionally refresh the page or update the UI
      window.location.reload()
    } catch (error) {
      console.error('Error deactivating employee:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate employee. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{employee.full_name}</h3>
          <p className="text-sm text-gray-500">{employee.role}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              Deactivate Employee
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will deactivate the user's profile. They will no longer be able to
                access the system, but their data will be preserved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeactivate}
                disabled={isLoading}
              >
                {isLoading ? "Deactivating..." : "Deactivate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
} 