import { useQuery } from '@tanstack/react-query'
import type { UserProfile } from '@/lib/supabase/profile'
import type { TrendingProfessional } from '@/app/api/trending-professionals/route'
import type { PostWithUser } from '@/lib/supabase/posts'
import type { ExternalSignal } from '@/lib/beauty-signals/external'
import type { ServiceWithSpace, ProfessionalSpace, ProfessionalService } from '@/lib/supabase/professional-spaces'
import type { Comment } from '@/components/CommentsSection'

// ── Query Keys ─────────────────────────────────────────────────────────────────

export const qk = {
  profile:            () => ['profile'] as const,
  trendingPros:       (limit: number) => ['trending-professionals', limit] as const,
  marketInsights:     () => ['market-insights'] as const,
  posts:              (params: Record<string, string | number>) => ['posts', params] as const,
  comments:           (postId: string) => ['comments', postId] as const,
  followStatus:       (userId: string) => ['follow', userId] as const,
  beautySignals:      () => ['beauty-signals'] as const,
  professionalSpaces: (limit: number) => ['professional-spaces', limit] as const,
  mySpaces:           () => ['my-spaces'] as const,
}

// ── Internal fetch helper ──────────────────────────────────────────────────────

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(String(res.status))
  return res.json() as Promise<T>
}

// ── Query Hooks ────────────────────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: qk.profile(),
    queryFn: () => apiFetch<UserProfile>('/api/profile').catch(() => null),
    staleTime: 2 * 60 * 1000,
  })
}

export function useTrendingPros(limit = 3) {
  return useQuery({
    queryKey: qk.trendingPros(limit),
    queryFn: () =>
      apiFetch<TrendingProfessional[]>(`/api/trending-professionals?limit=${limit}`)
        .catch(() => [] as TrendingProfessional[]),
    staleTime: 5 * 60 * 1000,
  })
}

export function useMarketInsights() {
  return useQuery({
    queryKey: qk.marketInsights(),
    queryFn: () => apiFetch('/api/market-insights').catch(() => null),
    staleTime: 5 * 60 * 1000,
  })
}

export function usePosts(params: {
  limit?: number
  offset?: number
  userId?: string
  hashtag?: string
}) {
  const sp = new URLSearchParams()
  if (params.limit != null) sp.set('limit', String(params.limit))
  if (params.offset != null) sp.set('offset', String(params.offset))
  if (params.userId) sp.set('user_id', params.userId)
  if (params.hashtag) sp.set('hashtag', params.hashtag)

  return useQuery({
    queryKey: qk.posts(params as Record<string, string | number>),
    queryFn: () =>
      apiFetch<{ data: PostWithUser[] }>(`/api/posts?${sp.toString()}`)
        .catch(() => ({ data: [] as PostWithUser[] })),
    staleTime: 30 * 1000,
  })
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: qk.comments(postId),
    queryFn: () =>
      apiFetch<{ data: Comment[] }>(`/api/posts/${postId}/comments`)
        .catch(() => ({ data: [] as Comment[] })),
    staleTime: 30 * 1000,
  })
}

export function useFollowStatus(userId: string, options: { enabled: boolean }) {
  return useQuery({
    queryKey: qk.followStatus(userId),
    queryFn: () =>
      apiFetch<{ is_following: boolean | null }>(`/api/users/${userId}/follow`)
        .catch(() => null),
    staleTime: 60 * 1000,
    enabled: options.enabled,
  })
}

export function useBeautySignals() {
  return useQuery({
    queryKey: qk.beautySignals(),
    queryFn: () =>
      apiFetch<ExternalSignal[]>('/api/beauty-signals')
        .catch(() => [] as ExternalSignal[]),
    staleTime: 10 * 60 * 1000,
  })
}

export function useMySpaces() {
  return useQuery({
    queryKey: qk.mySpaces(),
    queryFn: () =>
      apiFetch<{ spaces: ProfessionalSpace[]; services: ProfessionalService[] }>('/api/users/me/spaces')
        .catch(() => ({ spaces: [] as ProfessionalSpace[], services: [] as ProfessionalService[] })),
    staleTime: 2 * 60 * 1000,
  })
}

export function useProfessionalSpaces(limit = 20) {
  return useQuery({
    queryKey: qk.professionalSpaces(limit),
    queryFn: () =>
      apiFetch<ServiceWithSpace[]>(`/api/professional-spaces?limit=${limit}`)
        .catch(() => [] as ServiceWithSpace[]),
    staleTime: 5 * 60 * 1000,
  })
}
