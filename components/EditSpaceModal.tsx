'use client'

import { useEffect, useRef, useState } from 'react'
import type { ProfessionalSpace } from '@/lib/supabase/professional-spaces'

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'corte',        label: 'Corte Clássico', icon: 'content_cut'  },
  { id: 'barba',        label: 'Barba & Ritual',  icon: 'face'         },
  { id: 'colorimetria', label: 'Colorimetria',    icon: 'palette'      },
  { id: 'tratamento',   label: 'Tratamento',      icon: 'spa'          },
  { id: 'trancas',      label: 'Tranças',         icon: 'style'        },
  { id: 'manicure',     label: 'Manicure',        icon: 'back_hand'    },
  { id: 'maquilhagem',  label: 'Maquilhagem',     icon: 'brush'        },
  { id: 'sobrancelhas', label: 'Sobrancelhas',    icon: 'visibility'   },
]

const COUNTRIES = [
  { flag: '🇦🇴', dial: '+244' }, { flag: '🇲🇿', dial: '+258' },
  { flag: '🇨🇻', dial: '+238' }, { flag: '🇵🇹', dial: '+351' },
  { flag: '🇧🇷', dial: '+55'  }, { flag: '🇺🇸', dial: '+1'   },
  { flag: '🇬🇧', dial: '+44'  }, { flag: '🇿🇦', dial: '+27'  },
]

interface LocationData {
  city: string; street: string; address: string
  country: string; latitude: number; longitude: number; neighborhood: string
}

interface NominatimResult {
  display_name: string
  address?: {
    city?: string; town?: string; village?: string; road?: string
    neighbourhood?: string; suburb?: string; country?: string
  }
  lat: string; lon: string
}

function parseNominatim(r: NominatimResult): LocationData {
  const a = r.address ?? {}
  return {
    city: a.city ?? a.town ?? a.village ?? '',
    street: a.road ?? '',
    neighborhood: a.neighbourhood ?? a.suburb ?? '',
    country: a.country ?? '',
    address: r.display_name,
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
  }
}

async function nominatimSearch(q: string): Promise<LocationData[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
    { headers: { 'Accept-Language': 'pt-AO, pt, en' } },
  )
  return (await res.json() as NominatimResult[]).map(parseNominatim)
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean
  onClose: () => void
  space: ProfessionalSpace
  onSaved: () => void
}

interface Form {
  space_name: string
  available: boolean
  phone: string
  dialCode: string
  time_in: string
  time_out: string
  selectedCategories: string[]
  logoFile: File | null
  logoPreview: string | null
  location: LocationData | null
  locationSearch: string
  locationResults: LocationData[]
  locationSearching: boolean
  showLocationSearch: boolean
}

function buildInitialForm(space: ProfessionalSpace): Form {
  const currentDial = COUNTRIES[0].dial
  const rawPhone = space.phone ?? ''
  const matchedCountry = COUNTRIES.find(c => rawPhone.startsWith(c.dial))
  const dial = matchedCountry?.dial ?? currentDial
  const phone = matchedCountry ? rawPhone.slice(dial.length).trim() : rawPhone

  const existingCats = (space.beauty_services ?? '')
    .split(',').map(s => s.trim()).filter(Boolean)
  const selectedCategories = CATEGORIES
    .filter(c => existingCats.includes(c.label))
    .map(c => c.id)

  const loc = space.location_space as Record<string, string> | null

  return {
    space_name: space.space_name,
    available: space.available ?? false,
    phone,
    dialCode: dial,
    time_in: space.time_in?.slice(0, 5) ?? '',
    time_out: space.time_out?.slice(0, 5) ?? '',
    selectedCategories,
    logoFile: null,
    logoPreview: space.logo ?? null,
    location: loc ? (loc as unknown as LocationData) : null,
    locationSearch: '',
    locationResults: [],
    locationSearching: false,
    showLocationSearch: false,
  }
}

