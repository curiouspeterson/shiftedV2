/**
 * Form Component Module
 * 
 * A collection of form components built with React Hook Form and Radix UI.
 * Provides a set of accessible, styled components for building complex forms
 * with validation, error handling, and field state management.
 * 
 * Features:
 * - Form validation
 * - Error handling
 * - Field state management
 * - Accessible form controls
 * - Screen reader support
 * - Customizable styling
 * - Nested form fields
 */

"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

/**
 * Form provider component
 * Wrapper component that provides form context to child components
 */
const Form = FormProvider

/**
 * Type definition for form field context
 * Contains the name and id of the form field
 */
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

/**
 * Form field context
 * Provides context for form field components
 */
const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

/**
 * Form field component
 * Provides context and state management for form fields
 * 
 * @component
 * @example
 * <FormField
 *   control={form.control}
 *   name="email"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Email</FormLabel>
 *       <FormControl>
 *         <Input {...field} />
 *       </FormControl>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

/**
 * Custom hook for accessing form field context
 * Returns the name of the current form field
 */
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

/**
 * Type definition for form item context
 * Contains the id of the form item
 */
type FormItemContextValue = {
  id: string
}

/**
 * Form item context
 * Provides context for form item components
 */
const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

/**
 * Form item component
 * Container component for form field elements
 * 
 * @component
 * @example
 * <FormItem>
 *   <FormLabel>Username</FormLabel>
 *   <FormControl>
 *     <Input />
 *   </FormControl>
 *   <FormDescription>Enter your username.</FormDescription>
 *   <FormMessage />
 * </FormItem>
 */
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

/**
 * Form label component
 * Label for form fields with consistent styling
 * 
 * @component
 * @example
 * <FormLabel>Email address</FormLabel>
 */
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

/**
 * Form control component
 * Wrapper for form input elements
 * 
 * @component
 * @example
 * <FormControl>
 *   <Input />
 * </FormControl>
 */
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return React.createElement(Slot, {
    id: formItemId,
    "aria-describedby": !error
      ? `${formDescriptionId}`
      : `${formDescriptionId} ${formMessageId}`,
    "aria-invalid": !!error,
    ref,
    ...props,
  })
})
FormControl.displayName = "FormControl"

/**
 * Form description component
 * Provides additional context for form fields
 * 
 * @component
 * @example
 * <FormDescription>This will be your public display name.</FormDescription>
 */
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

/**
 * Form message component
 * Displays validation errors or other form field messages
 * 
 * @component
 * @example
 * <FormMessage>This field is required.</FormMessage>
 */
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
