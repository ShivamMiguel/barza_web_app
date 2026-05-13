import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockExchange = vi.fn()
const mockGetLoggedUserProfile = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: {
      exchangeCodeForSession: mockExchange,
    },
  }),
}))

vi.mock('@/lib/supabase/profile', async () => {
  const actual = await vi.importActual<typeof import('@/lib/supabase/profile')>(
    '@/lib/supabase/profile'
  )
  return {
    ...actual,
    getLoggedUserProfile: () => mockGetLoggedUserProfile(),
  }
})

// Lazy import so the mocks are wired first
async function callbackGet(url: string) {
  const { GET } = await import('@/app/auth/callback/route')
  return GET(new Request(url))
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('GET /auth/callback — preconditions', () => {
  it('redirects to /?auth=error when no code is present', async () => {
    const res = await callbackGet('http://localhost:3000/auth/callback')
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost:3000/?auth=error')
    expect(mockExchange).not.toHaveBeenCalled()
  })

  it('redirects to /?auth=error when code exchange fails', async () => {
    mockExchange.mockResolvedValue({ error: new Error('bad code') })
    const res = await callbackGet('http://localhost:3000/auth/callback?code=abc')
    expect(res.headers.get('location')).toBe('http://localhost:3000/?auth=error')
    expect(mockGetLoggedUserProfile).not.toHaveBeenCalled()
  })
})

describe('GET /auth/callback — first-time OAuth users (need onboarding)', () => {
  beforeEach(() => {
    mockExchange.mockResolvedValue({ error: null })
  })

  it('redirects to /onboarding when the profile row is missing', async () => {
    mockGetLoggedUserProfile.mockResolvedValue(null)

    const res = await callbackGet('http://localhost:3000/auth/callback?code=abc')
    expect(res.headers.get('location')).toBe('http://localhost:3000/onboarding')
  })

  it('redirects to /onboarding when the profile has no onboarding data', async () => {
    mockGetLoggedUserProfile.mockResolvedValue({
      id: 'user-1',
      full_name: 'New User',
    })

    const res = await callbackGet('http://localhost:3000/auth/callback?code=abc')
    expect(res.headers.get('location')).toBe('http://localhost:3000/onboarding')
  })

  it('still redirects to /onboarding even if ?next=/community is provided', async () => {
    mockGetLoggedUserProfile.mockResolvedValue({ id: 'u', full_name: 'x' })

    const res = await callbackGet(
      'http://localhost:3000/auth/callback?code=abc&next=/community'
    )
    expect(res.headers.get('location')).toBe('http://localhost:3000/onboarding')
  })
})

describe('GET /auth/callback — returning users (onboarding complete)', () => {
  beforeEach(() => {
    mockExchange.mockResolvedValue({ error: null })
  })

  it('redirects to /community by default', async () => {
    mockGetLoggedUserProfile.mockResolvedValue({
      id: 'user-1',
      full_name: 'Beatriz Luanda',
      phone: '+244923000000',
    })

    const res = await callbackGet('http://localhost:3000/auth/callback?code=abc')
    expect(res.headers.get('location')).toBe('http://localhost:3000/community')
  })

  it('honors a custom internal ?next path', async () => {
    mockGetLoggedUserProfile.mockResolvedValue({
      id: 'user-1',
      full_name: 'Beatriz Luanda',
      interests: ['beleza_cabelo'],
    })

    const res = await callbackGet(
      'http://localhost:3000/auth/callback?code=abc&next=/community/profile'
    )
    expect(res.headers.get('location')).toBe(
      'http://localhost:3000/community/profile'
    )
  })

  it('falls back to /community when ?next is an external URL', async () => {
    mockGetLoggedUserProfile.mockResolvedValue({
      id: 'user-1',
      full_name: 'x',
      phone: '+244923000000',
    })

    const res = await callbackGet(
      'http://localhost:3000/auth/callback?code=abc&next=https://evil.example.com'
    )
    expect(res.headers.get('location')).toBe('http://localhost:3000/community')
  })

  it('falls back to /community when ?next is protocol-relative', async () => {
    mockGetLoggedUserProfile.mockResolvedValue({
      id: 'user-1',
      full_name: 'x',
      phone: '+244923000000',
    })

    const res = await callbackGet(
      'http://localhost:3000/auth/callback?code=abc&next=//evil.example.com'
    )
    expect(res.headers.get('location')).toBe('http://localhost:3000/community')
  })
})

describe('GET /auth/callback — explicit onboarding continuation', () => {
  beforeEach(() => {
    mockExchange.mockResolvedValue({ error: null })
  })

  it('honors ?next=/onboarding/intent without invoking the profile check', async () => {
    const res = await callbackGet(
      'http://localhost:3000/auth/callback?code=abc&next=/onboarding/intent'
    )
    expect(res.headers.get('location')).toBe(
      'http://localhost:3000/onboarding/intent'
    )
    expect(mockGetLoggedUserProfile).not.toHaveBeenCalled()
  })

  it('honors ?next=/onboarding even for completed profiles', async () => {
    // Even though the user has data, an explicit /onboarding next wins.
    const res = await callbackGet(
      'http://localhost:3000/auth/callback?code=abc&next=/onboarding'
    )
    expect(res.headers.get('location')).toBe('http://localhost:3000/onboarding')
    expect(mockGetLoggedUserProfile).not.toHaveBeenCalled()
  })
})