export function EditSpaceModal({ isOpen, onClose, space, onSaved }: Props) {
  const [form, setForm] = useState<Form>(() => buildInitialForm(space))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countryOpen, setCountryOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) { setForm(buildInitialForm(space)); setError(null) }
  }, [isOpen, space])

  useEffect(() => {
    if (!form.logoFile) return
    const url = URL.createObjectURL(form.logoFile)
    setForm(prev => ({ ...prev, logoPreview: url }))
    return () => URL.revokeObjectURL(url)
  }, [form.logoFile])

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  function toggleCategory(id: string) {
    setForm(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(id)
        ? prev.selectedCategories.filter(c => c !== id)
        : [...prev.selectedCategories, id],
    }))
  }

  function handleLocationSearchChange(val: string) {
    set('locationSearch', val)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (val.length < 2) { set('locationResults', []); return }
    searchTimer.current = setTimeout(async () => {
      set('locationSearching', true)
      try {
        const results = await nominatimSearch(val)
        set('locationResults', results)
      } finally {
        set('locationSearching', false)
      }
    }, 380)
  }

  function selectLocation(loc: LocationData) {
    setForm(prev => ({
      ...prev,
      location: loc,
      locationSearch: '',
      locationResults: [],
      showLocationSearch: false,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.space_name.trim()) { setError('Nome obrigatório.'); return }
    setSaving(true); setError(null)
    try {
      const fd = new FormData()
      fd.append('space_name', form.space_name.trim())
      fd.append('available', String(form.available))
      fd.append('phone', `${form.dialCode} ${form.phone.trim()}`)
      fd.append('time_in', form.time_in)
      fd.append('time_out', form.time_out)
      const beauty = CATEGORIES
        .filter(c => form.selectedCategories.includes(c.id))
        .map(c => c.label).join(', ')
      fd.append('beauty_services', beauty)
      fd.append('location_space', form.location ? JSON.stringify(form.location) : '')
      if (form.logoFile) fd.append('logo', form.logoFile)

      const res = await fetch(`/api/users/me/spaces/${space.id}`, { method: 'PATCH', body: fd })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Erro ao guardar.'); return }
      onSaved()
      onClose()
    } catch {
      setError('Erro de conexão.')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  const inputCls = 'w-full bg-[#0e0e0e] border border-[rgba(86,67,58,0.25)] rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-[rgba(255,145,86,0.5)] transition-colors'
  const labelCls = 'block text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 mb-1.5'

  const currentLoc = form.location as Record<string, string> | null
  const locDisplay = currentLoc
    ? [currentLoc.neighborhood, currentLoc.city, currentLoc.country].filter(Boolean).join(', ')
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[rgba(86,67,58,0.2)] border-t-2 border-t-[#FF9156]"
        style={{ background: 'rgba(14,14,14,0.97)', backdropFilter: 'blur(24px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[rgba(86,67,58,0.12)] sticky top-0 z-10" style={{ background: 'rgba(14,14,14,0.97)' }}>
          <div>
            <p className="text-[10px] font-label uppercase tracking-[0.2em] text-primary-container/70">Editar Espaço</p>
            <h2 className="text-lg font-display font-extrabold text-on-surface leading-tight mt-0.5">{space.space_name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Logo */}
          <div>
            <label className={labelCls}>Logo</label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-[rgba(86,67,58,0.3)] hover:border-primary-container/50 transition-colors relative group"
            >
              {form.logoPreview ? (
                <>
                  <img src={form.logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-on-surface-variant/40">
                  <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                </div>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; e.target.value = ''; if (f) set('logoFile', f) }} />
          </div>

          {/* Space name */}
          <div>
            <label className={labelCls}>Nome do Espaço *</label>
            <input type="text" value={form.space_name} onChange={e => set('space_name', e.target.value)}
              placeholder="Nome do espaço" required className={inputCls} />
          </div>

          {/* Available toggle */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-surface-container border border-[rgba(86,67,58,0.15)]">
            <div>
              <p className="text-sm font-bold text-on-surface">Disponível</p>
              <p className="text-xs text-on-surface-variant/60 mt-0.5">Aceitar agendamentos</p>
            </div>
            <button type="button" onClick={() => set('available', !form.available)}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.available ? 'volcanic-gradient' : 'bg-surface-container-high'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.available ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls}>Telefone</label>
            <div className="flex gap-2 relative">
              <button type="button" onClick={() => setCountryOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-3 bg-[#0e0e0e] border border-[rgba(86,67,58,0.25)] rounded-xl text-sm hover:border-[rgba(255,145,86,0.5)] transition-colors flex-shrink-0">
                <span>{COUNTRIES.find(c => c.dial === form.dialCode)?.flag ?? '🇦🇴'}</span>
                <span className="text-on-surface-variant/60 text-xs">{form.dialCode}</span>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant/40">expand_more</span>
              </button>
              {countryOpen && (
                <div className="absolute left-0 z-20 w-36 rounded-xl overflow-hidden border border-[rgba(86,67,58,0.25)] bg-[#111] shadow-xl"
                  style={{ bottom: 'calc(100% + 6px)' }}>
                  {COUNTRIES.map(c => (
                    <button key={c.dial} type="button"
                      onMouseDown={() => { set('dialCode', c.dial); setCountryOpen(false) }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-surface-container text-on-surface transition-colors">
                      <span>{c.flag}</span><span className="text-xs text-on-surface-variant/70">{c.dial}</span>
                    </button>
                  ))}
                </div>
              )}
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                placeholder="000 000 000" className={`${inputCls} flex-1`} />
            </div>
          </div>

          {/* Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Abertura</label>
              <input type="time" value={form.time_in} onChange={e => set('time_in', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Encerramento</label>
              <input type="time" value={form.time_out} onChange={e => set('time_out', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className={labelCls}>Categorias de Serviço</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => {
                const active = form.selectedCategories.includes(cat.id)
                return (
                  <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                      active
                        ? 'border-primary-container/50 bg-primary-container/10 text-primary-container'
                        : 'border-[rgba(86,67,58,0.2)] bg-surface-container text-on-surface-variant/60 hover:border-[rgba(86,67,58,0.4)]'
                    }`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls.replace('mb-1.5', '')}>Localização</label>
              <button type="button" onClick={() => set('showLocationSearch', !form.showLocationSearch)}
                className="text-[10px] font-label uppercase tracking-widest text-primary-container hover:underline">
                {form.showLocationSearch ? 'Fechar' : 'Atualizar'}
              </button>
            </div>

            {locDisplay && !form.showLocationSearch && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container border border-[rgba(86,67,58,0.15)]">
                <span className="material-symbols-outlined text-primary-container text-sm">location_on</span>
                <span className="text-xs text-on-surface truncate">{locDisplay}</span>
              </div>
            )}

            {form.showLocationSearch && (
              <div className="relative">
                <input type="text" value={form.locationSearch}
                  onChange={e => handleLocationSearchChange(e.target.value)}
                  placeholder="Pesquisar localização…" className={inputCls}
                  onBlur={() => setTimeout(() => set('locationResults', []), 150)} />
                {form.locationSearching && (
                  <span className="material-symbols-outlined text-on-surface-variant/40 absolute right-3 top-3 text-lg animate-spin">progress_activity</span>
                )}
                {form.locationResults.length > 0 && (
                  <div className="absolute left-0 right-0 z-20 mt-1 rounded-xl overflow-hidden border border-[rgba(86,67,58,0.25)] bg-[#111] shadow-xl">
                    {form.locationResults.map((loc, i) => (
                      <button key={i} type="button" onMouseDown={() => selectLocation(loc)}
                        className="w-full text-left px-4 py-3 text-xs text-on-surface hover:bg-surface-container transition-colors border-b border-[rgba(86,67,58,0.1)] last:border-0">
                        <span className="font-bold">{loc.city || loc.neighborhood}</span>
                        {loc.country && <span className="text-on-surface-variant/50 ml-1">· {loc.country}</span>}
                        <p className="text-on-surface-variant/40 truncate mt-0.5">{loc.address}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[rgba(86,67,58,0.25)] text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl volcanic-gradient text-on-primary text-sm font-bold uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {saving
                ? <><span className="material-symbols-outlined text-base animate-spin">progress_activity</span>A guardar…</>
                : 'Guardar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
