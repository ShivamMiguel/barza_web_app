'use client'

import { useState, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { qk } from '@/hooks/api'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LocationData {
  city: string; street: string; address: string
  country: string; latitude: number; longitude: number; neighborhood: string
}

interface Country { name: string; flag: string; dial: string }

interface NominatimResult {
  display_name: string; lat: string; lon: string
  address?: {
    city?: string; town?: string; village?: string; municipality?: string; county?: string
    road?: string; pedestrian?: string; footway?: string
    neighbourhood?: string; suburb?: string; quarter?: string; country?: string
  }
}

type Step = 1 | 2 | 3 | 4

interface SpaceForm {
  space_name: string; logo: File | null; logoPreview: string | null
  locationSearch: string; location: LocationData | null
  country: Country; phone: string
  time_in: string; time_out: string
  selectedServices: string[]; available: boolean
}

// ── Data ───────────────────────────────────────────────────────────────────────

const COUNTRIES: Country[] = [
  { name: 'Angola',               flag: '🇦🇴', dial: '+244' },
  { name: 'Moçambique',           flag: '🇲🇿', dial: '+258' },
  { name: 'Cabo Verde',           flag: '🇨🇻', dial: '+238' },
  { name: 'São Tomé e Príncipe',  flag: '🇸🇹', dial: '+239' },
  { name: 'Guiné-Bissau',         flag: '🇬🇼', dial: '+245' },
  { name: 'Guiné Equatorial',     flag: '🇬🇶', dial: '+240' },
  { name: 'Portugal',             flag: '🇵🇹', dial: '+351' },
  { name: 'Brasil',               flag: '🇧🇷', dial: '+55'  },
  { name: 'África do Sul',        flag: '🇿🇦', dial: '+27'  },
  { name: 'Argélia',              flag: '🇩🇿', dial: '+213' },
  { name: 'Botswana',             flag: '🇧🇼', dial: '+267' },
  { name: 'Camarões',             flag: '🇨🇲', dial: '+237' },
  { name: 'Costa do Marfim',      flag: '🇨🇮', dial: '+225' },
  { name: 'Egito',                flag: '🇪🇬', dial: '+20'  },
  { name: 'Etiópia',              flag: '🇪🇹', dial: '+251' },
  { name: 'Gabão',                flag: '🇬🇦', dial: '+241' },
  { name: 'Ghana',                flag: '🇬🇭', dial: '+233' },
  { name: 'Marrocos',             flag: '🇲🇦', dial: '+212' },
  { name: 'Namíbia',              flag: '🇳🇦', dial: '+264' },
  { name: 'Nigéria',              flag: '🇳🇬', dial: '+234' },
  { name: 'Quénia',               flag: '🇰🇪', dial: '+254' },
  { name: 'Rep. do Congo',        flag: '🇨🇬', dial: '+242' },
  { name: 'RD do Congo',          flag: '🇨🇩', dial: '+243' },
  { name: 'Ruanda',               flag: '🇷🇼', dial: '+250' },
  { name: 'Senegal',              flag: '🇸🇳', dial: '+221' },
  { name: 'Tanzânia',             flag: '🇹🇿', dial: '+255' },
  { name: 'Uganda',               flag: '🇺🇬', dial: '+256' },
  { name: 'Zâmbia',               flag: '🇿🇲', dial: '+260' },
  { name: 'Zimbabwe',             flag: '🇿🇼', dial: '+263' },
  { name: 'Alemanha',             flag: '🇩🇪', dial: '+49'  },
  { name: 'Espanha',              flag: '🇪🇸', dial: '+34'  },
  { name: 'França',               flag: '🇫🇷', dial: '+33'  },
  { name: 'Itália',               flag: '🇮🇹', dial: '+39'  },
  { name: 'Países Baixos',        flag: '🇳🇱', dial: '+31'  },
  { name: 'Reino Unido',          flag: '🇬🇧', dial: '+44'  },
  { name: 'Suíça',                flag: '🇨🇭', dial: '+41'  },
  { name: 'Argentina',            flag: '🇦🇷', dial: '+54'  },
  { name: 'Canadá',               flag: '🇨🇦', dial: '+1'   },
  { name: 'Chile',                flag: '🇨🇱', dial: '+56'  },
  { name: 'Colômbia',             flag: '🇨🇴', dial: '+57'  },
  { name: 'EUA',                  flag: '🇺🇸', dial: '+1'   },
  { name: 'México',               flag: '🇲🇽', dial: '+52'  },
]

const DEFAULT_COUNTRY = COUNTRIES[0] // Angola

const SERVICE_CATEGORIES = [
  { id: 'corte',        label: 'Corte Clássico', icon: 'content_cut' },
  { id: 'barba',        label: 'Barba & Ritual',  icon: 'face'        },
  { id: 'colorimetria', label: 'Colorimetria',    icon: 'palette'     },
  { id: 'tratamento',   label: 'Tratamento',      icon: 'spa'         },
  { id: 'trancas',      label: 'Tranças',         icon: 'style'       },
  { id: 'manicure',     label: 'Manicure',        icon: 'back_hand'   },
  { id: 'maquilhagem',  label: 'Maquilhagem',     icon: 'brush'       },
  { id: 'sobrancelhas', label: 'Sobrancelhas',    icon: 'visibility'  },
]

const INITIAL: SpaceForm = {
  space_name: '', logo: null, logoPreview: null,
  locationSearch: '', location: null,
  country: DEFAULT_COUNTRY, phone: '',
  time_in: '09:00', time_out: '19:00',
  selectedServices: [], available: true,
}

// ── Nominatim helpers ──────────────────────────────────────────────────────────

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

// ── Shared styles ──────────────────────────────────────────────────────────────

const recessedCls = [
  'w-full rounded-lg py-4 text-sm text-on-surface placeholder:text-stone-600',
  'font-body border-0 focus:outline-none focus:ring-1 focus:ring-primary-container/40 transition-all',
].join(' ')

const recessedStyle = { background: '#0e0e0e', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }

// ── Country picker ─────────────────────────────────────────────────────────────

function CountryPicker({ value, onChange }: { value: Country; onChange: (c: Country) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  )

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 h-full rounded-lg min-w-[88px] transition-all hover:brightness-110"
        style={{ ...recessedStyle, paddingTop: '14px', paddingBottom: '14px' }}
      >
        <span className="text-xl leading-none">{value.flag}</span>
        <span className="text-sm font-medium" style={{ color: 'rgba(220,193,181,0.60)' }}>{value.dial}</span>
        <span className="material-symbols-outlined text-sm" style={{ color: 'rgba(220,193,181,0.30)', fontSize: '16px' }}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div
          className="absolute z-30 left-0 w-64 rounded-lg overflow-hidden shadow-2xl"
          style={{
            bottom: 'calc(100% + 6px)',
            background: '#111',
            border: '1px solid rgba(255,145,86,0.18)',
            boxShadow: '0 -16px 40px rgba(0,0,0,0.7)',
          }}
        >
          <div className="px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Procurar país ou indicativo..."
              className="w-full bg-transparent text-xs text-on-surface outline-none placeholder:text-stone-600"
              autoFocus
            />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-4 py-3 text-[11px] text-stone-600">Nenhum resultado</p>
            )}
            {filtered.map(c => (
              <button
                key={c.dial + c.name}
                type="button"
                onMouseDown={() => { onChange(c); setOpen(false); setSearch('') }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.05] transition-colors"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className="text-xs text-on-surface flex-1">{c.name}</span>
                <span className="text-[11px] font-label tabular-nums" style={{ color: 'rgba(220,193,181,0.35)' }}>{c.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Left editorial panel ───────────────────────────────────────────────────────

function LeftPanel({ step }: { step: Step }) {
  const content = {
    1: { tag: 'Identidade do Espaço',  title: <>Comunidade<br /><span style={{ color: '#ff9156' }}>Barza</span></>,        quote: 'O teu nome é a primeira impressão. Escolhe com a intenção de quem constrói uma lenda.' },
    2: { tag: 'Módulo de Localização', title: <>Comunidade<br /><span style={{ color: '#ff9156' }}>Barza</span></>,        quote: 'Onde o talento bruto é moldado em prestígio. Tua presença é o início da tua lenda.' },
    3: { tag: 'Etapa 03 / Ritual',     title: <>O Ritmo do<br /><span style={{ color: '#ff9156' }}>Teu Ofício</span></>,  quote: 'A beleza não tem pressa, mas tem tempo. Define os momentos em que a tua arte se revela.' },
    4: { tag: 'The Subterranean Hearth', title: <>Sê o<br /><span style={{ color: '#ff9156' }}>Arquitecto</span></>,      quote: 'Sê o arquitecto do teu próprio legado. Barza Pro é a ferramenta para quem não se contenta com o comum.' },
  }[step]

  return (
    <div className="hidden md:flex relative overflow-hidden flex-col" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #180c00 0%, #0e0e0e 55%, #1a0800 100%)' }}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,145,86,0.12) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,145,86,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,86,1) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />
      </div>
      <div className="relative mt-auto p-10 space-y-3">
        <p className="text-[10px] font-label tracking-[0.2em] uppercase" style={{ color: 'rgba(255,145,86,0.60)' }}>{content.tag}</p>
        <div className="w-10 h-[3px] rounded-full" style={{ background: '#ff9156' }} />
        <h2 className="font-display font-extrabold text-3xl leading-tight tracking-tight text-white">{content.title}</h2>
        <p className="text-sm leading-relaxed max-w-xs pt-1" style={{ color: 'rgba(220,193,181,0.60)' }}>{content.quote}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(14,14,14,0.6), transparent)' }} />
    </div>
  )
}

// ── Progress bars ──────────────────────────────────────────────────────────────

function ProgressBars({ step }: { step: Step }) {
  return (
    <div className="flex gap-2 mb-8">
      {([1, 2, 3, 4] as Step[]).map(n => (
        <div key={n} className="h-[3px] rounded-full transition-all duration-500" style={{
          width: n === step ? '48px' : '24px',
          background: n === step ? '#ff9156' : n < step ? 'rgba(255,145,86,0.40)' : 'rgba(255,145,86,0.10)',
          boxShadow: n === step ? '0 0 10px rgba(255,145,86,0.5)' : 'none',
        }} />
      ))}
    </div>
  )
}

// ── Step 1: Name + Logo ────────────────────────────────────────────────────────

function Step1Form({ form, set, fileInputRef }: {
  form: SpaceForm
  set: <K extends keyof SpaceForm>(k: K, v: SpaceForm[K]) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  const [dragOver, setDragOver] = useState(false)

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    set('logo', file)
    const reader = new FileReader()
    reader.onload = e => set('logoPreview', e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="space-y-2">
        <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase ml-1">Nome do Espaço *</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl"
            style={{ color: form.space_name ? '#ff9156' : 'rgba(120,100,90,0.6)' }}>storefront</span>
          <input
            type="text" value={form.space_name}
            onChange={e => set('space_name', e.target.value)}
            placeholder="Ex: Studio Fade, Nail Boutique..."
            className={`${recessedCls} pl-12 pr-4`} style={recessedStyle} autoFocus
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase ml-1">Logo / Imagem de Capa</label>
        <div
          className="relative rounded-lg overflow-hidden cursor-pointer transition-all"
          style={{ aspectRatio: '16/7', border: dragOver ? '1.5px dashed rgba(255,145,86,0.7)' : '1.5px dashed rgba(255,255,255,0.10)', ...recessedStyle }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        >
          {form.logoPreview
            ? <img src={form.logoPreview} alt="Logo" className="w-full h-full object-cover" />
            : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-3xl" style={{ color: 'rgba(255,255,255,0.14)' }}>add_photo_alternate</span>
                <p className="text-[10px] font-label uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.18)' }}>Arrastar ou clicar para carregar</p>
              </div>
            )
          }
          <input ref={fileInputRef} type="file" accept="image/*" className="sr-only"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>
        {form.logoPreview && (
          <button type="button" onClick={() => { set('logo', null); set('logoPreview', null) }}
            className="text-[10px] text-stone-500 hover:text-stone-300 transition-colors ml-1">Remover imagem</button>
        )}
      </div>
    </div>
  )
}

// ── Step 2: Location + CountryPicker + Phone ───────────────────────────────────

function Step2Form({ form, set }: {
  form: SpaceForm
  set: <K extends keyof SpaceForm>(k: K, v: SpaceForm[K]) => void
}) {
  const [suggestions, setSuggestions] = useState<LocationData[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleInput(value: string) {
    set('locationSearch', value)
    set('location', null)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 3) { setSuggestions([]); setShowSuggestions(false); return }
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const results = await nominatimSearch(value)
        setSuggestions(results); setShowSuggestions(results.length > 0)
      } catch { setSuggestions([]) }
      finally { setSearching(false) }
    }, 380)
  }

  function selectSuggestion(loc: LocationData) {
    set('locationSearch', loc.address); set('location', loc)
    setSuggestions([]); setShowSuggestions(false)
  }

  async function detectLocation() {
    if (!navigator.geolocation) return
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const loc = await nominatimReverse(pos.coords.latitude, pos.coords.longitude)
          set('locationSearch', loc.address); set('location', loc)
        } catch {
          const fallback: LocationData = {
            city: '', street: '', country: '',
            address: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
            latitude: pos.coords.latitude, longitude: pos.coords.longitude, neighborhood: '',
          }
          set('locationSearch', fallback.address); set('location', fallback)
        }
        setDetecting(false)
      },
      () => setDetecting(false),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const loc = form.location

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Location */}
      <div className="space-y-3">
        <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase ml-1">Localização Profissional</label>
        <div className="relative">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-4 text-xl" style={{ color: '#ff9156' }}>location_on</span>
            <input
              type="text" value={form.locationSearch}
              onChange={e => handleInput(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Procurar morada ou cidade..."
              className={`${recessedCls} pl-12 pr-10`} style={recessedStyle}
            />
            {searching && <span className="material-symbols-outlined absolute right-4 top-4 text-[18px] animate-spin" style={{ color: 'rgba(255,145,86,0.6)' }}>sync</span>}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 rounded-lg overflow-hidden shadow-2xl"
              style={{ background: '#111', border: '1px solid rgba(255,145,86,0.18)', boxShadow: '0 16px 40px rgba(0,0,0,0.7)' }}>
              {suggestions.map((s, i) => (
                <button key={i} type="button" onMouseDown={() => selectSuggestion(s)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors"
                  style={{ borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <span className="material-symbols-outlined text-sm mt-0.5 flex-shrink-0" style={{ color: '#ff9156', fontVariationSettings: "'FILL' 1" }}>place</span>
                  <div className="min-w-0">
                    <p className="text-xs text-on-surface leading-snug truncate">{s.address}</p>
                    {(s.city || s.country) && (
                      <p className="text-[9px] mt-0.5" style={{ color: 'rgba(220,193,181,0.35)' }}>
                        {[s.neighborhood, s.city, s.country].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {loc && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{ background: 'rgba(255,145,86,0.06)', border: '1px solid rgba(255,145,86,0.18)' }}>
            <span className="material-symbols-outlined text-base flex-shrink-0"
              style={{ color: '#ff9156', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-on-surface truncate">
                {[loc.neighborhood, loc.city].filter(Boolean).join(', ') || loc.address.slice(0, 40)}
              </p>
              {loc.country && <p className="text-[9px] mt-0.5 truncate" style={{ color: 'rgba(220,193,181,0.40)' }}>{loc.country}</p>}
            </div>
            <span className="text-[9px] font-label flex-shrink-0 tabular-nums" style={{ color: 'rgba(220,193,181,0.28)' }}>
              {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
            </span>
          </div>
        )}

        {/* CSS map preview */}
        <div className="relative w-full h-24 rounded-lg overflow-hidden"
          style={{ border: '1px solid rgba(255,145,86,0.10)', background: '#080808',
            backgroundImage: 'linear-gradient(rgba(255,145,86,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,86,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px' }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 340 96" preserveAspectRatio="xMidYMid slice">
            <line x1="0" y1="32" x2="340" y2="32" stroke="rgba(255,145,86,0.5)" strokeWidth="1.5"/>
            <line x1="0" y1="64" x2="340" y2="64" stroke="rgba(255,145,86,0.2)" strokeWidth="1"/>
            <line x1="90" y1="0" x2="90" y2="96" stroke="rgba(255,145,86,0.4)" strokeWidth="1.5"/>
            <line x1="210" y1="0" x2="210" y2="96" stroke="rgba(255,145,86,0.2)" strokeWidth="1"/>
            <rect x="100" y="38" width="45" height="20" fill="rgba(255,145,86,0.06)" rx="2"/>
            <rect x="155" y="38" width="40" height="20" fill="rgba(255,145,86,0.04)" rx="2"/>
          </svg>
          {loc && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ff9156' }} />
              <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(255,145,86,0.4)' }} />
            </div>
          )}
          <button type="button" onClick={detectLocation} disabled={detecting}
            className="absolute bottom-2.5 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
            style={{ background: 'rgba(32,30,30,0.90)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="material-symbols-outlined text-[14px]" style={{ color: '#ff9156', fontVariationSettings: "'FILL' 1" }}>
              {detecting ? 'sync' : 'my_location'}
            </span>
            <span className="text-[10px] font-label tracking-wider text-white">{detecting ? 'A DETECTAR...' : 'DETECTAR ATUAL'}</span>
          </button>
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-3">
        <label className="block text-[10px] font-label font-bold tracking-widest text-on-surface-variant uppercase ml-1">Contacto de Mestre</label>
        <div className="flex gap-3 items-stretch">
          <CountryPicker value={form.country} onChange={c => set('country', c)} />
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-xl"
              style={{ color: form.phone ? '#ff9156' : 'rgba(120,100,90,0.6)' }}>call</span>
            <input
              type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="9xx xxx xxx"
              className={`${recessedCls} pl-12 pr-4 h-full`} style={recessedStyle}
            />
          </div>
        </div>
        <p className="text-[10px] text-stone-500 italic ml-1">Utilizado apenas para verificações seguras de identidade.</p>
      </div>
    </div>
  )
}

// ── Step 3: Service categories + Time pickers ──────────────────────────────────

function Step3Form({ form, set }: {
  form: SpaceForm
  set: <K extends keyof SpaceForm>(k: K, v: SpaceForm[K]) => void
}) {
  function toggleService(id: string) {
    const next = form.selectedServices.includes(id)
      ? form.selectedServices.filter(s => s !== id)
      : [...form.selectedServices, id]
    set('selectedServices', next)
  }

  return (
    <div className="flex flex-col gap-7 flex-1">
      {/* Service cards */}
      <section>
        <div className="flex justify-between items-end mb-5">
          <label className="text-[11px] font-label tracking-widest uppercase" style={{ color: 'rgba(220,193,181,0.35)' }}>
            Serviços de Assinatura
          </label>
          <span className="text-[10px] italic font-body" style={{ color: 'rgba(255,145,86,0.55)' }}>Múltipla escolha</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SERVICE_CATEGORIES.map(svc => {
            const sel = form.selectedServices.includes(svc.id)
            return (
              <button
                key={svc.id} type="button" onClick={() => toggleService(svc.id)}
                className="p-4 rounded-xl border text-left transition-all duration-200"
                style={{
                  background: sel ? '#2a2a2a' : '#201f1f',
                  borderColor: sel ? 'rgba(255,145,86,0.40)' : 'rgba(86,67,58,0.15)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="material-symbols-outlined text-xl" style={{ color: 'rgba(255,145,86,0.80)' }}>{svc.icon}</span>
                  <div className="w-4 h-4 rounded-full border flex items-center justify-center transition-all"
                    style={{ borderColor: sel ? '#ff9156' : 'rgba(86,67,58,0.35)', background: sel ? '#ff9156' : 'transparent' }}>
                    {sel && (
                      <span className="material-symbols-outlined text-[10px]"
                        style={{ color: '#341100', fontVariationSettings: "'FILL' 1", fontSize: '10px' }}>check</span>
                    )}
                  </div>
                </div>
                <p className="text-sm font-semibold text-on-surface">{svc.label}</p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Time pickers */}
      <section>
        <label className="text-[11px] font-label tracking-widest uppercase block mb-5" style={{ color: 'rgba(220,193,181,0.35)' }}>
          Disponibilidade
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Início da Jornada', key: 'time_in'  as const, icon: 'schedule' },
            { label: 'Fim da Jornada',    key: 'time_out' as const, icon: 'bedtime'  },
          ].map(({ label, key, icon }) => (
            <div key={key}>
              <label className="block text-[10px] mb-2 ml-1" style={{ color: 'rgba(220,193,181,0.40)' }}>{label}</label>
              <div className="relative">
                <input
                  type="time" value={form[key]} onChange={e => set(key, e.target.value)}
                  className="w-full rounded-xl py-4 px-5 text-on-surface font-display text-lg focus:ring-1 focus:ring-primary-container/40 transition-all outline-none border-0"
                  style={{ background: '#1c1b1b' }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <span className="material-symbols-outlined text-xl" style={{ color: 'rgba(255,145,86,0.45)' }}>{icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── Step 4: Confirmation summary ───────────────────────────────────────────────

function Step4Summary({ form, set }: {
  form: SpaceForm
  set: <K extends keyof SpaceForm>(k: K, v: SpaceForm[K]) => void
}) {
  const servicesList = SERVICE_CATEGORIES
    .filter(s => form.selectedServices.includes(s.id))
    .map(s => s.label)
  const firstService = servicesList[0] ?? '—'

  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="space-y-1">
        <h1 className="font-display font-bold text-4xl text-white tracking-tight leading-none">
          Pronto para<br /><span style={{ color: '#ff9156' }}>Transformar.</span>
        </h1>
        <p className="text-sm leading-relaxed pt-2" style={{ color: 'rgba(220,193,181,0.55)' }}>
          O teu espaço não é apenas um local — é um destino. Confirma os detalhes e abre ao mundo.
        </p>
      </div>

      {/* Bento summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-lg" style={{ background: '#1c1b1b' }}>
          <span className="text-[9px] font-label tracking-widest uppercase block mb-1.5" style={{ color: 'rgba(120,100,90,0.65)' }}>Identidade</span>
          <p className="text-sm font-semibold text-on-surface truncate">{form.space_name || '—'}</p>
        </div>

        <div className="p-4 rounded-lg" style={{ background: '#1c1b1b' }}>
          <span className="text-[9px] font-label tracking-widest uppercase block mb-1.5" style={{ color: 'rgba(120,100,90,0.65)' }}>Especialidade</span>
          <p className="text-sm font-semibold text-on-surface truncate">{firstService}</p>
        </div>

        {form.location?.city && (
          <div className="p-4 rounded-lg" style={{ background: '#1c1b1b' }}>
            <span className="text-[9px] font-label tracking-widest uppercase block mb-1.5" style={{ color: 'rgba(120,100,90,0.65)' }}>Localização</span>
            <p className="text-sm font-semibold text-on-surface truncate">{form.location.city}</p>
          </div>
        )}

        <div
          className={`p-4 rounded-lg flex justify-between items-center gap-3 ${form.location?.city ? '' : 'col-span-2'}`}
          style={{ background: '#1c1b1b' }}
        >
          <div className="min-w-0">
            <span className="text-[9px] font-label tracking-widest uppercase block mb-1.5" style={{ color: 'rgba(120,100,90,0.65)' }}>Disponibilidade Imediata</span>
            <p className="text-sm font-semibold text-on-surface truncate">{form.available ? 'Visível na comunidade' : 'Indisponível'}</p>
          </div>
          <button
            type="button"
            onClick={() => set('available', !form.available)}
            className="relative w-11 h-6 rounded-full flex-shrink-0 transition-all"
            style={{ background: form.available ? '#ff9156' : '#2a2a2a' }}
          >
            <div className="absolute top-[2px] w-5 h-5 rounded-full bg-white transition-all shadow-sm"
              style={{ left: form.available ? 'calc(100% - 22px)' : '2px' }} />
          </button>
        </div>

        {servicesList.length > 1 && (
          <div className="col-span-2 p-4 rounded-lg" style={{ background: '#1c1b1b' }}>
            <span className="text-[9px] font-label tracking-widest uppercase block mb-2" style={{ color: 'rgba(120,100,90,0.65)' }}>Todos os Serviços</span>
            <div className="flex flex-wrap gap-1.5">
              {servicesList.map(s => (
                <span key={s} className="px-2 py-0.5 rounded text-[10px] font-label"
                  style={{ background: 'rgba(255,145,86,0.10)', color: 'rgba(255,145,86,0.80)', border: '1px solid rgba(255,145,86,0.15)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-[10px] font-label leading-relaxed" style={{ color: 'rgba(120,100,90,0.50)' }}>
        Ao clicar em "Abrir ao Mundo", confirmas a aceitação dos termos da Elite Specialist de Barza.
      </p>
    </div>
  )
}

// ── Root modal ─────────────────────────────────────────────────────────────────

type Props = { isOpen: boolean; onClose: () => void }

export function CreateSpaceModal({ isOpen, onClose }: Props) {
  const [step, setStep]      = useState<Step>(1)
  const [form, setForm]      = useState<SpaceForm>(INITIAL)
  const [submitting, setSub] = useState(false)
  const [error, setError]    = useState<string | null>(null)
  const fileInputRef         = useRef<HTMLInputElement>(null)
  const queryClient          = useQueryClient()

  if (!isOpen) return null

  function handleClose() { setStep(1); setForm(INITIAL); setError(null); onClose() }

  function set<K extends keyof SpaceForm>(key: K, value: SpaceForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function canAdvance() {
    if (step === 1) return form.space_name.trim().length >= 2
    return true
  }

  function advance() {
    if (!canAdvance()) return
    if (step < 4) { setStep(s => (s + 1) as Step); return }
    handleSubmit()
  }

  async function handleSubmit() {
    setSub(true); setError(null)
    try {
      const beauty_services = SERVICE_CATEGORIES
        .filter(s => form.selectedServices.includes(s.id))
        .map(s => s.label).join(', ')

      const fd = new FormData()
      fd.append('space_name',     form.space_name.trim())
      if (form.logo) fd.append('logo', form.logo)
      fd.append('location_space', form.location ? JSON.stringify(form.location) : '')
      fd.append('phone',          `${form.country.dial} ${form.phone.trim()}`)
      fd.append('time_in',        form.time_in)
      fd.append('time_out',       form.time_out)
      fd.append('beauty_services', beauty_services)
      fd.append('space',          'true')
      fd.append('available',      String(form.available))

      const res = await fetch('/api/users/me/spaces', { method: 'POST', body: fd })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? 'Erro ao criar espaço')
        setSub(false); return
      }

      await queryClient.invalidateQueries({ queryKey: qk.mySpaces() })
      handleClose()
    } catch {
      setError('Erro de ligação. Tenta novamente.')
      setSub(false)
    }
  }

  const stepLabel = step.toString().padStart(2, '0')
  const isLast    = step === 4

  const STEP_META = {
    1: { tag: 'Identidade do Espaço',   title: 'Batiza o teu Legado',              sub: 'O nome do teu espaço é a primeira impressão. Escolhe com intenção.' },
    2: { tag: 'Módulo de Localização',  title: 'Onde o teu Brilho se Encontra',    sub: 'Diz-nos as coordenadas da tua mestria para que o mundo saiba onde a arte acontece.' },
    3: { tag: 'Etapa 03 / Ritual',      title: 'O Ritmo do teu Ofício',            sub: 'Define os teus serviços de assinatura e os horários sagrados da tua arte.' },
    4: { tag: 'Passo 04 de 04',         title: '',                                 sub: '' },
  }[step]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none fixed -top-1/4 -left-1/4 w-[50%] h-[50%] rounded-full"
        style={{ background: 'rgba(255,145,86,0.07)', filter: 'blur(120px)' }} />
      <div className="pointer-events-none fixed -bottom-1/4 -right-1/4 w-[40%] h-[40%] rounded-full"
        style={{ background: 'rgba(120,40,0,0.12)', filter: 'blur(100px)' }} />

      {/* Modal */}
      <div
        className="relative w-full max-w-4xl grid md:grid-cols-2 rounded-xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(53,53,52,0.70) 0%, rgba(32,31,31,0.82) 100%)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,145,86,0.20)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        <LeftPanel step={step} />

        {/* Right column */}
        <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto max-h-[90vh]"
          style={{ background: 'rgba(14,14,14,0.30)' }}>
          <ProgressBars step={step} />

          {/* Header — hidden on step 4 (it has its own title inside Step4Summary) */}
          {step !== 4 && (
            <header className="mb-7">
              <span className="text-[10px] font-label font-bold tracking-[0.2em] uppercase block mb-2" style={{ color: '#ff9156' }}>
                {STEP_META.tag}
              </span>
              <h1 className="font-display font-bold text-2xl text-white mb-2 tracking-tight leading-tight">
                {STEP_META.title}
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(220,193,181,0.50)' }}>
                {STEP_META.sub}
              </p>
            </header>
          )}

          {step === 1 && <Step1Form form={form} set={set} fileInputRef={fileInputRef} />}
          {step === 2 && <Step2Form form={form} set={set} />}
          {step === 3 && <Step3Form form={form} set={set} />}
          {step === 4 && <Step4Summary form={form} set={set} />}

          {error && <p className="mt-3 text-[11px] font-label" style={{ color: '#ff6b6b' }}>{error}</p>}

          {/* Actions */}
          <div className="pt-6 space-y-3">
            <button
              onClick={advance}
              disabled={!canAdvance() || submitting}
              className="w-full font-headline font-bold py-5 rounded-xl flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-[0.98] group disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #ff9156 0%, #fc7c31 100%)', boxShadow: '0 0 30px rgba(255,145,86,0.20)', color: '#341100' }}
            >
              <span className="tracking-tight text-base font-extrabold uppercase">
                {submitting ? 'A criar...' : isLast ? 'Abrir ao Mundo' : step === 3 ? 'Definir Ritual' : 'Continuar'}
              </span>
              {!submitting && (
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                  {isLast ? 'public' : 'arrow_forward'}
                </span>
              )}
            </button>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={step === 1 ? handleClose : () => setStep(s => (s - 1) as Step)}
                className="flex items-center gap-2 text-[11px] font-label tracking-widest uppercase transition-colors hover:text-white group"
                style={{ color: 'rgba(120,100,90,0.55)' }}
              >
                <span className="material-symbols-outlined text-sm group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                {step === 1 ? 'Cancelar' : 'Rever Detalhes'}
              </button>

              {step === 3 && (
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="text-[11px] font-label tracking-widest uppercase transition-colors hover:text-white"
                  style={{ color: 'rgba(120,100,90,0.40)' }}
                >
                  Pular por agora
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(255,145,86,0.05)', filter: 'blur(40px)' }} />
      </div>

      {/* Status strip */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{ background: 'rgba(14,14,14,0.72)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.04)' }}>
        {[
          { icon: 'lock',          text: 'Sessão Segura' },
          { icon: null,            text: `Etapa ${stepLabel} de 04` },
          { icon: 'support_agent', text: 'Suporte Barza' },
        ].map((item, i) => (
          <span key={i} className="flex items-center gap-1 text-[9px] font-label uppercase tracking-widest" style={{ color: 'rgba(220,193,181,0.28)' }}>
            {i > 0 && <span className="mx-1" style={{ color: 'rgba(220,193,181,0.10)' }}>•</span>}
            {item.icon && <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>}
            {item.text}
          </span>
        ))}
      </div>
    </div>
  )
}
