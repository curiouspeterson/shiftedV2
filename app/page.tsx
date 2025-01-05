/**
 * Home Page Component
 * 
 * The landing page component for the application.
 * Automatically redirects visitors to the login page.
 * 
 * Features:
 * - Immediate redirect to login
 * - Server-side redirection
 * - No client-side JavaScript required
 * - SEO-friendly metadata
 */

import { redirect } from "next/navigation"

/**
 * Metadata configuration for SEO
 * Defines page-specific information
 */
export const metadata = {
  title: "Welcome | Employee Schedule Manager",
  description: "Employee scheduling and management system",
}

/**
 * Home page component
 * Performs immediate redirect to login page
 */
export default function Home() {
  // Redirect to login page
  redirect("/login")
}

