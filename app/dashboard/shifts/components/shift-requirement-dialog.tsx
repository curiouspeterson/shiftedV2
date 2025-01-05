"use client"

import { z } from "zod"
import { useState } from "react"
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

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  day_of_week: z.number().min(0).max(6),
  start_time: z.string(),
  end_time: z.string(),
  required_count: z.number().min(1),
})

type FormValues = z.infer<typeof formSchema>

interface ShiftRequirementDialogProps {
  shiftRequirement?: ShiftRequirement
  onSuccess: () => void
  onClose: () => void
}

export function ShiftRequirementDialog({
  shiftRequirement,
  onSuccess,
  onClose,
}: ShiftRequirementDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!shiftRequirement

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shiftRequirement?.name || "",
      day_of_week: shiftRequirement?.day_of_week || 0,
      start_time: shiftRequirement?.start_time || "09:00",
      end_time: shiftRequirement?.end_time || "17:00",
      required_count: shiftRequirement?.required_count || 1,
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      const endpoint = '/api/shift-requirements'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isEditing ? { id: shiftRequirement?.id, ...values } : values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save shift requirement')
      }

      onSuccess()
      onClose()
      toast({
        title: 'Success',
        description: `Shift requirement ${isEditing ? 'updated' : 'created'} successfully`,
      })
    } catch (error: any) {
      console.error('Failed to save shift requirement:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to save shift requirement',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
  )
} 