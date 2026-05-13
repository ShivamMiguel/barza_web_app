import { describe, it, expect } from 'vitest'
import { needsOnboarding } from '@/lib/supabase/profile'
import type { UserProfile } from '@/lib/supabase/profile'

const blank: UserProfile = {
  id: 'user-1',
  full_name: 'Beatriz Luanda',
}

describe('needsOnboarding()', () => {
  it('returns true for a null profile (race with the profiles trigger)', () => {
    expect(needsOnboarding(null)).toBe(true)
  })

  it('returns true for undefined', () => {
    expect(needsOnboarding(undefined)).toBe(true)
  })

  it('returns true for a fresh profile with no onboarding data', () => {
    expect(needsOnboarding(blank)).toBe(true)
  })

  it('returns false once a phone is set', () => {
    expect(needsOnboarding({ ...blank, phone: '+244923000000' })).toBe(false)
  })

  it('returns false once interests is a non-empty array', () => {
    expect(needsOnboarding({ ...blank, interests: ['beleza_cabelo'] })).toBe(false)
  })

  it('treats an empty interests array as no data', () => {
    expect(needsOnboarding({ ...blank, interests: [] })).toBe(true)
  })

  it('returns false once a city is set in profile_location', () => {
    expect(
      needsOnboarding({
        ...blank,
        profile_location: { city: 'Luanda', country: 'Angola' },
      })
    ).toBe(false)
  })

  it('treats whitespace-only phone as no phone', () => {
    expect(needsOnboarding({ ...blank, phone: '   ' })).toBe(true)
  })

  it('treats whitespace-only city as no city', () => {
    expect(
      needsOnboarding({
        ...blank,
        profile_location: { city: '   ' },
      })
    ).toBe(true)
  })

  it('ignores unrelated profile_location keys', () => {
    expect(
      needsOnboarding({
        ...blank,
        profile_location: { dial_code: '+244', country_code: 'AO' },
      })
    ).toBe(true)
  })
})
