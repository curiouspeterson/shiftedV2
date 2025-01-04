import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

const supabaseUrl = 'https://wgpehvclyqlyhseqdmqj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndncGVodmNseXFseWhzZXFkbXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NDI5MzksImV4cCI6MjA1MTUxODkzOX0.owN6sfxK_IPPeGqqhA-bvegoM9U5d_uPKBJMe4YBsys'

export function createClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
} 