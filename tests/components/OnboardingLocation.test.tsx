import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: vi.fn() }),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockFetch = vi.fn()

const sampleCountries = [
  {
    code: 'AO',
    name: 'Angola',
    flag: '🇦🇴',
    cities: [
      {
        name: 'Luanda',
        tagline: 'Pulso da Costa',
        neighborhoods: [{ name: 'Ingombota' }, { name: 'Talatona' }],
      },
    ],
  },
  {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    cities: [
      {
        name: 'Lisboa',
        tagline: 'Capital da Luz',
        neighborhoods: [{ name: 'Chiado' }],
      },
    ],
  },
]

const sampleSuggestions = [
  {
    country: 'Angola',
    country_code: 'AO',
    flag: '🇦🇴',
    city: 'Luanda',
    tagline: 'Pulso da Costa',
    id: 'AO-Luanda',
  },
  {
    country: 'Portugal',
    country_code: 'PT',
    flag: '🇵🇹',
    city: 'Lisboa',
    tagline: 'Capital da Luz',
    id: 'PT-Lisboa',
  },
]

function wireInitialFetches() {
  // First call: tree
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ countries: sampleCountries }),
  })
  // Second call: empty-query suggestions
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ suggestions: sampleSuggestions }),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers({ shouldAdvanceTime: true })
  global.fetch = mockFetch
})

afterEach(() => {
  vi.useRealTimers()
})

async function renderPage() {
  const mod = await import('@/app/onboarding/location/page')
  const Page = mod.default
  let result!: ReturnType<typeof render>
  await act(async () => {
    result = render(<Page />)
  })
  return result
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Onboarding /location — render', () => {
  it('renders the headline', async () => {
    wireInitialFetches()
    await renderPage()
    expect(screen.getByText(/Onde o teu brilho/)).toBeInTheDocument()
  })

  it('shows the search input', async () => {
    wireInitialFetches()
    await renderPage()
    expect(screen.getByPlaceholderText('Procurar cidade ou bairro...')).toBeInTheDocument()
  })

  it('hits /api/locations twice on mount (tree + suggestions)', async () => {
    wireInitialFetches()
    await renderPage()
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/locations')
      expect(mockFetch).toHaveBeenCalledWith('/api/locations?q=')
    })
  })

  it('renders initial suggestions', async () => {
    wireInitialFetches()
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Luanda, Angola')).toBeInTheDocument()
      expect(screen.getByText('Lisboa, Portugal')).toBeInTheDocument()
    })
  })
})

describe('Onboarding /location — selection', () => {
  it('picking a suggestion reveals the neighborhood chips', async () => {
    wireInitialFetches()
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Luanda, Angola')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Luanda, Angola'))

    // Neighborhood section appears
    expect(screen.getByText(/Bairro \(opcional\)/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ingombota' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Talatona' })).toBeInTheDocument()
  })

  it('Confirmar localização is disabled until a city is picked', async () => {
    wireInitialFetches()
    await renderPage()
    const cta = screen.getByRole('button', { name: /Confirmar localização/i })
    expect(cta).toBeDisabled()

    await waitFor(() => {
      expect(screen.getByText('Luanda, Angola')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Luanda, Angola'))
    expect(cta).toBeEnabled()
  })
})

describe('Onboarding /location — Confirm', () => {
  it('PATCHes /api/profile with the chosen city+country and navigates to /onboarding/start', async () => {
    wireInitialFetches()
    // PATCH response
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })

    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Luanda, Angola')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Luanda, Angola'))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar localização/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/profile',
        expect.objectContaining({ method: 'PATCH' })
      )
    })

    const patchCall = mockFetch.mock.calls.find((c) => c[0] === '/api/profile')!
    const body = JSON.parse(patchCall[1].body)
    expect(body.location).toEqual({
      country: 'Angola',
      country_code: 'AO',
      city: 'Luanda',
    })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/start')
    })
  })

  it('includes the picked neighborhood in the payload', async () => {
    wireInitialFetches()
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })

    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Luanda, Angola')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Luanda, Angola'))
    fireEvent.click(screen.getByRole('button', { name: 'Ingombota' }))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar localização/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/profile', expect.any(Object))
    })

    const patchCall = mockFetch.mock.calls.find((c) => c[0] === '/api/profile')!
    const body = JSON.parse(patchCall[1].body)
    expect(body.location).toEqual({
      country: 'Angola',
      country_code: 'AO',
      city: 'Luanda',
      neighborhood: 'Ingombota',
    })
  })

  it('surfaces server errors', async () => {
    wireInitialFetches()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Falha ao guardar' }),
    })
    await renderPage()
    await waitFor(() => {
      expect(screen.getByText('Lisboa, Portugal')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Lisboa, Portugal'))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar localização/i }))

    expect(await screen.findByText('Falha ao guardar')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })
})

describe('Onboarding /location — Skip', () => {
  it('"Escolher mais tarde" routes to /onboarding/start without saving', async () => {
    wireInitialFetches()
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /Escolher mais tarde/i }))
    expect(mockPush).toHaveBeenCalledWith('/onboarding/start')
    const patchCall = mockFetch.mock.calls.find((c) => c[0] === '/api/profile')
    expect(patchCall).toBeUndefined()
  })

  it('top "Skip" routes to /onboarding/start', async () => {
    wireInitialFetches()
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /^skip$/i }))
    expect(mockPush).toHaveBeenCalledWith('/onboarding/start')
  })
})
