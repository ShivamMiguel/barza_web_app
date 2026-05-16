'use client'

import { useEffect, useState } from 'react'
import type { ServiceWithSpace } from '@/lib/supabase/professional-spaces'

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
const WEEKDAYS_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30',
]

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function formatDateDisplay(dateStr: string) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${WEEKDAYS_FULL[date.getDay()]}, ${d} ${MONTHS_SHORT[m - 1]}`
}

// ── Calendar ─────────────────────────────────────────────────────────────────

function Calendar({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const now = new Date()
  const todayY = now.getFullYear()
  const todayM = now.getMonth()
  const todayD = now.getDate()

  const [viewY, setViewY] = useState(todayY)
  const [viewM, setViewM] = useState(todayM)

  const startOffset = (new Date(viewY, viewM, 1).getDay() + 6) % 7
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function isPast(d: number) {
    return new Date(viewY, viewM, d) < new Date(todayY, todayM, todayD)
  }

  function prev() {
    if (viewM === 0) { setViewY(y => y - 1); setViewM(11) } else setViewM(m => m - 1)
  }
  function next() {
    if (viewM === 11) { setViewY(y => y + 1); setViewM(0) } else setViewM(m => m + 1)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prev}
          aria-label="Mês anterior"
          className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-base text-on-surface-variant/50">chevron_left</span>
        </button>
        <p className="text-sm font-bold text-on-surface uppercase tracking-wider">
          {MONTHS_PT[viewM]} {viewY}
        </p>
        <button
          onClick={next}
          aria-label="Próximo mês"
          className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-base text-on-surface-variant/50">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
          <div key={d} className="text-center text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/25 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />
          const past = isPast(d)
          const sel = value === toDateStr(viewY, viewM, d)
          const isToday = viewY === todayY && viewM === todayM && d === todayD
          return (
            <button
              key={d}
              disabled={past}
              onClick={() => onChange(toDateStr(viewY, viewM, d))}
              className={`aspect-square rounded-full text-xs font-semibold transition-all flex items-center justify-center ${
                sel
                  ? 'volcanic-gradient text-on-primary shadow-[0_0_12px_rgba(255,145,86,0.35)]'
                  : past
                  ? 'text-on-surface-variant/15 cursor-not-allowed'
                  : isToday
                  ? 'border border-primary-container/50 text-primary-container hover:bg-primary-container/10'
                  : 'text-on-surface/70 hover:bg-white/5'
              }`}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface BookingForm {
  date: string
  time: string
  home: boolean
  description: string
}

export interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  service: ServiceWithSpace
}

// ── Main Modal ────────────────────────────────────────────────────────────────

export function BookingModal({ isOpen, onClose, service }: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<BookingForm>({ date: '', time: '', home: false, description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  function handleClose() {
    setStep(1)
    setForm({ date: '', time: '', home: false, description: '' })
    setLoading(false)
    setError(null)
    setSuccess(false)
    onClose()
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: service.id,
          professional_space_id: service.professional_space.id,
          booking_date: form.date,
          booking_time: form.time,
          description: form.description || null,
          home: form.home,
          total_price: service.preco_promocional ?? service.price,
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        if (res.status === 401) {
          setError('Tens de iniciar sessão para enviar um pedido.')
        } else {
          setError(d.error ?? 'Ocorreu um erro. Tenta novamente.')
        }
        return
      }
      setSuccess(true)
    } catch {
      setError('Sem ligação. Verifica a tua internet e tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const stepLabel = step === 1 ? 'Data' : step === 2 ? 'Horário' : 'Confirmar'
  const canAdvance = step === 1 ? !!form.date : step === 2 ? !!form.time : true

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Agendar serviço"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative w-full sm:max-w-[420px] bg-[rgba(14,14,14,0.98)] border border-[rgba(86,67,58,0.2)] border-t-[2px] border-t-[#FF9156] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.8),0_40px_80px_rgba(0,0,0,0.8)]">

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/10" />
        </div>

        {success ? (
          <SuccessState service={service} form={form} onClose={handleClose} />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-[rgba(86,67,58,0.12)]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {([1, 2, 3] as const).map(s => (
                    <div
                      key={s}
                      className={`rounded-full transition-all duration-300 ${
                        s === step
                          ? 'w-5 h-1.5 volcanic-gradient'
                          : s < step
                          ? 'w-1.5 h-1.5 bg-primary-container/60'
                          : 'w-1.5 h-1.5 bg-on-surface-variant/15'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40">
                  {stepLabel}
                </span>
              </div>
              <button
                onClick={handleClose}
                aria-label="Fechar"
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors text-on-surface-variant/40 hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 max-h-[65vh] overflow-y-auto">
              {step === 1 && (
                <Step1 service={service} form={form} onChange={date => setForm(f => ({ ...f, date }))} />
              )}
              {step === 2 && (
                <Step2 form={form} onChange={patch => setForm(f => ({ ...f, ...patch }))} />
              )}
              {step === 3 && (
                <Step3 service={service} form={form} error={error} />
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
                  className="px-5 py-3 rounded-xl border border-[rgba(86,67,58,0.25)] text-on-surface-variant/60 hover:text-on-surface hover:border-[rgba(86,67,58,0.45)] transition-all text-sm font-bold"
                >
                  Voltar
                </button>
              )}
              <button
                disabled={!canAdvance || loading}
                onClick={() => {
                  if (step < 3) setStep(s => (s + 1) as 1 | 2 | 3)
                  else handleSubmit()
                }}
                className="flex-1 volcanic-gradient text-on-primary py-3 rounded-xl font-bold text-sm uppercase tracking-widest active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                ) : step === 3 ? (
                  'Enviar Pedido'
                ) : (
                  <>
                    Continuar
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Step 1 — Date ─────────────────────────────────────────────────────────────

function Step1({
  service,
  form,
  onChange,
}: {
  service: ServiceWithSpace
  form: BookingForm
  onChange: (d: string) => void
}) {
  const price = service.preco_promocional ?? service.price
  return (
    <div className="space-y-5">
      {/* Mini service card */}
      <div className="flex gap-3 p-3 rounded-2xl bg-[#0e0e0e] border border-[rgba(86,67,58,0.15)]">
        {service.image && (
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
            <img src={service.image} alt={service.service_name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[9px] font-label uppercase tracking-widest text-primary-container mb-0.5">
            {service.category}
          </p>
          <p className="font-bold text-sm text-on-surface truncate">{service.service_name}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant/50">
            <span>{service.duration_minutes}min</span>
            <span>·</span>
            <span className="text-on-surface font-semibold">{price.toLocaleString('pt-AO')} Kz</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div>
        <p className="text-[10px] font-bold text-on-surface uppercase tracking-[0.2em] mb-4">
          Escolhe uma data
        </p>
        <Calendar value={form.date} onChange={onChange} />
      </div>
    </div>
  )
}

// ── Step 2 — Time & Notes ─────────────────────────────────────────────────────

function Step2({
  form,
  onChange,
}: {
  form: BookingForm
  onChange: (p: Partial<BookingForm>) => void
}) {
  return (
    <div className="space-y-5">
      {/* Date recap pill */}
      {form.date && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20">
          <span className="material-symbols-outlined text-primary-container text-sm">calendar_month</span>
          <span className="text-xs font-bold text-primary-container">{formatDateDisplay(form.date)}</span>
        </div>
      )}

      {/* Time grid */}
      <div>
        <p className="text-[10px] font-bold text-on-surface uppercase tracking-[0.2em] mb-3">
          Escolhe um horário
        </p>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map(t => (
            <button
              key={t}
              onClick={() => onChange({ time: t })}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                form.time === t
                  ? 'volcanic-gradient text-on-primary shadow-[0_0_10px_rgba(255,145,86,0.25)]'
                  : 'bg-[#0e0e0e] border border-[rgba(86,67,58,0.2)] text-on-surface/70 hover:border-primary-container/30 hover:text-on-surface'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Home service toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0e0e0e] border border-[rgba(86,67,58,0.15)]">
        <div>
          <p className="text-sm font-bold text-on-surface">Serviço ao domicílio</p>
          <p className="text-xs text-on-surface-variant/50 mt-0.5">O profissional desloca-se à tua morada</p>
        </div>
        <button
          role="switch"
          aria-checked={form.home}
          aria-label="Serviço ao domicílio"
          onClick={() => onChange({ home: !form.home })}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
            form.home ? 'bg-primary-container' : 'bg-on-surface-variant/20'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
              form.home ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>

      {/* Notes */}
      <div>
        <p className="text-[10px] font-bold text-on-surface uppercase tracking-[0.2em] mb-2">
          Notas <span className="text-on-surface-variant/30 normal-case tracking-normal font-normal">(opcional)</span>
        </p>
        <textarea
          value={form.description}
          onChange={e => onChange({ description: e.target.value })}
          placeholder="Referências, detalhes do look, preferências específicas..."
          rows={3}
          className="w-full bg-[#0e0e0e] border border-[rgba(86,67,58,0.2)] rounded-2xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/25 focus:outline-none focus:border-primary-container/40 resize-none"
        />
      </div>
    </div>
  )
}

// ── Step 3 — Review ───────────────────────────────────────────────────────────

function Step3({
  service,
  form,
  error,
}: {
  service: ServiceWithSpace
  form: BookingForm
  error: string | null
}) {
  const price = service.preco_promocional ?? service.price
  const space = service.professional_space
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold text-on-surface uppercase tracking-[0.2em]">
        Resumo do Pedido
      </p>

      {/* Summary card */}
      <div className="rounded-2xl bg-[#0e0e0e] border border-[rgba(86,67,58,0.15)] overflow-hidden divide-y divide-[rgba(86,67,58,0.1)]">
        <div className="p-4">
          <p className="text-[9px] font-label uppercase tracking-widest text-primary-container mb-0.5">
            {service.category}
          </p>
          <p className="font-bold text-on-surface">{service.service_name}</p>
          <p className="text-xs text-on-surface-variant/50 mt-0.5">{space.space_name}</p>
        </div>

        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant/60">
            <span className="material-symbols-outlined text-base">calendar_month</span>
            {formatDateDisplay(form.date)}
          </div>
          <div className="flex items-center gap-2 text-sm text-on-surface-variant/60">
            <span className="material-symbols-outlined text-base">schedule</span>
            {form.time}
          </div>
        </div>

        {form.home && (
          <div className="px-4 py-3 flex items-center gap-2 text-sm text-primary-container">
            <span className="material-symbols-outlined text-base">home</span>
            Serviço ao domicílio
          </div>
        )}

        {form.description && (
          <div className="px-4 py-3">
            <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/35 mb-1">
              Notas
            </p>
            <p className="text-xs text-on-surface-variant/60 leading-relaxed">{form.description}</p>
          </div>
        )}

        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant/50">Valor estimado</p>
            <p className="text-[9px] text-on-surface-variant/30 mt-0.5">{service.duration_minutes} minutos</p>
          </div>
          <p className="font-black text-on-surface">{price.toLocaleString('pt-AO')} Kz</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-3 rounded-xl bg-surface-container border border-[rgba(86,67,58,0.1)]">
        <p className="text-[10px] text-on-surface-variant/40 leading-relaxed">
          Este é um <strong className="text-on-surface-variant/60">pedido de contacto</strong>, não uma reserva confirmada.
          O profissional irá analisar e entrar em contacto directamente. Todos os acordos e pagamentos são
          estabelecidos exclusivamente entre ti e o profissional, fora da plataforma Barza.
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-xl py-2 px-3">
          {error}
        </p>
      )}
    </div>
  )
}

// ── Success ───────────────────────────────────────────────────────────────────

function SuccessState({
  service,
  form,
  onClose,
}: {
  service: ServiceWithSpace
  form: BookingForm
  onClose: () => void
}) {
  return (
    <div className="px-6 py-10 text-center space-y-5">
      <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto">
        <span
          className="material-symbols-outlined text-green-400 text-3xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>
      </div>

      <div>
        <p className="text-lg font-black font-headline text-on-surface mb-2">Pedido Enviado!</p>
        <p className="text-sm text-on-surface-variant/60 leading-relaxed max-w-xs mx-auto">
          O teu pedido para{' '}
          <strong className="text-on-surface">{service.service_name}</strong> em{' '}
          {service.professional_space.space_name} ficou registado para{' '}
          {formatDateDisplay(form.date)} às {form.time}.
        </p>
      </div>

      <p className="text-[10px] text-on-surface-variant/30 leading-relaxed max-w-[240px] mx-auto">
        O profissional irá entrar em contacto contigo directamente para confirmar os detalhes.
      </p>

      <button
        onClick={onClose}
        className="w-full volcanic-gradient text-on-primary py-3 rounded-xl font-bold text-sm uppercase tracking-widest active:scale-95 transition-transform"
      >
        Fechar
      </button>
    </div>
  )
}
