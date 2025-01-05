/**
 * Toast Hook and Store Module
 * 
 * This module provides a custom hook and store implementation for managing toast notifications
 * in a React application. It includes functionality for:
 * - Adding and dismissing toast notifications
 * - Managing a queue of active toasts with a limit
 * - Subscribing to toast state changes
 * - Providing a simple API for triggering toasts from anywhere
 * 
 * The implementation uses a custom store pattern rather than global state management
 * to keep the toast system self-contained and efficient.
 */

"use client"

import * as React from "react"

// Configuration constants
const TOAST_LIMIT = 1 // Maximum number of toasts shown simultaneously
const TOAST_REMOVE_DELAY = 1000000 // Delay in ms before removing toast

/**
 * Core toast notification properties interface
 * Defines the structure and available options for toast notifications
 */
export interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

/**
 * State interface for the toast store
 * Maintains an array of active toast notifications
 */
interface ToastState {
  toasts: ToastProps[]
}

/**
 * Union type defining all possible actions that can be dispatched to the toast store
 * Includes adding new toasts and dismissing existing ones
 */
type ActionType = {
  type: "ADD_TOAST"
  toast: Omit<ToastProps, "id">
} | {
  type: "DISMISS_TOAST"
  toastId: string
}

/**
 * Custom store implementation for managing toast state
 * Provides methods for subscribing to state changes and dispatching actions
 */
const toastStore = {
  state: { toasts: [] } as ToastState,
  listeners: new Set<() => void>(),
  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
      return undefined
    }
  },
  dispatch(action: ActionType) {
    switch (action.type) {
      case "ADD_TOAST":
        const id = Math.random().toString(36).slice(2, 9)
        this.state.toasts = [
          { id, ...action.toast },
          ...this.state.toasts,
        ].slice(0, TOAST_LIMIT)
        break
      case "DISMISS_TOAST":
        this.state.toasts = this.state.toasts.filter(
          (t) => t.id !== action.toastId
        )
        break
    }
    this.listeners.forEach((listener) => listener())
  },
}

/**
 * Helper function to create and show a new toast notification
 * Returns an object with the toast ID and a method to dismiss it
 */
export function toast({
  title,
  description,
  action,
  variant = "default",
}: Omit<ToastProps, "id">) {
  const id = Math.random().toString(36).slice(2, 9)
  toastStore.dispatch({
    type: "ADD_TOAST",
    toast: { title, description, action, variant },
  })
  return {
    id,
    dismiss: () => toastStore.dispatch({ type: "DISMISS_TOAST", toastId: id }),
  }
}

/**
 * Custom hook for accessing toast state and methods in React components
 * Provides access to:
 * - Current list of active toasts
 * - Method to create new toasts
 * - Method to dismiss specific toasts
 */
export function useToast() {
  const [state, setState] = React.useState<ToastState>(toastStore.state)

  React.useEffect(() => {
    const unsubscribe = toastStore.subscribe(() => setState({ ...toastStore.state }))
    return () => {
      unsubscribe()
    }
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (toastId: string) =>
      toastStore.dispatch({ type: "DISMISS_TOAST", toastId }),
  }
} 