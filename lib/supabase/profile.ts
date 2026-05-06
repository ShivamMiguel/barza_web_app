import { createClient as createServerClient } from './server'
import { createClient as createBrowserClient } from './client'

export interface UserProfile {
  id: string
  full_name: string
  phone?: string
  user_type?: string
  avatar_url?: string
  profile_location?: Record<string, any>
  role_profile?: string
  created_at?: string
}

/**
 * Get the logged-in user's profile from Supabase
 * Must be called from Server Components or Server Actions
 */
export async function getLoggedUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createServerClient()

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('No authenticated user:', userError?.message)
      return null
    }

    // Fetch user profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError.message)
      return null
    }

    if (!profile) {
      console.warn('Profile not found for user:', user.id)
      return null
    }

    return {
      id: profile.id,
      full_name: profile.full_name || 'User',
      phone: profile.phone,
      user_type: profile.user_type,
      avatar_url: profile.avatar_url,
      profile_location: profile.profile_location,
      role_profile: profile.role_profile,
      created_at: profile.created_at,
    }
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error)
    return null
  }
}

/**
 * Get a specific user's profile by ID (for viewing other profiles)
 */
export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = await createServerClient()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error.message)
      return null
    }

    if (!profile) {
      return null
    }

    return {
      id: profile.id,
      full_name: profile.full_name || 'User',
      phone: profile.phone,
      user_type: profile.user_type,
      avatar_url: profile.avatar_url,
      profile_location: profile.profile_location,
      role_profile: profile.role_profile,
      created_at: profile.created_at,
    }
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error)
    return null
  }
}

/**
 * Get user profile by username (from profile_location or email)
 */
export async function getUserProfileByUsername(username: string): Promise<UserProfile | null> {
  try {
    const supabase = await createServerClient()

    // Try to find by full_name or username in profile_location
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .or(
        `full_name.ilike.%${username}%,profile_location->>'username'.ilike.%${username}%`
      )
      .limit(1)

    if (error) {
      console.error('Error fetching profile:', error.message)
      return null
    }

    if (!profiles || profiles.length === 0) {
      return null
    }

    const profile = profiles[0]

    return {
      id: profile.id,
      full_name: profile.full_name || 'User',
      phone: profile.phone,
      user_type: profile.user_type,
      avatar_url: profile.avatar_url,
      profile_location: profile.profile_location,
      role_profile: profile.role_profile,
      created_at: profile.created_at,
    }
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error)
    return null
  }
}
