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

// Nominatim-format results
const nominatimLuanda = {
  display_name: 'Luanda, Município de Luanda, Luanda Province, Angola',
  lat: '-8.8368200',
  lon: '13.2343000',
  address: {
    city: 'Luanda',
    country: 'Angola',
    neighbourhood: 'Ingombota',
    road: 'Rua da Missão',
  },
}

const nominatimLisboa = {
  display_name: 'Lisboa, Área Metropolitana de Lisboa, Portugal',
  lat: '38.7166700',
  lon: '-9.1333300',
  address: {
    city: 'Lisboa',
    country: 'Portugal',
    neighbourhood: 'Chiado',
    road: 'Rua do Carmo',
  },
}

function wireNominatimSearch(results = [nominatimLuanda]) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => results,
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

async function typeAndSearch(query: string) {
  const input = screen.getByLabelText('Pesquisar localização')
  await act(async () => {
    fireEvent.change(input, { target: { value: query } })
  })
  await act(async () => {
    vi.advanceTimersByTime(400)
  })
  // Flush fetch microtasks
  await act(async () => {
    await Promise.resolve()
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Onboarding /location — render', () => {
  it('renders the headline', async () => {
    await renderPage()
    expect(screen.getByText(/Onde o teu brilho/)).toBeInTheDocument()
  })

  it('shows the search input', async () => {
    await renderPage()
    expect(screen.getByPlaceholderText('Pesquisar cidade, bairro ou endereço...')).toBeInTheDocument()
  })

  it('shows the detect location button', async () => {
    await renderPage()
    expect(screen.getByTitle('Detectar localização actual')).toBeInTheDocument()
  })

  it('makes no network calls on mount', async () => {
    await renderPage()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('renders Nominatim suggestions after typing', async () => {
    wireNominatimSearch([nominatimLuanda])
    await renderPage()
    await typeAndSearch('Luanda')

    await waitFor(() => {
      // The suggestion renders city + country as "Luanda, Angola"
      expect(screen.getByText('Luanda, Angola')).toBeInTheDocument()
    })
  })
})

describe('Onboarding /location — selection', () => {
  it('Confirmar localização is disabled before picking a location', async () => {
    await renderPage()
    expect(screen.getByRole('button', { name: /Confirmar localização/i })).toBeDisabled()
  })

  it('Confirmar localização becomes enabled after picking a suggestion', async () => {
    wireNominatimSearch([nominatimLuanda])
    await renderPage()
    await typeAndSearch('Luanda')

    await waitFor(() => expect(screen.getByText('Luanda, Angola')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Luanda, Angola'))

    expect(screen.getByRole('button', { name: /Confirmar localização/i })).toBeEnabled()
  })

  it('shows selected pill with city and country after picking a suggestion', async () => {
    wireNominatimSearch([nominatimLuanda])
    await renderPage()
    await typeAndSearch('Luanda')

    await waitFor(() => expect(screen.getByText('Luanda, Angola')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Luanda, Angola'))

    // After picking, suggestions hide and pill with city+country appears
    expect(screen.getByText('Luanda, Angola')).toBeInTheDocument()
    expect(screen.getByLabelText('Limpar')).toBeInTheDocument()
  })

  it('clears the selection when the X button is clicked', async () => {
    wireNominatimSearch([nominatimLuanda])
    await renderPage()
    await typeAndSearch('Luanda')

    await waitFor(() => expect(screen.getByText('Luanda, Angola')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Luanda, Angola'))

    expect(screen.getByRole('button', { name: /Confirmar localização/i })).toBeEnabled()
    fireEvent.click(screen.getByLabelText('Limpar'))
    expect(screen.getByRole('button', { name: /Confirmar localização/i })).toBeDisabled()
  })
})

describe('Onboarding /location — Confirm', () => {
  it('PATCHes /api/profile with full Nominatim location data and navigates', async () => {
    wireNominatimSearch([nominatimLuanda])
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })

    await renderPage()
    await typeAndSearch('Luanda')

    await waitFor(() => expect(screen.getByText('Luanda, Angola')).toBeInTheDocument())
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
    expect(body.location).toMatchObject({
      city: 'Luanda',
      country: 'Angola',
      address: nominatimLuanda.display_name,
      latitude: parseFloat(nominatimLuanda.lat),
      longitude: parseFloat(nominatimLuanda.lon),
      neighborhood: 'Ingombota',
      street: 'Rua da Missão',
    })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/start')
    })
  })

  it('surfaces server errors without navigating', async () => {
    wireNominatimSearch([nominatimLisboa])
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Falha ao guardar' }),
    })

    await renderPage()
    await typeAndSearch('Lisboa')

    await waitFor(() => expect(screen.getByText('Lisboa, Portugal')).toBeInTheDocument())
    fireEvent.click(screen.getByText('Lisboa, Portugal'))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar localização/i }))

    expect(await screen.findByText('Falha ao guardar')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })
})

describe('Onboarding /location — Skip', () => {
  it('"Escolher mais tarde" routes to /onboarding/start without saving', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /Escolher mais tarde/i }))
    expect(mockPush).toHaveBeenCalledWith('/onboarding/start')
    expect(mockFetch.mock.calls.find((c) => c[0] === '/api/profile')).toBeUndefined()
  })

  it('top "Skip" routes to /onboarding/start', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /^skip$/i }))
    expect(mockPush).toHaveBeenCalledWith('/onboarding/start')
  })
})

describe('Onboarding /location — geolocation detect', () => {
  it('calls navigator.geolocation.getCurrentPosition on detect click', async () => {
    const getCurrentPosition = vi.fn()
    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition },
      configurable: true,
    })

    await renderPage()
    fireEvent.click(screen.getByTitle('Detectar localização actual'))

    expect(getCurrentPosition).toHaveBeenCalled()
  })

  it('shows error when geolocation permission is denied', async () => {
    const getCurrentPosition = vi.fn((_: unknown, onError: (e: Error) => void) =>
      onError(new Error('denied'))
    )
    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition },
      configurable: true,
    })

    await renderPage()
    await act(async () => {
      fireEvent.click(screen.getByTitle('Detectar localização actual'))
    })

    await waitFor(() => {
      expect(screen.getByText('Permissão de localização negada.')).toBeInTheDocument()
    })
  })
})
