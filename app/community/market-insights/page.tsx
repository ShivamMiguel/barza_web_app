'use client'

import { useMarketInsights } from '@/hooks/api'

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface PeakHour { hour: string; demand: number }
interface ZoneData { total_services: number; total_revenue: number; average_price: number }
interface SpaceTicket { space_name: string; total_services: number; total_value: number; average_ticket: number }
interface ActivePro { professional: string; total_services: number; estimated_revenue: number }
interface ProductData { quantity: number; revenue: number }
interface SalonProducts { salon: string; products: Record<string, ProductData> }
interface PostPerformance { total_posts: number; total_likes: number; total_comments: number; engagement_rate: string }
interface GlobalSignal { title: string; summary: string; source: string; url: string; category: string; language: string }
interface AiReportItem { title: string; content: string }

interface UserSpace {
  id: string
  space_name: string
  owner: string
  location_space?: { city?: string; address?: string; district?: string; country?: string }
}

interface MarketData {
  success?: boolean
  user_context?: { user_id: string; has_spaces: boolean; spaces: UserSpace[] }
  market_insights?: {
    services_by_zone?: Record<string, ZoneData>
    ticket_average_per_space?: Record<string, SpaceTicket>
    products_by_salon?: Record<string, SalonProducts>
    peak_demand_hours?: PeakHour[]
    most_active_professionals?: Record<string, ActivePro>
    post_performance?: PostPerformance
  }
  ai_insights?: string
  global_beauty_signals?: GlobalSignal[]
  ai_market_report?: {
    local_market?: AiReportItem[]
    international_intelligence?: AiReportItem[]
    ai_recommendations?: AiReportItem[]
  }
  interpretation?: { market_status?: string; recommendation?: string; best_time_strategy?: string; growth_signal?: string }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) { return n.toLocaleString('pt-AO') }

