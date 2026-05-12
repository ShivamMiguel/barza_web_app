'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Welcome stages — the breathing ritual.
 *
 * t=0      → BARZA fades in
 * t=1500   → BARZA dissolves
 * t=3000   → "A tua presença foi recebida." (with breathing)
 * t=5500   → "Bem-vindo à Barza." + closing line
 * t=8000   → redirect to chosen flow
 */
const STAGES = [
  { at: 0,    name: 'logo_in'   as const },
  { at: 1700, name: 'logo_out'  as const },
  { at: 3000, name: 'received'  as const },
  { at: 5500, name: 'farewell'  as const },
]
const TOTAL_DURATION = 8000

const SAFE_NEXT_PREFIX = '/'

function sanitiseNext(raw: string | null): string {
  if (!raw) return '/community'
  if (!raw.startsWith(SAFE_NEXT_PREFIX)) return '/community'
  if (raw.startsWith('//')) return '/community'
  return raw
}

function WelcomeInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = sanitiseNext(searchParams.get('next'))

  const [stage, setStage] = useState<'logo_in' | 'logo_out' | 'received' | 'farewell'>('logo_in')

  // Stage scheduler
  useEffect(() => {
    const timers = STAGES.map(({ at, name }) =>
      window.setTimeout(() => setStage(name), at)
    )
    const redirect = window.setTimeout(() => {
      router.push(next)
      router.refresh()
    }, TOTAL_DURATION)
    return () => {
      timers.forEach(window.clearTimeout)
      window.clearTimeout(redirect)
    }
  }, [next, router])

  function skip() {
    router.push(next)
  }

  // Drifting particles — generated once
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 4,
        left: Math.random() * 100,
        top: 60 + Math.random() * 40,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 8,
        dx: (Math.random() - 0.5) * 120,
        dy: -120 - Math.random() * 200,
        opacity: 0.4 + Math.random() * 0.4,
      })),
    []
  )

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* Warm gradient field */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 35%, rgba(255,145,86,0.18) 0%, rgba(255,145,86,0.06) 30%, rgba(14,14,14,1) 70%)',
        }}
      />

      {/* Slow drifting glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-[20%] -left-[15%] w-[60%] h-[60%] rounded-full bg-primary-container/10 blur-[140px]"
          style={{ animation: 'welcome-drift-a 18s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-[15%] -right-[10%] w-[55%] h-[55%] rounded-full bg-tertiary-container/8 blur-[130px]"
          style={{ animation: 'welcome-drift-b 22s ease-in-out infinite' }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[35%] h-[35%] rounded-full bg-primary-container/5 blur-[110px]"
          style={{ animation: 'welcome-drift-c 26s ease-in-out infinite' }}
        />
      </div>

      {/* Organic particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-primary-container"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              opacity: p.opacity,
              filter: 'blur(1px)',
              boxShadow: '0 0 8px rgba(255,145,86,0.6)',
              animation: `welcome-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
              ['--dx' as string]: `${p.dx}px`,
              ['--dy' as string]: `${p.dy}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Skip — discreet, top-right */}
      <button
        type="button"
        onClick={skip}
        className="absolute top-4 sm:top-6 right-4 sm:right-8 z-10 text-[0.6875rem] font-label tracking-[0.1em] uppercase text-on-surface-variant/50 hover:text-primary transition-colors duration-300"
      >
        Skip
      </button>

      {/* Centerpiece */}
      <main className="relative z-10 h-full flex items-center justify-center px-6 text-center">
        <div
          className="max-w-xl"
          style={{ animation: 'welcome-breathe 5s ease-in-out infinite' }}
        >
          {/* Stage: logo_in / logo_out */}
          {(stage === 'logo_in' || stage === 'logo_out') && (
            <h1
              key={stage}
              className="text-4xl sm:text-6xl md:text-8xl font-headline font-extrabold tracking-[0.18em] sm:tracking-[0.3em] text-on-surface"
              style={{
                animation:
                  stage === 'logo_in'
                    ? 'welcome-fade-up 1.6s ease-out forwards'
                    : 'welcome-fade-out 1.3s ease-in forwards',
              }}
            >
              BARZA
            </h1>
          )}

          {/* Stage: received */}
          {stage === 'received' && (
            <p
              key="received"
              className="text-xl sm:text-2xl md:text-3xl font-headline font-extrabold tracking-tight text-on-surface leading-snug px-4"
              style={{ animation: 'welcome-fade-up 1.4s ease-out forwards' }}
            >
              A tua presença foi recebida.
            </p>
          )}

          {/* Stage: farewell */}
          {stage === 'farewell' && (
            <div
              key="farewell"
              className="px-4"
              style={{ animation: 'welcome-fade-up 1.4s ease-out forwards' }}
            >
              <p className="text-2xl sm:text-3xl md:text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-3 sm:mb-4">
                Bem-vindo à Barza.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-on-surface-variant leading-relaxed opacity-80">
                Aqui, cada escolha é uma forma de expressão.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Subtle progress hairline at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.03]">
        <div
          className="h-full volcanic-gradient"
          style={{
            animation: `welcome-progress ${TOTAL_DURATION}ms linear forwards`,
            width: 0,
          }}
        />
      </div>

      {/* Inline keyframe used only here */}
      <style jsx>{`
        @keyframes welcome-progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  )
}

export default function OnboardingWelcomePage() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
      <WelcomeInner />
    </Suspense>
  )
}
