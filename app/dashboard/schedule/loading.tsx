/**
 * Schedule Loading Component
 * 
 * A loading state component for the schedule page that displays while data is being fetched.
 * Utilizes the reusable Loading component to show a consistent loading spinner.
 * 
 * Features:
 * - Automatic loading state handling with Next.js
 * - Consistent loading UI across the app
 * - Seamless integration with Suspense boundaries
 * - Improved user experience during data fetching
 */

// Import the reusable loading spinner component
import { Loading } from "@/components/loading"

/**
 * Schedule loading component
 * Rendered automatically by Next.js when the schedule page is loading
 * Provides visual feedback to users during data fetching operations
 */
export default function ScheduleLoading() {
  return <Loading />
} 