function parseAiInsights(text: string) {
  // Strip markdown tables, horizontal rules, and bold markers before splitting
  const pre = text
    .replace(/\|[^\n]*/gm, '')        // Remove table rows (any line with |)
    .replace(/[-]{3,}/gm, '')          // Remove --- dividers
    .replace(/\*\*/g, '')              // Strip bold markers
    .replace(/\n{3,}/g, '\n\n')       // Collapse excessive blank lines

  // Split on section headers: ### N. Title  or  N. Title (uppercase start)
  const parts = pre.split(/\n(?=#{0,3}\s*\d+\.\s\S)/)
  const [rawHeader, ...rest] = parts

  const sections = rest.map(part => {
    const nl = part.indexOf('\n')
    const rawTitle = nl === -1 ? part : part.slice(0, nl)
    const rawContent = nl === -1 ? '' : part.slice(nl + 1)
    return {
      title: rawTitle.replace(/^#{1,3}\s*/, '').trim(),
      content: rawContent.trim(),
    }
  }).filter(s => s.title.length > 0)

  return { header: rawHeader.replace(/^#{1,3}\s*/gm, '').trim(), sections }
}

function parseBullets(content: string, max = 4) {
  return content.split('\n')
    .filter(l => l.trim().startsWith('-'))
    .slice(0, max)
    .map(l => {
      const text = l.trim().slice(1).trim()
      const colonIdx = text.indexOf(':')
      if (colonIdx > -1 && colonIdx < 80) {
        return { bold: text.slice(0, colonIdx).trim(), rest: text.slice(colonIdx + 1).trim() }
      }
      return { bold: '', rest: text }
    })
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl py-6 px-4 text-center border border-dashed" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      <span className="material-symbols-outlined text-2xl mb-1 block" style={{ color: 'rgba(255,145,86,0.3)' }}>hourglass_empty</span>
      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{text}</p>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MarketInsightsPage() {
  const { data, isLoading: loading } = useMarketInsights()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="material-symbols-outlined text-[#ff9156] text-5xl animate-spin">refresh</span>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-on-surface-variant">Erro ao carregar dados.</p>
      </div>
    )
  }

  // ── Data extraction ──────────────────────────────────────────────────────

  const marketData = data as MarketData
  const mi = marketData.market_insights ?? {}
  const interp = marketData.interpretation ?? {}
  const uc = marketData.user_context

  const mainSpace = uc?.spaces?.[0]
  const mainSpaceId = mainSpace?.id
  const spaceName = mainSpace?.space_name ?? 'Market'
  const spaceCity = mainSpace?.location_space?.city ?? ''
  const spaceDistrict = mainSpace?.location_space?.district ?? mainSpace?.location_space?.address ?? ''

  const zones = Object.entries(mi.services_by_zone ?? {})
  const pros = Object.entries(mi.most_active_professionals ?? {})
  const tickets = Object.entries(mi.ticket_average_per_space ?? {})
  const salons = Object.entries(mi.products_by_salon ?? {})
  const hours = mi.peak_demand_hours ?? []
  const perf = mi.post_performance
  const signals = marketData.global_beauty_signals ?? []

  // User space KPIs
  const userTicket = mainSpaceId ? mi.ticket_average_per_space?.[mainSpaceId] : null
  const totalRevenue = zones.reduce((s, [, z]) => s + z.total_revenue, 0)
  const totalServices = zones.reduce((s, [, z]) => s + z.total_services, 0)

  // Market share for user space
  const userServices = userTicket?.total_services ?? 0
  const userRevenue = userTicket?.total_value ?? 0
  const userAvgTicket = userTicket?.average_ticket ?? 0
  const marketAvgTicket = totalServices > 0 ? Math.round(totalRevenue / totalServices) : 0
  const shareServices = totalServices > 0 ? Math.round((userServices / totalServices) * 100) : 0
  const shareRevenue = totalRevenue > 0 ? Math.round((userRevenue / totalRevenue) * 100) : 0
  const ticketDelta = marketAvgTicket > 0 ? Math.round(((userAvgTicket - marketAvgTicket) / marketAvgTicket) * 100) : 0
  const engagementRate = perf ? parseFloat(perf.engagement_rate) : 0

  // AI sections
  const aiParsed = marketData.ai_insights ? parseAiInsights(marketData.ai_insights) : null
  const findSection = (keyword: string) =>
    aiParsed?.sections.find(s => s.title.toLowerCase().includes(keyword.toLowerCase()))

  const successSection = findSection('funcionar')
  const failureSection = findSection('falhar')
  const opportunitiesSection = findSection('oportunidades')
  const strategySection = findSection('estratégia')
  const conclusionSection = findSection('conclusão') ?? findSection('conclusao')

  const successItems = successSection ? parseBullets(successSection.content, 3) : []
  const failureItems = failureSection ? parseBullets(failureSection.content, 2) : []
  const opportunityItems = (opportunitiesSection ?? strategySection)
    ? parseBullets((opportunitiesSection ?? strategySection)!.content, 3)
    : []

  // Peak hours
  const topHours = [...hours].sort((a, b) => b.demand - a.demand).slice(0, 6)
  const maxDemand = Math.max(...topHours.map(h => h.demand), 1)
  const maxProRevenue = Math.max(...pros.map(([, p]) => p.estimated_revenue), 1)
  const maxTicketValue = Math.max(...tickets.map(([, t]) => t.average_ticket), 1)

  // Legacy ai_market_report
  const aiReport = marketData.ai_market_report ?? {}
  const aiLocal = aiReport.local_market ?? []
  const aiIntl = (aiReport.international_intelligence ?? []).filter(item => !/\[(PT|EN|FR)\]/i.test(item.title))
  const aiRecs = aiReport.ai_recommendations ?? []

  const hasMarketData = zones.length > 0 || pros.length > 0 || tickets.length > 0

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8 text-white overflow-x-hidden">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[60vw] max-w-[500px] aspect-square pointer-events-none -z-0"
        style={{ background: 'radial-gradient(circle at top right, rgba(255,145,86,0.06) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 w-[55vw] max-w-[400px] aspect-square pointer-events-none -z-0"
        style={{ background: 'radial-gradient(circle at bottom left, rgba(255,71,87,0.04) 0%, transparent 60%)' }} />

      <div className="relative max-w-5xl mx-auto space-y-8">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <span className="font-label uppercase tracking-[0.2em] text-[0.6875rem]" style={{ color: '#ff9156' }}>
              Relatório Estratégico Mensal
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-on-surface leading-none">
              {spaceName.length > 24 ? spaceName.slice(0, 24).trimEnd() + '…' : spaceName}
              <br />
              <span className="text-on-surface-variant font-light">Beauty Intelligence</span>
            </h1>
          </div>
          <div className="flex flex-col items-start sm:items-end flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ff9156' }} />
              <span className="font-label text-[0.625rem] uppercase tracking-widest text-on-surface-variant">Live Insight</span>
            </div>
            {(spaceCity || spaceDistrict) && (
              <p className="font-display font-medium text-base text-on-surface-variant">
                {spaceCity}{spaceDistrict ? ` / ${spaceDistrict}` : ''}
              </p>
            )}
          </div>
        </header>

        {/* ── SUMMARY + PERFORMANCE ───────────────────────────────────────── */}
        {(hasMarketData || userTicket) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Business Summary */}
            <section className="md:col-span-2 rounded-2xl p-8 relative overflow-hidden"
              style={{ background: '#0e0e0e' }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl"
                style={{ background: 'rgba(255,145,86,0.05)' }} />
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined" style={{ color: '#ff9156' }}>business_center</span>
                <h2 className="font-display font-bold text-lg tracking-tight">Resumo do Negócio</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                <div>
                  <p className="font-label uppercase text-[0.625rem] tracking-widest text-on-surface-variant mb-1">
                    Portfólio Ativo
                  </p>
                  <p className="font-display text-3xl font-bold">
                    {userServices || totalServices}
                    <span className="text-sm font-medium text-on-surface-variant ml-1">Serviços</span>
                  </p>
                </div>
                <div>
                  <p className="font-label uppercase text-[0.625rem] tracking-widest text-on-surface-variant mb-1">
                    Receita Mensal
                  </p>
                  <p className="font-display text-3xl font-bold">
                    {fmt(userRevenue || totalRevenue)}
                    <span className="text-sm font-medium text-on-surface-variant ml-1">AKZ</span>
                  </p>
                </div>
                <div>
                  <p className="font-label uppercase text-[0.625rem] tracking-widest text-on-surface-variant mb-1">
                    Ticket Médio
                  </p>
                  <p className="font-display text-3xl font-bold" style={{ color: '#ff9156' }}>
                    {fmt(userAvgTicket || marketAvgTicket)}
                    <span className="text-sm font-medium text-on-surface-variant ml-1">AKZ</span>
                  </p>
                </div>
              </div>
              {perf && (
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  {[
                    { label: 'Posts', value: perf.total_posts },
                    { label: 'Likes', value: perf.total_likes },
                    { label: 'Engagement', value: `${perf.engagement_rate}%` },
                  ].map((s, i) => (
                    <div key={i} className="text-center py-3 rounded-xl" style={{ background: 'rgba(255,145,86,0.06)' }}>
                      <p className="text-xl font-black" style={{ color: i === 2 ? '#ff9156' : '#fff' }}>{s.value}</p>
                      <p className="text-[9px] uppercase tracking-widest mt-0.5 opacity-40">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Performance vs Market */}
            <section className="rounded-2xl p-8 flex flex-col justify-between"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <span className="material-symbols-outlined" style={{ color: '#ff9156' }}>monitoring</span>
                  <h2 className="font-display font-bold text-lg tracking-tight">Performance</h2>
                </div>
                <div className="space-y-6">
                  {shareServices > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between font-label text-[0.6875rem] uppercase tracking-tighter">
                        <span className="text-on-surface-variant">Market Share Serviços</span>
                        <span style={{ color: '#ff9156' }}>{shareServices}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${shareServices}%`, background: 'linear-gradient(90deg, #ff9156, #ff4757)' }} />
                      </div>
                    </div>
                  )}
                  {shareRevenue > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between font-label text-[0.6875rem] uppercase tracking-tighter">
                        <span className="text-on-surface-variant">Eficiência de Receita</span>
                        <span style={{ color: '#ff9156' }}>{shareRevenue}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${shareRevenue}%`, background: 'linear-gradient(90deg, #ff9156, #ff4757)' }} />
                      </div>
                    </div>
                  )}
                  {engagementRate > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between font-label text-[0.6875rem] uppercase tracking-tighter">
                        <span className="text-on-surface-variant">Engagement Digital</span>
                        <span style={{ color: engagementRate < 5 ? '#ff4757' : '#ff9156' }}>{engagementRate.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(engagementRate * 5, 100)}%`, background: engagementRate < 5 ? '#ff4757' : 'linear-gradient(90deg, #ff9156, #ff4757)' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {marketAvgTicket > 0 && (
                <p className="text-[0.6875rem] text-on-surface-variant/50 italic leading-relaxed mt-6">
                  Benchmark regional: ticket médio de mercado{' '}
                  <span style={{ color: '#ff9156' }}>{fmt(marketAvgTicket)} AKZ</span>.
                  {ticketDelta !== 0 && (
                    <> A tua operação está{' '}
                      <span style={{ color: ticketDelta < 0 ? '#ff4757' : '#ff9156' }}>
                        {Math.abs(ticketDelta)}% {ticketDelta < 0 ? 'abaixo' : 'acima'}
                      </span> da média.
                    </>
                  )}
                </p>
              )}
            </section>
          </div>
        )}

        {/* ── SUCCESS / FAILURE ───────────────────────────────────────────── */}
        {(successItems.length > 0 || failureItems.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* What's Working */}
            {successItems.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-label uppercase tracking-widest text-[0.6875rem] flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg" style={{ color: '#ff9156' }}>check_circle</span>
                  <span className="text-on-surface-variant">O Que Está a Funcionar</span>
                </h3>
                <div className="space-y-3">
                  {successItems.map((item, i) => (
                    <div key={i} className="rounded-2xl p-5 transition-all duration-300 hover:translate-x-1"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      {item.bold && (
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-display font-bold text-sm">{item.bold}</p>
                          {i === 0 && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                              style={{ background: 'rgba(255,145,86,0.1)', color: '#ff9156' }}>
                              Top
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-on-surface-variant leading-relaxed">{item.rest || item.bold}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Failing */}
            {(failureItems.length > 0 || engagementRate > 0 || ticketDelta < 0) && (
              <div className="space-y-4">
                <h3 className="font-label uppercase tracking-widest text-[0.6875rem] flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg" style={{ color: '#ff4757' }}>warning</span>
                  <span style={{ color: '#ff4757' }}>O Que Está a Falhar</span>
                </h3>
                <div className="space-y-3">
                  {engagementRate > 0 && engagementRate < 10 && (
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(255,71,87,0.4)' }}>
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-display font-bold text-sm">Engajamento Digital</p>
                        <p className="font-display text-2xl font-black" style={{ color: '#ff4757' }}>
                          {perf?.engagement_rate}%
                        </p>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Baixa presença digital limita a aquisição de novos clientes.
                      </p>
                    </div>
                  )}
                  {ticketDelta < 0 && marketAvgTicket > 0 && (
                    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(255,71,87,0.4)' }}>
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-display font-bold text-sm">Ticket Sub-médio</p>
                        <p className="font-display text-2xl font-black" style={{ color: '#ff4757' }}>
                          {ticketDelta}%
                        </p>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Potencial para serviços premium e upselling.
                      </p>
                    </div>
                  )}
                  {failureItems.filter((_, i) => i < 2).map((item, i) => (
                    <div key={i} className="rounded-2xl p-5"
                      style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(255,71,87,0.25)' }}>
                      {item.bold && <p className="font-display font-bold text-sm mb-1">{item.bold}</p>}
                      <p className="text-xs text-on-surface-variant leading-relaxed">{item.rest || item.bold}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── OPPORTUNITIES ───────────────────────────────────────────────── */}
        {opportunityItems.length > 0 && (
          <section className="rounded-2xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, rgba(255,145,86,0.15) 0%, rgba(255,71,87,0.08) 100%)', border: '1px solid rgba(255,145,86,0.25)' }}>
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="md:w-1/3 space-y-4 flex-shrink-0">
                  <span className="material-symbols-outlined text-4xl block" style={{ color: '#ff9156', fontVariationSettings: "'FILL' 1" }}>
                    lightbulb
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tighter leading-tight text-on-surface">
                    Oportunidades &<br />Crescimento
                  </h2>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {conclusionSection?.content?.split('.')[0]?.trim() ?? 'Estratégias para acelerar o crescimento e posicionamento no mercado.'}
                    {'.'}
                  </p>
                </div>
                <div className="md:w-2/3 space-y-6">
                  {opportunityItems.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(255,145,86,0.15)' }}>
                        <span className="font-display font-bold text-xs" style={{ color: '#ff9156' }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div>
                        {item.bold && <h4 className="font-display font-bold mb-1 text-sm">{item.bold}</h4>}
                        <p className="text-sm text-on-surface-variant leading-relaxed">{item.rest || item.bold}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── PEAK HOURS + ZONES ──────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Horas de Maior Procura</h2>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>schedule</span>
            </div>
            {topHours.length > 0 ? (
              <>
                <div className="flex items-end justify-between gap-2" style={{ height: '100px' }}>
                  {topHours.map((h, i) => {
                    const pct = Math.round((h.demand / maxDemand) * 100)
                    return (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <span className="text-[8px]" style={{ color: 'rgba(255,145,86,0.6)' }}>{h.demand}</span>
                        <div className="w-full rounded-t-lg"
                          style={{ height: `${Math.max(pct, 8)}%`, background: i === 0 ? 'linear-gradient(180deg, #ff9156, #ff4757)' : 'rgba(255,145,86,0.25)' }} />
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between mt-3">
                  {topHours.map((h, i) => (
                    <span key={i} className="flex-1 text-center text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: i === 0 ? '#ff9156' : 'rgba(255,255,255,0.25)' }}>
                      {h.hour}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <EmptyHint text="Sem dados suficientes de procura por hora." />
            )}
          </div>

          <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Serviços por Zona</h2>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>location_on</span>
            </div>
            {zones.length > 0 ? (
              <div className="space-y-5">
                {zones.map(([zone, z]) => {
                  const pct = Math.round((z.total_services / Math.max(totalServices, 1)) * 100)
                  return (
                    <div key={zone}>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm font-bold">{zone}</span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{fmt(z.total_revenue)} Kz</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ff9156, #ff4757)' }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{z.total_services} serviços</span>
                        <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Preço médio: {fmt(z.average_price)} Kz</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyHint text="Ainda não há serviços registados por zona." />
            )}
          </div>
        </div>

        {/* ── TICKET POR ESPAÇO + PROFISSIONAIS ───────────────────────────── */}
        {(tickets.length > 0 || pros.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6">
            {tickets.length > 0 && (
              <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Ticket Médio por Espaço</h2>
                  <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>receipt_long</span>
                </div>
                <div className="space-y-4">
                  {tickets.map(([id, t], i) => {
                    const pct = Math.round((t.average_ticket / maxTicketValue) * 100)
                    return (
                      <div key={id} className="flex items-center gap-3">
                        <span className="text-[10px] font-black w-4 text-right flex-shrink-0"
                          style={{ color: i === 0 ? '#ff9156' : 'rgba(255,255,255,0.2)' }}>{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-sm font-bold truncate">{t.space_name}</span>
                            <span className="text-xs font-black flex-shrink-0 ml-2" style={{ color: '#ff9156' }}>{fmt(t.average_ticket)} Kz</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: i === 0 ? 'linear-gradient(90deg, #ff9156, #ff4757)' : 'rgba(255,145,86,0.3)' }} />
                          </div>
                          <span className="text-[9px] mt-0.5 block" style={{ color: 'rgba(255,255,255,0.3)' }}>
                            {t.total_services} serv. · {fmt(t.total_value)} Kz
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {pros.length > 0 && (
              <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Profissionais Mais Ativos</h2>
                  <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>workspace_premium</span>
                </div>
                <div className="space-y-4">
                  {pros.map(([id, pro], i) => {
                    const pct = Math.round((pro.estimated_revenue / maxProRevenue) * 100)
                    return (
                      <div key={id} className="flex items-center gap-3">
                        <span className="text-[10px] font-black w-4 text-right flex-shrink-0"
                          style={{ color: i === 0 ? '#ff9156' : 'rgba(255,255,255,0.2)' }}>{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-sm font-bold truncate">{pro.professional}</span>
                            <span className="text-xs font-bold flex-shrink-0 ml-2" style={{ color: '#ff9156' }}>{fmt(pro.estimated_revenue)} Kz</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: i === 0 ? 'linear-gradient(90deg, #ff9156, #ff4757)' : 'rgba(255,145,86,0.3)' }} />
                          </div>
                          <span className="text-[9px] mt-0.5 block" style={{ color: 'rgba(255,255,255,0.3)' }}>{pro.total_services} serviços</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS ────────────────────────────────────────────────────── */}
        {salons.length > 0 && (
          <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Produtos Mais Vendidos</h2>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>local_mall</span>
            </div>
            <div className="space-y-6">
              {salons.map(([id, salon]) => (
                <div key={id}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,145,86,0.6)' }}>{salon.salon}</p>
                  <div className="space-y-2">
                    {Object.entries(salon.products).map(([name, prod]) => (
                      <div key={name} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <span className="text-sm font-medium">{name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>×{prod.quantity}</span>
                          <span className="text-xs font-bold" style={{ color: '#ff9156' }}>{fmt(prod.revenue)} Kz</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EMPTY STATE ──────────────────────────────────────────────────── */}
        {!hasMarketData && !aiParsed && (
          <div className="rounded-2xl p-8 border text-center" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
            <span className="material-symbols-outlined text-4xl mb-3 block" style={{ color: 'rgba(255,145,86,0.3)' }}>insights</span>
            <p className="text-sm font-bold mb-1">Dados de mercado em construção</p>
            <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Ainda não há volume suficiente de transações para calcular métricas detalhadas.
            </p>
          </div>
        )}

        {/* ── FULL AI REPORT (accordion) ───────────────────────────────────── */}
        {aiParsed && (
          <div className="rounded-2xl border overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(26,18,10,0.85) 0%, rgba(17,10,4,0.85) 100%)', borderColor: 'rgba(255,145,86,0.2)' }}>
            <div className="px-6 py-5 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,145,86,0.12)' }}>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>psychology</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#ff9156' }}>Relatório IA Completo</p>
                {aiParsed.header && <p className="text-xs text-on-surface-variant mt-0.5">{aiParsed.header}</p>}
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {aiParsed.sections.map((section, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer select-none list-none hover:bg-white/[0.02] transition-colors">
                    <span className="text-sm font-bold text-white leading-snug">{section.title}</span>
                    <span className="material-symbols-outlined text-base flex-shrink-0 transition-transform group-open:rotate-180"
                      style={{ color: 'rgba(255,145,86,0.5)' }}>expand_more</span>
                  </summary>
                  <div className="px-6 pb-5 space-y-2">
                    {section.content.split('\n')
                      .filter(l => {
                        const t = l.trim()
                        return t.length > 2 && !t.startsWith('|') && !/^-{3,}$/.test(t)
                      })
                      .map((line, j) => {
                        const isBullet = line.trim().startsWith('-')
                        const text = isBullet ? line.trim().slice(1).trim() : line.trim()
                        const colonIdx = isBullet ? text.indexOf(':') : -1
                        const bold = colonIdx > -1 && colonIdx < 80 ? text.slice(0, colonIdx).trim() : ''
                        const rest = colonIdx > -1 && colonIdx < 80 ? text.slice(colonIdx + 1).trim() : text
                        return (
                          <div key={j} className={`flex gap-2 ${isBullet ? 'items-start' : ''}`}>
                            {isBullet && (
                              <span className="mt-2 w-1 h-1 rounded-full flex-shrink-0"
                                style={{ background: 'rgba(255,145,86,0.5)' }} />
                            )}
                            <p className="text-sm leading-relaxed"
                              style={{ color: isBullet ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)' }}>
                              {bold && <><span className="font-semibold text-white">{bold}:</span>{' '}</>}
                              {rest}
                            </p>
                          </div>
                        )
                      })}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* ── LEGACY: AI Market Report ──────────────────────────────────── */}
        {aiLocal.length > 0 && (
          <div className="rounded-2xl p-6 border"
            style={{ background: 'linear-gradient(135deg, rgba(26,18,10,0.7) 0%, rgba(22,14,6,0.7) 100%)', borderColor: 'rgba(255,145,86,0.18)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: '#ff9156' }}>Diagnóstico IA · Mercado Local</h2>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>psychology</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {aiLocal.map((item, i) => (
                <div key={i} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-sm font-bold mb-2 text-white">{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {aiRecs.length > 0 && (
          <div className="rounded-2xl p-6 border"
            style={{ background: 'linear-gradient(135deg, rgba(255,145,86,0.08) 0%, rgba(255,71,87,0.04) 100%)', borderColor: 'rgba(255,145,86,0.25)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: '#ff9156' }}>Recomendações da IA</h2>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>auto_awesome</span>
            </div>
            <div className="space-y-3">
              {aiRecs.map((item, i) => (
                <div key={i} className="rounded-2xl p-4 flex gap-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,145,86,0.12)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,145,86,0.15)' }}>
                    <span className="text-xs font-black" style={{ color: '#ff9156' }}>{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold mb-1 text-white">{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GLOBAL SIGNALS ───────────────────────────────────────────────── */}
        {signals.length > 0 && (
          <div className="rounded-2xl p-6 border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>Sinais Globais de Beleza</h2>
                <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,145,86,0.5)' }}>Tendências internacionais</p>
              </div>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>public</span>
            </div>
            <div className="space-y-4">
              {signals.map((signal, i) => (
                <a key={i} href={signal.url} target="_blank" rel="noopener noreferrer"
                  className="block rounded-2xl p-4 transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,145,86,0.12)', color: '#ff9156' }}>{signal.category}</span>
                    <span className="text-[9px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>{signal.source}</span>
                  </div>
                  <p className="text-sm font-bold leading-snug mb-1 text-white">{signal.title.replace(/^\[[A-Z]{2}\]\s*/, '')}</p>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {signal.summary.replace(/^Tendência global da indústria da beleza:\s*/i, '').replace(/^Tendance mondiale de l['']industrie de la beauté\s*:\s*/i, '')}
                  </p>
                  <div className="flex items-center gap-1 mt-3" style={{ color: 'rgba(255,145,86,0.6)' }}>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Ler mais</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
