/**
 * Shifts Loading Component
 * 
 * A loading state component for the shifts management page that displays while data is being fetched.
 * Utilizes the reusable Loading component to show a consistent loading spinner.
 * 
 * Features:
 * - Automatic loading state handling with Next.js
 * - Consistent loading UI across the app
 * - Seamless integration with Suspense boundaries
 * - Improved user experience during data fetching
 */

// Import the reusable loading spinner component that provides consistent loading UI
import { Loading } from "@/components/loading"

/**
 * Shifts loading component
 * Rendered automatically by Next.js when the shifts page is loading
 * Provides visual feedback to users during data fetching operations
 * Maintains consistent loading experience with other pages
 */
export default function ShiftsLoading() {
  return <Loading />
} 