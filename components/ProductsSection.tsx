const TRENDS = [
  {
    category: 'Cabelo',
    name: 'Trança Nagô',
    signal: '+38% esta semana',
    origin: 'Lagos → Luanda',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW6RWDf6OYRIoSvTNG4IWcuDLMpA6mf8vGma75h5_q7_puSWn5ujI7r9cqqskDUHU32MECi6CtX3MVX-QGHSrUWjTZoI52tENYFFfsek0KslZVknGukMf3PXJZUj0OWOifNNuKedjuhlifGrouApqbMtiMFIBBXjKRG9g1RCgas1JXelVk0JFpuoc',
    alt: 'Close-up of intricate nagô braids with soft warm lighting on dark background',
  },
  {
    category: 'Estética',
    name: 'Skin Prep Ritual',
    signal: '+22% este mês',
    origin: 'Milão → Talatona',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPVRUyNVehbZnVzb3xEYOo1xngFR_0MZ6mWoHSXF51fVIlVzdZrKm7r0AcIoH6zlewFS9vHu-2AuTBiSD5e26YSqJ1ojKRC7qXHR757nZqjKt-jbUp1z30nYV-J3LfviuI80cIrXjehhBJaZOranKLxElWenPruaXlVV9thSJvU3uG_AuYfe6J1Pc5qBKIsyRww8k80Y87zs3WdDP9CuR3o2OqMHzqJGv1q7Q16d686vFa6sQZ65VC_rVEQ6NJ_UVmOEEUomcAT8Q',
    alt: 'Professional skin treatment in a modern beauty studio with warm ambient lighting',
  },
  {
    category: 'Barbearia',
    name: 'Fade Clássico',
    signal: 'Top em Viana',
    origin: 'Nova Iorque → Luanda',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAida_sm8h4EKQ-tJ9PTYfAoYs3yDwucY4a594jfAbIyaYYRDJIKseTKWehuFonjZ8FybRAr7IC_Y4kNPasb8ea7fBiypwFNlIlWzcEK6_MXANNC81k2HvhgJNM_yRltLkPOQM-kU6D3JjDel9AlzUf4pSyaFGUoRM9Mt49JS4krnNrJhRuhYWzAsLzyBeUPe_6mt3cSqhv5neveug1VrawAwX8wgmvAUxJuVOREILogj9dGLprwwz5sQz_SUsLVXhPsJtNEK7Pnvw',
    alt: 'Precise fade haircut being performed by a professional barber, dramatic studio lighting',
  },
  {
    category: 'Coloração',
    name: 'Cinza Azulado',
    signal: 'Gap detectado',
    origin: 'Tóquio → Luanda',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMIMTxokqgCwX8sOmg6307g1Pr8ZPsXBLCShRNpKtjWHyFiOJr359gF2Atf3hW5SRWDt6CIvRHVnx_V10SGl2tnsrGdZYamTSl1sXp-nu0',
    alt: 'Stylized grey-blue hair color on a model with dramatic cinematic lighting',
  },
]

export function ProductsSection() {
  return (
    <section className="py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="text-[0.6875rem] font-label tracking-[0.25em] uppercase text-primary-container font-bold mb-3">
              Tendências em Destaque
            </p>
            <h2 className="text-4xl font-black font-headline tracking-tighter mb-4">O MERCADO FALA. ESTÁS A OUVIR?</h2>
            <p className="text-on-surface/60 max-w-md">Sinais reais do que está a ganhar tração na indústria da beleza, filtrados para o contexto angolano.</p>
          </div>
          <button className="text-primary-container font-bold flex items-center gap-2 group">
            Ver todos os sinais
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">keyboard_arrow_right</span>
          </button>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {TRENDS.map((trend, index) => (
            <div key={index} className="group">
              <div className="aspect-square bg-surface-container rounded-xl overflow-hidden mb-4 relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={trend.alt}
                  data-alt={trend.alt}
                  src={trend.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-container/20 border border-primary-container/40 w-fit mb-2">
                    <span className="material-symbols-outlined text-primary-container text-[10px]">trending_up</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary-container">{trend.signal}</span>
                  </span>
                  <p className="text-[9px] font-label uppercase tracking-widest text-white/50">{trend.origin}</p>
                </div>
              </div>
              <p className="text-xs font-label uppercase tracking-widest text-primary-container mb-1">{trend.category}</p>
              <h4 className="font-bold font-headline">{trend.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
