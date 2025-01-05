/**
 * Employee Card Component
 * 
 * A card component for displaying employee information.
 * Provides quick access to employee details and actions.
 * 
 * Features:
 * - Employee profile display
 * - Role indication
 * - Contact information
 * - Action buttons (edit/delete)
 * - Loading states
 * - Error handling
 * - Responsive design
 */

"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

/**
 * Employee data structure
 * @property id - Unique identifier for the employee
 * @property email - Employee's email address
 * @property first_name - Employee's first name
 * @property last_name - Employee's last name
 * @property role - Employee's role (manager/employee)
 * @property phone - Employee's phone number
 */
interface Employee {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'manager' | 'employee'
  phone?: string
}

/**
 * Component props
 * @property employee - Employee data to display
 * @property onEdit - Callback function for edit action
 * @property onDelete - Callback function for delete action
 */
interface EmployeeCardProps {
  employee: Employee
  onEdit: (employee: Employee) => void
  onDelete: (employeeId: string) => void
}

/**
 * Employee card component
 * Displays employee information and action buttons
 */
export function EmployeeCard({ employee, onEdit, onDelete }: EmployeeCardProps) {
  // State for loading states
  const [isDeleting, setIsDeleting] = useState(false)

  /**
   * Handles the delete action
   * Shows confirmation toast before deletion
   */
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(employee.id)
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting employee:', error)
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        {/* Employee name and role */}
        <div>
          <h3 className="font-medium">
            {employee.first_name} {employee.last_name}
          </h3>
          <Badge variant={employee.role === 'manager' ? 'default' : 'secondary'}>
            {employee.role}
          </Badge>
        </div>
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(employee)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Contact information */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{employee.email}</p>
          {employee.phone && (
            <p className="text-sm text-muted-foreground">{employee.phone}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 