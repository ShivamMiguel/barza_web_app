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
  Object.assign(chain, {
    select: vi.fn().mockReturnValue(chain),
    eq:     vi.fn().mockReturnValue(chain),
    insert: vi.fn().mockReturnValue(chain),
    single: vi.fn().mockReturnValue(resolved),
    then:   resolved.then.bind(resolved),
    catch:  resolved.catch.bind(resolved),
    finally: resolved.finally.bind(resolved),
  })
  return chain
}

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const VALID_BODY = {
  service_id: 'svc-1',
  professional_space_id: 'space-1',
  booking_date: '2026-07-15',
  booking_time: '10:00',
  total_price: 5000,
}

const BOOKING = {
  id: 'booking-1',
  client_id: 'user-1',
  service_id: 'svc-1',
  professional_space_id: 'space-1',
  booking_date: '2026-07-15',
  booking_time: '10:00',
  status: 'pending',
  total_price: 5000,
  home: false,
  description: null,
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

async function callPost(req: Request) {
  const { POST } = await import('@/app/api/bookings/route')
  return POST(req)
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('POST /api/bookings — unauthenticated', () => {
  it('returns 401 when user is not logged in', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it('returns 401 when auth returns error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error('session expired') })
    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(401)
  })
})

// ─── Validation ───────────────────────────────────────────────────────────────

describe('POST /api/bookings — validation', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
  })

  it('returns 400 when service_id is missing', async () => {
    const { service_id: _, ...body } = VALID_BODY
    const res = await callPost(makeRequest(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 when professional_space_id is missing', async () => {
    const { professional_space_id: _, ...body } = VALID_BODY
    const res = await callPost(makeRequest(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 when booking_date is missing', async () => {
    const { booking_date: _, ...body } = VALID_BODY
    const res = await callPost(makeRequest(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 when booking_time is missing', async () => {
    const { booking_time: _, ...body } = VALID_BODY
    const res = await callPost(makeRequest(body))
    expect(res.status).toBe(400)
  })
})

// ─── Success ──────────────────────────────────────────────────────────────────

describe('POST /api/bookings — success', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
  })

  it('creates booking and returns 201', async () => {
    mockFrom.mockReturnValue(makeChain({ data: BOOKING, error: null }))
    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.id).toBe('booking-1')
    expect(body.status).toBe('pending')
  })

  it('sets status to pending regardless of input', async () => {
    mockFrom.mockReturnValue(makeChain({ data: BOOKING, error: null }))
    const res = await callPost(makeRequest({ ...VALID_BODY, status: 'confirmed' }))
    expect(res.status).toBe(201)
    expect(mockFrom).toHaveBeenCalledWith('bookings')
  })

  it('defaults home to false when not provided', async () => {
    mockFrom.mockReturnValue(makeChain({ data: { ...BOOKING, home: false }, error: null }))
    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(201)
  })

  it('includes home=true when provided', async () => {
    mockFrom.mockReturnValue(makeChain({ data: { ...BOOKING, home: true }, error: null }))
    const res = await callPost(makeRequest({ ...VALID_BODY, home: true }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.home).toBe(true)
  })

  it('includes description when provided', async () => {
    const withDesc = { ...BOOKING, description: 'Trança nagô, referência enviada' }
    mockFrom.mockReturnValue(makeChain({ data: withDesc, error: null }))
    const res = await callPost(makeRequest({ ...VALID_BODY, description: 'Trança nagô, referência enviada' }))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.description).toBe('Trança nagô, referência enviada')
  })
})

// ─── DB error ─────────────────────────────────────────────────────────────────

describe('POST /api/bookings — database error', () => {
  it('returns 500 when insert fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    mockFrom.mockReturnValue(makeChain({ data: null, error: { message: 'insert failed' } }))
    const res = await callPost(makeRequest(VALID_BODY))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })
})
