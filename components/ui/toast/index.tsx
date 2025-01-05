/**
 * Toast Component Module Index
 * 
 * Entry point for the toast notification system.
 * Re-exports toast-related components and utilities for easy access.
 * 
 * Features:
 * - Toast notifications
 * - Toast provider for context
 * - Toast viewport for positioning
 * - Toast hook for programmatic control
 * - TypeScript support
 * 
 * @module
 */

export { Toaster } from "./toaster"
export { toast, useToast } from "./use-toast"
export { Toast, ToastProvider, ToastViewport } from "./toast"
export type { ToastProps } from "./use-toast" 