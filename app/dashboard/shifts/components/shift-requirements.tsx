"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { type ShiftRequirement } from "@/types/shift"
import { ShiftRequirementDialog } from "./shift-requirement-dialog"

export function ShiftRequirements() {
  const [requirements, setRequirements] = useState<ShiftRequirement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedRequirement, setSelectedRequirement] = useState<ShiftRequirement | null>(null)

  useEffect(() => {
    fetchRequirements()
  }, [])

  const fetchRequirements = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("shift_requirements")
        .select("*")
        .order("day_of_week")
        .order("start_time")

      if (error) throw error

      setRequirements(data)
    } catch (error) {
      console.error("Error fetching shift requirements:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load shift requirements. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("shift_requirements")
        .delete()
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Shift requirement deleted successfully.",
      })
      fetchRequirements()
    } catch (error) {
      console.error("Error deleting shift requirement:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete shift requirement. Please try again.",
      })
    }
  }

  const handleEdit = (requirement: ShiftRequirement) => {
    setSelectedRequirement(requirement)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    fetchRequirements()
    setIsDialogOpen(false)
    setSelectedRequirement(null)
  }

  if (isLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>
          Add Requirement
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {days.map((day, index) => (
          <Card key={day}>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">{day}</h3>
              <div className="space-y-4">
                {requirements
                  .filter((req) => req.day_of_week === index)
                  .map((requirement) => (
                    <div
                      key={requirement.id}
                      className="flex items-center justify-between border rounded p-3"
                    >
                      <div>
                        <p className="font-medium">
                          {format(new Date(`1970-01-01T${requirement.start_time}`), "h:mm a")} -{" "}
                          {format(new Date(`1970-01-01T${requirement.end_time}`), "h:mm a")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {requirement.required_count} employee{requirement.required_count === 1 ? "" : "s"} needed
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(requirement)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(requirement.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                {requirements.filter((req) => req.day_of_week === index).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No requirements set
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ShiftRequirementDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        requirement={selectedRequirement}
        onSuccess={handleSuccess}
      />
    </div>
  )
} 