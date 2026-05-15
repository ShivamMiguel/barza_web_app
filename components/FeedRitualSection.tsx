interface FeedRitualSectionProps {
  onSignupClick?: () => void
}

export function FeedRitualSection({ onSignupClick }: FeedRitualSectionProps = {}) {
  return (
    <section className="relative py-28 md:py-40 px-6 sm:px-8 overflow-hidden bg-surface-container-lowest">
      {/* Atmospheric obsidian glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[900px] aspect-square bg-primary-container/[0.06] blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute -top-20 right-0 w-[40vw] max-w-[400px] aspect-square bg-tertiary-container/[0.05] blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section anchor */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="h-px w-10 bg-primary-container/40" />
          <span className="text-[0.6875rem] font-label tracking-[0.25em] uppercase text-primary-container font-bold">
            Sec. III — O Feed
          </span>
          <div className="h-px w-10 bg-primary-container/40" />
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-extrabold tracking-tighter text-center leading-[1.05] mb-8">
          <span className="block">Não vens ver.</span>
          <span className="block">
            Vens <span className="italic text-primary-container">ser visto</span>.
          </span>
        </h2>

        {/* Subhead */}
        <p className="text-center text-on-surface-variant/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-16 md:mb-20 font-body">
          O feed da Barza não é uma vitrine. É um espelho coletivo onde cada
          gesto, cada corte, cada penteado conta a história da geração que
          escolheu cuidar de si em voz alta.
        </p>

        {/* Floating editorial cards */}
        <FeedCluster />

        {/* Closing manifesto line */}
        <div className="text-center max-w-3xl mx-auto mt-16 md:mt-20">
          <p className="font-headline text-xl sm:text-2xl md:text-3xl tracking-tight italic opacity-90 leading-snug">
            “Aqui ninguém{' '}
            <span className="text-primary-container not-italic font-bold">
              performa
            </span>
            . Toda a gente está a{' '}
            <span className="text-primary-container not-italic font-bold">
              ser
            </span>
            .”
          </p>
          <div className="mt-6 mx-auto h-px w-20 volcanic-gradient" />

          {/* Call to action */}
          <div className="mt-12 md:mt-14 flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={onSignupClick}
              className="bg-primary-container text-on-primary-container px-6 sm:px-10 py-3 sm:py-5 text-sm sm:text-base lg:text-lg font-black uppercase tracking-widest rounded-lg transition-all hover:brightness-110 shadow-2xl shadow-primary-container/20 flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Mostra-te no feed
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/40">
              Cria a tua conta · 60 segundos · grátis
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── The animated cluster ────────────────────────────────────────────────────

function FeedCluster() {
  return (
    <div
      className="relative h-[520px] sm:h-[560px] max-w-3xl mx-auto select-none"
      aria-hidden="true"
    >
      <PostCard />
      <LiveFeedCard />
      <SignalCard />
    </div>
  )
}

// ─── Left card: single post with pulsing like ───────────────────────────────

function PostCard() {
  return (
    <article
      className="absolute top-4 left-0 sm:left-6 w-60 sm:w-72 bg-surface-container/75 backdrop-blur-md border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden origin-top"
      style={{ animation: 'feed-float-a 9s ease-in-out infinite' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <div className="w-8 h-8 rounded-full volcanic-gradient flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-headline font-bold text-on-primary">
            MK
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-on-surface truncate">
            Marisa K.
          </p>
          <p className="text-[9px] text-on-surface-variant/50">
            há 12 min · Talatona
          </p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant/30 text-base">
          more_horiz
        </span>
      </div>

      {/* Caption */}
      <p className="px-4 text-[11px] text-on-surface/85 leading-relaxed mb-3">
        Glow ritual antes de qualquer sábado.{' '}
        <span className="text-primary-container">#golden_hour</span>
      </p>

      {/* "Photo" — gradient art with location chip */}
      <div className="relative h-32 mx-3 rounded-xl overflow-hidden bg-gradient-to-br from-primary-container/45 via-tertiary-container/25 to-surface-container-lowest">
        {/* Soft shimmer */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background:
              'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: 'feed-shimmer 7s linear infinite',
          }}
        />
        {/* Highlight */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm">
          <span className="text-[8px] font-bold uppercase tracking-widest text-on-surface">
            📍 Talatona
          </span>
        </div>
        {/* Faux subject silhouette */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-t-full bg-gradient-to-t from-surface-container-lowest/70 to-transparent" />
      </div>

      {/* Engagement */}
      <div className="flex items-center gap-3 px-4 py-3 mt-1">
        <div className="relative flex items-center gap-1">
          <span
            className="material-symbols-outlined text-primary-container text-base"
            style={{
              fontVariationSettings: "'FILL' 1",
              animation: 'feed-heart-pulse 4s ease-in-out infinite',
            }}
          >
            favorite
          </span>
          <span className="text-[10px] font-bold text-on-surface tabular-nums">
            248
          </span>
          {/* "+1" burst */}
          <span
            className="absolute -top-1 left-3 text-[9px] font-bold text-primary-container"
            style={{ animation: 'feed-like-burst 4s ease-out infinite' }}
          >
            +1
          </span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant/60">
          <span className="material-symbols-outlined text-base">chat_bubble</span>
          <span className="text-[10px] font-medium tabular-nums">18</span>
        </div>
        <div className="flex-1" />
        <span className="material-symbols-outlined text-on-surface-variant/40 text-base">
          bookmark
        </span>
      </div>
    </article>
  )
}

// ─── Center card: live feed marquee ─────────────────────────────────────────

const FEED_ITEMS: { who: string; what: string; tag: string; icon: string }[] = [
  { who: 'Aline',         what: 'descobriu @StudioAfro e entrou em contacto directamente',  tag: 'Descoberta', icon: 'person_search' },
  { who: 'Tendência',     what: 'micro-fringe regressa a Luanda esta semana',               tag: 'Sinal',      icon: 'trending_up' },
  { who: 'Mestre Kikas',  what: 'partilhou 3 cortes feitos hoje em Viana',                  tag: 'Portfólio',  icon: 'content_cut' },
  { who: 'Bruna',         what: 'descobriu um novo espaço de skincare em Talatona',         tag: 'Descoberta', icon: 'spa' },
  { who: 'Trança nagô',   what: 'novo episódio do podcast já no ar',                        tag: 'Podcast',    icon: 'graphic_eq' },
  { who: 'Glow Ritual',   what: 'antes de qualquer sábado · 248 ❤',                         tag: 'Post',       icon: 'auto_awesome' },
  { who: 'Insight IA',    what: 'cor cinza-azulada ganha tração 25-34',                     tag: 'IA',         icon: 'psychology' },
]

function LiveFeedCard() {
  // Render the list twice for a seamless infinite scroll
  const items = [...FEED_ITEMS, ...FEED_ITEMS]
  return (
    <article
      className="absolute top-12 sm:top-8 left-1/2 w-64 sm:w-80 bg-surface-container/85 backdrop-blur-md border border-primary-container/30 rounded-2xl shadow-[0_30px_60px_-15px_rgba(255,145,86,0.18)] overflow-hidden origin-top"
      style={{ animation: 'feed-float-b 11s ease-in-out 1s infinite' }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/15">
        <div className="flex items-center gap-2">
          <div className="text-2xl leading-none">🇦🇴</div>
          <span className="font-headline text-[11px] font-extrabold tracking-widest uppercase">
            Barza · Feed
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[#4cd964]"
            style={{ animation: 'feed-live-dot 1.8s ease-in-out infinite' }}
          />
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#4cd964]">
            Live
          </span>
        </div>
      </div>

      {/* Marquee window */}
      <div className="relative h-[300px] sm:h-[340px] overflow-hidden">
        <div
          style={{
            animation: 'feed-marquee 22s linear infinite',
          }}
        >
          {items.map((item, idx) => (
            <div
              key={`${item.who}-${idx}`}
              className="flex items-start gap-3 px-4 py-3 border-b border-outline-variant/10"
            >
              <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary-container text-sm">
                  {item.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold text-on-surface truncate">
                    {item.who}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-primary-container/70">
                    · {item.tag}
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant/70 leading-snug">
                  {item.what}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Top/bottom fades for editorial finish */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-surface-container to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-surface-container to-transparent" />
      </div>

      {/* Footer composer hint */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-outline-variant/15 bg-surface-container-low/50">
        <div className="w-6 h-6 rounded-full bg-tertiary-container/60 flex-shrink-0" />
        <div className="flex-1 h-7 rounded-full bg-surface-container-lowest border border-outline-variant/10 flex items-center px-3">
          <span className="text-[9px] text-on-surface-variant/40">
            O que te inspira hoje?
          </span>
        </div>
        <span
          className="material-symbols-outlined text-primary-container text-base"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          send
        </span>
      </div>
    </article>
  )
}

// ─── Right card: signal / market intelligence ──────────────────────────────

function SignalCard() {
  return (
    <article
      className="absolute bottom-0 right-0 sm:right-6 w-56 sm:w-64 bg-surface-container/75 backdrop-blur-md border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden origin-bottom"
      style={{ animation: 'feed-float-c 13s ease-in-out 2s infinite' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined text-primary-container text-base"
            style={{
              fontVariationSettings: "'FILL' 1",
              animation: 'feed-signal-ping 2.4s ease-in-out infinite',
            }}
          >
            radar
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary-container">
            Sinal IA
          </span>
        </div>
        <span className="text-[9px] text-on-surface-variant/40 font-label uppercase tracking-widest">
          ·02
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pb-3">
        <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50 mb-1">
          Tóquio → Luanda
        </p>
        <p className="text-[12px] font-headline font-bold text-on-surface leading-snug mb-3">
          Cor cinza-azulada ganha tração entre clientes 25-34.
        </p>

        {/* Mini sparkline */}
        <div className="relative h-10 mb-3">
          <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff9156" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff9156" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,32 L12,28 L24,30 L36,22 L48,24 L60,16 L72,18 L84,10 L100,4 L100,40 L0,40 Z"
              fill="url(#spark-fill)"
            />
            <path
              d="M0,32 L12,28 L24,30 L36,22 L48,24 L60,16 L72,18 L84,10 L100,4"
              fill="none"
              stroke="#ff9156"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="100" cy="4" r="2.2" fill="#ff9156">
              <animate
                attributeName="r"
                values="2.2;3.4;2.2"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>

        {/* Source line */}
        <div className="flex items-center gap-2 text-[9px] text-on-surface-variant/50">
          <span className="material-symbols-outlined text-xs">link</span>
          <span className="truncate">Vogue Japan · há 2 dias</span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-high">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">
            Ler insight
          </span>
          <span className="material-symbols-outlined text-primary-container text-sm">
            arrow_forward
          </span>
        </div>
      </div>
    </article>
  )
}
