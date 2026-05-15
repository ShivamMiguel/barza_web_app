'use client'

import { useEffect, useRef, useState } from 'react'
import type { ProfessionalService, ProfessionalSpace } from '@/lib/supabase/professional-spaces'

const CATEGORIES = [
  'Corte Clássico', 'Barba & Ritual', 'Colorimetria', 'Tratamento',
  'Tranças', 'Manicure', 'Maquilhagem', 'Sobrancelhas', 'Outro',
]

interface Props {
  isOpen: boolean
  onClose: () => void
  spaces: ProfessionalSpace[]
  service?: ProfessionalService | null
  onSaved: (service: ProfessionalService) => void
}

interface Form {
  professional_space_id: string
  service_name: string
  category: string
  price: string
  preco_promocional: string
  duration_minutes: string
  extra_fee: string
  description: string
  is_active: boolean
  imageFile: File | null
  imagePreview: string | null
}

const empty = (spaceId: string): Form => ({
  professional_space_id: spaceId,
  service_name: '',
  category: CATEGORIES[0],
  price: '',
  preco_promocional: '',
  duration_minutes: '30',
  extra_fee: '',
  description: '',
  is_active: true,
  imageFile: null,
  imagePreview: null,
})

export function ServiceModal({ isOpen, onClose, spaces, service, onSaved }: Props) {
  const isEdit = !!service
  const defaultSpaceId = spaces[0]?.id ?? ''

  const [form, setForm] = useState<Form>(() => empty(defaultSpaceId))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Populate form when editing
  useEffect(() => {
    if (!isOpen) return
    if (service) {
      setForm({
        professional_space_id: service.professional_space_id,
        service_name: service.service_name,
        category: service.category,
        price: String(service.price),
        preco_promocional: service.preco_promocional ? String(service.preco_promocional) : '',
        duration_minutes: String(service.duration_minutes),
        extra_fee: service.extra_fee ? String(service.extra_fee) : '',
        description: service.description ?? '',
        is_active: service.is_active,
        imageFile: null,
        imagePreview: service.image ?? null,
      })
    } else {
      setForm(empty(defaultSpaceId))
    }
    setError(null)
  }, [isOpen, service, defaultSpaceId])

  // Clean up object URL on unmount / file change
  useEffect(() => {
    return () => {
      if (form.imagePreview && form.imageFile) URL.revokeObjectURL(form.imagePreview)
    }
  }, [form.imagePreview, form.imageFile])

  function set<K extends keyof Form>(key: K, val: Form[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('Ficheiro deve ser uma imagem.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('Imagem ultrapassa 5MB.'); return }
    setError(null)
    const url = URL.createObjectURL(file)
    setForm(prev => ({ ...prev, imageFile: file, imagePreview: url }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.service_name.trim() || !form.price || !form.duration_minutes) {
      setError('Preenche os campos obrigatórios.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('professional_space_id', form.professional_space_id)
      fd.append('service_name', form.service_name.trim())
      fd.append('category', form.category)
      fd.append('price', form.price)
      fd.append('duration_minutes', form.duration_minutes)
      fd.append('is_active', String(form.is_active))
      if (form.description.trim()) fd.append('description', form.description.trim())
      if (form.preco_promocional) fd.append('preco_promocional', form.preco_promocional)
      if (form.extra_fee) fd.append('extra_fee', form.extra_fee)
      if (form.imageFile) fd.append('image', form.imageFile)

      const url = isEdit ? `/api/users/me/services/${service!.id}` : '/api/users/me/services'
      const method = isEdit ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, body: fd })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Erro ao guardar.'); return }
      onSaved(json.service)
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[rgba(86,67,58,0.2)] border-t-2 border-t-[#FF9156]"
        style={{ background: 'rgba(14,14,14,0.97)', backdropFilter: 'blur(24px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[rgba(86,67,58,0.12)]">
          <div>
            <p className="text-[10px] font-label uppercase tracking-[0.2em] text-primary-container/70">
              {isEdit ? 'Editar Serviço' : 'Novo Serviço'}
            </p>
            <h2 className="text-lg font-display font-extrabold text-on-surface leading-tight mt-0.5">
              {isEdit ? form.service_name || 'Editar' : 'Adicionar Serviço'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* Image upload */}
          <div>
            <label className={labelCls}>Imagem do Serviço</label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-2xl overflow-hidden border-2 border-dashed border-[rgba(86,67,58,0.3)] hover:border-primary-container/50 transition-colors relative"
              style={{ aspectRatio: '16/7' }}
            >
              {form.imagePreview ? (
                <>
                  <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-on-surface-variant/40">
                  <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                  <span className="text-xs font-label uppercase tracking-widest">Clica para adicionar imagem</span>
                </div>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
          </div>

          {/* Space selector (only if multiple spaces) */}
          {spaces.length > 1 && (
            <div>
              <label className={labelCls}>Espaço Profissional *</label>
              <select
                value={form.professional_space_id}
                onChange={e => set('professional_space_id', e.target.value)}
                className={inputCls}
              >
                {spaces.map(s => (
                  <option key={s.id} value={s.id}>{s.space_name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Service name */}
          <div>
            <label className={labelCls}>Nome do Serviço *</label>
            <input
              type="text"
              value={form.service_name}
              onChange={e => set('service_name', e.target.value)}
              placeholder="Ex: Corte + Barba Completo"
              required
              className={inputCls}
            />
          </div>

          {/* Category + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Categoria *</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Duração (min) *</label>
              <input
                type="number"
                min={5}
                max={480}
                value={form.duration_minutes}
                onChange={e => set('duration_minutes', e.target.value)}
                placeholder="30"
                required
                className={inputCls}
              />
            </div>
          </div>

          {/* Price + Promo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Preço (Kz) *</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="2500"
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Preço Promocional (Kz)</label>
              <input
                type="number"
                min={0}
                value={form.preco_promocional}
                onChange={e => set('preco_promocional', e.target.value)}
                placeholder="Opcional"
                className={inputCls}
              />
            </div>
          </div>

          {/* Extra fee */}
          <div>
            <label className={labelCls}>Taxa Extra (Kz)</label>
            <input
              type="number"
              min={0}
              value={form.extra_fee}
              onChange={e => set('extra_fee', e.target.value)}
              placeholder="Opcional"
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Descrição</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Descreve o serviço..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Is active toggle */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-surface-container border border-[rgba(86,67,58,0.15)]">
            <div>
              <p className="text-sm font-bold text-on-surface">Serviço Activo</p>
              <p className="text-xs text-on-surface-variant/60 mt-0.5">Visível no feed da comunidade</p>
            </div>
            <button
              type="button"
              onClick={() => set('is_active', !form.is_active)}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.is_active ? 'volcanic-gradient' : 'bg-surface-container-high'}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.is_active ? 'left-7' : 'left-1'}`}
              />
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs px-1">{error}</p>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[rgba(86,67,58,0.25)] text-on-surface-variant text-sm font-bold hover:bg-surface-container transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl volcanic-gradient text-on-primary text-sm font-bold uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><span className="material-symbols-outlined text-base animate-spin">progress_activity</span>A guardar…</>
              ) : (
                isEdit ? 'Guardar Alterações' : 'Criar Serviço'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
