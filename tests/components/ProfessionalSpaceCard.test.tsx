import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfessionalSpaceCard } from '@/components/ProfessionalSpaceCard'
import type { ServiceWithSpace } from '@/lib/supabase/professional-spaces'

// ShareModal makes window.location calls — stub it out
vi.mock('@/components/ShareModal', () => ({
  ShareModal: () => null,
}))

function makeService(overrides: Partial<ServiceWithSpace> = {}): ServiceWithSpace {
  return {
    id: 'svc-1',
    professional_space_id: 'space-1',
    service_name: 'Corte Premium',
    price: 5000,
    category: 'Barbeiro',
    is_active: true,
    duration_minutes: 45,
    description: 'Corte com acabamento',
    professional_space: {
      id: 'space-1',
      space_name: 'Studio Fade',
      logo: null,
      location_space: { city: 'Luanda' },
      rate: 4.8,
      created_at: new Date(Date.now() - 3_600_000).toISOString(),
    },
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── Navigation links ─────────────────────────────────────────────────────────

describe('ProfessionalSpaceCard — links', () => {
  it('logo links to the space profile page', () => {
    render(<ProfessionalSpaceCard service={makeService()} />)
    const link = screen.getAllByRole('link').find(
      (a) => (a as HTMLAnchorElement).href.includes('/community/space/space-1'),
    )
    expect(link).toBeDefined()
  })

  it('space name is inside a link to the space profile page', () => {
    render(<ProfessionalSpaceCard service={makeService()} />)
    const nameEl = screen.getByText('Studio Fade')
    expect(nameEl.closest('a')).toHaveAttribute('href', '/community/space/space-1')
  })

  it('"Ver Perfil" button links to the space profile page', () => {
    render(<ProfessionalSpaceCard service={makeService()} />)
    const link = screen.getByRole('link', { name: /ver perfil/i })
    expect(link).toHaveAttribute('href', '/community/space/space-1')
  })

  it('all three links point to the same space-specific URL', () => {
    render(<ProfessionalSpaceCard service={makeService()} />)
    const links = screen
      .getAllByRole('link')
      .filter((a) => (a as HTMLAnchorElement).href.includes('/community/space/space-1'))
    // header link (logo+name) + Ver Perfil
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  it('uses the correct space id when multiple spaces exist', () => {
    const service = makeService({
      professional_space: {
        id: 'space-abc-999',
        space_name: 'Nail Art Boutique',
        logo: null,
        location_space: null,
        rate: null,
        created_at: new Date().toISOString(),
      },
    })
    render(<ProfessionalSpaceCard service={service} />)
    const links = screen
      .getAllByRole('link')
      .filter((a) => (a as HTMLAnchorElement).href.includes('/community/space/space-abc-999'))
    expect(links.length).toBeGreaterThanOrEqual(2)
  })
})

// ─── Content rendering ────────────────────────────────────────────────────────

describe('ProfessionalSpaceCard — content', () => {
  it('renders space name', () => {
    render(<ProfessionalSpaceCard service={makeService()} />)
    expect(screen.getByText('Studio Fade')).toBeInTheDocument()
  })

  it('renders service name and category', () => {
    render(<ProfessionalSpaceCard service={makeService()} />)
    expect(screen.getByText('Corte Premium')).toBeInTheDocument()
    expect(screen.getByText('Barbeiro')).toBeInTheDocument()
  })

  it('renders price and duration', () => {
    render(<ProfessionalSpaceCard service={makeService()} />)
    expect(screen.getByText(/45min/)).toBeInTheDocument()
    expect(screen.getByText(/5.000/)).toBeInTheDocument()
  })

  it('renders location when available', () => {
    render(<ProfessionalSpaceCard service={makeService()} />)
    expect(screen.getByText(/luanda/i)).toBeInTheDocument()
  })

  it('renders logo img when logo url is provided', () => {
    const service = makeService({
      professional_space: {
        id: 'space-1',
        space_name: 'Studio Fade',
        logo: 'https://example.com/logo.png',
        location_space: null,
        rate: null,
        created_at: new Date().toISOString(),
      },
    })
    render(<ProfessionalSpaceCard service={service} />)
    const logo = screen.getAllByAltText('Studio Fade')[0]
    expect(logo).toHaveAttribute('src', 'https://example.com/logo.png')
  })

  it('renders initial letter fallback when no logo', () => {
    render(<ProfessionalSpaceCard service={makeService()} />)
    expect(screen.getByText('S')).toBeInTheDocument()
  })
})
