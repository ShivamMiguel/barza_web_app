import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { getLoggedUserProfile, getUserProfileById } from '@/lib/supabase/profile'
import {
  getSpaceById,
  getServicesBySpaceIds,
  type ProfessionalSpace,
  type ProfessionalService,
} from '@/lib/supabase/professional-spaces'

export const dynamic = 'force-dynamic'

function getLocation(space: ProfessionalSpace): { city?: string; address?: string; neighborhood?: string } {
  const loc = space.location_space as Record<string, string> | null
  if (!loc) return {}
  return {
    city: loc.city,
    address: loc.address,
    neighborhood: loc.neighborhood,
  }
}

function formatHours(space: ProfessionalSpace): string | null {
  if (!space.time_in || !space.time_out) return null
  return `${space.time_in.slice(0, 5)} – ${space.time_out.slice(0, 5)}`
}

function parseServices(text?: string | null): string[] {
  if (!text) return []
  return text.split(',').map(s => s.trim()).filter(Boolean)
}

export default async function SpacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [space, loggedUser] = await Promise.all([
    getSpaceById(id),
    getLoggedUserProfile(),
  ])

  if (!space) notFound()

  const isOwner = loggedUser?.id === space.owner

  const [services, owner] = await Promise.all([
    getServicesBySpaceIds([space.id]),
    getUserProfileById(space.owner),
  ])

  const loc = getLocation(space)
  const locationParts = [loc.neighborhood, loc.city].filter(Boolean).join(', ')
  const hours = formatHours(space)
  const beautyCategories = parseServices(space.beauty_services)

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Back */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-on-surface-variant/60 hover:text-on-surface transition-colors text-xs font-label uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Comunidade
        </Link>

        {/* ── Hero Card ───────────────────────────────────────────────── */}
        <div className="liquid-obsidian-glass refractive-highlight glow-bloom rounded-3xl border border-[rgba(86,67,58,0.1)] overflow-hidden">
          {/* Cover */}
          <div
            className="h-32 sm:h-44 relative"
            style={{ background: 'linear-gradient(135deg, rgba(255,145,86,0.15) 0%, rgba(255,71,87,0.06) 100%)' }}
          >
            {space.logo && (
              <img
                src={space.logo}
                alt={space.space_name}
                className="w-full h-full object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111]/80" />
          </div>

          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            {/* Logo + actions */}
            <div className="-mt-12 sm:-mt-14 mb-4 flex items-end justify-between gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#111] bg-surface-container flex items-center justify-center flex-shrink-0">
                {space.logo ? (
                  <img src={space.logo} alt={space.space_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl">store</span>
                )}
              </div>

              <div className="pb-1 flex items-center gap-2">
                {/* Availability badge */}
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-label uppercase tracking-widest font-bold ${
                    space.available
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-on-surface-variant/10 text-on-surface-variant/50 border border-outline-variant/20'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${space.available ? 'bg-green-400' : 'bg-on-surface-variant/30'}`} />
                  {space.available ? 'Disponível' : 'Indisponível'}
                </span>

                {isOwner && (
                  <Link
                    href="/community/market-insights"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-container/30 text-primary-container text-[10px] font-label uppercase tracking-widest hover:bg-primary-container/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Gerir
                  </Link>
                )}
              </div>
            </div>

            {/* Name & info */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-on-surface leading-tight">
                {space.space_name}
              </h1>
              {locationParts && (
                <p className="flex items-center gap-1 text-on-surface-variant/60 text-sm mt-1">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {locationParts}
                </p>
              )}
              {beautyCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {beautyCategories.map((cat) => (
                    <span
                      key={cat}
                      className="text-[9px] font-label uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-primary-container/10 text-primary-container"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 border-t border-[rgba(86,67,58,0.12)] pt-5">
              {space.rate != null && (
                <div>
                  <p className="text-xl font-black font-display text-on-surface flex items-center gap-1">
                    {space.rate.toFixed(1)}
                    <span className="material-symbols-outlined text-base text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </p>
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60 mt-0.5">Avaliação</p>
                </div>
              )}
              {services.length > 0 && (
                <div>
                  <p className="text-xl font-black font-display text-on-surface">{services.length}</p>
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60 mt-0.5">
                    {services.length === 1 ? 'Serviço' : 'Serviços'}
                  </p>
                </div>
              )}
              {hours && (
                <div>
                  <p className="text-base font-black font-display text-on-surface">{hours}</p>
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60 mt-0.5">Horário</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Contact / Info ───────────────────────────────────────────── */}
        {(space.phone || loc.address || loc.city) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {space.phone && (
              <a
                href={`tel:${space.phone}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.1)] hover:border-primary-container/30 transition-colors group"
              >
                <span className="material-symbols-outlined text-primary-container text-xl">phone</span>
                <div>
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/40 mb-0.5">Telefone</p>
                  <p className="text-sm font-semibold text-on-surface group-hover:text-primary-container transition-colors">{space.phone}</p>
                </div>
              </a>
            )}
            {(loc.address || loc.city) && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.1)]">
                <span className="material-symbols-outlined text-primary-container text-xl">location_on</span>
                <div>
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/40 mb-0.5">Endereço</p>
                  <p className="text-sm font-semibold text-on-surface">{loc.address ?? loc.city}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Services ────────────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40 mb-5">
            Serviços
          </p>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface-container rounded-3xl border border-[rgba(86,67,58,0.1)]">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3 block">content_cut</span>
              <p className="text-on-surface-variant text-sm">Nenhum serviço publicado</p>
            </div>
          )}
        </div>

        {/* ── Owner ───────────────────────────────────────────────────── */}
        {owner && (
          <div>
            <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40 mb-4">
              Proprietário
            </p>
            <Link
              href={isOwner ? '/community/profile' : `/community/profile/${owner.id}`}
              className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.1)] hover:border-primary-container/30 transition-colors group w-fit"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-container/20 flex-shrink-0">
                <Avatar name={owner.full_name} avatarUrl={owner.avatar_url} textSize="text-sm" />
              </div>
              <div>
                <p className="font-bold text-sm text-on-surface group-hover:text-primary-container transition-colors">
                  {owner.full_name}
                </p>
                {owner.profession && (
                  <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 mt-0.5">
                    {owner.profession}
                  </p>
                )}
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/30 text-sm ml-2 group-hover:text-primary-container/60 transition-colors">
                chevron_right
              </span>
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

function ServiceCard({ service }: { service: ProfessionalService }) {
  const hasPromo = service.preco_promocional != null && service.preco_promocional < service.price

  return (
    <div className="group flex flex-col gap-3 p-5 rounded-2xl bg-surface-container border border-[rgba(86,67,58,0.1)] hover:border-primary-container/20 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-sm text-on-surface leading-tight">{service.service_name}</h3>
        {service.category && (
          <span className="text-[9px] font-label uppercase tracking-widest bg-primary-container/10 text-primary-container px-2 py-0.5 rounded-full flex-shrink-0">
            {service.category}
          </span>
        )}
      </div>

      {service.description && (
        <p className="text-xs text-on-surface-variant/60 leading-relaxed line-clamp-2">{service.description}</p>
      )}

      <div className="flex items-center gap-4 mt-auto pt-1">
        <div className="flex items-center gap-2">
          {hasPromo ? (
            <>
              <span className="font-bold text-sm text-primary-container">{service.preco_promocional?.toLocaleString('pt-AO')} Kz</span>
              <span className="text-xs text-on-surface-variant/40 line-through">{service.price.toLocaleString('pt-AO')} Kz</span>
            </>
          ) : (
            <span className="font-bold text-sm text-on-surface">{service.price.toLocaleString('pt-AO')} Kz</span>
          )}
        </div>
        {service.duration_minutes > 0 && (
          <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 flex items-center gap-1 ml-auto">
            <span className="material-symbols-outlined text-[11px]">schedule</span>
            {service.duration_minutes} min
          </span>
        )}
      </div>
    </div>
  )
}
