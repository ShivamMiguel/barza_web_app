import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockGetUser = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
  }),
}))

const mockFollowUser = vi.fn()
const mockUnfollowUser = vi.fn()
const mockGetFollowSummary = vi.fn()

vi.mock('@/lib/supabase/follows', async () => {
  const actual = await vi.importActual<typeof import('@/lib/supabase/follows')>(
    '@/lib/supabase/follows',
  )
  return {
    ...actual,
    followUser: (a: string, b: string) => mockFollowUser(a, b),
    unfollowUser: (a: string, b: string) => mockUnfollowUser(a, b),
    getFollowSummary: (a: string, b: string | null) => mockGetFollowSummary(a, b),
  }
})

import { NextRequest } from 'next/server'

async function call(
  method: 'POST' | 'DELETE' | 'GET',
  id: string,
): Promise<Response> {
  const { POST, DELETE, GET } = await import(
    '@/app/api/users/[id]/follow/route'
  )
  const req = new NextRequest(`http://localhost/api/users/${id}/follow`, {
    method,
  })
  const params = Promise.resolve({ id })
  if (method === 'POST') return POST(req, { params })
  if (method === 'DELETE') return DELETE(req, { params })
  return GET(req, { params })
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── POST ─────────────────────────────────────────────────────────────────────

describe('POST /api/users/[id]/follow', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const res = await call('POST', 'target-1')
    expect(res.status).toBe(401)
    expect(mockFollowUser).not.toHaveBeenCalled()
  })

  it('returns 400 when trying to follow self', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'me' } },
      error: null,
    })
    const res = await call('POST', 'me')
    expect(res.status).toBe(400)
    expect(mockFollowUser).not.toHaveBeenCalled()
  })

  it('follows target user and returns fresh summary', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'me' } },
      error: null,
    })
    mockFollowUser.mockResolvedValue({ success: true })
    mockGetFollowSummary.mockResolvedValue({
      followers: 3,
      following: 0,
      is_following: true,
    })

    const res = await call('POST', 'target-1')
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({
      success: true,
      already_following: false,
      followers: 3,
      following: 0,
      is_following: true,
    })
    expect(mockFollowUser).toHaveBeenCalledWith('me', 'target-1')
    expect(mockGetFollowSummary).toHaveBeenCalledWith('target-1', 'me')
  })

  it('reports already_following=true when the row already exists', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'me' } },
      error: null,
    })
    mockFollowUser.mockResolvedValue({ success: true, alreadyFollowing: true })
    mockGetFollowSummary.mockResolvedValue({
      followers: 3,
      following: 0,
      is_following: true,
    })
    const res = await call('POST', 'target-1')
    const body = await res.json()
    expect(body.already_following).toBe(true)
  })

  it('returns 500 if the follow mutation fails', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'me' } },
      error: null,
    })
    mockFollowUser.mockResolvedValue({ success: false, error: 'db down' })
    const res = await call('POST', 'target-1')
    expect(res.status).toBe(500)
  })
})

// ─── DELETE ───────────────────────────────────────────────────────────────────

describe('DELETE /api/users/[id]/follow', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const res = await call('DELETE', 'target-1')
    expect(res.status).toBe(401)
  })

  it('unfollows and returns fresh summary', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'me' } },
      error: null,
    })
    mockUnfollowUser.mockResolvedValue({ success: true })
    mockGetFollowSummary.mockResolvedValue({
      followers: 2,
      following: 0,
      is_following: false,
    })
    const res = await call('DELETE', 'target-1')
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({
      success: true,
      followers: 2,
      following: 0,
      is_following: false,
    })
    expect(mockUnfollowUser).toHaveBeenCalledWith('me', 'target-1')
  })
})

// ─── GET ──────────────────────────────────────────────────────────────────────

describe('GET /api/users/[id]/follow', () => {
  it('returns summary for the target user (anonymous → is_following null)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    mockGetFollowSummary.mockResolvedValue({
      followers: 42,
      following: 7,
      is_following: null,
    })
    const res = await call('GET', 'target-1')
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body).toEqual({ followers: 42, following: 7, is_following: null })
    expect(mockGetFollowSummary).toHaveBeenCalledWith('target-1', null)
  })

  it('passes the caller id when authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'me' } } })
    mockGetFollowSummary.mockResolvedValue({
      followers: 42,
      following: 7,
      is_following: true,
    })
    const res = await call('GET', 'target-1')
    const body = await res.json()
    expect(body.is_following).toBe(true)
    expect(mockGetFollowSummary).toHaveBeenCalledWith('target-1', 'me')
  })
})
