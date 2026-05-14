import { createClient as createServerClient } from './server'

export interface FollowSummary {
  followers: number
  following: number
  /** null when the caller isn't authenticated or is viewing their own profile */
  is_following: boolean | null
}

export interface FollowerProfile {
  id: string
  full_name: string
  avatar_url?: string | null
  profession?: string | null
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function followUser(
  followerId: string,
  followedId: string,
): Promise<{ success: boolean; alreadyFollowing?: boolean; error?: string }> {
  if (followerId === followedId) {
    return { success: false, error: 'Não podes seguir-te a ti próprio.' }
  }
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('user_follows')
    .insert({ follower_id: followerId, followed_id: followedId })

  if (error) {
    // 23505 = unique_violation → already following, treat as idempotent success
    if (error.code === '23505') return { success: true, alreadyFollowing: true }
    return { success: false, error: error.message }
  }
  return { success: true }
}

export async function unfollowUser(
  followerId: string,
  followedId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('followed_id', followedId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function isFollowing(
  followerId: string,
  followedId: string,
): Promise<boolean> {
  if (followerId === followedId) return false
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('user_follows')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('followed_id', followedId)
    .maybeSingle()

  if (error) return false
  return !!data
}

export async function getFollowSummary(
  targetUserId: string,
  callerId: string | null,
): Promise<FollowSummary> {
  const supabase = await createServerClient()

  const followersPromise = supabase
    .from('user_follows')
    .select('*', { count: 'exact', head: true })
    .eq('followed_id', targetUserId)

  const followingPromise = supabase
    .from('user_follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', targetUserId)

  const isFollowingPromise =
    callerId && callerId !== targetUserId
      ? isFollowing(callerId, targetUserId)
      : Promise.resolve<null>(null)

  const [followersRes, followingRes, isF] = await Promise.all([
    followersPromise,
    followingPromise,
    isFollowingPromise,
  ])

  return {
    followers: followersRes.count ?? 0,
    following: followingRes.count ?? 0,
    is_following: isF as boolean | null,
  }
}

/**
 * Generic "list profiles by relation" — `direction` controls which side of the
 * relation we filter on.
 *   - "followers"  → list users who follow `userId`
 *   - "following"  → list users `userId` follows
 */
async function listRelatedProfiles(
  userId: string,
  direction: 'followers' | 'following',
  limit: number,
  offset: number,
): Promise<{ profiles: FollowerProfile[]; total: number }> {
  const supabase = await createServerClient()
  const filterColumn = direction === 'followers' ? 'followed_id' : 'follower_id'
  const otherColumn = direction === 'followers' ? 'follower_id' : 'followed_id'

  const { data: rows, count, error } = await supabase
    .from('user_follows')
    .select(otherColumn, { count: 'exact' })
    .eq(filterColumn, userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error || !rows) return { profiles: [], total: 0 }
  if (rows.length === 0) return { profiles: [], total: count ?? 0 }

  const ids = rows
    .map((r: Record<string, unknown>) => r[otherColumn] as string)
    .filter(Boolean)

  if (ids.length === 0) return { profiles: [], total: count ?? 0 }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, role_profile')
    .in('id', ids)

  // Preserve the original "newest first" order from user_follows
  const byId = new Map(
    (profiles ?? []).map((p: Record<string, unknown>) => [p.id as string, p]),
  )
  const ordered: FollowerProfile[] = []
  for (const id of ids) {
    const p = byId.get(id) as Record<string, unknown> | undefined
    if (!p) continue
    ordered.push({
      id: p.id as string,
      full_name: (p.full_name as string) ?? 'User',
      avatar_url: (p.avatar_url as string | null) ?? null,
      profession: (p.role_profile as string | null) ?? null,
    })
  }

  return { profiles: ordered, total: count ?? 0 }
}

export function getFollowers(userId: string, limit = 20, offset = 0) {
  return listRelatedProfiles(userId, 'followers', limit, offset)
}

export function getFollowing(userId: string, limit = 20, offset = 0) {
  return listRelatedProfiles(userId, 'following', limit, offset)
}
