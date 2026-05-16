'use client'

import { useState } from 'react'
import { Avatar } from '@/components/Avatar'
import type { BookingWithClient } from '@/lib/supabase/bookings'

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
  onStatusChange,
}: {
  booking: BookingWithClient
  onStatusChange: (id: string, status: string) => void
}) {
  const [loading, setLoading] = useState<'confirm' | 'cancel' | null>(null)
  const cfg = statusCfg(booking.status)
  const clientName = booking.profiles?.full_name ?? 'Cliente'
  const serviceName = booking.professional_services?.service_name ?? '—'

  async function update(status: string, action: 'confirm' | 'cancel') {
    setLoading(action)
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) onStatusChange(booking.id, status)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.1)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[rgba(86,67,58,0.08)]">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <Avatar name={clientName} avatarUrl={booking.profiles?.avatar_url ?? null} textSize="text-xs" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-on-surface truncate">{clientName}</p>
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

      {/* Actions */}
      {(booking.status === 'pending' || booking.status === 'accepted') && (
        <div className="flex gap-2 px-4 pb-4">
          {booking.status === 'pending' && (
            <button
              disabled={!!loading}
              onClick={() => update('accepted', 'confirm')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-colors disabled:opacity-40"
            >
              {loading === 'confirm' ? (
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-sm">check</span>
              )}
              Aceitar
            </button>
          )}
          {booking.status === 'accepted' && (
            <button
              disabled={!!loading}
              onClick={() => update('completed', 'confirm')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-colors disabled:opacity-40"
            >
              {loading === 'confirm' ? (
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-sm">task_alt</span>
              )}
              Concluído
            </button>
          )}
          <button
            disabled={!!loading}
            onClick={() => update('rejected', 'cancel')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400/80 text-xs font-bold hover:bg-red-500/20 transition-colors disabled:opacity-40"
          >
            {loading === 'cancel' ? (
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-sm">close</span>
            )}
            Recusar
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  initialBookings: BookingWithClient[]
}

export function SpaceBookingsSection({ initialBookings }: Props) {
  const [bookings, setBookings] = useState(initialBookings)
  const [tab, setTab] = useState('')

  const pending = bookings.filter(b => b.status === 'pending').length

  function handleStatusChange(id: string, status: string) {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const filtered = tab ? bookings.filter(b => b.status === tab) : bookings

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40">
            Agendamentos <span className="text-on-surface-variant/25">({bookings.length})</span>
          </p>
          {pending > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-[8px] font-black text-black">
              {pending}
            </span>
          )}
        </div>
      </div>

      {/* Status tabs */}
      {bookings.length > 0 && (
        <div className="flex gap-1 mb-4 overflow-x-auto pb-1 scrollbar-none">
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
              {t.key === 'pending' && pending > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-400/30 text-amber-400 text-[7px]">
                  {pending}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(b => (
            <BookingCard key={b.id} booking={b} onStatusChange={handleStatusChange} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-surface-container rounded-3xl border border-[rgba(86,67,58,0.1)]">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block">calendar_month</span>
          <p className="text-on-surface-variant text-sm">
            {tab ? 'Nenhum agendamento neste estado' : 'Ainda não tens agendamentos'}
          </p>
        </div>
      )}
    </div>
  )
}
