import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/locations/route'
import { NextRequest } from 'next/server'

function req(url: string) {
  return new NextRequest(url)
}

describe('GET /api/locations — full tree', () => {
  it('returns a list of countries', async () => {
    const res = await GET(req('http://localhost/api/locations'))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(json.countries)).toBe(true)
    expect(json.countries.length).toBeGreaterThan(0)
  })

  it('each country has code, name, flag, cities[]', async () => {
    const res = await GET(req('http://localhost/api/locations'))
    const { countries } = await res.json()
    for (const c of countries) {
      expect(typeof c.code).toBe('string')
      expect(typeof c.name).toBe('string')
      expect(typeof c.flag).toBe('string')
      expect(Array.isArray(c.cities)).toBe(true)
    }
  })

  it('includes Angola (AO) with Luanda', async () => {
    const res = await GET(req('http://localhost/api/locations'))
    const { countries } = await res.json()
    const ao = countries.find((c: { code: string }) => c.code === 'AO')
    expect(ao).toBeDefined()
    expect(ao.cities.some((c: { name: string }) => c.name === 'Luanda')).toBe(true)
  })
})

describe('GET /api/locations — suggestions', () => {
  it('returns a flat suggestion list when ?q is present', async () => {
    const res = await GET(req('http://localhost/api/locations?q='))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(Array.isArray(json.suggestions)).toBe(true)
    expect(json.suggestions.length).toBeGreaterThan(0)
    const first = json.suggestions[0]
    expect(first).toHaveProperty('city')
    expect(first).toHaveProperty('country')
    expect(first).toHaveProperty('country_code')
    expect(first).toHaveProperty('flag')
    expect(first).toHaveProperty('id')
  })

  it('filters by city name (case-insensitive)', async () => {
    const res = await GET(req('http://localhost/api/locations?q=lisb'))
    const { suggestions } = await res.json()
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.every((s: { city: string }) => s.city.toLowerCase().includes('lisb'))).toBe(true)
  })

  it('filters by country name', async () => {
    const res = await GET(req('http://localhost/api/locations?q=angola'))
    const { suggestions } = await res.json()
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions.every((s: { country_code: string }) => s.country_code === 'AO')).toBe(true)
  })

  it('returns an empty list for unmatched queries', async () => {
    const res = await GET(req('http://localhost/api/locations?q=zzznoplaceyyy'))
    const { suggestions } = await res.json()
    expect(suggestions).toEqual([])
  })
})

describe('GET /api/locations — by country', () => {
  it('returns the country node for ?country=PT', async () => {
    const res = await GET(req('http://localhost/api/locations?country=PT'))
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.code).toBe('PT')
    expect(json.name).toBe('Portugal')
    expect(json.cities.some((c: { name: string }) => c.name === 'Lisboa')).toBe(true)
  })

  it('is case-insensitive on the country code', async () => {
    const res = await GET(req('http://localhost/api/locations?country=ao'))
    const json = await res.json()
    expect(json.code).toBe('AO')
  })

  it('returns 404 for unknown country', async () => {
    const res = await GET(req('http://localhost/api/locations?country=ZZ'))
    expect(res.status).toBe(404)
  })
})
