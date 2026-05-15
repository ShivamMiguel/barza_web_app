import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ServiceModal } from '@/components/ServiceModal'
import type { ProfessionalService, ProfessionalSpace } from '@/lib/supabase/professional-spaces'

// ─── Global mocks ─────────────────────────────────────────────────────────────

const mockFetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch = mockFetch
  // jsdom does not implement createObjectURL
  global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
  global.URL.revokeObjectURL = vi.fn()
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
    description: 'Corte clássico com acabamento perfeito',
    preco_promocional: null,
    extra_fee: null,
    image: null,
    ...overrides,
  }
}

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  onSaved: vi.fn(),
  spaces: [makeSpace()],
  service: null,
}

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('ServiceModal — visibility', () => {
  it('renders nothing when isOpen is false', () => {
    render(<ServiceModal {...defaultProps} isOpen={false} />)
    expect(screen.queryByRole('heading')).toBeNull()
  })

  it('renders when isOpen is true', () => {
    render(<ServiceModal {...defaultProps} />)
    expect(screen.getByText(/Adicionar Serviço/i)).toBeInTheDocument()
  })
})

describe('ServiceModal — create mode', () => {
  it('shows "Criar Serviço" submit button in create mode', () => {
    render(<ServiceModal {...defaultProps} service={null} />)
    expect(screen.getByRole('button', { name: /Criar Serviço/i })).toBeInTheDocument()
  })

  it('shows "Novo Serviço" label in create mode', () => {
    render(<ServiceModal {...defaultProps} service={null} />)
    expect(screen.getByText(/Novo Serviço/i)).toBeInTheDocument()
  })

  it('starts with empty service name field', () => {
    render(<ServiceModal {...defaultProps} service={null} />)
    const input = screen.getByPlaceholderText(/corte \+ barba/i)
    expect((input as HTMLInputElement).value).toBe('')
  })
})

describe('ServiceModal — edit mode', () => {
  it('shows "Guardar Alterações" submit button in edit mode', () => {
    render(<ServiceModal {...defaultProps} service={makeService()} />)
    expect(screen.getByRole('button', { name: /Guardar Alterações/i })).toBeInTheDocument()
  })

  it('shows "Editar Serviço" label in edit mode', () => {
    render(<ServiceModal {...defaultProps} service={makeService()} />)
    expect(screen.getByText(/Editar Serviço/i)).toBeInTheDocument()
  })

  it('pre-fills the service name field with existing value', () => {
    render(<ServiceModal {...defaultProps} service={makeService()} />)
    const input = screen.getByPlaceholderText(/corte \+ barba/i)
    expect((input as HTMLInputElement).value).toBe('Corte Premium')
  })

  it('pre-fills price field with existing value', () => {
    render(<ServiceModal {...defaultProps} service={makeService()} />)
    const priceInput = screen.getByDisplayValue('3000')
    expect(priceInput).toBeInTheDocument()
  })

  it('pre-fills description field with existing value', () => {
    render(<ServiceModal {...defaultProps} service={makeService()} />)
    expect(screen.getByDisplayValue('Corte clássico com acabamento perfeito')).toBeInTheDocument()
  })
})

describe('ServiceModal — space selector', () => {
  it('hides space selector when only one space', () => {
    render(<ServiceModal {...defaultProps} spaces={[makeSpace()]} />)
    expect(screen.queryByText(/Espaço Profissional/i)).toBeNull()
  })

  it('shows space selector when multiple spaces', () => {
    const spaces = [
      makeSpace({ id: 'space-1', space_name: 'Studio A' }),
      makeSpace({ id: 'space-2', space_name: 'Studio B' }),
    ]
    render(<ServiceModal {...defaultProps} spaces={spaces} />)
    expect(screen.getByText(/Espaço Profissional/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Studio A')).toBeInTheDocument()
  })
})

describe('ServiceModal — close', () => {
  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn()
    render(<ServiceModal {...defaultProps} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when X button is clicked', () => {
    const onClose = vi.fn()
    render(<ServiceModal {...defaultProps} onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})

// ─── Submission ───────────────────────────────────────────────────────────────

describe('ServiceModal — create submission', () => {
  it('POSTs to /api/users/me/services with form data', async () => {
    const onSaved = vi.fn()
    const onClose = vi.fn()
    const created = makeService({ id: 'svc-new' })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ service: created }),
    })

    render(<ServiceModal {...defaultProps} onSaved={onSaved} onClose={onClose} service={null} />)

    fireEvent.change(screen.getByPlaceholderText(/corte \+ barba/i), {
      target: { value: 'Corte Premium' },
    })
    fireEvent.change(screen.getByPlaceholderText('2500'), {
      target: { value: '3000' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Criar Serviço/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/me/services',
        expect.objectContaining({ method: 'POST' }),
      )
    })

    expect(onSaved).toHaveBeenCalledWith(created)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('shows error message when API returns error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Espaço não encontrado' }),
    })

    render(<ServiceModal {...defaultProps} service={null} />)

    fireEvent.change(screen.getByPlaceholderText(/corte \+ barba/i), {
      target: { value: 'Corte' },
    })
    fireEvent.change(screen.getByPlaceholderText('2500'), {
      target: { value: '3000' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Criar Serviço/i }))

    await waitFor(() => {
      expect(screen.getByText('Espaço não encontrado')).toBeInTheDocument()
    })
  })
})

describe('ServiceModal — edit submission', () => {
  it('PATCHes to /api/users/me/services/[id] with updated data', async () => {
    const onSaved = vi.fn()
    const onClose = vi.fn()
    const updated = makeService({ service_name: 'Corte Especial' })

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ service: updated }),
    })

    render(
      <ServiceModal
        {...defaultProps}
        service={makeService()}
        onSaved={onSaved}
        onClose={onClose}
      />,
    )

    fireEvent.change(screen.getByDisplayValue('Corte Premium'), {
      target: { value: 'Corte Especial' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Guardar Alterações/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/me/services/svc-1',
        expect.objectContaining({ method: 'PATCH' }),
      )
    })

    expect(onSaved).toHaveBeenCalledWith(updated)
    expect(onClose).toHaveBeenCalledOnce()
  })
})
