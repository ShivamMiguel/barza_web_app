'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface PeakHour { hour: string; demand: number }
interface ZoneData { total_services: number; total_revenue: number; average_price: number }
interface SpaceTicket { space_name: string; total_services: number; total_value: number; average_ticket: number }
interface ActivePro { professional: string; total_services: number; estimated_revenue: number }
interface ProductData { quantity: number; revenue: number }
interface SalonProducts { salon: string; products: Record<string, ProductData> }
interface PostPerformance { total_posts: number; total_likes: number; total_comments: number; engagement_rate: string }
interface GlobalSignal { title: string; summary: string; source: string; url: string; category: string; language: string }
interface AiReportItem { title: string; content: string }

interface MarketData {
  market_insights?: {
    services_by_zone?: Record<string, ZoneData>
    ticket_average_per_space?: Record<string, SpaceTicket>
    products_by_salon?: Record<string, SalonProducts>
    peak_demand_hours?: PeakHour[]
    most_active_professionals?: Record<string, ActivePro>
    post_performance?: PostPerformance
  }
  global_beauty_signals?: GlobalSignal[]
  ai_market_report?: {
    local_market?: AiReportItem[]
    international_intelligence?: AiReportItem[]
    ai_recommendations?: AiReportItem[]
  }
  interpretation?: {
    market_status?: string
    recommendation?: string
    best_time_strategy?: string
    growth_signal?: string
  }
}

function fmt(n: number) {
  return n.toLocaleString('pt-AO')
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div
      className="rounded-xl py-6 px-4 text-center border border-dashed"
      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <span className="material-symbols-outlined text-2xl mb-1 block" style={{ color: 'rgba(255,145,86,0.3)' }}>
        hourglass_empty
      </span>
      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{text}</p>
    </div>
  )
}

