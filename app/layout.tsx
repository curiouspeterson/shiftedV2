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
 * 
 * Updated: 2024-01-08 - Improved layout structure for nested layouts
 */

import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SupabaseProvider from "@/components/providers/supabase-provider"
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
  title: "Shifted",
  description: "Employee scheduling made simple",
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
} 