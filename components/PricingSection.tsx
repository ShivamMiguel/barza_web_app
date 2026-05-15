type PricingSectionProps = {
  onSignupClick: () => void
}

export function PricingSection({ onSignupClick }: PricingSectionProps) {
  return (
    <section className="py-32 px-8 bg-[#0a0a0a] relative overflow-hidden">
      {/* ambient bloom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-container/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Manifesto ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">

          {/* left column */}
          <div className="space-y-8">
            <p className="text-[0.5625rem] font-label tracking-[0.35em] uppercase text-primary-container/50">
              Manifesto
            </p>

            <div className="space-y-6">
              <p className="text-3xl md:text-4xl font-black font-headline tracking-tighter text-white leading-tight">
                A beleza mudou.
              </p>

              <div className="space-y-1 text-base md:text-lg font-headline text-[#e5e2e1]/50 leading-relaxed">
                <p>Já não vive apenas nos salões, estúdios ou produtos.</p>
                <p>Vive na <span className="text-white font-bold">atenção</span>.</p>
                <p>Na descoberta.</p>
                <p>Na forma como as pessoas encontram, observam e escolhem.</p>
              </div>

              <div className="pt-2 space-y-1 text-base md:text-lg font-headline text-[#e5e2e1]/40 leading-relaxed">
                <p>Durante anos, profissionais da beleza cresceram</p>
                <p>através do boca-a-boca.</p>
                <p className="text-[#e5e2e1]/70 font-semibold">Hoje, presença também é estratégia.</p>
              </div>
            </div>
          </div>

          {/* right column */}
          <div className="lg:pt-20 space-y-8">
            <div className="text-base md:text-lg font-headline text-[#e5e2e1]/60 leading-relaxed space-y-4">
              <p>
                A <span className="text-white font-bold">BARZA</span> existe para tornar talentos, marcas e espaços visíveis dentro da nova economia da beleza africana.
              </p>

              <p className="text-[#ff9156] font-semibold">
                Não cobramos percentagens sobre o teu trabalho.
              </p>
              <p className="text-[#e5e2e1]/40">
                Porque acreditamos que o que crias já te pertence.
              </p>
            </div>

            <div className="text-base md:text-lg font-headline text-[#e5e2e1]/40 leading-relaxed space-y-1 pt-2">
              <p>Criámos um espaço onde presença, descoberta e</p>
              <p>inteligência de mercado se encontram no mesmo lugar.</p>
            </div>

            <div className="text-sm font-headline text-[#e5e2e1]/35 leading-relaxed space-y-1 pt-2">
              <p>Porque o mercado fala todos os dias.</p>
              <p className="text-[#e5e2e1]/60 font-semibold">A maioria apenas não consegue vê-lo.</p>
            </div>
          </div>
        </div>

        {/* ── Price ───────────────────────────────────────────── */}
        <div className="border-t border-[#ff9156]/15 pt-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">

            {/* plan description */}
            <div className="max-w-lg">
              <p className="text-[0.5625rem] font-label tracking-[0.35em] uppercase text-primary-container/50 mb-5">
                Plano
              </p>
              <h2 className="text-5xl md:text-6xl font-black font-headline tracking-tighter text-white leading-[0.95] mb-5">
                Professional<br />Presence
              </h2>
              <p className="text-[#e5e2e1]/45 text-sm leading-loose">
                O teu trabalho dentro de um ecossistema onde tendências, comportamento e atenção podem ser observados em tempo real.
              </p>

              {/* feature pills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {['Espaço Profissional', 'Feed de Comunidade', 'Inteligência de Mercado', 'Perfil Verificado'].map(f => (
                  <span
                    key={f}
                    className="text-[0.5625rem] font-label tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#ff9156]/20 text-primary-container/70"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* price card */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="relative rounded-3xl overflow-hidden border border-[#ff9156]/20 bg-gradient-to-b from-[#ff9156]/[0.07] to-transparent p-8 lg:min-w-[260px] text-center">
                {/* subtle top bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] volcanic-gradient opacity-60" />

                <p className="text-[0.5625rem] font-label tracking-[0.35em] uppercase text-primary-container/50 mb-4">
                  Por mês
                </p>

                <div className="flex items-end justify-center gap-1 mb-1">
                  <span className="text-6xl font-black font-headline text-white tracking-tighter leading-none">
                    6.999
                  </span>
                </div>
                <p className="text-primary-container font-bold text-base">
                  Kz<span className="text-[#e5e2e1]/30 text-sm font-normal"> / mês</span>
                </p>

                <button
                  onClick={onSignupClick}
                  className="mt-8 w-full volcanic-gradient text-on-primary font-bold py-3.5 rounded-2xl text-[0.6875rem] uppercase tracking-[0.15em] active:scale-95 transition-transform"
                >
                  Começar Agora
                </button>

                <p className="mt-3 text-[0.5625rem] text-[#e5e2e1]/25 font-label tracking-wide">
                  Sem percentagens. Sem surpresas.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
