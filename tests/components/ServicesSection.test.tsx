import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { ServicesSection } from '@/components/ServicesSection'
import type { ProfessionalService, ProfessionalSpace } from '@/lib/supabase/professional-spaces'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockFetch = vi.fn()

// Capture onSaved so tests can simulate a modal save
let capturedOnSaved: ((s: ProfessionalService) => void) = () => {}

vi.mock('@/components/ServiceModal', () => ({
  ServiceModal: ({
    isOpen,
    service,
    onSaved,
  }: {
    isOpen: boolean
    service: ProfessionalService | null
    onSaved: (s: ProfessionalService) => void
  }) => {
    capturedOnSaved = onSaved
    return isOpen ? (
      <div
        data-testid="service-modal"
        data-editing={service ? service.id : 'new'}
      />
    ) : null
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch = mockFetch
})

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeSpace(overrides: Partial<ProfessionalSpace> = {}): ProfessionalSpace {
  return {
    id: 'space-1',
    space_name: 'Studio Fade',
    owner: 'user-1',
    created_at: new Date().toISOString(),
    rate: null,
    ...overrides,
  }
}

function makeService(overrides: Partial<ProfessionalService> = {}): ProfessionalService {
  return {
    id: 'svc-1',
    professional_space_id: 'space-1',
    service_name: 'Corte Premium',
    price: 3000,
    category: 'Corte Clássico',
    is_active: true,
    duration_minutes: 30,
    description: null,
    preco_promocional: null,
    extra_fee: null,
    image: null,
    ...overrides,
  }
}

// ─── Empty states ─────────────────────────────────────────────────────────────

describe('ServicesSection — no spaces', () => {
  it('shows message to create a space first when spaces is empty', () => {
    render(<ServicesSection spaces={[]} initialServices={[]} />)
    expect(screen.getByText(/cria um espaço profissional/i)).toBeInTheDocument()
  })

  it('does not show an add button when no spaces exist', () => {
    render(<ServicesSection spaces={[]} initialServices={[]} />)
    expect(screen.queryByRole('button', { name: /Adicionar/i })).toBeNull()
  })
})

describe('ServicesSection — spaces but no services', () => {
  it('shows empty state message when no services', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[]} />)
    expect(screen.getByText(/Ainda não tens serviços/i)).toBeInTheDocument()
  })

  it('shows "Criar Serviço" CTA in empty state', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[]} />)
    expect(screen.getByRole('button', { name: /Criar Serviço/i })).toBeInTheDocument()
  })
})

// ─── Rendering services ───────────────────────────────────────────────────────

describe('ServicesSection — service cards', () => {
  it('renders the service name', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService()]} />)
    expect(screen.getByText('Corte Premium')).toBeInTheDocument()
  })

  it('renders the service category', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService()]} />)
    expect(screen.getByText(/Corte Clássico/i)).toBeInTheDocument()
  })

  it('renders formatted price', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService()]} />)
    // locale may use '.', ',', or ' ' as thousands separator
    expect(screen.getByText(/3.000 Kz/)).toBeInTheDocument()
  })

  it('renders duration', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService()]} />)
    expect(screen.getByText(/30min/)).toBeInTheDocument()
  })

  it('renders service count in section heading', () => {
    render(
      <ServicesSection
        spaces={[makeSpace()]}
        initialServices={[makeService(), makeService({ id: 'svc-2', service_name: 'Barba' })]}
      />,
    )
    expect(screen.getByText('(2)')).toBeInTheDocument()
  })

  it('shows "Activo" badge for active services', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService({ is_active: true })]} />)
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('shows "Inactivo" badge for inactive services', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService({ is_active: false })]} />)
    expect(screen.getByText('Inactivo')).toBeInTheDocument()
  })

  it('shows promotional price with original price struck through', () => {
    render(
      <ServicesSection
        spaces={[makeSpace()]}
        initialServices={[makeService({ preco_promocional: 2500 })]}
      />,
    )
    // locale may use '.', ',', or ' ' as thousands separator
    expect(screen.getByText(/2.500 Kz/)).toBeInTheDocument()
    expect(screen.getByText(/3.000 Kz/)).toBeInTheDocument()
  })

  it('renders the space name on the card', () => {
    render(
      <ServicesSection
        spaces={[makeSpace({ space_name: 'Studio Fade' })]}
        initialServices={[makeService()]}
      />,
    )
    expect(screen.getByText(/Studio Fade/)).toBeInTheDocument()
  })

  it('renders service image when available', () => {
    render(
      <ServicesSection
        spaces={[makeSpace()]}
        initialServices={[makeService({ image: 'https://example.com/cut.jpg' })]}
      />,
    )
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/cut.jpg')
  })
})

