/**
 * Toast Management System
 * 
 * A comprehensive toast notification management system that provides:
 * - Global toast state management without external state libraries
 * - Toast creation, updating, and dismissal functionality
 * - Automatic cleanup of dismissed toasts
 * - Type-safe toast configuration
 * - Custom toast actions and styling support
 * 
 * The system uses an internal state management approach with reducers and listeners
 * to maintain toast state across the application while remaining lightweight.
 */

"use client"

import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

// Configuration constants
const TOAST_LIMIT = 1 // Maximum number of toasts shown simultaneously
const TOAST_REMOVE_DELAY = 1000000 // Delay before removing dismissed toasts

/**
 * Core toast type definition extending base toast props with
 * required fields for internal management
 */
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

/**
 * Action types for toast state management
 * Defines all possible operations on toast state
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

/**
 * ID Generation System
 * Provides unique IDs for toast instances
 */
let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

/**
 * Action type definition for the reducer
 * Ensures type safety for all toast operations
 */
type ActionType = {
  type: typeof actionTypes[keyof typeof actionTypes]
  toast?: ToasterToast
  toastId?: string
}

/**
 * Toast Cleanup Management
 * Handles the queuing and execution of toast removal operations
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * Toast State Reducer
 * Handles all state transitions for the toast system
 * Implements the core logic for adding, updating, dismissing and removing toasts
 */
export const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast!, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast?.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

/**
 * State Management System
 * Implements a lightweight pub/sub pattern for managing toast state
 */
const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: ActionType) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

/**
 * Toast Creation and Management API
 * Provides the public interface for creating and managing toasts
 */
type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * Hook Configuration and State Types
 * Defines the interface for the useToast hook
 */
type UseToastOptions = {
  onDismiss?: (toastId: string) => void
}

interface State {
  toasts: ToasterToast[]
}

/**
 * useToast Hook
 * Custom hook that provides access to toast state and toast management functions
 * Handles subscription to toast state changes and cleanup
 */
function useToast(options: UseToastOptions = {}) {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  }
}

export { useToast, toast }