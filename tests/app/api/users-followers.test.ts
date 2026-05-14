import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockGetFollowers = vi.fn()
const mockGetFollowing = vi.fn()

vi.mock('@/lib/supabase/follows', async () => {
  const actual = await vi.importActual<typeof import('@/lib/supabase/follows')>(
    '@/lib/supabase/follows',
  )
  return {
    ...actual,
    getFollowers: (...args: unknown[]) => mockGetFollowers(...args),
    getFollowing: (...args: unknown[]) => mockGetFollowing(...args),
  }
})

import { NextRequest } from 'next/server'

function req(url: string) {
  return new NextRequest(url)
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── /followers ───────────────────────────────────────────────────────────────

describe('GET /api/users/[id]/followers', () => {
  it('uses default pagination (limit=20, offset=0)', async () => {
    mockGetFollowers.mockResolvedValue({ profiles: [], total: 0 })
    const { GET } = await import('@/app/api/users/[id]/followers/route')
    const res = await GET(req('http://localhost/api/users/u/followers'), {
      params: Promise.resolve({ id: 'u' }),
    })
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.pagination).toEqual({ limit: 20, offset: 0, total: 0 })
    expect(mockGetFollowers).toHaveBeenCalledWith('u', 20, 0)
  })

  it('honors custom limit and offset', async () => {
    mockGetFollowers.mockResolvedValue({
      profiles: [
        { id: 'a', full_name: 'Ana',  avatar_url: null, profession: null },
        { id: 'b', full_name: 'Beto', avatar_url: null, profession: 'Barber' },
      ],
      total: 42,
    })
    const { GET } = await import('@/app/api/users/[id]/followers/route')
    const res = await GET(
      req('http://localhost/api/users/u/followers?limit=10&offset=30'),
      { params: Promise.resolve({ id: 'u' }) },
    )
    const body = await res.json()
    expect(mockGetFollowers).toHaveBeenCalledWith('u', 10, 30)
    expect(body.data).toHaveLength(2)
    expect(body.pagination.total).toBe(42)
  })

  it('caps limit at 100', async () => {
    mockGetFollowers.mockResolvedValue({ profiles: [], total: 0 })
    const { GET } = await import('@/app/api/users/[id]/followers/route')
    await GET(req('http://localhost/api/users/u/followers?limit=999'), {
      params: Promise.resolve({ id: 'u' }),
    })
    expect(mockGetFollowers).toHaveBeenCalledWith('u', 100, 0)
  })

  it('treats negative offset as 0', async () => {
    mockGetFollowers.mockResolvedValue({ profiles: [], total: 0 })
    const { GET } = await import('@/app/api/users/[id]/followers/route')
    await GET(req('http://localhost/api/users/u/followers?offset=-50'), {
      params: Promise.resolve({ id: 'u' }),
    })
    expect(mockGetFollowers).toHaveBeenCalledWith('u', 20, 0)
  })
})

// ─── /following ───────────────────────────────────────────────────────────────

describe('GET /api/users/[id]/following', () => {
  it('uses default pagination and forwards id', async () => {
    mockGetFollowing.mockResolvedValue({ profiles: [], total: 0 })
    const { GET } = await import('@/app/api/users/[id]/following/route')
    const res = await GET(req('http://localhost/api/users/u/following'), {
      params: Promise.resolve({ id: 'u' }),
    })
    expect(res.status).toBe(200)
    expect(mockGetFollowing).toHaveBeenCalledWith('u', 20, 0)
  })

  it('returns profiles with pagination metadata', async () => {
    mockGetFollowing.mockResolvedValue({
      profiles: [
        { id: 'x', full_name: 'Xana', avatar_url: 'a.png', profession: null },
      ],
      total: 1,
    })
    const { GET } = await import('@/app/api/users/[id]/following/route')
    const res = await GET(req('http://localhost/api/users/u/following'), {
      params: Promise.resolve({ id: 'u' }),
    })
    const body = await res.json()
    expect(body.data[0].full_name).toBe('Xana')
    expect(body.pagination.total).toBe(1)
  })
})
