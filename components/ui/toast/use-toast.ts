"use client"

import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

export interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

interface ToastState {
  toasts: ToastProps[]
}

type ActionType = {
  type: "ADD_TOAST"
  toast: Omit<ToastProps, "id">
} | {
  type: "DISMISS_TOAST"
  toastId: string
}

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