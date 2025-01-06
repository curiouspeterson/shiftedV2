# Development Status

This document outlines the current development status of the Employee Schedule Manager application. It details completed, in-progress, and planned features.

## Project Overview

The Employee Schedule Manager is a full-stack web application built with Next.js, React, TypeScript, Tailwind CSS, and Supabase. It aims to provide a comprehensive solution for managing employee schedules, availability, time-off requests, and other related tasks.

## Current Status (as of January 6th, 2024)

### Completed Features

#### Authentication & Authorization

-   **Email/Password Authentication:** Users can securely sign up and log in using their email and password.
-   **Protected Routes:** Implemented using Next.js middleware to restrict access to certain pages based on user authentication status and role.
-   **Role-based Access Control:** Differentiated access for "employee" and "manager" roles, limiting functionality based on role permissions.
-   **Auth State Management:**  Uses Supabase authentication and manages user sessions using cookies, ensuring secure access and a smooth user experience.
-   **OAuth Callback Handling:** Implemented using a dedicated route to process authentication callbacks.

#### Employee Management

-   **Employee Profiles:** Allows managers to create, view, edit, and delete employee profiles, including basic information like name, email, and role.
-   **Availability Management:** Employees can set their weekly availability, specifying start and end times for each day of the week. Managers can view employee availability.
-   **Role Assignment:** Managers can assign "employee" or "manager" roles to users during the onboarding process.
-   **Weekly Hour Limits:** Functionality implemented to set and track weekly hour limits for employees.

#### Schedule Management

-   **Weekly Schedule View:** Implemented a basic weekly view to display the generated schedule, organized by day and shift requirements.
-   **Manual Shift Assignment:** Managers can manually assign employees to specific shifts via a user-friendly dialog.
-   **Shift Requirements:** Managers can define recurring shift requirements, specifying the day, start time, end time, and the number of employees required.
-   **Automated Schedule Generation:** Basic schedule generation has been created, although further development is needed for advanced conflict resolution and schedule optimization.

#### Time Off Management

-   **Time Off Requests:** Employees can submit time-off requests, specifying the start and end dates and an optional reason.
-   **Request Approval Workflow:** Basic workflow implemented. Time-off requests are currently added to the database in a 'pending' status. Future work will include adding the logic to approve or reject requests.
-   **Real-time Updates:** The Time Off Requests List component now uses Supabase subscriptions to provide real-time updates when new requests are submitted, or existing requests are updated or deleted.

### In-Progress Features

-   **Automated Schedule Generation:** Refining the automatic schedule generation algorithm to handle various constraints, such as employee availability, weekly hour limits, and shift requirements. Improving conflict resolution and schedule optimization.
-   **Real-time Updates:** Implementing real-time updates for schedule changes and shift assignments using Supabase real-time subscriptions.  A basic implementation has been completed for time-off requests.

### Planned Features

-   **Schedule Conflicts Detection:** Automatically detect and highlight scheduling conflicts, such as overlapping shifts or exceeding weekly hour limits.
-   **Schedule Templates:** Allow managers to create and reuse schedule templates for common scheduling patterns.
-   **Calendar Integration:** Enable employees to synchronize their work schedules with external calendar applications (e.g., Google Calendar, Outlook Calendar).
-   **Notifications:** Implement email and in-app notifications to inform users about schedule changes, time-off request approvals, and other relevant events.
-   **Reporting & Analytics:** Provide managers with reports and visualizations to analyze scheduling data, track employee hours, and identify coverage gaps.
-   **Mobile App:** Develop a mobile app for employees and managers to access the scheduling system on the go (using React Native).
-   **Shift Swapping:** Allow employees to request shift swaps with each other, subject to manager approval.
-   **Advanced Auto-Scheduling:**
    -   Incorporate employee preferences (e.g., preferred shifts, desired days off).
    -   Consider employee skills and certifications when assigning shifts.
    -   Optimize schedules based on labor costs and other business rules.
-   **User Interface Improvements:** Improve the UI for adding and managing employee availability.

