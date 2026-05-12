import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

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

beforeEach(() => {
  vi.clearAllMocks()
})

async function renderPage() {
  const mod = await import('@/app/onboarding/start/page')
  const Page = mod.default
  return render(<Page />)
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Onboarding /start — render', () => {
  it('renders the headline and tagline', async () => {
    await renderPage()
    expect(screen.getByText('O teu primeiro passo importa')).toBeInTheDocument()
    expect(screen.getByText(/Não vieste apenas observar/)).toBeInTheDocument()
  })

  it('renders all three first-step options', async () => {
    await renderPage()
    expect(screen.getByText('Criar o primeiro post')).toBeInTheDocument()
    expect(screen.getByText('Marcar um serviço')).toBeInTheDocument()
    expect(screen.getByText('Comprar um produto')).toBeInTheDocument()
  })

  it('renders the main "Entrar na Barza" CTA', async () => {
    await renderPage()
    expect(screen.getByRole('button', { name: /entrar na barza/i })).toBeInTheDocument()
  })
})

describe('Onboarding /start — routing through welcome', () => {
  it('"Criar o primeiro post" → welcome?next=/community?action=post', async () => {
    await renderPage()
    fireEvent.click(screen.getByText('Criar o primeiro post'))
    expect(mockPush).toHaveBeenCalledWith(
      `/onboarding/welcome?next=${encodeURIComponent('/community?action=post')}`
    )
  })

  it('"Marcar um serviço" → welcome?next=/community?action=book', async () => {
    await renderPage()
    fireEvent.click(screen.getByText('Marcar um serviço'))
    expect(mockPush).toHaveBeenCalledWith(
      `/onboarding/welcome?next=${encodeURIComponent('/community?action=book')}`
    )
  })

  it('"Comprar um produto" → welcome?next=/community?action=shop', async () => {
    await renderPage()
    fireEvent.click(screen.getByText('Comprar um produto'))
    expect(mockPush).toHaveBeenCalledWith(
      `/onboarding/welcome?next=${encodeURIComponent('/community?action=shop')}`
    )
  })

  it('"Entrar na Barza" → welcome?next=/community', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /entrar na barza/i }))
    expect(mockPush).toHaveBeenCalledWith(
      `/onboarding/welcome?next=${encodeURIComponent('/community')}`
    )
  })
})

describe('Onboarding /start — Skip', () => {
  it('routes to /community directly (no welcome transition)', async () => {
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /skip/i }))
    expect(mockPush).toHaveBeenCalledWith('/community')
  })
})
