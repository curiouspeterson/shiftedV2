/**
 * Employees API Route
 * 
 * Handles API requests for employee management operations.
 * Provides endpoints for creating, updating, and deleting employees.
 * 
 * Features:
 * - Request validation
 * - Action-based routing
 * - Error handling
 * - Type safety
 * - Server-side processing
 * - Response formatting
 */

import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'
import { handleEmployeeAction } from '@/lib/auth-server'

/**
 * Request schema for employee actions
 * Validates incoming request data structure
 */
const requestSchema = z.object({
  // Action type for the employee operation
  action: z.enum(['create', 'update', 'delete']),
  // Data payload for the action
  data: z.object({
    id: z.string().optional(),      // Employee ID for update/delete
    name: z.string().optional(),    // Employee name for create/update
    email: z.string().optional(),   // Employee email for create/update
    // Additional fields can be added as needed
  }),
})

/**
 * POST request handler
 * Processes employee management actions
 * 
 * @param req - Incoming request object
 * @returns JSON response with action result or error
 */
export async function POST(req: NextRequest) {
  try {
    // Validate request body against schema
    const { action, data } = requestSchema.parse(await req.json())

    // Delegate to server-side handler
    return await handleEmployeeAction(req)
  } catch (error: any) {
    // Log and format error response
    console.error('API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 400 }
    )
  }
} 