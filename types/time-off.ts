export type TimeOffRequest = {
  id: string
  user_id: string
  start_date: string
  end_date: string
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

