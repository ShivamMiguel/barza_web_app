export function ProblemSection() {
  return (
    <section className="py-32 px-8 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black font-headline mb-20 text-center tracking-tighter">
          UMA INDÚSTRIA GIGANTE.<br/>
          <span className="opacity-40 uppercase text-3xl">Demasiado desconectada.</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-0 border border-outline-variant/10 rounded-2xl overflow-hidden">
          <div className="p-12 border-r border-outline-variant/10 bg-surface-container-low transition-colors hover:bg-surface-container">
            <span className="material-symbols-outlined text-4xl text-primary-container mb-6">person_search</span>
            <h3 className="text-2xl font-black mb-4 font-headline">Clientes</h3>
            <p className="text-on-surface/60 leading-relaxed">Perdem horas à procura de especialistas que entendam as suas necessidades específicas sem qualquer garantia de qualidade.</p>
          </div>
          <div className="p-12 border-r border-outline-variant/10 bg-surface-container-low transition-colors hover:bg-surface-container">
            <span className="material-symbols-outlined text-4xl text-primary-container mb-6">content_cut</span>
            <h3 className="text-2xl font-black mb-4 font-headline">Profissionais</h3>
            <p className="text-on-surface/60 leading-relaxed">Talentos incríveis invisíveis ao mercado, sem ferramentas de gestão ou marketing para escalar o seu negócio.</p>
          </div>
          <div className="p-12 bg-surface-container-low transition-colors hover:bg-surface-container">
            <span className="material-symbols-outlined text-4xl text-primary-container mb-6">storefront</span>
            <h3 className="text-2xl font-black mb-4 font-headline">Marcas</h3>
            <p className="text-on-surface/60 leading-relaxed">Dificuldade em chegar ao consumidor final e educar o mercado sobre o uso correto dos seus produtos premium.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
