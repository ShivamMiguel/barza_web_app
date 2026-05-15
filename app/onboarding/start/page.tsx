'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface StartOption {
  id: string
  emoji: string
  title: string
  caption: string
  href: string
}

const OPTIONS: StartOption[] = [
  {
    id: 'create_post',
    emoji: '✍🏾',
    title: 'Criar o primeiro post',
    caption: 'Expressa algo teu.',
    href: '/community?action=post',
  },
  {
    id: 'book_service',
    emoji: '📅',
    title: 'Marcar um serviço',
    caption: 'Deixa alguém cuidar da tua presença.',
    href: '/community?action=book',
  },
  {
    id: 'buy_product',
    emoji: '🛍️',
    title: 'Comprar um produto',
    caption: 'Às vezes a mudança começa no detalhe certo.',
    href: '/community?action=shop',
  },
]

export default function OnboardingStartPage() {
  const router = useRouter()

  function go(href: string) {
    router.push(`/onboarding/welcome?next=${encodeURIComponent(href)}`)
  }

  function handleSkip() {
    router.push('/community')
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-body antialiased selection:bg-primary-container selection:text-on-primary-container relative">
      {/* Background Layer (Liquid Obsidian) */}
      <div className="fixed inset-0 z-0 bg-surface-container-lowest overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] max-w-[600px] h-[70vw] max-h-[600px] rounded-full bg-primary-container/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[60vw] max-w-[500px] h-[60vw] max-h-[500px] rounded-full bg-tertiary-container/10 blur-[100px]" />
      </div>

      {/* Top Navigation Anchor */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-6 max-w-7xl mx-auto bg-transparent">
        <Link
          href="/"
          className="text-xl sm:text-2xl font-headline font-bold tracking-tighter text-on-surface"
        >
          Barza
        </Link>
        <button
          type="button"
          onClick={handleSkip}
          className="text-[0.6875rem] font-label tracking-[0.1em] uppercase text-primary hover:text-primary transition-colors duration-300"
        >
          Skip
        </button>
      </header>

      {/* Main Modal Canvas */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-3 sm:px-4 pt-20 pb-24 sm:py-20">
        {/* Modal Backdrop Overlay */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />

        {/* Modal Container */}
        <div className="relative w-full max-w-2xl glass-panel refractive-highlight internal-glow rounded-xl overflow-hidden flex flex-col items-center text-center">
          {/* Hero Visual Area — volcanic glow */}
          <div className="w-full h-36 sm:h-48 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-60 mix-blend-luminosity"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 60%, #ff9156 0%, #fc7c31 18%, #5a2810 45%, #0e0e0e 80%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-50 mix-blend-screen pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 70% 40%, rgba(255,145,86,0.4) 0%, transparent 35%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-variant via-transparent to-transparent" />
          </div>

          {/* Content Section */}
          <div className="px-5 sm:px-8 pb-8 sm:pb-12 pt-6 flex flex-col items-center w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-4 leading-none">
              O teu primeiro passo importa
            </h1>
            <p className="text-on-surface-variant max-w-md text-sm md:text-base mb-8 sm:mb-10 leading-relaxed opacity-80 px-2">
              Não vieste apenas observar. Vieste participar.{' '}
              <br className="hidden sm:block" />O que queres fazer primeiro?
            </p>

            {/* Options List */}
            <div className="w-full space-y-3 mb-8 sm:mb-12">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => go(opt.href)}
                  className="group w-full flex items-center justify-between p-4 sm:p-5 bg-surface-container-low hover:bg-surface-container-high transition-all duration-300 rounded-lg text-left active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className="text-xl flex-shrink-0">{opt.emoji}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-on-surface truncate">{opt.title}</p>
                      <p className="text-[0.6875rem] font-label tracking-wide uppercase text-on-surface-variant/60">
                        {opt.caption}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary-container text-base sm:text-xl opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:translate-x-4 sm:group-hover:translate-x-0 flex-shrink-0">
                    arrow_forward_ios
                  </span>
                </button>
              ))}
            </div>

            {/* Main Action */}
            <button
              type="button"
              onClick={() => go('/community')}
              className="volcanic-gradient text-on-primary-container font-headline font-bold text-base sm:text-lg px-10 sm:px-12 py-4 sm:py-5 rounded-full hover:shadow-[0_0_20px_rgba(255,145,86,0.3)] transition-all duration-500 active:scale-95 w-full md:w-auto"
            >
              Entrar na Barza
            </button>
          </div>
        </div>
      </main>

      {/* Footer Anchor */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-8 py-4 sm:py-10 max-w-7xl mx-auto bg-transparent gap-2 sm:gap-0">
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
