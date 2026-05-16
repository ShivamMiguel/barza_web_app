import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockFrom = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ from: mockFrom }),
}))

function makeChain(result: unknown) {
  const chain: Record<string, unknown> = {}
  const resolved = Promise.resolve(result)
  const methods = ['select', 'eq', 'order', 'limit', 'in']
  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain)
  }
  chain.then = resolved.then.bind(resolved)
  chain.catch = resolved.catch.bind(resolved)
  chain.finally = resolved.finally.bind(resolved)
  return chain
}

function makeRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost/api/products')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return new NextRequest(url)
}

const PRODUCT_WITH_SPACE = {
  id: 'prod-1',
  name: 'Pomada Rara',
  description: 'Premium',
  price: 3500,
  promo_price: null,
  image_url: null,
  category: 'Cabelo',
  created_at: '2026-01-01T00:00:00Z',
  space_id: 'space-1',
  professional_space: { id: 'space-1', space_name: 'Studio Afro', logo: null, owner: 'owner-1' },
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

async function callGet(req: NextRequest) {
  const { GET } = await import('@/app/api/products/route')
  return GET(req)
}

// ─── Success ──────────────────────────────────────────────────────────────────

describe('GET /api/products — success', () => {
  it('returns 200 with products array', async () => {
    mockFrom.mockReturnValue(makeChain({ data: [PRODUCT_WITH_SPACE], error: null }))
    const res = await callGet(makeRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body[0].id).toBe('prod-1')
  })

  it('returns empty array when no products', async () => {
    mockFrom.mockReturnValue(makeChain({ data: [], error: null }))
    const res = await callGet(makeRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([])
  })

  it('applies limit query param', async () => {
    const chain = makeChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)
    await callGet(makeRequest({ limit: '5' }))
    expect(chain.limit).toHaveBeenCalledWith(5)
  })

  it('caps limit at 50', async () => {
    const chain = makeChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)
    await callGet(makeRequest({ limit: '200' }))
    expect(chain.limit).toHaveBeenCalledWith(50)
  })

  it('defaults limit to 20 when not provided', async () => {
    const chain = makeChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)
    await callGet(makeRequest())
    expect(chain.limit).toHaveBeenCalledWith(20)
  })

  it('filters by space_id when provided', async () => {
    const chain = makeChain({ data: [PRODUCT_WITH_SPACE], error: null })
    mockFrom.mockReturnValue(chain)
    await callGet(makeRequest({ space_id: 'space-1' }))
    expect(chain.eq).toHaveBeenCalledWith('space_id', 'space-1')
  })

  it('does not apply eq filter without space_id', async () => {
    const chain = makeChain({ data: [], error: null })
    mockFrom.mockReturnValue(chain)
    await callGet(makeRequest())
    expect(chain.eq).not.toHaveBeenCalled()
  })
})

// ─── DB error ─────────────────────────────────────────────────────────────────

describe('GET /api/products — database error', () => {
  it('returns 500 on query failure', async () => {
    mockFrom.mockReturnValue(makeChain({ data: null, error: { message: 'connection error' } }))
    const res = await callGet(makeRequest())
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })
})
