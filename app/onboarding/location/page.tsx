'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Nominatim types & helpers ────────────────────────────────────────────────

interface LocationData {
  city: string
  street: string
  address: string
  country: string
  latitude: number
  longitude: number
  neighborhood: string
}

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  address?: {
    city?: string; town?: string; village?: string; municipality?: string; county?: string
    road?: string; pedestrian?: string; footway?: string
    neighbourhood?: string; suburb?: string; quarter?: string; country?: string
  }
}

function parseNominatim(r: NominatimResult): LocationData {
  const a = r.address ?? {}
  return {
    city:         a.city ?? a.town ?? a.village ?? a.municipality ?? a.county ?? '',
    street:       a.road ?? a.pedestrian ?? a.footway ?? '',
    address:      r.display_name,
    country:      a.country ?? '',
    latitude:     parseFloat(r.lat),
    longitude:    parseFloat(r.lon),
    neighborhood: a.neighbourhood ?? a.suburb ?? a.quarter ?? '',
  }
}

async function nominatimSearch(q: string): Promise<LocationData[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
    { headers: { 'Accept-Language': 'pt-AO, pt, en' } }
  )
  return (await res.json() as NominatimResult[]).map(parseNominatim)
}

async function nominatimReverse(lat: number, lon: number): Promise<LocationData> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
    { headers: { 'Accept-Language': 'pt-AO, pt, en' } }
  )
  return parseNominatim(await res.json() as NominatimResult)
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingLocationPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<LocationData[]>([])
  const [selected, setSelected] = useState<LocationData | null>(null)
  const [detecting, setDetecting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounced Nominatim search
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return }
    const id = window.setTimeout(async () => {
      try {
        const results = await nominatimSearch(query)
        setSuggestions(results)
      } catch {
        setSuggestions([])
      }
    }, 400)
    return () => window.clearTimeout(id)
  }, [query])

  async function detectLocation() {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada neste dispositivo.')
      return
    }
    setDetecting(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await nominatimReverse(pos.coords.latitude, pos.coords.longitude)
          setSelected(loc)
          setQuery('')
          setSuggestions([])
        } catch {
          setError('Não foi possível obter o endereço. Tenta pesquisar manualmente.')
        } finally {
          setDetecting(false)
        }
      },
      () => {
        setError('Permissão de localização negada.')
        setDetecting(false)
      }
    )
  }

  function pickSuggestion(loc: LocationData) {
    setSelected(loc)
    setQuery('')
    setSuggestions([])
  }

  function clearSelected() {
    setSelected(null)
    setError(null)
  }

  async function handleConfirm() {
    if (loading || !selected) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: selected }),
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

      {/* Top nav */}
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
            <div
              className="absolute inset-0 opacity-40 grayscale contrast-125"
              style={{
                background:
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
              <div className={`w-12 h-12 rounded-full volcanic-gradient flex items-center justify-center shadow-[0_0_30px_rgba(255,145,86,0.4)] relative ${detecting ? 'animate-pulse' : ''}`}>
                {detecting ? (
                  <span className="material-symbols-outlined text-on-primary text-2xl animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined text-on-primary text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    location_on
                  </span>
                )}
              </div>
              {selected && (
                <div className="mt-3 px-3 py-1.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-primary/20 text-xs font-medium text-on-surface flex items-center gap-1.5 max-w-[200px]">
                  <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  <span className="truncate">{selected.city || selected.address.split(',')[0]}</span>
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

            <div className="space-y-4 sm:space-y-6">
              {/* Search + detect row */}
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary">
                    <span className="material-symbols-outlined">search</span>
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
                    disabled={loading || detecting}
                    placeholder="Pesquisar cidade, bairro ou endereço..."
                    className="w-full h-14 sm:h-16 pl-12 sm:pl-14 pr-4 bg-surface-container-low border-none focus:ring-1 focus:ring-primary/40 rounded-lg text-on-surface placeholder:text-on-surface-variant/40 font-medium transition-all shadow-inner outline-none disabled:opacity-60"
                    aria-label="Pesquisar localização"
                  />
                </div>
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={loading || detecting}
                  title="Detectar localização actual"
                  className="h-14 sm:h-16 px-4 rounded-lg bg-surface-container-low text-primary hover:bg-surface-container transition-colors disabled:opacity-40 flex-shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
                >
                  {detecting ? (
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  ) : (
                    <span className="material-symbols-outlined text-base">my_location</span>
                  )}
                  <span className="hidden sm:inline">{detecting ? 'A detectar…' : 'Actual'}</span>
                </button>
              </div>

              {/* Selected pill */}
              {selected && (
                <div className="flex items-start justify-between gap-3 p-4 rounded-lg bg-surface-container border-t border-primary/20">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      location_on
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface">
                        {selected.city || selected.neighborhood}{selected.country ? `, ${selected.country}` : ''}
                      </p>
                      {selected.neighborhood && selected.city && (
                        <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 mt-0.5">
                          {selected.neighborhood}
                        </p>
                      )}
                      <p className="text-[10px] text-on-surface-variant/40 mt-1 leading-relaxed line-clamp-2">
                        {selected.address}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={clearSelected}
                    disabled={loading}
                    aria-label="Limpar"
                    className="p-2 rounded-full text-on-surface-variant/60 hover:text-error hover:bg-error/10 transition-colors flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              )}

              {/* Suggestions list */}
              {!selected && suggestions.length > 0 && (
                <div className="space-y-2 max-h-[280px] overflow-y-auto obsidian-scroll pr-1">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => pickSuggestion(s)}
                      disabled={loading}
                      className="w-full flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all text-left border-t border-primary/5 disabled:opacity-60"
                    >
                      <span className="material-symbols-outlined text-primary/60 text-base flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                        location_on
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface">
                          {s.city || s.neighborhood || s.address.split(',')[0]}
                          {s.country ? `, ${s.country}` : ''}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/40 truncate mt-0.5">
                          {s.address}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Empty state when typing but no results */}
              {!selected && query.trim() && suggestions.length === 0 && (
                <p className="text-sm text-on-surface-variant/50 py-2">
                  Sem resultados. Tenta um termo diferente.
                </p>
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
