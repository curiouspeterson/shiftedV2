/**
 * Root Layout Component
 * 
 * The top-level layout component that wraps all pages in the application.
 * Provides global configuration and shared UI elements.
 * 
 * Features:
 * - Font configuration (Inter)
 * - Metadata setup for SEO
 * - Global toast notifications
 * - Theme configuration
 * - Responsive layout
 */

import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

/**
 * Inter font configuration
 * Subsets latin characters for optimal loading
 */
const inter = Inter({ subsets: ["latin"] })

/**
 * Metadata configuration for SEO
 * Defines basic page information
 */
export const metadata = {
  title: "Employee Schedule Manager",
  description: "Manage employee schedules, shifts, and availability",
}

/**
 * Root layout component
 * Wraps all pages with common elements and configuration
 * 
 * @property children - Child components to render within the layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Main content area */}
        <main>{children}</main>
        
        {/* Global toast notifications */}
        <Toaster />
      </body>
    </html>
  )
} 