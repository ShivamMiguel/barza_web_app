'use client'

import { useState, useEffect, useCallback } from 'react'
import { ServiceModal } from '@/components/ServiceModal'
import type { ProfessionalService, ProfessionalSpace } from '@/lib/supabase/professional-spaces'

const DIVIDER = 'border-[rgba(86,67,58,0.12)]'

function formatPrice(n: number) {
  return n.toLocaleString('pt-AO') + ' Kz'
}

interface ServiceCardProps {
  service: ProfessionalService
  spaceName: string
  onEdit: () => void
  onDelete: () => void
  deleting: boolean
  isOwner: boolean
}

function ServiceCard({ service, spaceName, onEdit, onDelete, deleting, isOwner }: ServiceCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <div className="group rounded-2xl overflow-hidden border border-[rgba(86,67,58,0.1)] hover:border-primary-container/25 bg-surface-container transition-colors">
      {/* Image */}
      <div className="relative bg-surface-container-high overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {service.image ? (
          <img src={service.image} alt={service.service_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
            <span className="material-symbols-outlined text-5xl">content_cut</span>
          </div>
        )}
        {/* Active badge — only shown to owner */}
        {isOwner && (
          <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${service.is_active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-surface-container/80 text-on-surface-variant/50 border border-[rgba(86,67,58,0.2)]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${service.is_active ? 'bg-green-400' : 'bg-on-surface-variant/40'}`} />
            {service.is_active ? 'Activo' : 'Inactivo'}
          </div>
        )}
        {/* Actions overlay — only for owner */}
        {isOwner && (
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            {confirmDelete ? (
              <button
                onClick={onDelete}
                disabled={deleting}
                className="px-2 h-8 rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white text-[10px] font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> : 'Confirmar'}
              </button>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500/60 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="text-[9px] font-label uppercase tracking-widest text-primary-container mb-1">{service.category} · {spaceName}</p>
        <p className="font-bold text-sm text-on-surface leading-snug truncate">{service.service_name}</p>

        <div className="flex items-center justify-between mt-2">
          <div>
            {service.preco_promocional ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-primary-container">{formatPrice(service.preco_promocional)}</span>
                <span className="text-[10px] text-on-surface-variant/40 line-through">{formatPrice(service.price)}</span>
              </div>
            ) : (
              <span className="text-xs font-black text-on-surface">{formatPrice(service.price)}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant/50">
            <span className="material-symbols-outlined text-[13px]">schedule</span>
            <span className="text-[10px] font-label">{service.duration_minutes}min</span>
          </div>
        </div>

        {service.description && (
          <p className="text-xs text-on-surface-variant/50 mt-2 leading-relaxed line-clamp-2">{service.description}</p>
        )}
      </div>
    </div>
  )
}

interface Props {
  spaces: ProfessionalSpace[]
  initialServices: ProfessionalService[]
  isOwner?: boolean
}

export function ServicesSection({ spaces, initialServices, isOwner = true }: Props) {
  const [services, setServices] = useState<ProfessionalService[]>(initialServices)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<ProfessionalService | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const spaceMap = Object.fromEntries(spaces.map(s => [s.id, s.space_name]))

  const openCreate = () => { setEditingService(null); setModalOpen(true) }
  const openEdit = (svc: ProfessionalService) => { setEditingService(svc); setModalOpen(true) }

  const handleSaved = useCallback((saved: ProfessionalService) => {
    setServices(prev => {
      const idx = prev.findIndex(s => s.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [saved, ...prev]
    })
  }, [])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/users/me/services/${id}`, { method: 'DELETE' })
      if (res.ok) setServices(prev => prev.filter(s => s.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  if (spaces.length === 0 && isOwner) {
    return (
      <div>
        <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40 mb-5">Serviços</p>
        <div className="text-center py-10 bg-surface-container rounded-3xl border border-[rgba(86,67,58,0.1)]">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block">content_cut</span>
          <p className="text-on-surface-variant text-sm">Cria um espaço profissional para adicionar serviços</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-5">
          <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40">
            Serviços <span className="text-on-surface-variant/25">({services.length})</span>
          </p>
          {isOwner && (
            <button
              onClick={openCreate}
              className="flex items-center gap-1 text-[10px] font-label uppercase tracking-widest text-primary-container hover:underline"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Adicionar
            </button>
          )}
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map(svc => (
              <ServiceCard
                key={svc.id}
                service={svc}
                spaceName={spaceMap[svc.professional_space_id] ?? '—'}
                onEdit={() => openEdit(svc)}
                onDelete={() => handleDelete(svc.id)}
                deleting={deletingId === svc.id}
                isOwner={isOwner}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-surface-container rounded-3xl border border-[rgba(86,67,58,0.1)]">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block">content_cut</span>
            <p className="text-on-surface-variant text-sm mb-4">
              {isOwner ? 'Ainda não tens serviços' : 'Nenhum serviço publicado'}
            </p>
            {isOwner && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full volcanic-gradient text-on-primary text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Criar Serviço
              </button>
            )}
          </div>
        )}
      </div>

      {isOwner && (
        <ServiceModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          spaces={spaces}
          service={editingService}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
