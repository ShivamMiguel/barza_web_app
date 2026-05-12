'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { CountryNode, LocationSuggestion } from '@/lib/locations'

interface SelectedLocation {
  country: string
  country_code: string
  flag: string
  city: string
  neighborhood?: string
  tagline?: string
}

export default function OnboardingLocationPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState<CountryNode[]>([])
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [selected, setSelected] = useState<SelectedLocation | null>(null)
  const [neighborhoodChoice, setNeighborhoodChoice] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initial fetch: tree + suggestions
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [treeRes, sugRes] = await Promise.all([
          fetch('/api/locations'),
          fetch('/api/locations?q='),
        ])
        if (cancelled) return
        if (treeRes.ok) {
          const { countries } = await treeRes.json()
          setAllCountries(countries)
        }
        if (sugRes.ok) {
          const { suggestions: sug } = await sugRes.json()
          setSuggestions(sug)
        }
      } catch {
        /* offline → fall back to empty; the user can still skip */
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const id = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/locations?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const { suggestions: sug } = await res.json()
          setSuggestions(sug)
        }
      } catch {
        /* ignore */
      }
    }, 200)
    return () => window.clearTimeout(id)
  }, [query])

  const selectedNode: CountryNode | undefined = useMemo(() => {
    if (!selected) return undefined
    return allCountries.find((c) => c.code === selected.country_code)
  }, [selected, allCountries])

  const neighborhoods = useMemo(() => {
    if (!selectedNode || !selected) return []
    const city = selectedNode.cities.find((c) => c.name === selected.city)
    return city?.neighborhoods ?? []
  }, [selectedNode, selected])

  function pickSuggestion(s: LocationSuggestion) {
    setSelected({
      country: s.country,
      country_code: s.country_code,
      flag: s.flag,
      city: s.city,
      tagline: s.tagline,
    })
    setNeighborhoodChoice('')
  }

  function clearSelected() {
    setSelected(null)
    setNeighborhoodChoice('')
  }

  async function handleConfirm() {
    if (loading || !selected) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: {
            country: selected.country,
            country_code: selected.country_code,
            city: selected.city,
            ...(neighborhoodChoice ? { neighborhood: neighborhoodChoice } : {}),
          },
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Erro ao guardar localização.')
        return
      }
      router.push('/onboarding/start')
    } catch {
      setError('Erro de conexão. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleSkip() {
    if (loading) return
    router.push('/onboarding/start')
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container relative">
      {/* Backdrop & decorative orbs */}
      <div className="fixed inset-0 z-0 bg-[#000000]/90 backdrop-blur-md pointer-events-none" />
      <div className="fixed top-[-10%] right-[-10%] w-[60vw] max-w-[500px] h-[60vw] max-h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] max-w-[400px] h-[50vw] max-h-[400px] bg-tertiary-container/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Skip */}
      <header className="fixed top-0 left-0 right-0 z-30 flex justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-headline font-bold tracking-tighter text-on-surface"
        >
          Barza
        </Link>
        <button
          type="button"
          onClick={handleSkip}
          disabled={loading}
          className="text-[0.6875rem] font-label tracking-[0.1em] uppercase text-primary font-bold hover:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Skip
        </button>
      </header>

      {/* Modal Wrapper */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-24 pb-12 md:p-8 md:pt-28">
        <main className="relative w-full max-w-4xl overflow-hidden bg-surface-container-lowest shadow-[0_40px_60px_-15px_rgba(255,255,255,0.04)] rounded-xl flex flex-col md:flex-row">
          {/* Map Side */}
          <section className="relative w-full md:w-5/12 h-44 md:h-auto md:min-h-[520px] overflow-hidden bg-surface-container">
            {/* Stylised obsidian map (pure CSS, editorial vibe) */}
            <div
              className="absolute inset-0 opacity-40 grayscale contrast-125"
              style={{
                background:
                  // a grid-like pattern + warm node accents
                  `repeating-linear-gradient(90deg, rgba(255,145,86,0.10) 0 1px, transparent 1px 80px), ` +
                  `repeating-linear-gradient(0deg,  rgba(255,145,86,0.08) 0 1px, transparent 1px 80px), ` +
                  `radial-gradient(circle at 30% 40%, rgba(255,145,86,0.35) 0 2px, transparent 3px), ` +
                  `radial-gradient(circle at 70% 60%, rgba(255,145,86,0.25) 0 2px, transparent 3px), ` +
                  `radial-gradient(circle at 20% 70%, rgba(255,145,86,0.18) 0 2px, transparent 3px), ` +
                  `radial-gradient(circle at 80% 30%, rgba(255,145,86,0.25) 0 2px, transparent 3px), ` +
                  `linear-gradient(135deg, #1c1b1b 0%, #0e0e0e 100%)`,
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent md:bg-gradient-to-r" />
            {/* Floating Map Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full volcanic-gradient flex items-center justify-center shadow-[0_0_30px_rgba(255,145,86,0.4)] relative animate-pulse">
                <span
                  className="material-symbols-outlined text-on-primary text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
              </div>
              {selected && (
                <div className="mt-3 px-3 py-1.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-primary/20 text-xs font-medium text-on-surface flex items-center gap-1.5 max-w-[200px]">
                  <span className="text-base leading-none">{selected.flag}</span>
                  <span className="truncate">{selected.city}</span>
                </div>
              )}
            </div>
          </section>

          {/* Content Side */}
          <section className="w-full md:w-7/12 p-6 sm:p-8 md:p-14 flex flex-col justify-center relative">
            <div className="mb-6 sm:mb-10">
              <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-on-surface leading-tight mb-3 sm:mb-4 uppercase">
                Onde o teu brilho <br className="hidden sm:block" /> se encontra?
              </h1>
              <p className="text-on-surface-variant text-sm sm:text-base md:text-lg leading-relaxed max-w-md font-body">
                A beleza manifesta-se em lugares específicos. Diz-nos onde estás para que possamos ligar-te aos artesãos e segredos da tua zona.
              </p>
            </div>

            {/* Search */}
            <div className="space-y-6 sm:space-y-8">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                  placeholder="Procurar cidade ou bairro..."
                  className="w-full h-14 sm:h-16 pl-12 sm:pl-14 pr-6 bg-surface-container-low border-none focus:ring-1 focus:ring-primary/40 rounded-lg text-on-surface placeholder:text-on-surface-variant/40 font-medium transition-all shadow-inner outline-none disabled:opacity-60"
                  aria-label="Procurar localização"
                />
              </div>

              {/* Selected pill OR suggestions */}
              {selected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 p-4 rounded-lg bg-surface-container border-t border-primary/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl leading-none">{selected.flag}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {selected.city}, {selected.country}
                        </p>
                        {selected.tagline && (
                          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/50">
                            {selected.tagline}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearSelected}
                      disabled={loading}
                      aria-label="Limpar"
                      className="p-2 rounded-full text-on-surface-variant/60 hover:text-error hover:bg-error/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>

                  {neighborhoods.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[0.6875rem] font-bold tracking-[0.1em] uppercase text-on-surface-variant/60 block">
                        Bairro (opcional)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {neighborhoods.map((n) => {
                          const isOn = neighborhoodChoice === n.name
                          return (
                            <button
                              key={n.name}
                              type="button"
                              onClick={() =>
                                setNeighborhoodChoice(isOn ? '' : n.name)
                              }
                              disabled={loading}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                isOn
                                  ? 'bg-primary-container/15 border-primary-container text-on-surface'
                                  : 'bg-surface-container border-outline-variant/20 text-on-surface-variant hover:border-primary/30 hover:text-on-surface'
                              }`}
                            >
                              {n.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <span className="text-[0.6875rem] font-bold tracking-[0.1em] uppercase text-on-surface-variant/60 block">
                    {query.trim() ? 'Resultados' : 'Sugestões Próximas'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-[280px] overflow-y-auto obsidian-scroll pr-1">
                    {suggestions.length === 0 ? (
                      <p className="text-sm text-on-surface-variant/50 col-span-full py-4">
                        Sem resultados.
                      </p>
                    ) : (
                      suggestions.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => pickSuggestion(s)}
                          disabled={loading}
                          className="flex items-center gap-3 p-3 sm:p-4 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all text-left border-t border-primary/5 group disabled:opacity-60"
                        >
                          <span className="text-lg leading-none">{s.flag}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-on-surface truncate">
                              {s.city}, {s.country}
                            </p>
                            {s.tagline && (
                              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/40 truncate">
                                {s.tagline}
                              </p>
                            )}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!selected || loading}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full volcanic-gradient text-on-primary font-headline text-sm font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                )}
                {loading ? 'A guardar…' : 'Confirmar localização'}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="text-on-surface-variant/60 hover:text-on-surface font-label text-[10px] font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-40"
              >
                Escolher mais tarde
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
