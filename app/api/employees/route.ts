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

import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const employeeSchema = z.object({
  data: z.object({
    email: z.string().email(),
    name: z.string(),
    role: z.string(),
    position: z.string(),
    weekly_hour_limit: z.number(),
  }),
});

export async function POST(request: Request) {
  try {
    const supabase = createServiceClient();
    console.log("Service client created successfully");

    const json = await request.json();
    const { data } = employeeSchema.parse(json);
    console.log("Request data validated:", data);

    // First check if user already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", data.email)
      .single();

    if (userCheckError) {
      console.error("Error checking for existing user:", userCheckError);
    }

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create user with admin API
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: "tempPassword123!", // Temporary password
      email_confirm: true,
    });

    if (createError) {
      console.error("Error creating user:", createError);
      console.error("Error details:", JSON.stringify(createError, null, 2));
      return NextResponse.json(
        { error: "Failed to create user", details: createError.message, code: 500 },
        { status: 500 }
      );
    }

    if (!newUser || !newUser.user) {
      console.error("No user data returned from createUser");
      return NextResponse.json(
        { error: "Failed to create user", details: "No user data returned", code: 500 },
        { status: 500 }
      );
    }

    console.log("User created successfully:", newUser.user.id);

    // Update profile with additional data
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        name: data.name,
        role: data.role,
        position: data.position,
        weekly_hour_limit: data.weekly_hour_limit,
      })
      .eq("id", newUser.user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
      // Clean up the user if profile update fails
      await supabase.auth.admin.deleteUser(newUser.user.id);
      return NextResponse.json(
        { error: "Failed to update profile", details: profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, userId: newUser.user.id });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 