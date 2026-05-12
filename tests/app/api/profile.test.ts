import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PATCH, GET } from '@/app/api/profile/route'
import { NextRequest } from 'next/server'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockGetLoggedUserProfile = vi.fn()
const mockUpdateProfile = vi.fn()

vi.mock('@/lib/supabase/profile', () => ({
  getLoggedUserProfile: () => mockGetLoggedUserProfile(),
  updateProfile: (data: Record<string, unknown>) => mockUpdateProfile(data),
}))

const baseProfile = {
  id: 'user-123',
  full_name: 'Beatriz Luanda',
  phone: '+244923000000',
  avatar_url: 'https://example.com/me.jpg',
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── PATCH ────────────────────────────────────────────────────────────────────

describe('PATCH /api/profile — phone', () => {
  beforeEach(() => {
    mockUpdateProfile.mockResolvedValue({ success: true })
    mockGetLoggedUserProfile.mockResolvedValue(baseProfile)
  })

  it('accepts a phone string and forwards it (trimmed)', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ phone: '  +244 923 000 000  ' }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(200)
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ phone: '+244 923 000 000' })
    )
  })

  it('rejects non-string phone with 400', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ phone: 244923000000 }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(400)
    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })

  it('allows phone to be omitted entirely', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ avatar_url: 'https://example.com/a.jpg' }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(200)
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ phone: undefined })
    )
  })
})

describe('PATCH /api/profile — interests', () => {
  beforeEach(() => {
    mockUpdateProfile.mockResolvedValue({ success: true })
    mockGetLoggedUserProfile.mockResolvedValue(baseProfile)
  })

  it('accepts an array of interest strings', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ interests: ['beleza_cabelo', 'unhas_estetica'] }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(200)
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ interests: ['beleza_cabelo', 'unhas_estetica'] })
    )
  })

  it('trims and drops empty strings', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ interests: ['  beleza_cabelo  ', '', '   ', 'face'] }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(200)
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ interests: ['beleza_cabelo', 'face'] })
    )
  })

  it('rejects when interests is not an array (400)', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ interests: 'beleza_cabelo' }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(400)
    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })

  it('rejects when an item is not a string (400)', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ interests: ['beleza_cabelo', 42] }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(400)
    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })

  it('accepts an empty array (clear interests)', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ interests: [] }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(200)
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ interests: [] })
    )
  })
})

describe('PATCH /api/profile — location', () => {
  beforeEach(() => {
    mockUpdateProfile.mockResolvedValue({ success: true })
    mockGetLoggedUserProfile.mockResolvedValue(baseProfile)
  })

  it('accepts a full location object', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({
        location: {
          country: 'Angola',
          country_code: 'AO',
          city: 'Luanda',
          neighborhood: 'Ingombota',
          dial_code: '+244',
        },
      }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(200)
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        location: {
          country: 'Angola',
          country_code: 'AO',
          city: 'Luanda',
          neighborhood: 'Ingombota',
          dial_code: '+244',
        },
      })
    )
  })

  it('trims string fields and drops empty ones', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({
        location: { country: '  Portugal  ', city: '   ', neighborhood: 'Chiado' },
      }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(200)
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        location: { country: 'Portugal', neighborhood: 'Chiado' },
      })
    )
  })

  it('rejects non-object location (400)', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ location: 'Lisboa' }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(400)
    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })

  it('rejects array location (400)', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ location: ['AO', 'PT'] }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(400)
    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })

  it('rejects non-string field inside location (400)', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ location: { city: 42 } }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(400)
    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })

  it('silently drops unknown keys', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({
        location: { city: 'Luanda', injected: 'hacker' },
      }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(200)
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ location: { city: 'Luanda' } })
    )
  })
})

describe('PATCH /api/profile — full_name validation (regression)', () => {
  it('rejects empty full_name string with 400', async () => {
    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ full_name: '   ' }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(400)
    expect(mockUpdateProfile).not.toHaveBeenCalled()
  })
})

describe('PATCH /api/profile — response', () => {
  it('returns the refreshed profile on success', async () => {
    mockUpdateProfile.mockResolvedValue({ success: true })
    mockGetLoggedUserProfile.mockResolvedValue(baseProfile)

    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ phone: '+244923111111' }),
    })

    const res = await PATCH(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.profile).toEqual(baseProfile)
  })

  it('returns 500 if updateProfile reports failure', async () => {
    mockUpdateProfile.mockResolvedValue({ success: false, error: 'db down' })

    const req = new NextRequest('http://localhost/api/profile', {
      method: 'PATCH',
      body: JSON.stringify({ phone: '+244923000000' }),
    })

    const res = await PATCH(req)
    expect(res.status).toBe(500)
  })
})

// ─── GET ──────────────────────────────────────────────────────────────────────

describe('GET /api/profile', () => {
  it('returns the logged user profile', async () => {
    mockGetLoggedUserProfile.mockResolvedValue(baseProfile)

    const res = await GET()
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json).toEqual(baseProfile)
  })

  it('returns 404 if no profile is found', async () => {
    mockGetLoggedUserProfile.mockResolvedValue(null)

    const res = await GET()
    expect(res.status).toBe(404)
  })
})
