/**
 * Utility Functions Module
 * 
 * A collection of utility functions used throughout the application.
 * Currently provides class name merging functionality using clsx and tailwind-merge.
 * 
 * @module
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and tailwind-merge
 * Combines multiple class names or conditional classes while resolving
 * Tailwind CSS conflicts using tailwind-merge
 * 
 * @param {...ClassValue[]} inputs - Class names or conditional class expressions to merge
 * @returns {string} Merged class string with resolved Tailwind conflicts
 * 
 * @example
 * cn('px-2 py-1', 'bg-blue-500', condition && 'text-white')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a readable error message from various error types
 * 
 * @param {unknown} error - The error to extract a message from
 * @returns {string} A human-readable error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }
  return 'An unknown error occurred'
}
