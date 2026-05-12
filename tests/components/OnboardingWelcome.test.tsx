import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = vi.fn()
const mockRefresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => mockSearchParams,
}))

let mockSearchParams = new URLSearchParams()

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
  mockSearchParams = new URLSearchParams()
})

afterEach(() => {
  vi.useRealTimers()
})

async function renderPage(next?: string) {
  if (next) mockSearchParams = new URLSearchParams({ next })
  const mod = await import('@/app/onboarding/welcome/page')
  const Page = mod.default
  return render(<Page />)
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Onboarding /welcome — initial stage', () => {
  it('renders BARZA on first paint', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { name: 'BARZA' })).toBeInTheDocument()
  })

  it('does not yet show the received line', async () => {
    await renderPage()
    expect(screen.queryByText(/A tua presença foi recebida/)).not.toBeInTheDocument()
  })

  it('does not yet show the farewell line', async () => {
    await renderPage()
    expect(screen.queryByText(/Bem-vindo à Barza/)).not.toBeInTheDocument()
  })
})

describe('Onboarding /welcome — staged sequence', () => {
  it('shows "A tua presença foi recebida." after 3000ms', async () => {
    await renderPage()
    advance(3000)
    expect(screen.getByText('A tua presença foi recebida.')).toBeInTheDocument()
  })

  it('shows the farewell pair after 5500ms', async () => {
    await renderPage()
    advance(5500)
    expect(screen.getByText('Bem-vindo à Barza.')).toBeInTheDocument()
    expect(screen.getByText('Aqui, cada escolha é uma forma de expressão.')).toBeInTheDocument()
  })
})

describe('Onboarding /welcome — redirect', () => {
  it('redirects to /community by default after 8000ms', async () => {
    await renderPage()
    expect(mockPush).not.toHaveBeenCalled()
    advance(8000)
    expect(mockPush).toHaveBeenCalledWith('/community')
  })

  it('redirects to the sanitised next path', async () => {
    await renderPage('/community?action=post')
    advance(8000)
    expect(mockPush).toHaveBeenCalledWith('/community?action=post')
  })

  it('falls back to /community when next is not an internal path', async () => {
    await renderPage('https://evil.example.com')
    advance(8000)
    expect(mockPush).toHaveBeenCalledWith('/community')
  })

  it('falls back to /community when next is protocol-relative (//host)', async () => {
    await renderPage('//evil.example.com')
    advance(8000)
    expect(mockPush).toHaveBeenCalledWith('/community')
  })
})

describe('Onboarding /welcome — Skip', () => {
  it('Skip jumps to the target immediately', async () => {
    await renderPage('/community?action=book')
    fireEvent.click(screen.getByRole('button', { name: /skip/i }))
    expect(mockPush).toHaveBeenCalledWith('/community?action=book')
  })
})
