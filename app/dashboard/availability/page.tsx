"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { AvailabilityForm } from "@/components/availability-form"
import { AvailabilityList } from "@/components/availability-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Availability {
  id: string
  profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else if (user) {
        setUserId(user.id);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAvailabilities();
    }
  }, [userId]);

  async function fetchAvailabilities() {
    try {
      setLoading(true);
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data, error } = await supabase
        .from('employee_availability')
        .select('*')
        .eq('profile_id', userId)
        .order('day_of_week', { ascending: true });

      if (error) throw error;
      setAvailabilities(data || []);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilityForm onAvailabilityAdded={fetchAvailabilities} />
          {loading ? (
            <p>Loading availabilities...</p>
          ) : (
            <AvailabilityList
              availabilities={availabilities}
              onAvailabilityUpdated={fetchAvailabilities}
              onAvailabilityDeleted={fetchAvailabilities}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}