'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { DIAL_CODES, DEFAULT_DIAL_CODE, type CountryDialCode } from '@/lib/locations'

const MAX_AVATAR_BYTES = 5 * 1024 * 1024
const STORAGE_BUCKET = 'avatars'

export default function OnboardingPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [dial, setDial] = useState<CountryDialCode>(DEFAULT_DIAL_CODE)
  const [dialOpen, setDialOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Close dial dropdown on outside click
  useEffect(() => {
    if (!dialOpen) return
    function onClick(e: MouseEvent) {
      if (dialRef.current && !dialRef.current.contains(e.target as Node)) {
        setDialOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [dialOpen])

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null)
      return
    }
    const url = URL.createObjectURL(avatarFile)
    setAvatarPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [avatarFile])

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('O ficheiro deve ser uma imagem.')
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError('A imagem ultrapassa 5MB.')
      return
    }
    setError(null)
    setAvatarFile(file)
  }

  async function uploadAvatar(file: File, userId: string): Promise<string> {
    const supabase = createClient()
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      let avatar_url: string | undefined
      if (avatarFile) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError('Sessão inválida. Faz login outra vez.')
          return
        }
        try {
          avatar_url = await uploadAvatar(avatarFile, user.id)
        } catch (uploadErr) {
          console.error('Avatar upload error:', uploadErr)
          setError('Erro ao enviar a foto.')
          return
        }
      }

      const digits = phone.replace(/\D/g, '').trim()
      const payload: Record<string, unknown> = {}
      if (avatar_url) payload.avatar_url = avatar_url
      if (digits) {
        payload.phone = `${dial.dial}${digits}`
        payload.location = { dial_code: dial.dial, country_code: dial.code }
      }

      if (Object.keys(payload).length > 0) {
        const res = await fetch('/api/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error ?? 'Erro ao guardar. Tenta novamente.')
          return
        }
      }

      router.push('/onboarding/intent')
    } catch {
      setError('Erro de conexão. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleSkip() {
    if (loading) return
    router.push('/onboarding/intent')
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container flex items-center justify-center relative px-4 pt-24 pb-32 sm:pt-28 sm:pb-28">
      {/* Background Decoration (Liquid Obsidian Aesthetic) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] max-w-[500px] h-[60vw] max-h-[500px] bg-primary-container/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50vw] max-w-[400px] h-[50vw] max-h-[400px] bg-tertiary-container/5 blur-[100px] rounded-full" />
      </div>

      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent flex justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-headline font-bold tracking-tighter text-on-surface uppercase"
        >
          Barza
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <span className="text-[0.6875rem] font-label tracking-[0.1em] uppercase text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer">
            Identidade
          </span>
          <span className="text-[0.6875rem] font-label tracking-[0.1em] uppercase text-on-surface-variant/40 cursor-not-allowed">
            Conexão
          </span>
          <span className="text-[0.6875rem] font-label tracking-[0.1em] uppercase text-on-surface-variant/40 cursor-not-allowed">
            Ritual
          </span>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          disabled={loading}
          className="text-[0.6875rem] font-label tracking-[0.1em] uppercase text-primary font-bold hover:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Skip
        </button>
      </header>

      {/* Main Modal */}
      <main className="relative z-10 w-full max-w-lg">
        <div className="glass-morphism refractive-edge internal-glow rounded-xl p-6 sm:p-8 md:p-12 border border-outline-variant/15">
          {/* Header Section */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tighter text-on-surface mb-4">
              Antes de começares…
            </h1>
            <p className="text-lg font-body text-on-surface-variant leading-relaxed">
              Toda presença precisa de uma forma de ser reconhecida. Não é sobre dados.{' '}
              <span className="text-primary font-medium">É sobre ligação.</span>
            </p>
            <p className="text-[0.6875rem] font-label tracking-[0.1em] uppercase text-on-surface-variant/60 mt-4">
              Diz-nos como te podemos encontrar — e como te queres mostrar ao mundo.
            </p>
          </div>

          {/* Form Section */}
          <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
            {/* Avatar Upload Section */}
            <div className="group">
              <label className="block text-[0.6875rem] font-label tracking-[0.1em] uppercase text-on-surface-variant/80 mb-4">
                não precisa ser perfeito — só teu
              </label>
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-center overflow-hidden group-hover:border-primary/40 transition-colors duration-500 shadow-inner flex-shrink-0">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl">
                      add_a_photo
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="text-sm font-semibold text-primary text-left hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {avatarFile ? 'Alterar imagem' : 'Carregar imagem'}
                  </button>
                  <span className="text-[0.625rem] font-label text-on-surface-variant/40 uppercase tracking-widest">
                    JPG, PNG up to 5MB
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFilePick}
                  className="hidden"
                />
              </div>
            </div>

            {/* Phone Input Section */}
            <div className="space-y-3">
              <label
                htmlFor="phone"
                className="block text-[0.6875rem] font-label tracking-[0.1em] uppercase text-on-surface-variant/80"
              >
                para te mantermos ligado ao que importa
              </label>
              <div className="relative flex items-stretch gap-2">
                {/* Dial code selector */}
                <div ref={dialRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setDialOpen((o) => !o)}
                    disabled={loading}
                    aria-haspopup="listbox"
                    aria-expanded={dialOpen}
                    aria-label={`Indicativo ${dial.name} ${dial.dial}`}
                    className="h-full flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/15 rounded-lg px-3 sm:px-4 py-4 hover:border-primary/30 focus:outline-none focus:border-primary/40 transition-all internal-glow disabled:opacity-60"
                  >
                    <span className="text-xl leading-none">{dial.flag}</span>
                    <span className="text-sm font-medium tabular-nums text-on-surface">{dial.dial}</span>
                    <span className="material-symbols-outlined text-on-surface-variant/50 text-base">
                      {dialOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {dialOpen && (
                    <ul
                      role="listbox"
                      aria-label="Indicativos disponíveis"
                      className="absolute z-30 top-full left-0 mt-2 w-64 max-h-72 overflow-y-auto obsidian-scroll bg-surface-container border border-outline-variant/20 rounded-lg shadow-2xl py-1"
                    >
                      {DIAL_CODES.map((c) => (
                        <li key={c.code}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={dial.code === c.code}
                            onClick={() => {
                              setDial(c)
                              setDialOpen(false)
                            }}
                            className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-surface-container-high transition-colors ${
                              dial.code === c.code ? 'bg-surface-container-high' : ''
                            }`}
                          >
                            <span className="text-xl leading-none">{c.flag}</span>
                            <span className="flex-1 text-sm text-on-surface truncate">{c.name}</span>
                            <span className="text-xs tabular-nums text-on-surface-variant/70">{c.dial}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Phone digits */}
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  placeholder="900 000 000"
                  autoComplete="tel-national"
                  inputMode="numeric"
                  className="flex-1 min-w-0 bg-surface-container-lowest border border-outline-variant/15 rounded-lg py-4 px-4 text-on-surface placeholder:text-on-surface-variant/20 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all duration-300 internal-glow disabled:opacity-60"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full volcanic-gradient text-on-primary-container font-headline font-bold py-5 rounded-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all duration-300 text-center flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">
                    progress_activity
                  </span>
                  <span>A guardar…</span>
                </>
              ) : (
                <>
                  <span>Continuar</span>
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-transparent flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-10 max-w-7xl mx-auto gap-2 sm:gap-0">
        <div className="text-[0.625rem] font-label tracking-[0.15em] uppercase text-on-surface-variant/40">
          © 2024 BARZA. THE RITUAL OF IDENTITY.
        </div>
        <div className="flex gap-4 sm:gap-6">
          <a
            href="/privacy"
            className="text-[0.625rem] font-label tracking-[0.15em] uppercase text-on-surface-variant/40 hover:text-primary transition-colors duration-500"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-[0.625rem] font-label tracking-[0.15em] uppercase text-on-surface-variant/40 hover:text-primary transition-colors duration-500"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-[0.625rem] font-label tracking-[0.15em] uppercase text-on-surface-variant/40 hover:text-primary transition-colors duration-500"
          >
            Editorial
          </a>
        </div>
      </footer>
    </div>
  )
}
