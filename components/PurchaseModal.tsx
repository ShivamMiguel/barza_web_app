'use client'

import { useEffect, useState } from 'react'
import type { ProductWithSpace } from '@/lib/supabase/products'

type Step = 1 | 2

interface Props {
  isOpen: boolean
  onClose: () => void
  product: ProductWithSpace
}

export function PurchaseModal({ isOpen, onClose, product }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const space = product.professional_space
  const hasPromo = product.promo_price != null && product.promo_price < product.price
  const unitPrice = hasPromo ? product.promo_price! : product.price
  const total = unitPrice * quantity

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setQuantity(1)
      setError(null)
      setSuccess(false)
      setLoading(false)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  async function handleConfirm() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
          space_id: space.id,
        }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.error ?? 'Erro ao registar pedido.')
        return
      }
      setSuccess(true)
    } catch {
      setError('Erro de conexão. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full sm:max-w-md bg-[#111] rounded-t-3xl sm:rounded-3xl border border-[rgba(255,145,86,0.12)] shadow-2xl overflow-hidden">
        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-on-surface/20" />
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center justify-center px-8 py-12 text-center gap-5">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div>
              <p className="font-bold text-lg text-on-surface">Pedido registado!</p>
              <p className="text-sm text-on-surface-variant/60 mt-1.5 leading-relaxed">
                O teu pedido foi enviado ao espaço. Aguarda o contacto do vendedor para combinar o pagamento e entrega.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full volcanic-gradient text-on-primary text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[rgba(255,145,86,0.08)]">
              <div>
                <p className="text-[9px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40">
                  Passo {step} de 2
                </p>
                <p className="font-bold text-sm text-on-surface mt-0.5">
                  {step === 1 ? 'Quantidade' : 'Confirmar pedido'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-on-surface-variant/50 hover:text-on-surface hover:bg-white/5 transition-colors"
                aria-label="Fechar"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Step 1: product + quantity */}
            {step === 1 && (
              <div className="px-6 py-5 space-y-5">
                {/* Product mini card */}
                <div className="flex gap-4 p-4 rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.1)]">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant/30 text-2xl">inventory_2</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-on-surface leading-snug">{product.name}</p>
                    <p className="text-[10px] text-on-surface-variant/50 mt-0.5 truncate">{space.space_name}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-black text-sm text-on-surface">
                        {unitPrice.toLocaleString('pt-AO')} Kz
                      </span>
                      {hasPromo && (
                        <span className="text-xs text-on-surface-variant/40 line-through">
                          {product.price.toLocaleString('pt-AO')} Kz
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity stepper */}
                <div>
                  <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 mb-3">
                    Quantidade
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-full border border-[rgba(86,67,58,0.2)] flex items-center justify-center text-on-surface-variant hover:border-primary-container/40 hover:text-primary-container transition-all disabled:opacity-30"
                    >
                      <span className="material-symbols-outlined text-xl">remove</span>
                    </button>
                    <span className="text-2xl font-black text-on-surface w-8 text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(99, q + 1))}
                      disabled={quantity >= 99}
                      className="w-10 h-10 rounded-full border border-[rgba(86,67,58,0.2)] flex items-center justify-center text-on-surface-variant hover:border-primary-container/40 hover:text-primary-container transition-all disabled:opacity-30"
                    >
                      <span className="material-symbols-outlined text-xl">add</span>
                    </button>
                    <span className="ml-auto text-sm font-black text-on-surface">
                      = {total.toLocaleString('pt-AO')} Kz
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-2xl volcanic-gradient text-on-primary font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-transform"
                >
                  Continuar
                </button>
              </div>
            )}

            {/* Step 2: summary + confirm */}
            {step === 2 && (
              <div className="px-6 py-5 space-y-5">
                {/* Order summary */}
                <div className="rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.1)] overflow-hidden divide-y divide-[rgba(86,67,58,0.08)]">
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-on-surface-variant/60">Produto</span>
                    <span className="font-semibold text-on-surface text-right max-w-[60%] truncate">{product.name}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-on-surface-variant/60">Espaço</span>
                    <span className="font-semibold text-on-surface">{space.space_name}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3 text-sm">
                    <span className="text-on-surface-variant/60">Qtd × Preço</span>
                    <span className="font-semibold text-on-surface">
                      {quantity} × {unitPrice.toLocaleString('pt-AO')} Kz
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-3">
                    <span className="text-sm font-bold text-on-surface">Total</span>
                    <span className="text-base font-black text-on-surface">{total.toLocaleString('pt-AO')} Kz</span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="flex gap-3 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-amber-400/80">
                  <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">info</span>
                  <p className="text-[11px] leading-relaxed">
                    A BARZA regista o teu interesse. O pagamento e entrega são combinados directamente com o espaço após confirmação do pedido.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setStep(1); setError(null) }}
                    disabled={loading}
                    className="flex-1 py-3.5 rounded-2xl border border-[rgba(86,67,58,0.2)] text-on-surface-variant/60 text-sm font-bold hover:text-on-surface transition-colors disabled:opacity-40"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex-[2] py-3.5 rounded-2xl volcanic-gradient text-on-primary font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && (
                      <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    )}
                    {loading ? 'A enviar…' : 'Confirmar pedido'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
