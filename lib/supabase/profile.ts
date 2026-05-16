import { createClient as createServerClient } from './server'

export interface ProfileLocation {
  country?: string
  country_code?: string
  city?: string
  neighborhood?: string
  street?: string
  address?: string
  latitude?: number
  longitude?: number
  dial_code?: string
  bio?: string
}

export interface UserProfile {
  id: string
  full_name: string
  phone?: string
  user_type?: string
  avatar_url?: string
  bio?: string
  profession?: string
  profile_location?: ProfileLocation & Record<string, any>
  interests?: string[]
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
    interests: Array.isArray(profile.interests) ? profile.interests : undefined,
    created_at: profile.created_at,
  }
}

/**
 * Heuristic: a profile needs onboarding when no onboarding step has ever
 * produced data. As soon as the user fills in their phone, picks any
 * interest, or selects a city, we treat them as onboarded and stop
 * pushing them through the flow.
 *
 * - First-time OAuth signups (Google, etc.) hit this and return `true`.
 * - Users who actively skipped every step also return `true` — they'll
 *   see onboarding again next login, which is intentional (the only way
 *   to "complete" it is to actually enter at least one field).
 * - `null` profile (race against the auth.users → profiles trigger)
 *   also returns `true`, so we err on the side of guiding the user.
 */
export function needsOnboarding(profile: UserProfile | null | undefined): boolean {
  if (!profile) return true
  const hasPhone = !!profile.phone?.trim()
  const hasInterests = (profile.interests?.length ?? 0) > 0
  const hasCity = !!profile.profile_location?.city?.trim()
  return !hasPhone && !hasInterests && !hasCity
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
  phone?: string
  interests?: string[]
  location?: Partial<ProfileLocation>
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false, error: 'Não autorizado' }

    // Read current profile_location so we merge instead of overwriting.
    const { data: current } = await supabase
      .from('profiles')
      .select('profile_location')
      .eq('id', user.id)
      .single()

    const currentLocation: Record<string, any> =
      (current?.profile_location as Record<string, any>) || {}

    const updates: Record<string, any> = {}
    if (data.full_name !== undefined) updates.full_name = data.full_name
    if (data.profession !== undefined) updates.role_profile = data.profession
    if (data.avatar_url !== undefined) updates.avatar_url = data.avatar_url
    if (data.phone !== undefined) updates.phone = data.phone
    if (data.interests !== undefined) updates.interests = data.interests

    // profile_location is a JSONB bag — merge keys as they arrive.
    let nextLocation: Record<string, any> | undefined
    if (data.bio !== undefined) {
      nextLocation = { ...(nextLocation ?? currentLocation), bio: data.bio }
    }
    if (data.location !== undefined) {
      nextLocation = { ...(nextLocation ?? currentLocation), ...data.location }
    }
    if (nextLocation !== undefined) updates.profile_location = nextLocation

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch {
    return { success: false, error: 'Erro inesperado' }
  }
}
