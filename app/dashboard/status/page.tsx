import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Users, Calendar, Briefcase, ShieldCheck, Database, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase"

type SystemStatus = {
  component: string
  status: 'operational' | 'degraded' | 'down'
  description: string
}

export default async function StatusPage() {
  // Fetch system status data from Supabase
  const { data, error } = await supabase
    .from<SystemStatus>('system_status')
    .select('*')

  if (error) {
    console.error('Error fetching system status:', error)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Failed to load system status.</p>
      </div>
    )
  }

  const systemStatuses = data || []

  // Function to determine badge color based on status
  const getBadgeVariant = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'green'
      case 'degraded':
        return 'yellow'
      case 'down':
        return 'red'
      default:
        return 'gray'
    }
  }

  // Function to get corresponding icon
  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="text-green-500" />
      case 'degraded':
        return <Clock className="text-yellow-500" />
      case 'down':
        return <ShieldCheck className="text-red-500" />
      default:
        return <FileText className="text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Status</h1>
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          <CardDescription>Current status of all system components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {systemStatuses.map((status) => (
            <div key={status.component}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.status)}
                  <span>{status.component}</span>
                </div>
                <Badge variant="outline" className={`bg-${getBadgeVariant(status.status)}-50 text-${getBadgeVariant(status.status)}-700`}>
                  {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                </Badge>
              </div>
              <p className="ml-8 text-sm text-gray-600">{status.description}</p>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

