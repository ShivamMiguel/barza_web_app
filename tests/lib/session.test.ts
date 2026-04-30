import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ─── Mock @supabase/ssr ────────────────────────────────────────────────────────
const mockGetUser = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}))

// Import AFTER mock setup
const { updateSession } = await import('@/lib/supabase/session')

function makeRequest(pathname: string) {
  return new NextRequest(`https://barza.app${pathname}`)
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('updateSession() — unauthenticated user', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
  })

  it('redirects /community to / with ?auth=login', async () => {
    const req = makeRequest('/community')
    const res = await updateSession(req)
    expect(res.status).toBe(307)
    const location = res.headers.get('location')
    expect(location).toContain('/?auth=login')
  })

  it('redirects /profile/amara to / with ?auth=login', async () => {
    const req = makeRequest('/profile/amara')
    const res = await updateSession(req)
    expect(res.status).toBe(307)
    const location = res.headers.get('location')
    expect(location).toContain('/?auth=login')
  })

  it('does NOT redirect public route /pro/carlos-fade', async () => {
    const req = makeRequest('/pro/carlos-fade')
    const res = await updateSession(req)
    expect(res.status).not.toBe(307)
  })

  it('does NOT redirect landing page /', async () => {
    const req = makeRequest('/')
    const res = await updateSession(req)
    expect(res.status).not.toBe(307)
  })

  it('does NOT redirect /barza-insights', async () => {
    const req = makeRequest('/barza-insights')
    const res = await updateSession(req)
    expect(res.status).not.toBe(307)
  })
})

describe('updateSession() — authenticated user', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'test@barza.app' } },
    })
  })

  it('allows /community through', async () => {
    const req = makeRequest('/community')
    const res = await updateSession(req)
    expect(res.status).not.toBe(307)
  })

  it('allows /profile/[username] through', async () => {
    const req = makeRequest('/profile/amara-vance')
    const res = await updateSession(req)
    expect(res.status).not.toBe(307)
  })

  it('allows / through', async () => {
    const req = makeRequest('/')
    const res = await updateSession(req)
    expect(res.status).not.toBe(307)
  })
})
