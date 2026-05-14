import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { getLoggedUserProfile, getUserProfileByUsername } from '@/lib/supabase/profile'
import {
  getSpacesByOwner,
  getServicesBySpaceIds,
  type ProfessionalSpace,
  type ProfessionalService,
} from '@/lib/supabase/professional-spaces'

function getLocation(space: ProfessionalSpace): string | null {
  const loc = space.location_space as Record<string, string> | null
  if (!loc) return null
  return loc.city ?? loc.address ?? loc.neighborhood ?? null
}

function formatHours(space: ProfessionalSpace): string | null {
  if (!space.time_in || !space.time_out) return null
  return `${space.time_in.slice(0, 5)} – ${space.time_out.slice(0, 5)}`
}

export default async function ProPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const [profile, loggedUser] = await Promise.all([
    getUserProfileByUsername(username),
    getLoggedUserProfile(),
  ])

  if (!profile) notFound()

  const isOwner = loggedUser?.id === profile.id

  const spaces = await getSpacesByOwner(profile.id)
  const spaceIds = spaces.map((s) => s.id)
  const services = await getServicesBySpaceIds(spaceIds)

  const primarySpace = spaces[0] ?? null

  const servicesBySpace = spaces.reduce<Record<string, ProfessionalService[]>>((acc, sp) => {
    acc[sp.id] = services.filter((s) => s.professional_space_id === sp.id)
    return acc
  }, {})

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary min-h-screen flex">
      {/* ── Left Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0e0e0e] flex flex-col z-50">
        <div className="px-8 pt-8 pb-4 flex-shrink-0">
          <img src="/barza_logo.png" alt="Barza Logo" className="h-10 w-auto mb-3" style={{ mixBlendMode: 'screen' }} />
          <p className="text-[0.6875rem] font-label tracking-widest uppercase opacity-50">Perfil Pro</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-y-1 pb-2">
          <Link
            href="/community"
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">home</span>
            <span>Home</span>
          </Link>
          <Link
            href="/community/profile"
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">person</span>
            <span>Perfil</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">event</span>
            <span>Agenda</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">local_mall</span>
            <span>Shop</span>
          </a>
        </nav>

        {isOwner && (
          <div className="flex-shrink-0 px-4 pb-6 pt-4 border-t border-white/5 flex flex-col gap-3">
            <Link
              href="/community?action=post"
              className="w-full volcanic-gradient text-on-primary py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(255,145,86,0.3)] active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Criar Post</span>
            </Link>
          </div>
        )}
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="ml-64 mr-80 flex-1 min-h-screen p-6 lg:p-8 space-y-12">

        {/* Hero Section */}
        <section className="relative h-[400px] sm:h-[480px] rounded-[2rem] overflow-hidden group bg-surface-container">
          {primarySpace?.logo ? (
            <img
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt={primarySpace.space_name}
              src={primarySpace.logo}
            />
          ) : (
            <div className="absolute inset-0 volcanic-gradient opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              {primarySpace && (
                <div className="flex items-center gap-3 px-4 py-1.5 bg-black/40 backdrop-blur-sm w-fit rounded-full border border-white/10">
                  <span
                    className="material-symbols-outlined text-primary-container text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white">
                    {primarySpace.available ? 'Disponível' : 'Espaço Profissional'}
                  </span>
                </div>
              )}

              <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] font-headline leading-none text-white drop-shadow-2xl">
                {primarySpace?.space_name ?? profile.full_name}
              </h1>

              {profile.profession && (
                <p className="text-base text-primary-container font-medium tracking-tight">
                  {profile.profession}
                </p>
              )}

              <div className="flex gap-8 pt-4">
                {primarySpace?.rate != null && (
                  <div className="flex flex-col">
                    <span className="text-xl font-bold font-headline text-white">{primarySpace.rate.toFixed(1)}</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium flex items-center gap-1">
                      Rating
                      <span className="material-symbols-outlined text-[10px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </span>
                  </div>
                )}
                {spaces.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-xl font-bold font-headline text-white">{spaces.length}</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">Espaços</span>
                  </div>
                )}
                {services.length > 0 && (
                  <div className="flex flex-col">
                    <span className="text-xl font-bold font-headline text-white">{services.length}</span>
                    <span className="text-[10px] uppercase tracking-widest text-white/60 font-medium">Serviços</span>
                  </div>
                )}
              </div>
            </div>

            {!isOwner && (
              <div className="flex flex-col sm:flex-row gap-4">
                {primarySpace?.phone && (
                  <a
                    href={`tel:${primarySpace.phone}`}
                    className="px-8 py-3 volcanic-gradient rounded-full text-on-primary font-bold tracking-tight active:scale-95 transition-transform text-sm"
                  >
                    Ligar Agora
                  </a>
                )}
                <button className="px-8 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-white font-bold tracking-tight active:scale-95 transition-transform text-sm hover:bg-black/60">
                  Mensagem
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Owner Management Bar */}
        {isOwner && (
          <section className="flex flex-col md:flex-row items-center justify-between p-1 bg-surface-container-high rounded-2xl border border-outline-variant/10">
            <div className="px-6 py-4 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary-container">admin_panel_settings</span>
              <span className="text-sm font-semibold tracking-tight text-on-surface">Painel do Proprietário</span>
            </div>
            <div className="flex gap-2 p-2">
              <Link
                href="/community/market-insights"
                className="px-6 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">insights</span>
                Métricas
              </Link>
              <Link
                href="/profile/create-page"
                className="px-6 py-2 rounded-xl bg-primary-container/10 border border-primary-container/20 text-sm font-bold text-primary-container hover:bg-primary-container/20 transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add_business</span>
                Novo Espaço
              </Link>
            </div>
          </section>
        )}

        {/* Spaces list (when user has multiple) */}
        {spaces.length > 1 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-extrabold tracking-tight font-headline">Todos os Espaços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {spaces.map((space) => (
                <SpaceCard key={space.id} space={space} services={servicesBySpace[space.id] ?? []} />
              ))}
            </div>
          </section>
        )}

        {/* Services Section */}
        {services.length > 0 ? (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight font-headline">Serviços</h2>
              <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/40">
                {services.length} {services.length === 1 ? 'serviço' : 'serviços'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-6">
            <h2 className="text-2xl font-extrabold tracking-tight font-headline">Serviços</h2>
            <div className="text-center py-12 bg-surface-container rounded-3xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-3 block">content_cut</span>
              <p className="text-on-surface-variant text-sm">Nenhum serviço publicado ainda</p>
            </div>
          </section>
        )}

        {/* Space info card (primary space details) */}
        {primarySpace && (
          <section className="space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tight font-headline">Informações</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getLocation(primarySpace) && (
                <InfoTile icon="location_on" label="Localização" value={getLocation(primarySpace)!} />
              )}
              {primarySpace.phone && (
                <InfoTile icon="phone" label="Telefone" value={primarySpace.phone} />
              )}
              {formatHours(primarySpace) && (
                <InfoTile icon="schedule" label="Horário" value={formatHours(primarySpace)!} />
              )}
              {primarySpace.beauty_services && (
                <InfoTile icon="spa" label="Serviços" value={primarySpace.beauty_services} />
              )}
              <InfoTile
                icon={primarySpace.available ? 'check_circle' : 'cancel'}
                label="Estado"
                value={primarySpace.available ? 'A aceitar reservas' : 'Indisponível'}
              />
            </div>
          </section>
        )}
      </main>

      {/* ── Right Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-80 h-screen fixed right-0 top-0 bg-[#0e0e0e] border-l border-white/5 p-6 z-40 overflow-y-auto">
        {/* Profile card */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <Avatar name={profile.full_name} avatarUrl={profile.avatar_url} textSize="text-sm" />
          </div>
          <div>
            <p className="text-sm font-bold">{profile.full_name}</p>
            {profile.profession && (
              <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-widest">{profile.profession}</p>
            )}
          </div>
        </div>

        {/* My Spaces */}
        <div className="mb-8">
          <p className="text-[9px] font-label tracking-[0.2em] uppercase text-on-surface-variant/30 mb-3">
            {isOwner ? 'Meus Espaços' : 'Espaços'}
          </p>
          {spaces.length > 0 ? (
            <div className="flex flex-col gap-y-1 mb-4">
              {spaces.map((space) => (
                <div
                  key={space.id}
                  className="flex items-center gap-3 px-3 py-2.5 text-primary-container bg-primary-container/5 border border-primary-container/20 font-label text-sm tracking-wide uppercase rounded-xl"
                >
                  {space.logo ? (
                    <img src={space.logo} alt={space.space_name} className="w-5 h-5 rounded-md object-cover flex-shrink-0" />
                  ) : (
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                  )}
                  <span className="truncate flex-1 text-xs">{space.space_name}</span>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${space.available ? 'bg-green-500' : 'bg-on-surface-variant/30'}`} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant/40 mb-3">Nenhum espaço criado</p>
          )}
          {isOwner && (
            <Link
              href="/profile/create-page"
              className="w-full border border-primary-container/40 text-primary-container py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container/10 transition-all text-xs tracking-wide uppercase"
            >
              <span className="material-symbols-outlined text-sm">add_business</span>
              <span>Criar Espaço</span>
            </Link>
          )}
        </div>

        {/* Profile bio */}
        {profile.bio && (
          <div className="mb-8 pb-6 border-b border-white/5">
            <p className="text-[9px] font-label tracking-[0.2em] uppercase text-on-surface-variant/30 mb-3">Bio</p>
            <p className="text-xs text-on-surface-variant/70 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Since date */}
        <div className="text-center py-6 border-t border-white/5">
          <p className="text-[10px] font-label uppercase tracking-widest opacity-40 mb-1">Membro desde</p>
          <p className="text-xs font-bold">
            {profile.created_at
              ? new Date(profile.created_at).toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })
              : '—'}
          </p>
        </div>
      </aside>
    </div>
  )
}

function SpaceCard({
  space,
  services,
}: {
  space: ProfessionalSpace
  services: ProfessionalService[]
}) {
  const loc = space.location_space as Record<string, string> | null
  const city = loc?.city ?? loc?.address ?? null
  const hours =
    space.time_in && space.time_out
      ? `${space.time_in.slice(0, 5)} – ${space.time_out.slice(0, 5)}`
      : null

  return (
    <div className="group p-6 bg-surface-container rounded-3xl border border-outline-variant/10 hover:border-primary-container/20 transition-colors space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center overflow-hidden flex-shrink-0">
          {space.logo ? (
            <img src={space.logo} alt={space.space_name} className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl">store</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base truncate">{space.space_name}</h3>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${space.available ? 'bg-green-500' : 'bg-on-surface-variant/30'}`} />
          </div>
          {city && <p className="text-xs text-on-surface-variant/60 mt-0.5">{city}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">
        {space.rate != null && (
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[11px] text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            {space.rate.toFixed(1)}
          </span>
        )}
        {hours && <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[11px]">schedule</span>{hours}</span>}
        {services.length > 0 && <span>{services.length} {services.length === 1 ? 'serviço' : 'serviços'}</span>}
      </div>

      {space.beauty_services && (
        <p className="text-xs text-on-surface-variant/60 line-clamp-1">{space.beauty_services}</p>
      )}
    </div>
  )
}

function ServiceCard({ service }: { service: ProfessionalService }) {
  const hasPromo = service.preco_promocional != null && service.preco_promocional < service.price

  return (
    <div className="group relative p-6 bg-surface-container rounded-3xl border border-outline-variant/10 hover:border-primary-container/20 transition-colors overflow-hidden space-y-3">
      <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
        <span className="material-symbols-outlined text-7xl text-primary-container">content_cut</span>
      </div>
      <div className="relative z-10 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base leading-tight">{service.service_name}</h3>
          {service.category && (
            <span className="text-[9px] font-label uppercase tracking-widest bg-primary-container/10 text-primary-container px-2 py-1 rounded-full flex-shrink-0">
              {service.category}
            </span>
          )}
        </div>
        {service.description && (
          <p className="text-xs text-on-surface-variant/70 leading-relaxed line-clamp-2">{service.description}</p>
        )}
        <div className="flex items-center gap-5 pt-1">
          <div className="flex items-center gap-1.5">
            {hasPromo ? (
              <>
                <span className="font-bold text-primary-container">{service.preco_promocional?.toLocaleString('pt-AO')} Kz</span>
                <span className="text-xs text-on-surface-variant/40 line-through">{service.price.toLocaleString('pt-AO')} Kz</span>
              </>
            ) : (
              <span className="font-bold text-on-surface">{service.price.toLocaleString('pt-AO')} Kz</span>
            )}
          </div>
          {service.duration_minutes > 0 && (
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 flex items-center gap-1">
              <span className="material-symbols-outlined text-[11px]">schedule</span>
              {service.duration_minutes} min
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoTile({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-surface-container rounded-2xl border border-outline-variant/10">
      <span className="material-symbols-outlined text-primary-container text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/40 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-on-surface">{value}</p>
      </div>
    </div>
  )
}
