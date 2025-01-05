/**
 * Toaster Component
 * 
 * A client-side component that manages and renders toast notifications in the application.
 * Built on top of Radix UI's Toast primitive and integrated with a custom useToast hook.
 * 
 * Features:
 * - Renders multiple toasts simultaneously
 * - Supports titles, descriptions, and custom actions
 * - Handles toast lifecycle and animations
 * - Provides consistent positioning through ToastViewport
 * - Fully accessible and keyboard navigable
 */

"use client"

import { useToast } from "../../hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

/**
 * Main Toaster component that manages the display of all toast notifications
 * Subscribes to the toast state using useToast hook and renders active toasts
 */
export function Toaster() {
  // Get current toasts from the toast management hook
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {/* Map through active toasts and render each one */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            {/* Content container with consistent spacing */}
            <div className="grid gap-1">
              {/* Conditionally render title if provided */}
              {title && <ToastTitle>{title}</ToastTitle>}
              {/* Conditionally render description if provided */}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {/* Render optional custom action */}
            {action}
            {/* Close button for dismissing the toast */}
            <ToastClose />
          </Toast>
        )
      })}
      {/* Viewport component that handles toast positioning and layout */}
      <ToastViewport />
    </ToastProvider>
  )
}
