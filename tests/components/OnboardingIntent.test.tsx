import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockRefresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace, refresh: mockRefresh }),
}))

// Next's <Link> just renders an anchor here
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockFetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch = mockFetch
})

// Lazy import so mocks are wired first
async function renderPage() {
  const mod = await import('@/app/onboarding/intent/page')
  const Page = mod.default
  return render(<Page />)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Onboarding /intent — render', () => {
  it('renders the headline', async () => {
    await renderPage()
    expect(screen.getByText('O que te trouxe à Barza?')).toBeInTheDocument()
  })

  it('renders all 6 intent cards', async () => {
    await renderPage()
    expect(screen.getByRole('button', { name: /Beleza & Cabelo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Unhas & Estética/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Skincare & Bem-estar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Barbeiro & Grooming/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Produtos & Compras/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Inspiração & Conteúdo/i })).toBeInTheDocument()
  })
})

describe('Onboarding /intent — selection', () => {
  it('toggles aria-pressed when a card is clicked', async () => {
    await renderPage()
    const card = screen.getByRole('button', { name: /Beleza & Cabelo/i })
    expect(card).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(card)
    expect(card).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(card)
    expect(card).toHaveAttribute('aria-pressed', 'false')
  })

  it('allows multiple selections at once', async () => {
    await renderPage()
    const c1 = screen.getByRole('button', { name: /Beleza & Cabelo/i })
    const c2 = screen.getByRole('button', { name: /Unhas & Estética/i })
    fireEvent.click(c1)
    fireEvent.click(c2)
    expect(c1).toHaveAttribute('aria-pressed', 'true')
    expect(c2).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Onboarding /intent — Skip', () => {
  it('navigates to /onboarding/location when Skip is clicked', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /skip/i }))
    expect(mockPush).toHaveBeenCalledWith('/onboarding/location')
  })

  it('does not call /api/profile on Skip', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /skip/i }))
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

describe('Onboarding /intent — Continuar', () => {
  it('goes straight to /onboarding/location without API call when nothing is selected', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/location')
    })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('PATCHes /api/profile with the selected interest ids before navigating', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    await renderPage()

    fireEvent.click(screen.getByRole('button', { name: /Beleza & Cabelo/i }))
    fireEvent.click(screen.getByRole('button', { name: /Barbeiro & Grooming/i }))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/profile', expect.objectContaining({
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      }))
    })

    const call = mockFetch.mock.calls[0]
    const body = JSON.parse(call[1].body)
    expect(body.interests).toEqual(['beleza_cabelo', 'barbeiro_grooming'])

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/onboarding/location')
    })
  })

  it('shows an error message when /api/profile fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Falha do servidor' }),
    })
    await renderPage()

    fireEvent.click(screen.getByRole('button', { name: /Skincare & Bem-estar/i }))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByText('Falha do servidor')).toBeInTheDocument()
    })
    expect(mockPush).not.toHaveBeenCalled()
  })
})
