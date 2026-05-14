import { describe, it, expect, vi, beforeEach } from 'vitest'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockFrom = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ from: mockFrom }),
}))

function makeChain(resolvedValue: unknown) {
  const chain: Record<string, unknown> = {}
  const resolved = Promise.resolve(resolvedValue)
  Object.assign(chain, {
    select: vi.fn().mockReturnValue(chain),
    eq: vi.fn().mockReturnValue(chain),
    in: vi.fn().mockReturnValue(chain),
    order: vi.fn().mockReturnValue(chain),
    single: vi.fn().mockResolvedValue(resolvedValue),
    then: resolved.then.bind(resolved),
    catch: resolved.catch.bind(resolved),
    finally: resolved.finally.bind(resolved),
  })
  return chain
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

// ─── getSpaceById ─────────────────────────────────────────────────────────────

describe('getSpaceById', () => {
  it('returns the space when found', async () => {
    const space = { id: 'sp-1', space_name: 'Fade Studio', owner: 'u-1' }
    mockFrom.mockReturnValue(makeChain({ data: space, error: null }))

    const { getSpaceById } = await import('@/lib/supabase/professional-spaces')
    const result = await getSpaceById('sp-1')

    expect(result).toEqual(space)
  })

  it('returns null when not found', async () => {
    mockFrom.mockReturnValue(makeChain({ data: null, error: { message: 'not found' } }))

    const { getSpaceById } = await import('@/lib/supabase/professional-spaces')
    const result = await getSpaceById('missing')

    expect(result).toBeNull()
  })
})

// ─── getSpacesByOwner ─────────────────────────────────────────────────────────

describe('getSpacesByOwner', () => {
  it('returns spaces belonging to the owner', async () => {
    const spaces = [
      { id: 'sp-1', space_name: 'Studio A', owner: 'u-1' },
      { id: 'sp-2', space_name: 'Studio B', owner: 'u-1' },
    ]
    mockFrom.mockReturnValue(makeChain({ data: spaces, error: null }))

    const { getSpacesByOwner } = await import('@/lib/supabase/professional-spaces')
    const result = await getSpacesByOwner('u-1')

    expect(result).toHaveLength(2)
    expect(result[0].space_name).toBe('Studio A')
  })

  it('returns empty array when owner has no spaces', async () => {
    mockFrom.mockReturnValue(makeChain({ data: [], error: null }))

    const { getSpacesByOwner } = await import('@/lib/supabase/professional-spaces')
    const result = await getSpacesByOwner('u-nobody')

    expect(result).toEqual([])
  })

  it('returns empty array on database error', async () => {
    mockFrom.mockReturnValue(makeChain({ data: null, error: { message: 'db error' } }))

    const { getSpacesByOwner } = await import('@/lib/supabase/professional-spaces')
    const result = await getSpacesByOwner('u-1')

    expect(result).toEqual([])
  })
})

// ─── getServicesBySpaceIds ────────────────────────────────────────────────────

describe('getServicesBySpaceIds', () => {
  it('returns empty array immediately when called with no ids', async () => {
    const { getServicesBySpaceIds } = await import('@/lib/supabase/professional-spaces')
    const result = await getServicesBySpaceIds([])

    expect(result).toEqual([])
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('returns services for the given space ids', async () => {
    const services = [
      { id: 'svc-1', professional_space_id: 'sp-1', service_name: 'Corte', is_active: true },
      { id: 'svc-2', professional_space_id: 'sp-2', service_name: 'Barba', is_active: true },
    ]
    mockFrom.mockReturnValue(makeChain({ data: services, error: null }))

    const { getServicesBySpaceIds } = await import('@/lib/supabase/professional-spaces')
    const result = await getServicesBySpaceIds(['sp-1', 'sp-2'])

    expect(result).toHaveLength(2)
    expect(result.map(s => s.service_name)).toEqual(['Corte', 'Barba'])
  })

  it('returns empty array on database error', async () => {
    mockFrom.mockReturnValue(makeChain({ data: null, error: { message: 'fail' } }))

    const { getServicesBySpaceIds } = await import('@/lib/supabase/professional-spaces')
    const result = await getServicesBySpaceIds(['sp-1'])

    expect(result).toEqual([])
  })
})
