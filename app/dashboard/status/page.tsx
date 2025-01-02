import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Clock, Users, Calendar, Briefcase, ShieldCheck, Database, FileText } from 'lucide-react'

export default function StatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Status</h1>
        <p className="text-muted-foreground mt-2">
          Current status and overview of the Schedule Manager application
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>System Overview</CardTitle>
              <Badge variant="success" className="bg-green-500">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Operational
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Database className="h-6 w-6 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">Database Structure</h3>
                  <p className="text-sm text-muted-foreground">
                    PostgreSQL database with Supabase integration
                  </p>
                </div>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Tables</h4>
                    <ul className="mt-1 list-disc list-inside text-muted-foreground">
                      <li>profiles - User profiles and details</li>
                      <li>shifts - Shift definitions and schedules</li>
                      <li>shift_assignments - Employee shift assignments</li>
                      <li>employee_availability - Staff availability windows</li>
                      <li>employee_schedules - Employee work schedules</li>
                      <li>time_off_requests - Employee time off requests</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Security</h4>
                    <ul className="mt-1 list-disc list-inside text-muted-foreground">
                      <li>Row Level Security (RLS) enabled</li>
                      <li>User authentication via Supabase Auth</li>
                      <li>Role-based access control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Briefcase className="h-6 w-6 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">Core Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Key functionality and capabilities
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <CardTitle className="text-base">Shift Management</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      <li>Create and manage shift templates</li>
                      <li>Define shift durations and times</li>
                      <li>Flexible shift scheduling</li>
                      <li>Shift assignment tracking</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <CardTitle className="text-base">Employee Management</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      <li>Employee profiles and details</li>
                      <li>Role and permission management</li>
                      <li>Staff availability tracking</li>
                      <li>Shift assignment history</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <CardTitle className="text-base">Availability Management</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      <li>Set recurring availability</li>
                      <li>Time-off requests</li>
                      <li>Availability conflicts detection</li>
                      <li>Schedule optimization</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <CardTitle className="text-base">Security & Access</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      <li>Secure authentication</li>
                      <li>Role-based permissions</li>
                      <li>Data encryption</li>
                      <li>Activity logging</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <CardTitle className="text-base">Time Off Management</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      <li>Submit time off requests</li>
                      <li>Approve/reject time off requests</li>
                      <li>View time off history</li>
                      <li>Real-time updates</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">Technical Specifications</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium">Frontend</h4>
                  <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Next.js 14 with App Router</li>
                    <li>React Server Components</li>
                    <li>Tailwind CSS for styling</li>
                    <li>shadcn/ui component library</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Backend</h4>
                  <ul className="mt-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Supabase for database and auth</li>
                    <li>PostgreSQL database</li>
                    <li>Row Level Security</li>
                    <li>Real-time subscriptions</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

