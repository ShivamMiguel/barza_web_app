'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Avatar } from '@/components/Avatar'
import { CommunityContext } from '@/lib/community-context'
import { useProfile, useTrendingPros, useMarketInsights, useMySpaces } from '@/hooks/api'

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const { data: userProfile, isLoading: loadingProfile } = useProfile()
  const { data: trendingPros = [], isLoading: loadingTrending } = useTrendingPros(3)
  const { data: marketInsightsRaw, isLoading: loadingInsights } = useMarketInsights()
  const { data: mySpacesData } = useMySpaces()
  const mySpaces = mySpacesData?.spaces ?? []
  const marketInsights = marketInsightsRaw as any ?? null
  const isLoadingChrome = loadingProfile || loadingTrending || loadingInsights

  const navItems = [
    { href: '/community', icon: 'dynamic_feed', label: 'Feed', exact: true },
    { href: '/community/market-insights', icon: 'insights', label: 'Market Insights', exact: true },
    { href: '#', icon: 'event', label: 'Agenda', exact: false },
    { href: '#', icon: 'local_mall', label: 'Shop', exact: false },
  ]

  function isActive(item: { href: string; exact: boolean }) {
    if (item.href === '#') return false
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  return (
    <CommunityContext.Provider value={{ userProfile: userProfile ?? null, marketInsights, isLoadingChrome }}>
      <div className="bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary min-h-screen flex flex-col lg:flex-row">

        {/* Mobile Top App Bar */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-[#ff9156]/20 shadow-[0_40px_60px_-15px_rgba(255,255,255,0.04)] flex justify-between items-center px-6 h-16">
          <h1 className="text-2xl font-bold tracking-tighter text-[#ff9156] font-display">Barza</h1>
          <div className="flex items-center gap-4">
            <button className="active:scale-95 duration-200 text-on-surface/60 hover:text-[#ff9156] transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="active:scale-95 duration-200 text-on-surface/60 hover:text-[#ff9156] transition-colors">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </header>

        {/* Left Sidebar */}
        <aside className="hidden lg:flex lg:h-screen lg:w-64 lg:fixed lg:left-0 lg:top-0 bg-[#0e0e0e] lg:flex-col z-50">
          <div className="px-8 pt-8 pb-4 flex-shrink-0">
            <img src="/barza_logo.png" alt="Barza Logo" className="h-10 w-auto mb-3" style={{ mixBlendMode: 'screen' }} />
            <p className="text-[0.6875rem] font-label tracking-widest uppercase opacity-50">Community</p>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-y-1 pb-2">
            {navItems.map((item) => {
              const active = isActive(item)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 font-label text-sm tracking-wide uppercase transition-all rounded-xl group ${
                    active
                      ? 'text-primary-container border-r-2 border-primary-container bg-primary-container/5'
                      : 'text-on-surface/60 hover:text-on-surface hover:bg-[#201f1f]'
                  }`}
                >
                  <span
                    className="material-symbols-outlined transition-transform group-active:scale-95"
                    style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              )
            })}

            <p className="px-4 pt-5 pb-1 text-[9px] font-label tracking-[0.2em] uppercase text-on-surface-variant/30">My Pages</p>
            {mySpaces.length > 0 ? mySpaces.map((space) => (
              <Link
                key={space.id}
                href={`/community/space/${space.id}`}
                className="flex items-center gap-3 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
              >
                {space.logo ? (
                  <img src={space.logo} alt={space.space_name} className="w-5 h-5 rounded-md object-cover flex-shrink-0" />
                ) : (
                  <span className="material-symbols-outlined text-[18px] transition-transform group-active:scale-95">store</span>
                )}
                <span className="truncate flex-1">{space.space_name}</span>
                {space.available && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                )}
              </Link>
            )) : (
              <p className="px-4 py-2 text-[10px] text-on-surface-variant/30 font-label">
                Nenhum espaço criado
              </p>
            )}
          </nav>

          <div className="flex-shrink-0 px-4 pb-4 pt-4 border-t border-white/5 flex flex-col gap-3">
            <Link
              href="/profile/create-page"
              className="w-full border border-primary-container/40 text-primary-container py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container/10 transition-all text-sm"
            >
              <span className="material-symbols-outlined text-sm">add_business</span>
              <span>Create Page</span>
            </Link>
            <Link
              href="/community/profile"
              className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-[#201f1f] transition-all group border-t border-white/5 pt-3"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#ff9156]/40 flex-shrink-0">
                <Avatar name={userProfile?.full_name || 'User'} avatarUrl={userProfile?.avatar_url} textSize="text-xs" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface group-hover:text-[#ff9156] transition-colors truncate">
                  {userProfile?.full_name || 'Loading...'}
                </p>
                <p className="text-[10px] text-on-surface-variant/50 font-label uppercase tracking-widest">
                  {userProfile?.profession || 'User'}
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/30 text-sm group-hover:text-[#ff9156]/60 transition-colors">
                chevron_right
              </span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:ml-64 xl:mr-80 min-h-screen bg-surface-container-lowest">
          {children}
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block xl:w-80 xl:h-screen xl:fixed xl:right-0 xl:top-0 bg-[#0e0e0e] border-l border-white/5 p-6 overflow-y-auto">
          <div className="mb-10">
            <div className="relative group mb-6">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-container">
                search
              </span>
              <input
                className="w-full bg-surface-container-lowest border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary-container/40 text-sm placeholder:text-on-surface-variant/40"
                placeholder="Search Barza..."
                type="text"
              />
            </div>
          </div>

          <section className="mb-10">
            <h3 className="text-[10px] font-label uppercase tracking-[0.2em] opacity-40 mb-6">Trending Professionals</h3>
            <div className="space-y-6">
              {trendingPros.length === 0 && !isLoadingChrome && (
                <p className="text-[10px] text-on-surface-variant/40 font-label uppercase tracking-widest">
                  Nenhuma avaliação ainda
                </p>
              )}
              {trendingPros.map((pro) => (
                <Link
                  key={pro.space_id}
                  href={`/community/space/${pro.space_id}`}
                  className="flex items-center gap-4 group hover:opacity-80 transition-opacity"
                >
                  {pro.logo ? (
                    <img src={pro.logo} alt={pro.space_name} className="w-12 h-12 rounded-2xl object-cover flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary-container/30 transition-all" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl volcanic-gradient flex items-center justify-center flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary-container/30 transition-all">
                      <span className="text-white font-bold text-sm">{pro.space_name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate group-hover:text-primary-container transition-colors">{pro.space_name}</p>
                    <p className="text-[10px] text-on-surface-variant opacity-60 truncate">{pro.top_category ?? 'Profissional'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className="text-[10px] font-bold text-primary-container">{pro.avg_stars.toFixed(1)}★</span>
                    <span className="text-[9px] text-on-surface-variant/40">{pro.rating_count} aval.</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-label uppercase tracking-[0.2em] opacity-40">Market Insights</h3>
              {marketInsights && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            </div>
            <div className="bg-surface-container rounded-2xl p-5 border-t border-white/5">
              {marketInsights ? (() => {
                const mi = marketInsights.market_insights ?? {}
                const interp = marketInsights.interpretation ?? {}
                const uc = marketInsights.user_context
                const hours: { hour: string; demand: number }[] = mi.peak_demand_hours ?? []
                const top = [...hours].sort((a, b) => b.demand - a.demand).slice(0, 5)
                const max = Math.max(...top.map(h => h.demand), 1)
                const perf = mi.post_performance

                // Revenue across all zones
                const zones = Object.values(mi.services_by_zone ?? {}) as { total_services: number; total_revenue: number; average_price: number }[]
                const totalRevenue = zones.reduce((s, z) => s + z.total_revenue, 0)
                const totalServices = zones.reduce((s, z) => s + z.total_services, 0)

                // First space name (if any)
                const spaceName = uc?.has_spaces && uc.spaces?.[0]?.space_name

                return (
                  <>
                    {top.length > 0 ? (
                      <>
                        <div className="flex justify-between items-end gap-1.5 h-24 mb-3">
                          {top.map((h, i) => {
                            const pct = Math.round((h.demand / max) * 100)
                            return (
                              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                <div
                                  className="w-full rounded-t-md"
                                  style={{
                                    height: `${Math.max(pct, 8)}%`,
                                    background: i === 0 ? 'linear-gradient(180deg, #ff9156, #ff4757)' : 'rgba(255,145,86,0.2)',
                                  }}
                                />
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex justify-between mb-4">
                          {top.map((h, i) => (
                            <span key={i} className="flex-1 text-center text-[8px] font-label uppercase tracking-widest"
                              style={{ color: i === 0 ? 'rgba(255,145,86,0.8)' : 'rgba(255,255,255,0.2)' }}>
                              {h.hour}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : perf ? (
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { label: 'Posts', value: perf.total_posts },
                          { label: 'Likes', value: perf.total_likes },
                          { label: 'Engage', value: `${perf.engagement_rate}%` },
                        ].map((s, i) => (
                          <div key={i} className="text-center py-3 rounded-xl" style={{ background: 'rgba(255,145,86,0.06)' }}>
                            <p className="text-base font-black" style={{ color: i === 2 ? '#ff9156' : '#fff' }}>{s.value}</p>
                            <p className="text-[8px] uppercase tracking-widest mt-0.5 opacity-40">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="border-t border-white/5 pt-4 space-y-2">
                      {/* Legacy interpretation fields */}
                      {interp.market_status && (
                        <p className="text-xs font-bold leading-snug text-on-surface">
                          {interp.market_status.length > 80 ? interp.market_status.slice(0, 80) + '…' : interp.market_status}
                        </p>
                      )}
                      {interp.growth_signal && (
                        <p className="text-[10px] text-on-surface-variant/50 leading-relaxed">
                          {interp.growth_signal.length > 90 ? interp.growth_signal.slice(0, 90) + '…' : interp.growth_signal}
                        </p>
                      )}
                      {/* New format: show revenue + space */}
                      {!interp.market_status && totalRevenue > 0 && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-[9px] uppercase tracking-widest opacity-40">Receita Total</span>
                          <span className="text-xs font-black" style={{ color: '#ff9156' }}>
                            {totalRevenue.toLocaleString('pt-AO')} Kz
                          </span>
                        </div>
                      )}
                      {!interp.market_status && totalServices > 0 && (
                        <div className="flex items-baseline justify-between">
                          <span className="text-[9px] uppercase tracking-widest opacity-40">Serviços</span>
                          <span className="text-xs font-bold text-on-surface">{totalServices}</span>
                        </div>
                      )}
                      {spaceName && (
                        <p className="text-[9px] uppercase tracking-widest truncate" style={{ color: 'rgba(255,145,86,0.5)' }}>
                          {spaceName}
                        </p>
                      )}
                    </div>
                  </>
                )
              })() : (
                <>
                  <div className="flex justify-between items-end gap-1.5 h-24 mb-3">
                    {[40, 65, 30, 85, 55].map((height, idx) => (
                      <div key={idx} className="flex-1 volcanic-gradient rounded-t-md opacity-30" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <div className="border-t border-white/5 pt-4">
                    <div className="h-3 rounded bg-white/5 mb-2 w-3/4" />
                    <div className="h-2.5 rounded bg-white/5 w-1/2" />
                  </div>
                </>
              )}

              <Link
                href="/community/market-insights"
                className="flex items-center justify-center gap-2 w-full mt-5 py-2.5 rounded-xl border text-[10px] font-label font-bold uppercase tracking-widest transition-all hover:bg-[#ff9156]/10 active:scale-95"
                style={{ borderColor: 'rgba(255,145,86,0.25)', color: '#ff9156' }}
              >
                <span className="material-symbols-outlined text-sm">insights</span>
                Ver todo insight
              </Link>
            </div>
          </section>
        </aside>

        {/* Mobile Bottom Nav */}
        <footer className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 sm:px-4 h-20 bg-[#0e0e0e]/90 backdrop-blur-2xl border-t border-[#ff9156]/10 shadow-[0_-10px_40px_rgba(255,145,86,0.05)]">
          {[
            { href: '/community', icon: 'dynamic_feed', label: 'Feed', exact: true, asLink: true },
            { href: '/community/market-insights', icon: 'insights', label: 'Insights', exact: true, asLink: true },
            { href: '#', icon: 'event', label: 'Agenda', exact: true, asLink: false },
            { href: '#', icon: 'local_mall', label: 'Shop', exact: true, asLink: false },
            { href: '/community/profile', icon: 'person', label: 'Perfil', exact: true, asLink: true },
          ].map(item => {
            const active = item.asLink && (item.exact ? pathname === item.href : pathname.startsWith(item.href))
            const baseCls = 'flex flex-col items-center justify-center min-w-0 flex-1 max-w-[80px]'
            const stateCls = active
              ? 'text-[#ff9156] bg-[#ff9156]/10 rounded-xl px-2 py-1'
              : 'text-on-surface/40 hover:text-on-surface/70 active:scale-90 duration-200 transition-colors'
            const Icon = (
              <span
                className="material-symbols-outlined text-[22px]"
                style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
            )
            const Label = (
              <span className="font-label text-[9px] sm:text-[10px] uppercase tracking-[0.1em] font-semibold mt-0.5 truncate max-w-full">
                {item.label}
              </span>
            )
            return item.asLink ? (
              <Link key={item.label} href={item.href} className={`${baseCls} ${stateCls}`}>
                {Icon}
                {Label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className={`${baseCls} ${stateCls}`}>
                {Icon}
                {Label}
              </a>
            )
          })}
        </footer>

      </div>
    </CommunityContext.Provider>
  )
}
