'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShareModal } from '@/components/ShareModal'
import type { ServiceWithSpace } from '@/lib/supabase/professional-spaces'


function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3_600_000)
  const d = Math.floor(h / 24)
  if (h < 1) return 'agora'
  if (h < 24) return `${h}h atrás`
  return `${d}d atrás`
}

function getLocation(location: Record<string, any> | null | undefined): string {
  if (!location) return 'Angola'
  return location.city || location.province || location.municipio || location.address || 'Angola'
}

export function ProfessionalSpaceCard({ service }: { service: ServiceWithSpace }) {
  const space = service.professional_space
  const location = getLocation(space.location_space)
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <article className="bg-surface-container rounded-3xl overflow-hidden shadow-[0_40px_60px_-15px_rgba(255,255,255,0.04)] border-t border-primary/20">

      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <Link href={`/community/space/${space.id}`} className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-high ring-2 ring-transparent group-hover:ring-primary-container/40 transition-all">
            {space.logo ? (
              <img src={space.logo} alt={space.space_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full volcanic-gradient flex items-center justify-center font-display font-black text-on-primary text-lg">
                {space.space_name[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-sm text-on-surface group-hover:text-primary-container transition-colors">{space.space_name}</h3>
              <span className="material-symbols-outlined text-[16px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            <p className="text-xs text-on-surface-variant opacity-60">{location} • {timeAgo(space.created_at)}</p>
          </div>
        </Link>
        <button className="material-symbols-outlined opacity-50 hover:opacity-100 transition-opacity text-on-surface">more_horiz</button>
      </div>

      {/* Image + CTAs */}
      <div className="relative aspect-square w-full bg-surface-container-highest overflow-hidden">
        {service.image ? (
          <img
            src={service.image}
            alt={service.service_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-on-surface-variant/25">
            <span className="material-symbols-outlined text-5xl">hide_image</span>
            <p className="text-[10px] font-label uppercase tracking-widest">Imagem não disponível</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-widest text-primary-container font-bold mb-0.5">{service.category}</p>
            <p className="text-white font-bold text-lg leading-tight">{service.service_name}</p>
            <p className="text-white/70 text-sm">{service.duration_minutes}min · {service.price.toLocaleString('pt-AO')} Kz</p>
          </div>
          <div className="flex gap-4 w-full">
            <button className="flex-1 volcanic-gradient text-on-primary py-3 rounded-xl font-bold active:scale-95 transition-all text-sm">
              Agendar Agora
            </button>
            <Link
              href={`/community/space/${space.id}`}
              className="flex-1 bg-surface-variant/80 backdrop-blur-md text-on-surface py-3 rounded-xl font-bold border-t border-white/10 active:scale-95 transition-all text-sm text-center"
            >
              Ver Perfil
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 hover:text-primary-container transition-colors text-on-surface/60">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <button className="flex items-center gap-2 hover:text-primary-container transition-colors text-on-surface/60">
            <span className="material-symbols-outlined">mode_comment</span>
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-2 hover:text-primary-container transition-colors text-on-surface/60"
            aria-label="Partilhar serviço"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
        </div>
        <button className="material-symbols-outlined hover:text-primary-container transition-colors text-on-surface/60">bookmark</button>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`${service.service_name} — ${space.space_name}`}
        description={service.description ?? `${service.duration_minutes}min · ${service.price.toLocaleString('pt-AO')} Kz · ${location}`}
        imageUrl={space.logo ?? undefined}
        shareUrl={typeof window !== 'undefined' ? `${window.location.origin}/community` : ''}
        category={service.category}
      />
    </article>
  )
}
