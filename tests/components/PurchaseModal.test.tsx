import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PurchaseModal } from '@/components/PurchaseModal'
import type { ProductWithSpace } from '@/lib/supabase/products'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockProduct: ProductWithSpace = {
  id: 'prod-1',
  name: 'Pomada Rara',
  description: 'Pomada premium para cabelo',
  price: 3500,
  promo_price: null,
  image_url: null,
  category: 'Cabelo',
  created_at: '2026-01-01T00:00:00Z',
  space_id: 'space-1',
  professional_space: {
    id: 'space-1',
    space_name: 'Studio Afro',
    logo: null,
    owner: 'owner-1',
  },
}

const mockProductWithPromo: ProductWithSpace = {
  ...mockProduct,
  id: 'prod-promo',
  name: 'Creme Hidratante',
  price: 5000,
  promo_price: 3200,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderModal(
  props: Partial<{ isOpen: boolean; onClose: () => void; product: ProductWithSpace }> = {},
) {
  const onClose = props.onClose ?? vi.fn()
  return {
    onClose,
    ...render(
      <PurchaseModal
        isOpen={props.isOpen ?? true}
        onClose={onClose}
        product={props.product ?? mockProduct}
      />,
    ),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch = vi.fn()
})

// ─── Visibility ───────────────────────────────────────────────────────────────

describe('PurchaseModal — visibility', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <PurchaseModal isOpen={false} onClose={vi.fn()} product={mockProduct} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders step 1 with product name when open', () => {
    renderModal()
    expect(screen.getByText('Pomada Rara')).toBeInTheDocument()
  })

  it('shows "Passo 1 de 2" indicator on open', () => {
    renderModal()
    expect(screen.getByText('Passo 1 de 2')).toBeInTheDocument()
  })

  it('shows "Quantidade" section on step 1', () => {
    renderModal()
    expect(screen.getByText('Quantidade')).toBeInTheDocument()
  })

  it('shows space name in the product mini card', () => {
    renderModal()
    expect(screen.getByText('Studio Afro')).toBeInTheDocument()
  })
})

// ─── Quantity stepper ─────────────────────────────────────────────────────────

