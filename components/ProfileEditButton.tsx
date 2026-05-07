'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/lib/supabase/profile'

interface Props {
  profile: UserProfile
  className?: string
}

export function ProfileEditButton({ profile, className }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState(profile.full_name)
  const [profession, setProfession] = useState(profile.profession || '')
  const [bio, setBio] = useState(profile.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError('O nome não pode estar vazio.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, profession, bio, avatar_url: avatarUrl }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erro ao guardar.')
        return
      }
      setIsOpen(false)
      router.refresh()
    } catch {
      setError('Erro de rede. Tenta novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleOpen = () => {
    setFullName(profile.full_name)
    setProfession(profile.profession || '')
    setBio(profile.bio || '')
    setAvatarUrl(profile.avatar_url || '')
    setError(null)
    setIsOpen(true)
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className={`volcanic-gradient px-8 py-3 rounded-xl font-bold text-on-primary text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-transform${className ? ` ${className}` : ''}`}
      >
        Editar Perfil
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !saving && setIsOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg liquid-obsidian-glass refractive-highlight glow-bloom rounded-2xl overflow-hidden border border-[rgba(86,67,58,0.1)]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(86,67,58,0.1)]">
              <h2 className="font-headline font-bold text-lg text-on-surface tracking-tight">Editar Perfil</h2>
              <button
                onClick={() => !saving && setIsOpen(false)}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 flex flex-col gap-5">
              {/* Avatar preview */}
              <div className="flex justify-center mb-2">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary-container/40">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-headline font-bold text-white text-2xl select-none"
                      style={{ backgroundColor: getPreviewColor(fullName) }}
                    >
                      {getPreviewInitials(fullName)}
                    </div>
                  )}
                </div>
              </div>

              <Field label="URL do Avatar">
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className={inputClass}
                />
              </Field>

              <Field label="Nome Completo">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="O teu nome"
                  className={inputClass}
                />
              </Field>

              <Field label="Profissão">
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="ex: Barbeiro, Nail Artist, Cabeleireiro..."
                  className={inputClass}
                />
              </Field>

              <Field label="Biografia">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conta algo sobre ti..."
                  rows={4}
                  maxLength={300}
                  className={`${inputClass} resize-none`}
                />
                <span className="text-[11px] text-on-surface-variant/40 text-right">{bio.length}/300</span>
              </Field>

              {error && (
                <p className="text-error text-sm font-medium">{error}</p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-[rgba(86,67,58,0.1)] flex gap-3 justify-end">
              <button
                onClick={() => !saving && setIsOpen(false)}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-surface-container text-on-surface font-bold text-sm hover:bg-surface-container-high transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl volcanic-gradient text-on-primary font-bold text-sm active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? 'A guardar...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const inputClass =
  'w-full bg-surface-container-high border border-[rgba(86,67,58,0.15)] rounded-xl px-4 py-3 text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container/60 transition-colors'

const PREVIEW_COLORS = [
  '#ff9156','#e67e22','#9b59b6','#3498db','#1abc9c','#e74c3c','#f39c12','#16a085','#8e44ad',
]
function getPreviewInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}
function getPreviewColor(name: string) {
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return PREVIEW_COLORS[hash % PREVIEW_COLORS.length]
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-label font-bold uppercase tracking-widest text-on-surface-variant/60">
        {label}
      </label>
      {children}
    </div>
  )
}
