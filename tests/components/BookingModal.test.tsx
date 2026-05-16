import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BookingModal } from '@/components/BookingModal'
import type { ServiceWithSpace } from '@/lib/supabase/professional-spaces'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockService: ServiceWithSpace = {
  id: 'svc-1',
  professional_space_id: 'space-1',
  service_name: 'Trança Nagô',
  price: 5000,
  category: 'Cabelo',
  is_active: true,
  duration_minutes: 90,
  description: 'Trança tradicional nagô',
  preco_promocional: null,
  image: null,
  professional_space: {
    id: 'space-1',
    space_name: 'Studio Afro',
    logo: null,
    location_space: { city: 'Luanda' },
    rate: 4.8,
    created_at: '2025-01-01T00:00:00Z',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderModal(props: Partial<{ isOpen: boolean; onClose: () => void }> = {}) {
  const onClose = props.onClose ?? vi.fn()
  const { rerender } = render(
    <BookingModal
      isOpen={props.isOpen ?? true}
      onClose={onClose}
      service={mockService}
    />,
  )
  return { onClose, rerender }
}

/** Clicks an available (non-disabled, numeric) day button in the calendar. */
function clickAvailableDay() {
  const buttons = screen.getAllByRole('button')
  const day = buttons.find(
    btn =>
      !btn.hasAttribute('disabled') &&
      /^\d{1,2}$/.test((btn.textContent ?? '').trim()),
  )
  if (!day) throw new Error('No available day button found')
  fireEvent.click(day)
}

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch = vi.fn()
})

// ─── Visibility ───────────────────────────────────────────────────────────────

describe('BookingModal — visibility', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <BookingModal isOpen={false} onClose={vi.fn()} service={mockService} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders step 1 with service name when open', () => {
    renderModal()
    expect(screen.getByText('Trança Nagô')).toBeInTheDocument()
    expect(screen.getByText('Escolhe uma data')).toBeInTheDocument()
  })

  it('shows step indicator text "Data" on step 1', () => {
    renderModal()
    expect(screen.getByText('Data')).toBeInTheDocument()
  })
})

// ─── Step 1 — Date ────────────────────────────────────────────────────────────

describe('BookingModal — step 1', () => {
  it('Continuar is disabled when no date is selected', () => {
    renderModal()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('Continuar becomes enabled after selecting a date', () => {
    renderModal()
    clickAvailableDay()
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('calls onClose when backdrop is clicked', () => {
    const { onClose } = renderModal()
    const backdrop = document.querySelector('[role="dialog"] > div')
    if (backdrop) fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when X button is clicked', () => {
    const { onClose } = renderModal()
    fireEvent.click(screen.getByLabelText('Fechar'))
    expect(onClose).toHaveBeenCalled()
  })

  it('navigates to step 2 after selecting a date and clicking Continuar', async () => {
    renderModal()
    clickAvailableDay()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => expect(screen.getByText('Escolhe um horário')).toBeInTheDocument())
  })
})

// ─── Step 2 — Time & Notes ────────────────────────────────────────────────────

describe('BookingModal — step 2', () => {
  async function goToStep2() {
    renderModal()
    clickAvailableDay()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => expect(screen.getByText('Escolhe um horário')).toBeInTheDocument())
  }

  it('shows step indicator text "Horário" on step 2', async () => {
    await goToStep2()
    expect(screen.getByText('Horário')).toBeInTheDocument()
  })

  it('Continuar is disabled when no time is selected', async () => {
    await goToStep2()
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled()
  })

  it('Continuar becomes enabled after selecting a time slot', async () => {
    await goToStep2()
    fireEvent.click(screen.getByText('10:00'))
    expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
  })

  it('Voltar button goes back to step 1', async () => {
    await goToStep2()
    fireEvent.click(screen.getByText('Voltar'))
    await waitFor(() => expect(screen.getByText('Escolhe uma data')).toBeInTheDocument())
  })

  it('home service toggle changes state', async () => {
    await goToStep2()
    const toggle = screen.getByRole('switch', { name: /domicílio/i })
    expect(toggle).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-checked', 'true')
  })

  it('navigates to step 3 after selecting time and clicking Continuar', async () => {
    await goToStep2()
    fireEvent.click(screen.getByText('10:00'))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => expect(screen.getByText('Resumo do Pedido')).toBeInTheDocument())
  })
})

// ─── Step 3 — Review & Submit ─────────────────────────────────────────────────

describe('BookingModal — step 3', () => {
  async function goToStep3() {
    renderModal()
    clickAvailableDay()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => screen.getByText('Escolhe um horário'))
    fireEvent.click(screen.getByText('10:00'))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => screen.getByText('Resumo do Pedido'))
  }

  it('shows service name and space name in summary', async () => {
    await goToStep3()
    expect(screen.getAllByText('Trança Nagô').length).toBeGreaterThan(0)
    expect(screen.getByText('Studio Afro')).toBeInTheDocument()
  })

  it('shows selected time in summary', async () => {
    await goToStep3()
    expect(screen.getByText('10:00')).toBeInTheDocument()
  })

  it('shows disclaimer about direct contact', async () => {
    await goToStep3()
    expect(screen.getByText(/pedido de contacto/i)).toBeInTheDocument()
  })

  it('shows "Enviar Pedido" button on step 3', async () => {
    await goToStep3()
    expect(screen.getByRole('button', { name: /enviar pedido/i })).toBeInTheDocument()
  })

  it('shows success state after successful submission', async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: 'booking-1', status: 'pending' }), { status: 201 }),
    )
    await goToStep3()
    fireEvent.click(screen.getByRole('button', { name: /enviar pedido/i }))
    await waitFor(() => expect(screen.getByText('Pedido Enviado!')).toBeInTheDocument())
  })

  it('shows error message when API returns 401', async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: 'Não autenticado' }), { status: 401 }),
    )
    await goToStep3()
    fireEvent.click(screen.getByRole('button', { name: /enviar pedido/i }))
    await waitFor(() =>
      expect(screen.getByText(/iniciar sessão/i)).toBeInTheDocument(),
    )
  })

  it('shows error message when API returns 500', async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: 'DB error' }), { status: 500 }),
    )
    await goToStep3()
    fireEvent.click(screen.getByRole('button', { name: /enviar pedido/i }))
    await waitFor(() =>
      expect(screen.getByText(/DB error/i)).toBeInTheDocument(),
    )
  })

  it('shows network error when fetch throws', async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))
    await goToStep3()
    fireEvent.click(screen.getByRole('button', { name: /enviar pedido/i }))
    await waitFor(() =>
      expect(screen.getByText(/sem ligação/i)).toBeInTheDocument(),
    )
  })
})

// ─── Success state ────────────────────────────────────────────────────────────

describe('BookingModal — success state', () => {
  it('Fechar button in success state resets and closes modal', async () => {
    const { onClose } = renderModal()
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: 'b-1', status: 'pending' }), { status: 201 }),
    )

    // Navigate to step 3
    clickAvailableDay()
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => screen.getByText('Escolhe um horário'))
    fireEvent.click(screen.getByText('10:00'))
    fireEvent.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => screen.getByText('Resumo do Pedido'))

    fireEvent.click(screen.getByRole('button', { name: /enviar pedido/i }))
    await waitFor(() => screen.getByText('Pedido Enviado!'))

    fireEvent.click(screen.getByText('Fechar'))
    expect(onClose).toHaveBeenCalled()
  })
})
