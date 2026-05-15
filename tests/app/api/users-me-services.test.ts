import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockGetUser = vi.fn()
const mockFrom = vi.fn()
const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
    storage: {
      from: () => ({ upload: mockUpload, getPublicUrl: mockGetPublicUrl }),
    },
  }),
}))

function makeChain(result: unknown) {
  const chain: Record<string, unknown> = {}
  const resolved = Promise.resolve(result)
  Object.assign(chain, {
    select: vi.fn().mockReturnValue(chain),
    eq:     vi.fn().mockReturnValue(chain),
    in:     vi.fn().mockReturnValue(chain),
    order:  vi.fn().mockReturnValue(chain),
    insert: vi.fn().mockReturnValue(chain),
    single: vi.fn().mockReturnValue(resolved),
    then:   resolved.then.bind(resolved),
    catch:  resolved.catch.bind(resolved),
    finally: resolved.finally.bind(resolved),
  })
  return chain
}

const SPACE = { id: 'space-1', owner: 'user-1' }
const SERVICE = {
  id: 'svc-1',
  professional_space_id: 'space-1',
  service_name: 'Corte Premium',
  price: 3000,
  category: 'Corte Clássico',
  is_active: true,
  duration_minutes: 30,
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
  mockUpload.mockResolvedValue({ error: null })
  mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/img.jpg' } })
})

// ─── GET /api/users/me/services ───────────────────────────────────────────────

async function callGet(): Promise<Response> {
  const { GET } = await import('@/app/api/users/me/services/route')
  return GET()
}

describe('GET /api/users/me/services — unauthenticated', () => {
  it('returns empty services when no session', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const res = await callGet()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ services: [] })
    expect(mockFrom).not.toHaveBeenCalled()
  })
})

describe('GET /api/users/me/services — no spaces', () => {
  it('returns empty services when user owns no spaces', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockFrom.mockReturnValue(makeChain({ data: [], error: null }))

    const res = await callGet()
    const body = await res.json()

    expect(body).toEqual({ services: [] })
    // Only spaces query runs — services query skipped
    expect(mockFrom).toHaveBeenCalledTimes(1)
  })
})

describe('GET /api/users/me/services — with spaces', () => {
  it('returns all services (active and inactive) for user spaces', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const inactiveService = { ...SERVICE, id: 'svc-2', is_active: false }
    let call = 0
    mockFrom.mockImplementation(() => {
      call++
      if (call === 1) return makeChain({ data: [SPACE], error: null })
      return makeChain({ data: [SERVICE, inactiveService], error: null })
    })

    const res = await callGet()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.services).toHaveLength(2)
    expect(body.services[0].service_name).toBe('Corte Premium')
    expect(body.services[1].is_active).toBe(false)
  })

  it('queries services using all user space IDs', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const spaces = [{ id: 'space-1' }, { id: 'space-2' }]
    let inSpy: ReturnType<typeof vi.fn> | null = null
    let call = 0
    mockFrom.mockImplementation(() => {
      call++
      const chain = makeChain({ data: call === 1 ? spaces : [], error: null })
      if (call === 2) inSpy = chain.in as ReturnType<typeof vi.fn>
      return chain
    })

    await callGet()
    expect(inSpy).toHaveBeenCalledWith('professional_space_id', ['space-1', 'space-2'])
  })

  it('returns empty services on db error', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let call = 0
    mockFrom.mockImplementation(() => {
      call++
      if (call === 1) return makeChain({ data: [SPACE], error: null })
      return makeChain({ data: null, error: { message: 'db error' } })
    })

    const res = await callGet()
    const body = await res.json()

    expect(body).toEqual({ services: [] })
  })
})

// ─── POST /api/users/me/services ─────────────────────────────────────────────

function makePostRequest(fields: Record<string, string>, image?: File) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.append(k, v)
  if (image) fd.append('image', image)
  return new Request('http://localhost/api/users/me/services', { method: 'POST', body: fd })
}

const VALID_FIELDS = {
  professional_space_id: 'space-1',
  service_name: 'Corte Premium',
  category: 'Corte Clássico',
  price: '3000',
  duration_minutes: '30',
}

async function callPost(req: Request): Promise<Response> {
  const { POST } = await import('@/app/api/users/me/services/route')
  return POST(req)
}

describe('POST /api/users/me/services — authentication', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const res = await callPost(makePostRequest(VALID_FIELDS))
    expect(res.status).toBe(401)
  })
})

describe('POST /api/users/me/services — validation', () => {
  it('returns 400 when required fields are missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const res = await callPost(makePostRequest({ service_name: 'Corte' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})

describe('POST /api/users/me/services — authorization', () => {
  it('returns 403 when user does not own the space', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    // Ownership check returns null (space not found for this owner)
    mockFrom.mockReturnValue(makeChain({ data: null, error: null }))

    const res = await callPost(makePostRequest(VALID_FIELDS))
    expect(res.status).toBe(403)
  })
})

describe('POST /api/users/me/services — success', () => {
  it('creates service and returns 201 with service data', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let call = 0
    mockFrom.mockImplementation(() => {
      call++
      if (call === 1) return makeChain({ data: SPACE, error: null })      // ownership
      return makeChain({ data: SERVICE, error: null })                     // insert
    })

    const res = await callPost(makePostRequest(VALID_FIELDS))
    const body = await res.json()

    expect(res.status).toBe(201)
    expect(body.service.service_name).toBe('Corte Premium')
  })

  it('returns 400 when db insert fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let call = 0
    mockFrom.mockImplementation(() => {
      call++
      if (call === 1) return makeChain({ data: SPACE, error: null })
      return makeChain({ data: null, error: { message: 'insert failed' } })
    })

    const res = await callPost(makePostRequest(VALID_FIELDS))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('insert failed')
  })

  it('includes optional fields in the insert payload', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let call = 0
    let insertSpy: ReturnType<typeof vi.fn> | null = null
    mockFrom.mockImplementation(() => {
      call++
      const chain = makeChain({ data: SERVICE, error: null })
      if (call === 2) insertSpy = chain.insert as ReturnType<typeof vi.fn>
      return chain
    })

    const fields = {
      ...VALID_FIELDS,
      description: 'Corte clássico com acabamento',
      preco_promocional: '2500',
      extra_fee: '200',
    }
    await callPost(makePostRequest(fields))

    expect(insertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Corte clássico com acabamento',
        preco_promocional: 2500,
        extra_fee: 200,
      }),
    )
  })
})
