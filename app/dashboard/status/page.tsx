"use server"

import { createServerComponentClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CircleSlash, Clock, CheckCircle2 } from "lucide-react"

interface SystemStatus {
  id: string
  name: string
  status: 'not_started' | 'in_progress' | 'completed'
  description: string
}

interface DevelopmentProgress {
  id: string
  feature: string
  status: 'not_started' | 'in_progress' | 'completed'
  completion_percentage: number
}

const statusConfig = {
  not_started: {
    color: "text-red-500",
    icon: <CircleSlash className="h-4 w-4" />
  },
  in_progress: {
    color: "text-yellow-500",
    icon: <Clock className="h-4 w-4" />
  },
  completed: {
    color: "text-green-500",
    icon: <CheckCircle2 className="h-4 w-4" />
  }
} as const

export default async function StatusPage() {
  const supabase = createServerComponentClient()

  // Fetch system status data from Supabase
  const { data: systemData, error: systemError } = await supabase
    .from('system_status')
    .select('*') as { data: SystemStatus[] | null; error: Error | null }

  // Fetch development progress data from Supabase
  const { data: progressData, error: progressError } = await supabase
    .from('development_progress')
    .select('*') as { data: DevelopmentProgress[] | null; error: Error | null }

  if (systemError || progressError) {
    throw new Error('Failed to fetch data')
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemData?.map((status) => (
                <div key={status.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {status.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {status.description}
                    </p>
                  </div>
                  <div className={statusConfig[status.status].color}>
                    {statusConfig[status.status].icon}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Development Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData?.map((progress) => (
                <div key={progress.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {progress.feature}
                    </p>
                    <div className={statusConfig[progress.status].color}>
                      {statusConfig[progress.status].icon}
                    </div>
                  </div>
                  <Progress value={progress.completion_percentage} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

