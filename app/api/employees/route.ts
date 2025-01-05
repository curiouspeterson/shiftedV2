import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'
import { handleEmployeeAction } from '@/lib/auth-server'

// Define request schema using Zod for validation
const requestSchema = z.object({
  action: z.enum(['create', 'update', 'delete']),
  data: z.object({
    // Define the structure based on action
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    // Add more fields as necessary
  }),
})

/**
 * Handles POST requests for employee actions.
 * @param req - Incoming NextRequest object.
 * @returns JSON response based on the action outcome.
 */
export async function POST(req: NextRequest) {
  try {
    // Validate the request body
    const { action, data } = requestSchema.parse(await req.json())

    // Delegate handling to server-only function
    return await handleEmployeeAction(req)
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 400 }
    )
  }
} 