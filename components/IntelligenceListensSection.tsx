interface IntelligenceListensSectionProps {
  onSignupClick?: () => void
}

export function IntelligenceListensSection({
  onSignupClick,
}: IntelligenceListensSectionProps = {}) {
  return (
    <section className="relative py-28 md:py-40 px-6 sm:px-8 overflow-hidden bg-surface-container-low">
      {/* Atmospheric */}
      <div className="pointer-events-none absolute -bottom-40 -left-20 w-[60vw] max-w-[600px] aspect-square bg-primary-container/[0.08] blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute top-0 right-0 w-[40vw] max-w-[500px] aspect-square bg-tertiary-container/[0.05] blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* ── Editorial copy ── */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-primary-container/40" />
              <span className="text-[0.6875rem] font-label tracking-[0.25em] uppercase text-primary-container font-bold">
                Sec. IV — Inteligência
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-extrabold tracking-tighter leading-[1.02] mb-8">
              A IA não <span className="italic opacity-60">fala</span>.<br />
              <span className="text-primary-container italic">Escuta</span>.
            </h2>

            <p className="text-on-surface-variant/85 text-base sm:text-lg leading-relaxed mb-6 font-body max-w-xl">
              Traduzimos Paris para Talatona. Tóquio para Luanda.{' '}
              <br className="hidden sm:block" />
              Cada sinal global passa por um filtro angolano antes de chegar a
              ti — porque o que importa não é seguir tendências.{' '}
              <span className="text-on-surface font-medium">
                É reconhecer o teu pulso entre elas.
              </span>
            </p>

            <p className="font-headline italic text-lg sm:text-xl text-on-surface-variant/70 leading-relaxed mb-10 max-w-xl">
              Sinais, não ruído.{' '}
              <span className="text-on-surface">Diagnóstico, não opinião.</span>{' '}
              Clareza, num mercado opaco.
            </p>

            {/* Capability chips */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-primary-container/20">
                <span className="material-symbols-outlined text-primary-container text-base">
                  trending_up
                </span>
                <span className="text-[0.6875rem] uppercase tracking-widest font-bold">
                  Sinais Globais
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-primary-container/20">
                <span className="material-symbols-outlined text-primary-container text-base">
                  spa
                </span>
                <span className="text-[0.6875rem] uppercase tracking-widest font-bold">
                  Pulso Local
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-primary-container/20">
                <span className="material-symbols-outlined text-primary-container text-base">
                  auto_awesome
                </span>
                <span className="text-[0.6875rem] uppercase tracking-widest font-bold">
                  Recomendações IA
                </span>
              </div>
            </div>
          </div>

          {/* ── Pulse visualization ── */}
          <div
            className="order-1 lg:order-2 relative aspect-square w-full max-w-[440px] mx-auto"
            aria-hidden="true"
          >
            {/* concentric rings */}
            <div className="absolute inset-0 rounded-full border border-primary-container/12" />
            <div className="absolute inset-[12%] rounded-full border border-primary-container/18" />
            <div className="absolute inset-[24%] rounded-full border border-primary-container/24" />
            <div className="absolute inset-[36%] rounded-full border border-primary-container/32" />

            {/* live pulse */}
            <div className="absolute inset-[8%] rounded-full border-2 border-primary-container/25 animate-ping" />

            {/* center node — the AI */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full volcanic-gradient flex items-center justify-center shadow-[0_0_80px_rgba(255,145,86,0.45)]">
              <span
                className="material-symbols-outlined text-on-primary text-4xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>

            {/* satellite signals */}
            <SignalChip className="top-[2%] left-1/2 -translate-x-1/2" label="+ Paris" />
            <SignalChip className="top-[28%] right-[2%]" label="+ Tóquio" />
            <SignalChip className="bottom-[28%] left-[2%]" label="+ Lagos" />
            <SignalChip className="bottom-[2%] right-[28%]" label="+ Luanda" />
            <SignalChip className="bottom-[2%] left-[28%]" label="+ Milão" />
            <SignalChip className="top-1/2 right-[2%] -translate-y-1/2" label="+ Lisboa" />
          </div>
        </div>

        {/* ── Live insight examples ─────────────────────────────────── */}
        <InsightExamples onSignupClick={onSignupClick} />

        {/* Closing line */}
        <div className="mt-20 md:mt-28 text-center max-w-3xl mx-auto">
          <p className="font-headline text-xl sm:text-2xl md:text-3xl tracking-tight italic opacity-90 leading-snug">
            “A intuição é sagrada. A{' '}
            <span className="text-primary-container not-italic font-bold">
              clareza
            </span>{' '}
            é coragem.”
          </p>
          <div className="mt-6 mx-auto h-px w-20 volcanic-gradient" />
        </div>
      </div>
    </section>
  )
}

function SignalChip({
  className,
  label,
}: {
  className: string
  label: string
}) {
  return (
    <div
      className={`absolute ${className} px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur border border-primary-container/30 shadow-lg`}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-container">
        {label}
      </span>
    </div>
  )
}

// ─── Insight examples ───────────────────────────────────────────────────────

function InsightExamples({ onSignupClick }: { onSignupClick?: () => void }) {
  return (
    <div className="mt-20 md:mt-28">
      {/* Sub-section header */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-8 md:mb-10">
        <div>
          <p className="text-[0.6875rem] font-label tracking-[0.25em] uppercase text-primary-container font-bold mb-2">
            ·02 — Sinais que chegaram hoje
          </p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-headline font-extrabold tracking-tighter leading-tight max-w-2xl">
            O que a IA <span className="italic text-primary-container">ouviu</span> nas últimas 24 horas.
          </h3>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant/40">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4cd964] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Atualizado · há 12 min
          </span>
        </div>
      </div>

      {/* Cards — horizontal scroll on small, grid on lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <InsightTrendCard />
        <InsightMarketCard />
        <InsightOpportunityCard />
        <InsightLocalCard />
      </div>

      {/* Footer caption */}
      <p className="mt-8 text-center text-[11px] sm:text-xs text-on-surface-variant/40 font-label uppercase tracking-[0.2em]">
        Mais 47 sinais ativos esta semana · Diagnóstico contínuo · Curado para Angola
      </p>

      {/* Call to action */}
      <div className="mt-12 md:mt-14 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={onSignupClick}
          className="bg-primary-container text-on-primary-container px-6 sm:px-10 py-3 sm:py-5 text-sm sm:text-base lg:text-lg font-black uppercase tracking-widest rounded-lg transition-all hover:brightness-110 shadow-2xl shadow-primary-container/20 flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          Ler os 47 sinais
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-on-surface-variant/40">
          Acesso ao painel IA · Diagnóstico semanal · Sem cartão
        </p>
      </div>
    </div>
  )
}

// ─── Insight card 1 · Trend (sparkline) ─────────────────────────────────────

function InsightTrendCard() {
  return (
    <article className="relative bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-2xl p-5 overflow-hidden hover:border-primary-container/40 transition-colors duration-500 group">
      {/* Top meta */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/15 border border-primary-container/30">
          <span className="material-symbols-outlined text-primary-container text-xs">
            trending_up
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary-container">
            Tendência
          </span>
        </span>
        <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/40">
          Tóquio → Luanda
        </span>
      </div>

      {/* Headline */}
      <h4 className="font-headline text-sm sm:text-base font-bold leading-snug text-on-surface mb-5 min-h-[3.5rem]">
        Cor cinza-azulada ganha tração entre 25-34 anos.
      </h4>

      {/* Sparkline */}
      <div className="relative h-14 mb-4">
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="spark-trend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff9156" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff9156" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,34 L10,30 L20,32 L30,24 L40,26 L50,18 L60,22 L70,12 L80,14 L90,6 L100,4 L100,40 L0,40 Z"
            fill="url(#spark-trend)"
          />
          <path
            d="M0,34 L10,30 L20,32 L30,24 L40,26 L50,18 L60,22 L70,12 L80,14 L90,6 L100,4"
            fill="none"
            stroke="#ff9156"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="100" cy="4" r="2.5" fill="#ff9156">
            <animate
              attributeName="r"
              values="2.5;4;2.5"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        {/* axis labels */}
        <div className="absolute -bottom-1 left-0 text-[8px] font-label uppercase tracking-widest text-on-surface-variant/30">
          14d atrás
        </div>
        <div className="absolute -bottom-1 right-0 text-[8px] font-label uppercase tracking-widest text-primary-container">
          hoje
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
        <span className="text-[9px] text-on-surface-variant/50 font-medium">
          Vogue Japan · ELLE · WGSN
        </span>
        <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary-container group-hover:translate-x-0.5 transition-all text-base">
          arrow_outward
        </span>
      </div>
    </article>
  )
}

// ─── Insight card 2 · Market (bar chart) ────────────────────────────────────

function InsightMarketCard() {
  const bars = [42, 58, 51, 73, 64, 88, 96] // 7 days, last is today
  const max = 100
  return (
    <article className="relative bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-2xl p-5 overflow-hidden hover:border-primary-container/40 transition-colors duration-500 group">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-container/15 border border-tertiary-container/40">
          <span className="material-symbols-outlined text-tertiary-container text-xs">
            insights
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-tertiary-container">
            Mercado
          </span>
        </span>
        <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/40">
          Lagos → Talatona
        </span>
      </div>

      <h4 className="font-headline text-sm sm:text-base font-bold leading-snug text-on-surface mb-5 min-h-[3.5rem]">
        Procura por trança nagô sobe <span className="text-primary-container">+38%</span> pós-Afronation.
      </h4>

      {/* Bars */}
      <div className="flex items-end gap-1.5 h-14 mb-4">
        {bars.map((b, i) => {
          const isToday = i === bars.length - 1
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-sm ${
                  isToday
                    ? 'volcanic-gradient'
                    : 'bg-primary-container/25'
                }`}
                style={{ height: `${(b / max) * 100}%` }}
              />
              <span
                className={`text-[7px] font-label uppercase tracking-widest ${
                  isToday ? 'text-primary-container' : 'text-on-surface-variant/30'
                }`}
              >
                {['Q', 'S', 'S', 'D', 'S', 'T', 'H'][i] /* qua sex sab dom seg ter hoje */}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
        <span className="text-[9px] text-on-surface-variant/50 font-medium">
          Beauty Africa · Instagram analytics
        </span>
        <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary-container group-hover:translate-x-0.5 transition-all text-base">
          arrow_outward
        </span>
      </div>
    </article>
  )
}

// ─── Insight card 3 · Opportunity (big metric) ─────────────────────────────

function InsightOpportunityCard() {
  return (
    <article className="relative bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-2xl p-5 overflow-hidden hover:border-primary-container/40 transition-colors duration-500 group">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/20 border border-primary-container/40">
          <span
            className="material-symbols-outlined text-primary-container text-xs"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-primary-container">
            Oportunidade
          </span>
        </span>
        <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/40">
          Milão → Maianga
        </span>
      </div>

      <h4 className="font-headline text-sm sm:text-base font-bold leading-snug text-on-surface mb-5 min-h-[3.5rem]">
        Hair gloss premium sem oferta local. Gap detectado.
      </h4>

      {/* Big metric */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tighter volcanic-gradient bg-clip-text text-transparent">
          0
        </span>
        <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">
          / 14 salões
        </span>
      </div>
      <p className="text-[10px] text-on-surface-variant/60 leading-snug mb-4">
        Nenhum dos 14 salões mapeados em Maianga oferece o serviço — procura
        local sobe há 6 semanas seguidas.
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
        <span className="text-[9px] text-on-surface-variant/50 font-medium">
          The Business of Beauty · Pesquisa local
        </span>
        <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary-container group-hover:translate-x-0.5 transition-all text-base">
          arrow_outward
        </span>
      </div>
    </article>
  )
}

// ─── Insight card 4 · Local pulse (heatmap) ────────────────────────────────

function InsightLocalCard() {
  // 7 cols (Seg–Dom) × 4 rows (manhã, almoço, tarde, noite)
  // values 0..3 representing booking intensity
  const grid: number[][] = [
    [1, 1, 1, 1, 1, 2, 1], // manhã
    [2, 2, 2, 2, 2, 3, 2], // almoço
    [2, 2, 2, 2, 3, 3, 3], // tarde
    [1, 1, 1, 1, 2, 3, 2], // noite
  ]
  const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
  return (
    <article className="relative bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 rounded-2xl p-5 overflow-hidden hover:border-primary-container/40 transition-colors duration-500 group">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4cd964]/15 border border-[#4cd964]/30">
          <span className="material-symbols-outlined text-[#4cd964] text-xs">
            radar
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#4cd964]">
            Pulso Local
          </span>
        </span>
        <span className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/40">
          Luanda
        </span>
      </div>

      <h4 className="font-headline text-sm sm:text-base font-bold leading-snug text-on-surface mb-5 min-h-[3.5rem]">
        Pico de actividade: sexta 14h-19h. Domingo subiu <span className="text-primary-container">+12%</span>.
      </h4>

      {/* Heatmap */}
      <div className="mb-4">
        <div className="grid grid-cols-7 gap-1 mb-1.5">
          {grid.map((row, ri) =>
            row.map((v, ci) => (
              <div
                key={`${ri}-${ci}`}
                className="aspect-square rounded-[3px]"
                style={{
                  backgroundColor:
                    v === 0
                      ? 'rgba(255,145,86,0.06)'
                      : v === 1
                      ? 'rgba(255,145,86,0.20)'
                      : v === 2
                      ? 'rgba(255,145,86,0.50)'
                      : '#ff9156',
                  boxShadow:
                    v === 3 ? '0 0 8px rgba(255,145,86,0.5)' : undefined,
                }}
              />
            ))
          )}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <span
              key={i}
              className="text-[7px] font-label uppercase tracking-widest text-on-surface-variant/40 text-center"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10">
        <span className="text-[9px] text-on-surface-variant/50 font-medium">
          Dados anónimos · 2,4k interações
        </span>
        <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary-container group-hover:translate-x-0.5 transition-all text-base">
          arrow_outward
        </span>
      </div>
    </article>
  )
}
