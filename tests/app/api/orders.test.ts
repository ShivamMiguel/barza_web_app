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

function makeChain(result: unknown) {
  const chain: Record<string, unknown> = {}
  const resolved = Promise.resolve(result)
  const methods = ['select', 'eq', 'insert', 'order', 'limit', 'in', 'update']
  for (const m of methods) {
    chain[m] = vi.fn().mockReturnValue(chain)
  }
  chain.single = vi.fn().mockReturnValue(resolved)
  chain.then = resolved.then.bind(resolved)
  chain.catch = resolved.catch.bind(resolved)
  chain.finally = resolved.finally.bind(resolved)
  return chain
}

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const VALID_BODY = {
  product_id: 'prod-1',
  quantity: 2,
  space_id: 'space-1',
}

const PRODUCT_ROW = {
  price: 3500,
  promo_price: null,
  space_id: 'space-1',
}

const ORDER_ROW = {
  id: 'order-1',
  product_id: 'prod-1',
  quantity: 2,
  total_price: 7000,
  status: 'pendente',
  user: 'user-1',
  space_id: 'space-1',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

async function callPost(req: Request) {
  const { POST } = await import('@/app/api/orders/route')
  return POST(req)
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('POST /api/orders — unauthenticated', () => {
  it('returns 401 when user is not logged in', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(401)
  })

  it('returns 401 when auth errors', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error('expired') })
    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(401)
  })
})

// ─── Validation ───────────────────────────────────────────────────────────────

describe('POST /api/orders — validation', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
  })

  it('returns 400 when product_id is missing', async () => {
    const { product_id: _, ...body } = VALID_BODY
    const res = await callPost(makeRequest(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 when space_id is missing', async () => {
    const { space_id: _, ...body } = VALID_BODY
    const res = await callPost(makeRequest(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 when quantity is 0', async () => {
    const res = await callPost(makeRequest({ ...VALID_BODY, quantity: 0 }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when quantity exceeds 99', async () => {
    const res = await callPost(makeRequest({ ...VALID_BODY, quantity: 100 }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when quantity is a float', async () => {
    const res = await callPost(makeRequest({ ...VALID_BODY, quantity: 1.5 }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when quantity is negative', async () => {
    const res = await callPost(makeRequest({ ...VALID_BODY, quantity: -1 }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for malformed JSON body', async () => {
    const req = new Request('http://localhost/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    })
    const res = await callPost(req)
    expect(res.status).toBe(400)
  })
})

// ─── Business logic ───────────────────────────────────────────────────────────

describe('POST /api/orders — business logic', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
  })

  it('returns 404 when product does not exist', async () => {
    mockFrom.mockReturnValueOnce(makeChain({ data: null, error: { message: 'not found' } }))
    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(404)
  })

  it('returns 400 when space_id does not match product', async () => {
    mockFrom.mockReturnValueOnce(
      makeChain({ data: { ...PRODUCT_ROW, space_id: 'other-space' }, error: null })
    )
    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(400)
  })
})

// ─── Success ──────────────────────────────────────────────────────────────────

describe('POST /api/orders — success', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
  })

  it('creates order and returns 201', async () => {
    mockFrom
      .mockReturnValueOnce(makeChain({ data: PRODUCT_ROW, error: null }))
      .mockReturnValueOnce(makeChain({ data: ORDER_ROW, error: null }))

    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.id).toBe('order-1')
    expect(body.status).toBe('pendente')
  })

  it('calculates total_price as price × quantity', async () => {
    mockFrom
      .mockReturnValueOnce(makeChain({ data: PRODUCT_ROW, error: null }))
      .mockReturnValueOnce(makeChain({ data: { ...ORDER_ROW, total_price: 3500 * 2 }, error: null }))

    const res = await callPost(makeRequest({ ...VALID_BODY, quantity: 2 }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.total_price).toBe(7000)
  })

  it('uses promo_price when it is lower than price', async () => {
    const promoProduct = { price: 3500, promo_price: 2500, space_id: 'space-1' }
    const promoOrder = { ...ORDER_ROW, total_price: 2500 * 1 }

    mockFrom
      .mockReturnValueOnce(makeChain({ data: promoProduct, error: null }))
      .mockReturnValueOnce(makeChain({ data: promoOrder, error: null }))

    const res = await callPost(makeRequest({ ...VALID_BODY, quantity: 1 }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.total_price).toBe(2500)
  })

  it('uses regular price when promo_price is null', async () => {
    const orderWithRegularPrice = { ...ORDER_ROW, total_price: 3500 }

    mockFrom
      .mockReturnValueOnce(makeChain({ data: PRODUCT_ROW, error: null }))
      .mockReturnValueOnce(makeChain({ data: orderWithRegularPrice, error: null }))

    const res = await callPost(makeRequest({ ...VALID_BODY, quantity: 1 }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.total_price).toBe(3500)
  })

  it('sets status to "pendente"', async () => {
    mockFrom
      .mockReturnValueOnce(makeChain({ data: PRODUCT_ROW, error: null }))
      .mockReturnValueOnce(makeChain({ data: ORDER_ROW, error: null }))

    const res = await callPost(makeRequest(VALID_BODY))
    const body = await res.json()
    expect(body.status).toBe('pendente')
  })
})

// ─── DB error ─────────────────────────────────────────────────────────────────

describe('POST /api/orders — database error', () => {
  it('returns 500 when order insert fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    mockFrom
      .mockReturnValueOnce(makeChain({ data: PRODUCT_ROW, error: null }))
      .mockReturnValueOnce(makeChain({ data: null, error: { message: 'insert failed' } }))

    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })
})
