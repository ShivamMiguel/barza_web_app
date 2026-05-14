import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockGetUser = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}))

import { NextRequest } from 'next/server'

async function call(): Promise<Response> {
  const { GET } = await import('@/app/api/users/me/spaces/route')
  return GET(new NextRequest('http://localhost/api/users/me/spaces'))
}

function makeChain(result: unknown) {
  const chain: Record<string, unknown> = {}
  const resolved = Promise.resolve(result)
  Object.assign(chain, {
    select: vi.fn().mockReturnValue(chain),
    eq: vi.fn().mockReturnValue(chain),
    in: vi.fn().mockReturnValue(chain),
    order: vi.fn().mockReturnValue(chain),
    // Make the whole chain awaitable regardless of which method is last
    then: resolved.then.bind(resolved),
    catch: resolved.catch.bind(resolved),
    finally: resolved.finally.bind(resolved),
  })
  return chain
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

// ─── Unauthenticated ──────────────────────────────────────────────────────────

describe('GET /api/users/me/spaces — unauthenticated', () => {
  it('returns empty arrays when no user session', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const res = await call()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ spaces: [], services: [] })
    expect(mockFrom).not.toHaveBeenCalled()
  })
})

// ─── Authenticated — no spaces ────────────────────────────────────────────────

describe('GET /api/users/me/spaces — authenticated, no spaces', () => {
  it('returns empty arrays when owner has no spaces', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    mockFrom.mockImplementation(() =>
      makeChain({ data: [], error: null }),
    )

    const res = await call()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ spaces: [], services: [] })
  })
})

// ─── Authenticated — with spaces ──────────────────────────────────────────────

describe('GET /api/users/me/spaces — authenticated, with spaces', () => {
  const spaces = [
    { id: 'space-1', space_name: 'Studio A', owner: 'user-1', available: true },
    { id: 'space-2', space_name: 'Studio B', owner: 'user-1', available: false },
  ]
  const services = [
    { id: 'svc-1', professional_space_id: 'space-1', service_name: 'Corte', price: 3000, is_active: true },
  ]

  it('returns spaces and their services', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let callCount = 0
    mockFrom.mockImplementation(() => {
      callCount++
      if (callCount === 1) return makeChain({ data: spaces, error: null })
      return makeChain({ data: services, error: null })
    })

    const res = await call()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.spaces).toHaveLength(2)
    expect(body.spaces[0].space_name).toBe('Studio A')
    expect(body.services).toHaveLength(1)
    expect(body.services[0].service_name).toBe('Corte')
  })

  it('queries spaces filtered by owner', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-42' } } })

    let eqSpy: ReturnType<typeof vi.fn> | null = null
    mockFrom.mockImplementation(() => {
      const chain = makeChain({ data: [], error: null })
      eqSpy = chain.eq
      return chain
    })

    await call()
    expect(eqSpy).toHaveBeenCalledWith('owner', 'user-42')
  })

  it('skips services query when user has no spaces', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let fromCallCount = 0
    mockFrom.mockImplementation(() => {
      fromCallCount++
      return makeChain({ data: [], error: null })
    })

    const res = await call()
    const body = await res.json()

    expect(body.services).toEqual([])
    // professional_space query only — professional_services not queried
    expect(fromCallCount).toBe(1)
  })
})

// ─── Error handling ───────────────────────────────────────────────────────────

describe('GET /api/users/me/spaces — error handling', () => {
  it('returns empty arrays when spaces query fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    mockFrom.mockImplementation(() =>
      makeChain({ data: null, error: { message: 'db error' } }),
    )

    const res = await call()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ spaces: [], services: [] })
  })
})
