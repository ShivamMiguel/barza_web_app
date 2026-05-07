import { createClient as createServerClient } from './server'

export interface UserProfile {
  id: string
  full_name: string
  phone?: string
  user_type?: string
  avatar_url?: string
  bio?: string
  profession?: string
  profile_location?: Record<string, any>
  created_at?: string
}

function mapProfile(profile: Record<string, any>): UserProfile {
  return {
    id: profile.id,
    full_name: profile.full_name || 'User',
    phone: profile.phone,
    user_type: profile.user_type,
    avatar_url: profile.avatar_url,
    profession: profile.role_profile,
    bio: profile.profile_location?.bio as string | undefined,
    profile_location: profile.profile_location,
    created_at: profile.created_at,
  }
}

export async function getLoggedUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createServerClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return null

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) return null

    return mapProfile(profile)
  } catch {
    return null
  }
}

export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = await createServerClient()

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !profile) return null

    return mapProfile(profile)
  } catch {
    return null
  }
}

export async function getUserProfileByUsername(username: string): Promise<UserProfile | null> {
  try {
    const supabase = await createServerClient()

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${username}%,profile_location->>'username'.ilike.%${username}%`)
      .limit(1)

    if (error || !profiles || profiles.length === 0) return null

    return mapProfile(profiles[0])
  } catch {
    return null
  }
}

export async function updateProfile(data: {
  full_name?: string
  profession?: string
  bio?: string
  avatar_url?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false, error: 'Não autorizado' }

    // Fetch current profile_location so we only merge bio, not overwrite other fields
    const { data: current } = await supabase
      .from('profiles')
      .select('profile_location')
      .eq('id', user.id)
      .single()

    const currentLocation: Record<string, any> = (current?.profile_location as Record<string, any>) || {}

    const updates: Record<string, any> = {}
    if (data.full_name !== undefined) updates.full_name = data.full_name
    if (data.profession !== undefined) updates.role_profile = data.profession
    if (data.avatar_url !== undefined) updates.avatar_url = data.avatar_url
    if (data.bio !== undefined) {
      updates.profile_location = { ...currentLocation, bio: data.bio }
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err) {
    return { success: false, error: 'Erro inesperado' }
  }
}
