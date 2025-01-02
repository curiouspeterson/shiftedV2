"use server"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, XCircle, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase"

type SystemStatus = {
  component: string
  status: 'operational' | 'degraded' | 'down'
  description: string
}

type DevelopmentTask = {
  id: number
  task_title: string
  description: string
  status: 'not_started' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assigned_to: string | null
  due_date: string | null
}

export default async function StatusPage() {
  // Fetch system status data from Supabase
  const { data: systemData, error: systemError } = await supabase
    .from<SystemStatus>('system_status')
    .select('*')

  // Fetch development progress data from Supabase
  const { data: devData, error: devError } = await supabase
    .from<DevelopmentTask>('development_progress')
    .select('*')

  if (systemError || devError) {
    console.error('Error fetching data:', systemError || devError)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Failed to load status information.</p>
      </div>
    )
  }

  const systemStatuses = systemData || []
  const developmentTasks = devData || []

  // Mappings for system status
  const systemStatusMappings: Record<SystemStatus['status'], { color: string, icon: JSX.Element }> = {
    operational: { color: 'green', icon: <CheckCircle className="text-green-500" /> },
    degraded: { color: 'yellow', icon: <Clock className="text-yellow-500" /> },
    down: { color: 'red', icon: <XCircle className="text-red-500" /> },
  }

  // Mappings for development task status
  const devStatusMappings: Record<DevelopmentTask['status'], { color: string, icon: JSX.Element }> = {
    not_started: { color: 'gray', icon: <FileText className="text-gray-500" /> },
    in_progress: { color: 'blue', icon: <Clock className="text-blue-500" /> },
    completed: { color: 'green', icon: <CheckCircle className="text-green-500" /> },
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Status</h1>
      
      {/* System Status Section */}
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
                  {systemStatusMappings[status.status]?.icon || <FileText className="text-gray-500" />}
                  <span>{status.component}</span>
                </div>
                <Badge variant="outline" className={`bg-${systemStatusMappings[status.status]?.color}-50 text-${systemStatusMappings[status.status]?.color}-700`}>
                  {status.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </Badge>
              </div>
              <p className="ml-8 text-sm text-gray-600">{status.description}</p>
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Development Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Development Progress</CardTitle>
          <CardDescription>Current status of development tasks and features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {developmentTasks.map((task) => (
            <div key={task.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {devStatusMappings[task.status]?.icon || <FileText className="text-gray-500" />}
                  <span>{task.task_title}</span>
                </div>
                <Badge variant="outline" className={`bg-${devStatusMappings[task.status]?.color}-50 text-${devStatusMappings[task.status]?.color}-700`}>
                  {task.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </Badge>
              </div>
              <p className="ml-8 text-sm text-gray-600">{task.description}</p>
              {task.assigned_to && (
                <p className="ml-8 text-sm text-gray-500">Assigned to: {task.assigned_to}</p>
              )}
              {task.due_date && (
                <p className="ml-8 text-sm text-gray-500">Due by: {new Date(task.due_date).toLocaleDateString()}</p>
              )}
              <Separator />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