export default function MarketInsightsPage() {
  const [data, setData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/market-insights')
      .then(r => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="material-symbols-outlined text-[#ff9156] text-5xl animate-spin">refresh</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-on-surface-variant">Erro ao carregar dados.</p>
      </div>
    )
  }

  const mi = data.market_insights ?? {}
  const interp = data.interpretation ?? {}
  const zones = Object.entries(mi.services_by_zone ?? {})
  const pros = Object.entries(mi.most_active_professionals ?? {})
  const salons = Object.entries(mi.products_by_salon ?? {})
  const hours = mi.peak_demand_hours ?? []
  const perf = mi.post_performance
  const signals = data.global_beauty_signals ?? []
  const aiReport = data.ai_market_report ?? {}
  const aiLocal = aiReport.local_market ?? []
  const aiIntl = (aiReport.international_intelligence ?? []).filter(
    item => !/\[(PT|EN|FR)\]/i.test(item.title)
  )
  const aiRecs = aiReport.ai_recommendations ?? []

  const topHours = [...hours].sort((a, b) => b.demand - a.demand).slice(0, 6)
  const maxDemand = Math.max(...topHours.map(h => h.demand), 1)
  const totalRevenue = zones.reduce((s, [, z]) => s + z.total_revenue, 0)
  const totalServices = zones.reduce((s, [, z]) => s + z.total_services, 0)
  const maxProRevenue = Math.max(...pros.map(([, p]) => p.estimated_revenue), 1)

  const hasMarketData = zones.length > 0 || pros.length > 0 || salons.length > 0 || hours.length > 0

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8 text-white">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none -z-0"
        style={{ background: 'radial-gradient(circle at top right, rgba(255,145,86,0.06) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none -z-0"
        style={{ background: 'radial-gradient(circle at bottom left, rgba(255,71,87,0.04) 0%, transparent 60%)' }} />

      <div className="relative max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[3.5rem] font-headline font-extrabold tracking-tighter leading-none mb-2">
              Market Insights
            </h2>
            <div className="h-1 w-12 volcanic-gradient rounded-full"></div>
          </div>
          <div className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(255,145,86,0.12)', color: '#ff9156', border: '1px solid rgba(255,145,86,0.25)' }}>
            Live Data
          </div>
        </div>

        {/* Market Status Banner */}
        {(interp.market_status || interp.recommendation) && (
          <div className="rounded-2xl p-6 mb-8 border"
            style={{ background: 'linear-gradient(135deg, rgba(26,18,10,0.8) 0%, rgba(22,14,6,0.8) 100%)', borderColor: 'rgba(255,145,86,0.15)' }}>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: '#ff9156', opacity: 0.7 }}>
              Status do Mercado
            </p>
            {interp.market_status && (
              <p className="font-bold text-base leading-snug text-white mb-4">{interp.market_status}</p>
            )}
            {interp.recommendation && (
              <>
                <div className="h-px w-full mb-4" style={{ background: 'rgba(255,145,86,0.1)' }} />
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {interp.recommendation}
                </p>
              </>
            )}
          </div>
        )}

        {/* KPI Cards */}
        {(zones.length > 0 || perf) && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Serviços Ativos', value: totalServices, icon: 'content_cut', suffix: '' },
              { label: 'Receita Total', value: totalRevenue, icon: 'payments', suffix: ' Kz' },
              { label: 'Ticket Médio', value: totalServices > 0 ? Math.round(totalRevenue / totalServices) : 0, icon: 'receipt_long', suffix: ' Kz' },
              { label: 'Engagement', value: perf ? parseFloat(perf.engagement_rate) : 0, icon: 'trending_up', suffix: '%' },
            ].map((kpi, i) => (
              <div key={i} className="rounded-2xl p-5 border"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
                <span className="material-symbols-outlined text-lg mb-3 block" style={{ color: '#ff9156' }}>{kpi.icon}</span>
                <p className="text-xl font-black tracking-tight">
                  {typeof kpi.value === 'number' && kpi.value > 999
                    ? fmt(Math.round(kpi.value))
                    : typeof kpi.value === 'number'
                    ? kpi.value.toFixed(kpi.suffix === '%' ? 2 : 0)
                    : kpi.value}
                  <span className="text-xs font-normal ml-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{kpi.suffix}</span>
                </p>
                <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* AI Local Market Diagnosis */}
        {aiLocal.length > 0 && (
          <div className="rounded-2xl p-6 border mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(26,18,10,0.7) 0%, rgba(22,14,6,0.7) 100%)', borderColor: 'rgba(255,145,86,0.18)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: '#ff9156' }}>
                  Diagnóstico IA · Mercado Local
                </h2>
                <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Análise automatizada do teu mercado
                </p>
              </div>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>psychology</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {aiLocal.map((item, i) => (
                <div key={i} className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-sm font-bold mb-2 leading-snug text-white">{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        {aiRecs.length > 0 && (
          <div className="rounded-2xl p-6 border mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(255,145,86,0.08) 0%, rgba(255,71,87,0.04) 100%)', borderColor: 'rgba(255,145,86,0.25)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: '#ff9156' }}>
                  Recomendações da IA
                </h2>
                <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Próximos passos sugeridos
                </p>
              </div>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>auto_awesome</span>
            </div>
            <div className="space-y-3">
              {aiRecs.map((item, i) => (
                <div key={i} className="rounded-xl p-4 flex gap-4"
                  style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,145,86,0.12)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(255,145,86,0.15)' }}>
                    <span className="text-xs font-black" style={{ color: '#ff9156' }}>{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold mb-1.5 leading-snug text-white">{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post Performance */}
        {perf && (
          <div className="rounded-2xl p-6 border mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Performance da Comunidade
              </h2>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>analytics</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Posts', value: perf.total_posts, icon: 'edit_note' },
                { label: 'Likes', value: perf.total_likes, icon: 'favorite' },
                { label: 'Comentários', value: perf.total_comments, icon: 'chat_bubble' },
                { label: 'Engagement', value: `${perf.engagement_rate}%`, icon: 'trending_up' },
              ].map((s, i) => (
                <div key={i} className="text-center py-5 rounded-xl"
                  style={{ background: i === 3 ? 'rgba(255,145,86,0.08)' : 'rgba(255,255,255,0.03)', border: i === 3 ? '1px solid rgba(255,145,86,0.2)' : '1px solid transparent' }}>
                  <span className="material-symbols-outlined text-base mb-1 block" style={{ color: i === 3 ? '#ff9156' : 'rgba(255,255,255,0.4)' }}>
                    {s.icon}
                  </span>
                  <p className="text-2xl font-black" style={{ color: i === 3 ? '#ff9156' : '#fff' }}>{s.value}</p>
                  <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-column: peak hours + zones */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl p-6 border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Horas de Maior Procura
              </h2>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>schedule</span>
            </div>
            {topHours.length > 0 ? (
              <>
                <div className="flex items-end justify-between gap-2" style={{ height: '120px' }}>
                  {topHours.map((h, i) => {
                    const pct = Math.round((h.demand / maxDemand) * 100)
                    return (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <span className="text-[8px]" style={{ color: 'rgba(255,145,86,0.6)' }}>{h.demand}</span>
                        <div
                          className="w-full rounded-t-lg transition-all"
                          style={{
                            height: `${Math.max(pct, 8)}%`,
                            background: i === 0 ? 'linear-gradient(180deg, #ff9156, #ff4757)' : 'rgba(255,145,86,0.25)',
                          }}
                        />
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
            {interp.best_time_strategy && (
              <div className="mt-5 pt-4 border-t text-xs leading-relaxed"
                style={{ borderColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                {interp.best_time_strategy}
              </div>
            )}
          </div>

          <div className="rounded-2xl p-6 border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Serviços por Zona
              </h2>
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
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {fmt(z.total_revenue)} Kz
                        </span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ff9156, #ff4757)' }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          {z.total_services} serviços
                        </span>
                        <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          Preço médio: {fmt(z.average_price)} Kz
                        </span>
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

        {/* Most Active Professionals */}
        {pros.length > 0 && (
          <div className="rounded-2xl p-6 border mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Profissionais Mais Ativos
              </h2>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>workspace_premium</span>
            </div>
            <div className="space-y-4">
              {pros.map(([id, pro], i) => {
                const pct = Math.round((pro.estimated_revenue / maxProRevenue) * 100)
                return (
                  <div key={id} className="flex items-center gap-4">
                    <span className="text-[10px] font-black w-4 text-right flex-shrink-0"
                      style={{ color: i === 0 ? '#ff9156' : 'rgba(255,255,255,0.2)' }}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-sm font-bold truncate">{pro.professional}</span>
                        <span className="text-xs font-bold flex-shrink-0 ml-2" style={{ color: '#ff9156' }}>
                          {fmt(pro.estimated_revenue)} Kz
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: i === 0 ? 'linear-gradient(90deg, #ff9156, #ff4757)' : 'rgba(255,145,86,0.3)',
                          }}
                        />
                      </div>
                      <span className="text-[9px] mt-1 block" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {pro.total_services} serviços
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Products by Salon */}
        {salons.length > 0 && (
          <div className="rounded-2xl p-6 border mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Produtos Mais Vendidos
              </h2>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>local_mall</span>
            </div>
            <div className="space-y-6">
              {salons.map(([id, salon]) => (
                <div key={id}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,145,86,0.6)' }}>
                    {salon.salon}
                  </p>
                  <div className="space-y-2">
                    {Object.entries(salon.products).map(([name, prod]) => (
                      <div key={name} className="flex items-center justify-between py-2 px-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)' }}>
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

        {/* Empty market data fallback */}
        {!hasMarketData && (
          <div className="rounded-2xl p-8 mb-6 border text-center"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
            <span className="material-symbols-outlined text-4xl mb-3 block" style={{ color: 'rgba(255,145,86,0.3)' }}>
              insights
            </span>
            <p className="text-sm font-bold mb-1">Dados de mercado em construção</p>
            <p className="text-xs leading-relaxed max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Ainda não há volume suficiente de transações para calcular métricas detalhadas por zona, profissional ou produto.
            </p>
          </div>
        )}

        {/* Interpretation Cards */}
        {(interp.best_time_strategy || interp.growth_signal) && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {interp.best_time_strategy && (
              <div className="rounded-2xl p-5 border"
                style={{ background: 'linear-gradient(135deg, rgba(22,14,6,0.9) 0%, rgba(17,10,4,0.9) 100%)', borderColor: 'rgba(255,145,86,0.12)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>schedule</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,145,86,0.7)' }}>
                    Melhor Horário
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{interp.best_time_strategy}</p>
              </div>
            )}
            {interp.growth_signal && (
              <div className="rounded-2xl p-5 border"
                style={{ background: 'linear-gradient(135deg, rgba(22,14,6,0.9) 0%, rgba(17,10,4,0.9) 100%)', borderColor: 'rgba(255,145,86,0.12)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>trending_up</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,145,86,0.7)' }}>
                    Sinal de Crescimento
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{interp.growth_signal}</p>
              </div>
            )}
          </div>
        )}

        {/* AI International Intelligence */}
        {aiIntl.length > 0 && (
          <div className="rounded-2xl p-6 border mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Inteligência Internacional
                </h2>
                <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,145,86,0.5)' }}>
                  Tendências globais aplicadas ao mercado angolano
                </p>
              </div>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>language</span>
            </div>
            <div className="space-y-3">
              {aiIntl.map((item, i) => (
                <div key={i} className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p className="text-sm font-bold mb-2 leading-snug text-white">{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Beauty Signals */}
        {signals.length > 0 && (
          <div className="rounded-2xl p-6 border"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Sinais Globais de Beleza
                </h2>
                <p className="text-[9px] uppercase tracking-widest mt-1" style={{ color: 'rgba(255,145,86,0.5)' }}>
                  Tendências internacionais
                </p>
              </div>
              <span className="material-symbols-outlined text-base" style={{ color: '#ff9156' }}>public</span>
            </div>
            <div className="space-y-4">
              {signals.map((signal, i) => (
                <a
                  key={i}
                  href={signal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl p-4 transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,145,86,0.12)', color: '#ff9156' }}>
                      {signal.category}
                    </span>
                    <span className="text-[9px] flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      {signal.source}
                    </span>
                  </div>
                  <p className="text-sm font-bold leading-snug mb-2 text-white">
                    {signal.title.replace(/^\[[A-Z]{2}\]\s*/, '')}
                  </p>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {signal.summary
                      .replace(/^Tendência global da indústria da beleza:\s*/i, '')
                      .replace(/^Tendance mondiale de l['']industrie de la beauté\s*:\s*/i, '')}
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