## Technical Stack

-   **Frontend:** Next.js 13/14 (with App Router), React, TypeScript, Tailwind CSS, Shadcn UI, Radix UI, Date-fns, React Hook Form, Zod
-   **Backend:** Supabase (Auth, Database, Realtime)
-   **Styling:** Tailwind CSS, Class Variance Authority (CVA), `clsx`, `tailwind-merge`
-   **Deployment:** Vercel (presumably)

## Recent Improvements

-   **Refactored Middleware:** Improved `middleware.ts` to handle authentication and redirects more efficiently and prevent redirect loops.
-   **Resolved Build Errors:** Addressed Webpack configuration issues causing "Unexpected end of JSON input" errors during the build process.
-   **Upgraded Dependencies:** Updated core dependencies like Next.js, React, and Supabase to their latest stable versions.
-   **Added WebSocket Dependencies:** Installed `bufferutil` and `utf-8-validate` to handle potential WebSocket related errors.
-   **Enhanced Error Handling:** Implemented more consistent error handling and user feedback using toast notifications.
-   **Improved Code Documentation:** Added JSDoc comments to functions, components, and hooks for better code maintainability.
-   **Implemented `withManagerAuth` HOC:** Added a higher-order component to simplify protecting API routes that require manager authorization.
-   **Added Real-time Updates to Time Off Requests:** Implemented Supabase subscriptions to provide real-time updates to the Time Off Requests List.
-   **Resolved `refresh_token_not_found` and `over_request_rate_limit` Errors:** Implemented changes to avoid unnecessary calls to `supabase.auth.getSession()` which were causing invalid token refreshes and triggering rate limits on the Supabase API.

## Testing

-   **Unit Tests:** Currently, no unit tests are implemented. It's highly recommended to add unit tests using Jest and React Testing Library to ensure code quality and prevent regressions.
-   **End-to-End Tests:**  E2E tests are not yet implemented. Adding E2E tests using Cypress or Playwright is recommended to test user flows and critical interactions.

## Future Considerations

-   **State Management:** Evaluate the need for a state management library (e.g., Zustand, Redux Toolkit) as the application grows in complexity.
-   **Performance Optimization:** Implement code splitting, lazy loading, and caching strategies to improve application performance.
-   **Security:** Conduct a thorough security audit to identify and address potential vulnerabilities. Implement server-side validation, input sanitization, and CSRF protection.
-   **Accessibility:** Perform an accessibility audit and make necessary improvements to ensure the application is usable by everyone, including people with disabilities.
-   **Internationalization:** Consider adding support for multiple languages if targeting a global audience.
-   **Documentation:** Create comprehensive documentation for the codebase, including API documentation, component usage guides, and deployment instructions.

---

## Set Weekly Hour Limit in Add Employee Form

**Feature:**

*   The Add Employee form now includes a field to specify the weekly hour limit for each employee.
*   This allows managers to set the maximum number of hours an employee can be scheduled per week.

**Implementation Details:**

1.  **Database Schema:**
    *   Added a `weekly_hour_limit` column (integer, default: 40) to the `profiles` table in the Supabase database.

2.  **Form Field:**
    *   Added a new `Input` field of type `number` to the `AddEmployeeForm` component.
    *   The field is labeled "Weekly Hour Limit".
    *   It has a minimum value of 0 and a maximum value of 168 (total hours in a week).
    *   The input value is bound to the `weeklyHourLimit` state variable in the `formData` object.

3.  **Data Handling:**
    *   When the form is submitted, the `weeklyHourLimit` value is included in the metadata sent to Supabase during user creation.
    *   The database trigger automatically creates a corresponding profile with the provided `weekly_hour_limit`.

**Validation:**

*   The input field uses the `type="number"`, `min="0"`, and `max="168"` attributes to enforce basic numeric input and range validation.
*   Further validation (e.g., ensuring a value is provided) can be added as needed.

**Note:** This feature assumes that the Supabase database trigger responsible for creating employee profiles is correctly configured to handle the `weekly_hour_limit` field in the user metadata.