'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface IntentCard {
  id: string
  label: string
  icon: string
}

const INTENTS: IntentCard[] = [
  { id: 'beleza_cabelo', label: 'Beleza & Cabelo', icon: 'content_cut' },
  { id: 'unhas_estetica', label: 'Unhas & Estética', icon: 'brush' },
  { id: 'skincare_bemestar', label: 'Skincare & Bem-estar', icon: 'self_care' },
  { id: 'barbeiro_grooming', label: 'Barbeiro & Grooming', icon: 'face' },
  { id: 'produtos_compras', label: 'Produtos & Compras', icon: 'shopping_bag' },
  { id: 'inspiracao_conteudo', label: 'Inspiração & Conteúdo', icon: 'photo_camera' },
]

export default function OnboardingIntentPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleContinue() {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      if (selected.size > 0) {
        const interests = INTENTS.filter((i) => selected.has(i.id)).map((i) => i.id)
        const res = await fetch('/api/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interests }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          setError(data.error ?? 'Erro ao guardar. Tenta novamente.')
          return
        }
      }
      router.push('/onboarding/location')
    } catch {
      setError('Erro de conexão. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleSkip() {
    if (loading) return
    router.push('/onboarding/location')
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container flex flex-col">
      {/* Header (TopAppBar) */}
      <nav className="bg-transparent text-primary flex justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto z-50">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-headline font-bold tracking-tighter text-on-surface"
        >
          Barza
        </Link>
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={handleSkip}
            disabled={loading}
            className="text-[0.6875rem] font-label tracking-[0.1em] uppercase text-on-surface-variant cursor-pointer hover:text-primary transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Skip
          </button>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient Internal Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] bg-primary-container/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Premium Modal Container */}
        <div className="w-full max-w-3xl bg-surface-container/80 backdrop-blur-3xl rounded-xl refractive-edge internal-bloom p-6 sm:p-8 md:p-12 relative z-10">
          {/* Modal Header */}
          <header className="mb-8 sm:mb-12 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-3 sm:mb-4">
              O que te trouxe à Barza?
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed opacity-80">
              Ninguém entra num espaço de beleza por acaso. Mesmo quando ainda não sabe o que procura.
            </p>
          </header>

          {/* Intent Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12">
            {INTENTS.map((intent) => {
              const isSelected = selected.has(intent.id)
              return (
                <button
                  key={intent.id}
                  type="button"
                  onClick={() => toggle(intent.id)}
                  disabled={loading}
                  aria-pressed={isSelected}
                  className={`group relative text-left transition-all duration-500 rounded-lg p-5 sm:p-6 cursor-pointer refractive-edge overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-surface-container-high ring-1 ring-primary-container'
                      : 'bg-surface-container-low hover:bg-surface-container-high'
                  }`}
                >
                  <div
                    className={`mb-4 transition-transform duration-500 group-hover:scale-110 ${
                      isSelected ? 'text-primary-container' : 'text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl">{intent.icon}</span>
                  </div>
                  <h3 className="text-sm font-label font-bold tracking-wider uppercase text-on-surface">
                    {intent.label}
                  </h3>
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary-container/5 rounded-tl-full translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
                  {isSelected && (
                    <span
                      className="material-symbols-outlined absolute top-3 right-3 text-primary-container text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          {/* Action Area */}
          <footer className="flex justify-center md:justify-end">
            <button
              type="button"
              onClick={handleContinue}
              disabled={loading}
              className="volcanic-gradient text-on-primary-container font-bold px-10 sm:px-12 py-4 rounded-lg tracking-widest uppercase text-[0.75rem] active:scale-95 transition-all duration-300 internal-bloom hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              {loading && (
                <span className="material-symbols-outlined text-base animate-spin">
                  progress_activity
                </span>
              )}
              {loading ? 'A guardar…' : 'Continuar'}
            </button>
          </footer>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-transparent text-primary flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-8 py-6 sm:py-10 max-w-7xl mx-auto z-40 gap-3 sm:gap-0">
        <div className="text-[0.625rem] font-label tracking-[0.15em] uppercase text-on-surface-variant/40">
          © 2024 BARZA. THE RITUAL OF IDENTITY.
        </div>
        <div className="flex gap-4 sm:gap-8">
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