// ─── Modal — create ───────────────────────────────────────────────────────────

describe('ServicesSection — open create modal', () => {
  it('opens modal with no service when "Adicionar" is clicked', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService()]} />)
    fireEvent.click(screen.getByRole('button', { name: /Adicionar/i }))
    const modal = screen.getByTestId('service-modal')
    expect(modal).toBeInTheDocument()
    expect(modal.getAttribute('data-editing')).toBe('new')
  })

  it('opens modal with no service when empty-state "Criar Serviço" is clicked', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[]} />)
    fireEvent.click(screen.getByRole('button', { name: /Criar Serviço/i }))
    expect(screen.getByTestId('service-modal')).toBeInTheDocument()
  })
})

// ─── Modal — edit ─────────────────────────────────────────────────────────────

describe('ServicesSection — open edit modal', () => {
  it('opens modal with the correct service when edit button is clicked', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService()]} />)
    // edit button: button containing "edit" material icon text
    const editBtn = screen.getByRole('button', { name: 'edit' })
    fireEvent.click(editBtn)
    const modal = screen.getByTestId('service-modal')
    expect(modal.getAttribute('data-editing')).toBe('svc-1')
  })
})

// ─── Delete ───────────────────────────────────────────────────────────────────

describe('ServicesSection — delete service', () => {
  it('shows confirm button after first delete click', () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService()]} />)
    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    expect(screen.getByText('Confirmar')).toBeInTheDocument()
  })

  it('sends DELETE to correct URL after confirmation', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })

    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService()]} />)

    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    fireEvent.click(await screen.findByText('Confirmar'))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/me/services/svc-1',
        { method: 'DELETE' },
      )
    })
  })

  it('removes service card from list after successful delete', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) })

    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService()]} />)

    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    fireEvent.click(await screen.findByText('Confirmar'))

    await waitFor(() => {
      expect(screen.queryByText('Corte Premium')).not.toBeInTheDocument()
    })
  })

  it('keeps the service in the list when delete fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Erro' }) })

    render(<ServicesSection spaces={[makeSpace()]} initialServices={[makeService()]} />)

    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    fireEvent.click(await screen.findByText('Confirmar'))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    expect(screen.getByText('Corte Premium')).toBeInTheDocument()
  })
})

// ─── onSaved callback ─────────────────────────────────────────────────────────

describe('ServicesSection — onSaved', () => {
  it('adds a new service to the list when modal calls onSaved', async () => {
    render(<ServicesSection spaces={[makeSpace()]} initialServices={[]} />)

    // Open the create modal so the mock mounts and capturedOnSaved is set
    fireEvent.click(screen.getByRole('button', { name: /Criar Serviço/i }))
    expect(screen.getByTestId('service-modal')).toBeInTheDocument()

    // Simulate the modal calling onSaved with a new service
    const newService = makeService({ id: 'svc-new', service_name: 'Barba Completa' })
    act(() => capturedOnSaved(newService))

    expect(await screen.findByText('Barba Completa')).toBeInTheDocument()
  })

  it('updates an existing service in the list when modal calls onSaved with same id', async () => {
    render(
      <ServicesSection
        spaces={[makeSpace()]}
        initialServices={[makeService({ service_name: 'Corte Premium' })]}
      />,
    )

    // Open edit modal
    fireEvent.click(screen.getByRole('button', { name: 'edit' }))

    // Simulate save with updated name
    const updated = makeService({ service_name: 'Corte Especial' })
    act(() => capturedOnSaved(updated))

    expect(await screen.findByText('Corte Especial')).toBeInTheDocument()
    expect(screen.queryByText('Corte Premium')).not.toBeInTheDocument()
  })
})
