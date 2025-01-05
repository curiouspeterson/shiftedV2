/**
 * Status Page Component
 * 
 * A dashboard page that displays the development status and roadmap of the Schedule Manager application.
 * Provides a comprehensive overview of completed, in-progress, and planned features,
 * along with technical stack information and future development plans.
 * 
 * Features:
 * - Feature status cards with completion indicators
 * - Technical stack overview
 * - Roadmap and upcoming features
 * - Responsive grid layout
 * - Visual status indicators
 * 
 * @component
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock } from "lucide-react"

/**
 * Feature configuration array
 * Defines the status and details of all application features
 * Each feature includes a name, description, overall status, and sub-items
 */
const features = [
  {
    name: "Authentication & Authorization",
    description: "User authentication with Supabase Auth, role-based access control",
    status: "completed",
    items: [
      { name: "Email/Password Authentication", status: "completed" },
      { name: "Protected Routes", status: "completed" },
      { name: "Role-based Access (Employee/Manager)", status: "completed" },
      { name: "Auth State Management", status: "completed" }
    ]
  },
  {
    name: "Employee Management",
    description: "Comprehensive employee profile and availability management",
    status: "completed",
    items: [
      { name: "Employee Profiles", status: "completed" },
      { name: "Availability Management", status: "completed" },
      { name: "Role Assignment", status: "completed" },
      { name: "Weekly Hour Limits", status: "completed" }
    ]
  },
  {
    name: "Schedule Management",
    description: "Advanced scheduling system with automated generation",
    status: "in_progress",
    items: [
      { name: "Weekly Schedule View", status: "completed" },
      { name: "Manual Shift Assignment", status: "completed" },
      { name: "Shift Requirements", status: "completed" },
      { name: "Automated Schedule Generation", status: "in_progress" },
      { name: "Schedule Conflicts Detection", status: "planned" },
      { name: "Schedule Templates", status: "planned" }
    ]
  },
  {
    name: "Time Off Management",
    description: "Request and approve time off with calendar integration",
    status: "in_progress",
    items: [
      { name: "Time Off Requests", status: "completed" },
      { name: "Request Approval Workflow", status: "completed" },
      { name: "Calendar Integration", status: "planned" },
      { name: "Conflict Detection", status: "planned" }
    ]
  },
  {
    name: "Notifications",
    description: "Real-time notifications and email alerts",
    status: "planned",
    items: [
      { name: "Real-time Updates", status: "in_progress" },
      { name: "Email Notifications", status: "planned" },
      { name: "Schedule Change Alerts", status: "planned" },
      { name: "Request Status Updates", status: "planned" }
    ]
  },
  {
    name: "Reporting & Analytics",
    description: "Insights and analytics for better scheduling decisions",
    status: "planned",
    items: [
      { name: "Schedule Coverage Analysis", status: "planned" },
      { name: "Employee Hours Reports", status: "planned" },
      { name: "Cost Analysis", status: "planned" },
      { name: "Custom Report Builder", status: "planned" }
    ]
  }
]

/**
 * Returns the appropriate icon component based on status
 * @param {string} status - The status of the feature ('completed', 'in_progress', or 'planned')
 * @returns {JSX.Element} Icon component representing the status
 */
const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "in_progress":
      return <Clock className="h-4 w-4 text-yellow-500" />
    default:
      return <Circle className="h-4 w-4 text-gray-400" />
  }
}

/**
 * Returns the appropriate badge component based on status
 * @param {string} status - The status of the feature ('completed', 'in_progress', or 'planned')
 * @returns {JSX.Element} Badge component representing the status
 */
const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>
    case "in_progress":
      return <Badge className="bg-yellow-500">In Progress</Badge>
    default:
      return <Badge variant="outline">Planned</Badge>
  }
}

/**
 * Status page component
 * Renders a comprehensive view of the application's development status
 * Includes feature cards, technical stack, and roadmap information
 */
export default function StatusPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Manager Development Status</CardTitle>
          <CardDescription>
            A comprehensive employee scheduling solution with automated schedule generation,
            availability management, and time-off tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{feature.name}</CardTitle>
                    {getStatusBadge(feature.status)}
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.items.map((item) => (
                      <li key={item.name} className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="text-sm">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Stack</CardTitle>
          <CardDescription>
            Modern and scalable technologies powering the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Frontend</h3>
              <ul className="space-y-1 text-sm">
                <li>• Next.js 14 with App Router</li>
                <li>• React Server Components</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Shadcn UI Components</li>
                <li>• Date-fns for date manipulation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Backend & Infrastructure</h3>
              <ul className="space-y-1 text-sm">
                <li>• Supabase for backend services</li>
                <li>• PostgreSQL database</li>
                <li>• Row Level Security (RLS)</li>
                <li>• Real-time subscriptions</li>
                <li>• Edge Functions</li>
                <li>• Vercel deployment</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Features</CardTitle>
          <CardDescription>
            Features and improvements planned for future releases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Short Term (Next Release)</h3>
              <ul className="space-y-1 text-sm">
                <li>• Automated schedule generation algorithm</li>
                <li>• Schedule conflict detection and resolution</li>
                <li>• Email notifications for schedule changes</li>
                <li>• Basic reporting functionality</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Medium Term</h3>
              <ul className="space-y-1 text-sm">
                <li>• Advanced analytics dashboard</li>
                <li>• Schedule templates and patterns</li>
                <li>• Mobile app development</li>
                <li>• Integration with popular calendar services</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Long Term Vision</h3>
              <ul className="space-y-1 text-sm">
                <li>• AI-powered schedule optimization</li>
                <li>• Advanced forecasting and demand prediction</li>
                <li>• Multi-location support</li>
                <li>• Employee skills and certification tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

