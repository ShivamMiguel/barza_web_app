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
    update: vi.fn().mockReturnValue(chain),
    delete: vi.fn().mockReturnValue(chain),
    single: vi.fn().mockReturnValue(resolved),
    then:   resolved.then.bind(resolved),
    catch:  resolved.catch.bind(resolved),
    finally: resolved.finally.bind(resolved),
  })
  return chain
}

const OWNED_EXISTING = {
  id: 'svc-1',
  professional_space: { owner: 'user-1' },
}

const UPDATED_SERVICE = {
  id: 'svc-1',
  professional_space_id: 'space-1',
  service_name: 'Corte Atualizado',
  price: 3500,
  category: 'Corte Clássico',
  is_active: true,
  duration_minutes: 45,
}

function makeRequest(method: string, fields: Record<string, string> = {}, image?: File) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.append(k, v)
  if (image) fd.append('image', image)
  return new Request('http://localhost/api/users/me/services/svc-1', { method, body: fd })
}

const PARAMS = { params: Promise.resolve({ id: 'svc-1' }) }

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
  mockUpload.mockResolvedValue({ error: null })
  mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/img.jpg' } })
})

// ─── PATCH /api/users/me/services/[id] ───────────────────────────────────────

async function callPatch(req: Request): Promise<Response> {
  const { PATCH } = await import('@/app/api/users/me/services/[id]/route')
  return PATCH(req, PARAMS)
}

describe('PATCH /api/users/me/services/[id] — authentication', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const res = await callPatch(makeRequest('PATCH', { service_name: 'Novo Nome' }))
    expect(res.status).toBe(401)
  })
})

describe('PATCH /api/users/me/services/[id] — authorization', () => {
  it('returns 403 when user does not own the service', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-99' } } })
    // ownership check returns service owned by 'user-1', not 'user-99'
    mockFrom.mockReturnValue(
      makeChain({ data: OWNED_EXISTING, error: null }),
    )

    const res = await callPatch(makeRequest('PATCH', { service_name: 'Hack' }))
    expect(res.status).toBe(403)
  })

  it('returns 403 when service does not exist', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockFrom.mockReturnValue(makeChain({ data: null, error: null }))

    const res = await callPatch(makeRequest('PATCH', { service_name: 'Novo' }))
    expect(res.status).toBe(403)
  })
})

describe('PATCH /api/users/me/services/[id] — success', () => {
  it('updates service and returns 200 with updated data', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let call = 0
    mockFrom.mockImplementation(() => {
      call++
      if (call === 1) return makeChain({ data: OWNED_EXISTING, error: null })
      return makeChain({ data: UPDATED_SERVICE, error: null })
    })

    const res = await callPatch(makeRequest('PATCH', { service_name: 'Corte Atualizado', price: '3500' }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.service.service_name).toBe('Corte Atualizado')
  })

  it('returns 400 when db update fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let call = 0
    mockFrom.mockImplementation(() => {
      call++
      if (call === 1) return makeChain({ data: OWNED_EXISTING, error: null })
      return makeChain({ data: null, error: { message: 'update failed' } })
    })

    const res = await callPatch(makeRequest('PATCH', { service_name: 'Novo' }))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('update failed')
  })
})

// ─── DELETE /api/users/me/services/[id] ──────────────────────────────────────

async function callDelete(): Promise<Response> {
  const { DELETE } = await import('@/app/api/users/me/services/[id]/route')
  return DELETE(new Request('http://localhost/api/users/me/services/svc-1', { method: 'DELETE' }), PARAMS)
}

describe('DELETE /api/users/me/services/[id] — authentication', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const res = await callDelete()
    expect(res.status).toBe(401)
  })
})

describe('DELETE /api/users/me/services/[id] — authorization', () => {
  it('returns 403 when user does not own the service', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-99' } } })
    mockFrom.mockReturnValue(makeChain({ data: OWNED_EXISTING, error: null }))

    const res = await callDelete()
    expect(res.status).toBe(403)
  })

  it('returns 403 when service not found', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockFrom.mockReturnValue(makeChain({ data: null, error: null }))

    const res = await callDelete()
    expect(res.status).toBe(403)
  })
})

describe('DELETE /api/users/me/services/[id] — success', () => {
  it('deletes service and returns { ok: true }', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let call = 0
    mockFrom.mockImplementation(() => {
      call++
      if (call === 1) return makeChain({ data: OWNED_EXISTING, error: null })
      return makeChain({ data: null, error: null })
    })

    const res = await callDelete()
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ ok: true })
  })

  it('calls delete on the correct table', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const tableNames: string[] = []
    let call = 0
    mockFrom.mockImplementation((table: string) => {
      tableNames.push(table)
      call++
      if (call === 1) return makeChain({ data: OWNED_EXISTING, error: null })
      return makeChain({ data: null, error: null })
    })

    await callDelete()
    expect(tableNames).toContain('professional_services')
  })

  it('returns 400 when db delete fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    let call = 0
    mockFrom.mockImplementation(() => {
      call++
      if (call === 1) return makeChain({ data: OWNED_EXISTING, error: null })
      return makeChain({ data: null, error: { message: 'delete failed' } })
    })

    const res = await callDelete()
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('delete failed')
  })
})
