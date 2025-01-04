import { createClient } from '@/lib/supabase/client'
import { AuthError } from '@supabase/supabase-js'

export async function signUp(email: string, password: string, fullName: string) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Signup error:', error)
      return { error }
    }

    if (!data.user) {
      return { error: new Error('No user returned from signup') }
    }

    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          full_name: fullName,
          email: email,
          role: 'employee',
          is_active: true,
        },
      ])

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return { error: profileError }
    }

    return { data }
  } catch (err) {
    console.error('Unexpected error during signup:', err)
    return { error: err as Error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error)
      return { error }
    }

    // Verify the session was created
    const { data: { session } } = await supabase.auth.getSession()
    console.log('Session after login:', {
      hasSession: !!session,
      user: session?.user,
      accessToken: session?.access_token ? 'present' : 'missing'
    })

    return { data }
  } catch (err) {
    console.error('Unexpected error during login:', err)
    return { error: err as Error }
  }
} 