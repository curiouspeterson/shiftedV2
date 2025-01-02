"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Plus, Trash2, UserPlus } from 'lucide-react'
import { AddEmployeeForm } from "@/components/add-employee-form"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Employee = {
  id: string
  email: string
  role: string
  full_name: string
  status: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [activeTab, setActiveTab] = useState("employees")
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchEmployees()
  }, [])

  async function fetchEmployees() {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'active')
        .order('full_name')

      if (error) throw error
      setEmployees(profiles || [])
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast({
        title: "Error fetching employees",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  async function deleteEmployee(employee: Employee) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'inactive' })
        .eq('id', employee.id)

      if (error) throw error

      toast({
        title: "Employee deactivated",
        description: `${employee.full_name}'s profile has been deactivated.`
      })
      
      fetchEmployees()
    } catch (error) {
      console.error('Error deactivating employee:', error)
      toast({
        title: "Error deactivating employee",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setEmployeeToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Add Test Availability
          </Button>
          <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <AddEmployeeForm
                onSuccess={() => {
                  setAddEmployeeOpen(false)
                  fetchEmployees()
                }}
                onCancel={() => setAddEmployeeOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="employees" className="w-full" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="time-off">Time Off Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="employees" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {employees.map((employee) => (
              <Card key={employee.id} className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{employee.full_name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{employee.role}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Link href={`/dashboard/employees/${employee.id}/availability`} passHref>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Manage Availability
                      </Button>
                    </Link>

                    <Link href={`/dashboard/employees/${employee.id}/schedule`} passHref>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Employee Schedule
                      </Button>
                    </Link>

                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      onClick={() => {
                        setEmployeeToDelete(employee)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Employee
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="time-off">
          <p>Time off requests coming soon...</p>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate {employeeToDelete?.full_name}&apos;s profile. 
              They will no longer be able to access the system, but their data will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEmployeeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => employeeToDelete && deleteEmployee(employeeToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

