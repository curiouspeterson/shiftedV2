/**
 * Employee Type Definitions
 * 
 * This file defines the core TypeScript interfaces for employee data management.
 * It provides type definitions for employee availability, employee profiles,
 * and form data structures used throughout the application for managing
 * employee information and scheduling.
 */

import type { Database } from '@/lib/database.types'

export type Employee = Database['public']['Tables']['profiles']['Row'] 