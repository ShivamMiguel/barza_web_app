'use client'

import { useState } from 'react'
import type { BookingWithSpace } from '@/lib/supabase/bookings'

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function formatDate(d: string) {
  const [y, m, day] = d.split('-').map(Number)
  const date = new Date(y, m - 1, day)
  return `${WEEKDAYS[date.getDay()]}, ${day} ${MONTHS[m - 1]}`
}

function formatTime(t: string) {
  return t.slice(0, 5)
}

type StatusKey = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'

const STATUS: Record<StatusKey, { label: string; dot: string; badge: string }> = {
  pending:   { label: 'Pendente',   dot: 'bg-amber-400',    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  accepted:  { label: 'Aceite',     dot: 'bg-green-400',    badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  rejected:  { label: 'Recusado',   dot: 'bg-red-400/60',   badge: 'bg-red-500/10 text-red-400/80 border-red-500/20' },
  completed: { label: 'Concluído',  dot: 'bg-blue-400',     badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  cancelled: { label: 'Cancelado',  dot: 'bg-on-surface-variant/30', badge: 'bg-surface-container text-on-surface-variant/50 border-[rgba(86,67,58,0.12)]' },
}

function statusCfg(s: string) {
  return STATUS[s as StatusKey] ?? { label: s, dot: 'bg-on-surface-variant/30', badge: 'bg-surface-container text-on-surface-variant/50 border-[rgba(86,67,58,0.12)]' }
}

const TABS = [
  { key: '', label: 'Todos' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'accepted', label: 'Aceites' },
  { key: 'rejected', label: 'Recusados' },
  { key: 'completed', label: 'Concluídos' },
  { key: 'cancelled', label: 'Cancelados' },
]

// ── Booking card ──────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  onReject,
}: {
  booking: BookingWithSpace
  onReject: (id: string) => void
}) {
  const [cancelling, setCancelling] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const cfg = statusCfg(booking.status)

  const spaceName = booking.professional_space?.space_name ?? '—'
  const spaceLogo = booking.professional_space?.logo ?? null
  const serviceName = booking.professional_services?.service_name ?? '—'

  async function handleReject() {
    setCancelling(true)
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      })
      if (res.ok) onReject(booking.id)
    } finally {
      setCancelling(false)
      setConfirmCancel(false)
    }
  }

  return (
    <div className="rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.1)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[rgba(86,67,58,0.08)]">
        {/* Space logo */}
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high flex items-center justify-center">
          {spaceLogo ? (
            <img src={spaceLogo} alt={spaceName} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant/30 text-xl">store</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-on-surface truncate">{spaceName}</p>
          <p className="text-[10px] text-on-surface-variant/50 truncate">{serviceName}</p>
        </div>

        {/* Status badge */}
        <span className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest ${cfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-on-surface-variant/60">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          {formatDate(booking.booking_date)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">schedule</span>
          {formatTime(booking.booking_time)}
        </span>
        {booking.home && (
          <span className="flex items-center gap-1.5 text-primary-container">
            <span className="material-symbols-outlined text-sm">home</span>
            Domicílio
          </span>
        )}
        <span className="ml-auto font-black text-on-surface">
          {booking.total_price.toLocaleString('pt-AO')} Kz
        </span>
      </div>

      {booking.description && (
        <div className="px-4 pb-3">
          <p className="text-[11px] text-on-surface-variant/45 leading-relaxed line-clamp-2">
            {booking.description}
          </p>
        </div>
      )}

      {/* Cancel action — only on pending or accepted */}
      {(booking.status === 'pending' || booking.status === 'accepted') && (
        <div className="flex gap-2 px-4 pb-4">
          {confirmCancel ? (
            <>
              <p className="flex-1 text-[11px] text-on-surface-variant/50 self-center">
                Tens a certeza?
              </p>
              <button
                disabled={cancelling}
                onClick={handleReject}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400/80 text-[10px] font-bold hover:bg-red-500/20 transition-colors disabled:opacity-40 flex items-center gap-1"
              >
                {cancelling
                  ? <span className="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                  : 'Confirmar'}
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                className="px-3 py-1.5 rounded-xl border border-[rgba(86,67,58,0.2)] text-on-surface-variant/50 text-[10px] font-bold hover:text-on-surface transition-colors"
              >
                Não
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmCancel(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[rgba(86,67,58,0.2)] text-on-surface-variant/40 text-[10px] font-bold hover:border-red-500/30 hover:text-red-400/80 transition-all"
            >
              <span className="material-symbols-outlined text-xs">cancel</span>
              Cancelar pedido
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  initialBookings: BookingWithSpace[]
}

export function UserBookingsSection({ initialBookings }: Props) {
  const [bookings, setBookings] = useState(initialBookings)
  const [tab, setTab] = useState('')

  function handleReject(id: string) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b))
  }

  const pending = bookings.filter(b => b.status === 'pending').length
  const filtered = tab ? bookings.filter(b => b.status === tab) : bookings

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-5">
        <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40">
          Os Meus Agendamentos <span className="text-on-surface-variant/25">({bookings.length})</span>
        </p>
        {pending > 0 && (
          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-[8px] font-black text-black">
            {pending}
          </span>
        )}
      </div>

      {/* Status tabs */}
      {bookings.length > 0 && (
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                tab === t.key
                  ? 'volcanic-gradient text-on-primary'
                  : 'bg-surface-container border border-[rgba(86,67,58,0.12)] text-on-surface-variant/50 hover:text-on-surface'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(b => (
            <BookingCard key={b.id} booking={b} onReject={handleReject} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-surface-container rounded-3xl border border-[rgba(86,67,58,0.1)]">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block">calendar_month</span>
          <p className="text-on-surface-variant text-sm">
            {tab ? 'Nenhum agendamento neste estado' : 'Ainda não fizeste nenhum pedido de agendamento'}
          </p>
        </div>
      )}
    </div>
  )
}
