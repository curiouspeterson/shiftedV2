"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { AvailabilityForm } from "@/components/availability-form"
import { AvailabilityList } from "@/components/availability-list"
import { EmployeeAvailabilityManager } from "@/components/employee-availability-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AvailabilityPage() {
  const [availabilities, setAvailabilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
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
      const { data, error } = await supabase
        .from('employee_availability')
        .select('*')
        .eq('user_id', userId)
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
    <div className="space-y-6">
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