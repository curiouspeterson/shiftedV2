import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a manager
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError) throw profileError
    if (profile?.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden - Managers only' }, { status: 403 })
    }

    // Get the shift requirement data from the request
    const shiftData = await request.json()

    // Insert the shift requirement
    const { data, error } = await supabase
      .from('shift_requirements')
      .insert([shiftData])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        error: error.message,
        details: error.stack,
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a manager
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError) throw profileError
    if (profile?.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden - Managers only' }, { status: 403 })
    }

    // Get the shift requirement data and ID from the request
    const { id, ...updateData } = await request.json()

    // Update the shift requirement
    const { data, error } = await supabase
      .from('shift_requirements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        error: error.message,
        details: error.stack,
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const supabase = createServerSupabaseClient()

  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a manager
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError) throw profileError
    if (profile?.role !== 'manager') {
      return NextResponse.json({ error: 'Forbidden - Managers only' }, { status: 403 })
    }

    // Get the shift requirement ID from the URL
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing shift requirement ID' }, { status: 400 })
    }

    // Delete the shift requirement
    const { error } = await supabase
      .from('shift_requirements')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        error: error.message,
        details: error.stack,
      },
      { status: 500 }
    )
  }
} 