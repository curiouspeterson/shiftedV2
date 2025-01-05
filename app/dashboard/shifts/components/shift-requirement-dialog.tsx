/**
 * Shift Requirement Dialog Component
 * 
 * A form dialog component for creating and editing shift requirements.
 * Implements a fully controlled form with validation using React Hook Form and Zod.
 * Provides real-time validation feedback and handles API interactions for saving data.
 * 
 * Features:
 * - Create new shift requirements
 * - Edit existing shift requirements
 * - Form validation with error messages
 * - Loading states during submission
 * - Success/error notifications via toast
 */

"use client"

import { z } from "zod"
<<<<<<< HEAD
import { useState, useEffect } from "react"
=======
import { useState } from "react"
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast"
import { type ShiftRequirement } from "@/types/schedule"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type ControllerRenderProps } from "react-hook-form"
<<<<<<< HEAD
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { supabaseClient as supabase } from "@/lib/auth"

/**
 * Array of day names for mapping numeric day values to readable names
 */
const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

/**
=======

/**
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
 * Zod schema for form validation
 * Defines the shape and validation rules for shift requirement data
 */
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  day_of_week: z.number().min(0).max(6),
<<<<<<< HEAD
  start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
=======
  start_time: z.string(),
  end_time: z.string(),
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
  required_count: z.number().min(1),
})

// Type inference for form values from schema
type FormValues = z.infer<typeof formSchema>

/**
 * Props for the ShiftRequirementDialog component
 * @property shiftRequirement - Optional existing requirement for editing mode
 * @property onSuccess - Callback function after successful save
 * @property onClose - Callback function to close the dialog
 */
interface ShiftRequirementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shiftRequirement?: ShiftRequirement
  onSuccess: () => void
  onClose: () => void
}

/**
 * Dialog component for creating and editing shift requirements
 * Handles both creation and editing modes with the same form interface
 */
export function ShiftRequirementDialog({
  open,
  onOpenChange,
  shiftRequirement,
  onSuccess,
  onClose,
}: ShiftRequirementDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!shiftRequirement

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
<<<<<<< HEAD
      name: "",
      day_of_week: 0,
      start_time: "09:00",
      end_time: "17:00",
      required_count: 1,
    },
  })

  // Format time values to ensure they have leading zeros
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const paddedHours = hours.padStart(2, '0')
    // Ensure hours are in valid range (00-23)
    const validHours = Math.min(Math.max(parseInt(paddedHours), 0), 23).toString().padStart(2, '0')
    return `${validHours}:${minutes.padStart(2, '0')}`
  }

  // Reset form values when dialog opens for editing
  useEffect(() => {
    if (shiftRequirement) {
      form.reset({
        name: shiftRequirement.name,
        day_of_week: shiftRequirement.day_of_week,
        start_time: formatTime(shiftRequirement.start_time),
        end_time: formatTime(shiftRequirement.end_time),
        required_count: shiftRequirement.required_count,
      })
    } else {
      form.reset({
        name: "",
        day_of_week: 0,
        start_time: "09:00",
        end_time: "17:00",
        required_count: 1,
      })
    }
  }, [form, shiftRequirement])

  /**
   * Form submission handler
   * Sends data to the API and handles success/error states
   * @param values - Validated form values
   */
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
=======
      name: shiftRequirement?.name || "",
      day_of_week: shiftRequirement?.day_of_week || 0,
      start_time: shiftRequirement?.start_time || "09:00",
      end_time: shiftRequirement?.end_time || "17:00",
      required_count: shiftRequirement?.required_count || 1,
    },
  })
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589

  /**
   * Form submission handler
   * Sends data to the API and handles success/error states
   * @param values - Validated form values
   */
  const onSubmit = async (values: FormValues) => {
    try {
<<<<<<< HEAD
      // Get the current session
      console.log('1. Getting current session')
      const { data: { session } } = await supabase.auth.getSession()
      console.log('   Session found:', !!session)
      
      if (!session) {
        throw new Error("No active session")
      }

      const endpoint = '/api/shift-requirements'
      const method = isEditing ? 'PUT' : 'POST'

      console.log('2. Starting form submission')
      console.log('   Original values:', shiftRequirement)
      console.log('   Form values:', values)

      // Format times to ensure they match the expected pattern
      const formattedStartTime = formatTime(values.start_time)
      const formattedEndTime = formatTime(values.end_time)

      console.log('3. Formatted times:')
      console.log('   start_time:', formattedStartTime)
      console.log('   end_time:', formattedEndTime)

      const formData = {
        ...values,
        start_time: formattedStartTime,
        end_time: formattedEndTime
      }

      console.log('4. Preparing request:')
      console.log('   URL:', endpoint)
      console.log('   Method:', method)
      console.log('   Body:', isEditing ? { id: shiftRequirement?.id, ...formData } : formData)

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          isEditing ? { id: shiftRequirement?.id, ...formData } : formData
        ),
      })

      console.log('5. Response received:')
      console.log('   Status:', response.status)
      console.log('   Status Text:', response.statusText)

      if (!response.ok) {
        const errorData = await response.json()
        console.log('6. Error response:', errorData)
        throw new Error(errorData.error || 'Failed to save shift requirement')
      }

      const responseData = await response.json()
      console.log('6. Success response:', responseData)

      toast({
        title: 'Success',
        description: `Shift requirement ${isEditing ? 'updated' : 'created'} successfully`,
      })

      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error in form submission:', error)
      toast({
=======
      setIsLoading(true)
      const endpoint = '/api/shift-requirements'
      const method = isEditing ? 'PUT' : 'POST'
      
      // Send request to API
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isEditing ? { id: shiftRequirement?.id, ...values } : values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save shift requirement')
      }

      // Handle success
      toast({
        title: 'Success',
        description: `Shift requirement ${isEditing ? 'updated' : 'created'} successfully`,
      })
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Failed to save shift requirement:', error)
      toast({
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
        title: 'Error',
        description: error.message || 'Failed to save shift requirement',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
<<<<<<< HEAD
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Shift Requirement" : "Add Shift Requirement"}
          </DialogTitle>
          <DialogDescription>
            Define the shift coverage requirements for a specific day and time.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shift name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Day of week field */}
            <FormField
              control={form.control}
              name="day_of_week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of Week</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DAYS_OF_WEEK.map((day, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start time field */}
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End time field */}
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Required count field */}
            <FormField
              control={form.control}
              name="required_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Employees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Create Requirement"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
=======
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }: { field: ControllerRenderProps<FormValues, "name"> }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Day of week selection */}
        <FormField
          control={form.control}
          name="day_of_week"
          render={({ field }: { field: ControllerRenderProps<FormValues, "day_of_week"> }) => (
            <FormItem>
              <FormLabel>Day of Week</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                  <SelectItem value="6">Saturday</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start time input */}
        <FormField
          control={form.control}
          name="start_time"
          render={({ field }: { field: ControllerRenderProps<FormValues, "start_time"> }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End time input */}
        <FormField
          control={form.control}
          name="end_time"
          render={({ field }: { field: ControllerRenderProps<FormValues, "end_time"> }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Required employee count input */}
        <FormField
          control={form.control}
          name="required_count"
          render={({ field }: { field: ControllerRenderProps<FormValues, "required_count"> }) => (
            <FormItem>
              <FormLabel>Required Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
>>>>>>> 814f5aa8e56d545825b7fd94a72c02dc721cc589
  )
} 