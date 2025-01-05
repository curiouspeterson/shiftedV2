/**
 * Toast Component Export Module
 * 
 * This is the main entry point for the toast notification system. It exports all necessary
 * components and utilities needed to implement toast notifications throughout the application.
 * The toast system provides accessible, customizable notifications with animations and 
 * keyboard navigation support.
 */

// Core toast functionality exports
// Provides the main toast function for triggering notifications
// and a hook for accessing toast state and methods
export { toast, useToast } from "./use-toast"

// Main toast container component
// Renders and manages the list of active toast notifications
export { Toaster } from "./toaster"

// Base toast UI components
// Includes the individual toast component, context provider,
// and viewport for positioning toasts on screen
export { Toast, ToastProvider, ToastViewport } from "./toast"

// Type definitions
// Exports the props interface for toast notifications
export type { ToastProps } from "./use-toast"