describe('PurchaseModal — quantity stepper', () => {
  it('defaults quantity to 1', () => {
    renderModal()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('increments quantity on + click', () => {
    renderModal()
    const plus = screen.getByRole('button', { name: '' }).parentElement
      ? screen.getAllByRole('button').find(b => b.querySelector('.material-symbols-outlined')?.textContent === 'add')
      : null
    const addBtn = screen.getAllByRole('button').find(
      b => (b.querySelector('.material-symbols-outlined')?.textContent ?? '') === 'add',
    )!
    fireEvent.click(addBtn)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('decrements quantity on - click', () => {
    renderModal()
    const addBtn = screen.getAllByRole('button').find(
      b => (b.querySelector('.material-symbols-outlined')?.textContent ?? '') === 'add',
    )!
    fireEvent.click(addBtn)
    fireEvent.click(addBtn)
    const removeBtn = screen.getAllByRole('button').find(
      b => (b.querySelector('.material-symbols-outlined')?.textContent ?? '') === 'remove',
    )!
    fireEvent.click(removeBtn)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('minus button is disabled when quantity is 1', () => {
    renderModal()
    const removeBtn = screen.getAllByRole('button').find(
      b => (b.querySelector('.material-symbols-outlined')?.textContent ?? '') === 'remove',
    )!
    expect(removeBtn).toBeDisabled()
  })

  it('shows live total as quantity × price', () => {
    renderModal()
    // Default qty 1, price 3500
    expect(screen.getByText(/3\.500.*Kz|3,500.*Kz/)).toBeInTheDocument()
    const addBtn = screen.getAllByRole('button').find(
      b => (b.querySelector('.material-symbols-outlined')?.textContent ?? '') === 'add',
    )!
    fireEvent.click(addBtn)
    // qty 2 → 7000 Kz
    expect(screen.getByText(/7\.000.*Kz|7,000.*Kz/)).toBeInTheDocument()
  })
})

// ─── Price display ─────────────────────────────────────────────────────────────

describe('PurchaseModal — price display', () => {
  it('shows regular price when no promo', () => {
    renderModal()
    expect(screen.getAllByText(/3\.500.*Kz|3,500.*Kz/).length).toBeGreaterThan(0)
  })

  it('shows promo price when promo_price is set', () => {
    renderModal({ product: mockProductWithPromo })
    expect(screen.getAllByText(/3\.200.*Kz|3,200.*Kz/).length).toBeGreaterThan(0)
  })

  it('shows original price struck-through when promo', () => {
    renderModal({ product: mockProductWithPromo })
    const struck = screen.getByText(/5\.000.*Kz|5,000.*Kz/)
    expect(struck.className).toMatch(/line-through/)
  })
})

// ─── Step navigation ──────────────────────────────────────────────────────────

describe('PurchaseModal — step navigation', () => {
  it('navigates to step 2 on "Continuar" click', () => {
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    expect(screen.getByText('Passo 2 de 2')).toBeInTheDocument()
    expect(screen.getByText(/Confirmar pedido/i)).toBeInTheDocument()
  })

  it('shows order summary in step 2', () => {
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    expect(screen.getByText('Pomada Rara')).toBeInTheDocument()
    expect(screen.getByText('Studio Afro')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('shows disclaimer text in step 2', () => {
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    expect(screen.getByText(/pagamento e entrega são combinados/i)).toBeInTheDocument()
  })

  it('"Voltar" returns to step 1', () => {
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Voltar/i }))
    expect(screen.getByText('Passo 1 de 2')).toBeInTheDocument()
    expect(screen.getByText('Quantidade')).toBeInTheDocument()
  })
})

// ─── Confirm flow ─────────────────────────────────────────────────────────────

describe('PurchaseModal — confirm', () => {
  it('POSTs to /api/orders with correct payload', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'order-1', status: 'pendente' }),
    })

    renderModal()
    const addBtn = screen.getAllByRole('button').find(
      b => (b.querySelector('.material-symbols-outlined')?.textContent ?? '') === 'add',
    )!
    fireEvent.click(addBtn) // qty → 2
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar pedido/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/orders',
        expect.objectContaining({ method: 'POST' }),
      )
    })

    const call = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    const body = JSON.parse(call[1].body)
    expect(body.product_id).toBe('prod-1')
    expect(body.quantity).toBe(2)
    expect(body.space_id).toBe('space-1')
  })

  it('shows success state after confirmed order', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'order-1', status: 'pendente' }),
    })

    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar pedido/i }))

    await waitFor(() => {
      expect(screen.getByText(/Pedido registado/i)).toBeInTheDocument()
    })
  })

  it('shows success message about contacting vendor', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'order-1' }),
    })

    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar pedido/i }))

    await waitFor(() => {
      expect(screen.getByText(/contacto do vendedor/i)).toBeInTheDocument()
    })
  })
})

// ─── Error handling ───────────────────────────────────────────────────────────

describe('PurchaseModal — error handling', () => {
  it('shows error message when API returns error', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Produto não encontrado' }),
    })

    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar pedido/i }))

    expect(await screen.findByText('Produto não encontrado')).toBeInTheDocument()
  })

  it('does not navigate to success on error', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Falhou' }),
    })

    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar pedido/i }))

    await waitFor(() => {
      expect(screen.queryByText(/Pedido registado/i)).not.toBeInTheDocument()
    })
  })

  it('clears error when going back and retrying', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Falhou' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'order-1' }) })

    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar pedido/i }))

    await waitFor(() => expect(screen.getByText('Falhou')).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /Voltar/i }))
    expect(screen.queryByText('Falhou')).not.toBeInTheDocument()
  })
})

// ─── Close behaviour ──────────────────────────────────────────────────────────

describe('PurchaseModal — close behaviour', () => {
  it('calls onClose when backdrop is clicked', () => {
    const { onClose } = renderModal()
    const backdrop = document.querySelector('[aria-hidden="true"]')!
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape key is pressed', () => {
    const { onClose } = renderModal()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Fechar button is clicked on success', async () => {
    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'order-1' }),
    })

    const { onClose } = renderModal()
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    fireEvent.click(screen.getByRole('button', { name: /Confirmar pedido/i }))

    await waitFor(() => expect(screen.getByRole('button', { name: /Fechar/i })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /Fechar/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('resets to step 1 when reopened', async () => {
    const { rerender, onClose } = renderModal()

    // Navigate to step 2
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }))
    expect(screen.getByText('Passo 2 de 2')).toBeInTheDocument()

    // Close
    rerender(
      <PurchaseModal isOpen={false} onClose={onClose} product={mockProduct} />,
    )

    // Reopen
    rerender(
      <PurchaseModal isOpen={true} onClose={onClose} product={mockProduct} />,
    )

    expect(screen.getByText('Passo 1 de 2')).toBeInTheDocument()
  })
})
