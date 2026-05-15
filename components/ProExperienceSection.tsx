export function ProExperienceSection() {
  return (
    <section className="py-32 px-8 relative bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
        <div className="flex-1 order-2 md:order-1">
          <h2 className="text-5xl font-black font-headline tracking-tighter mb-8">
            O TALENTO QUE O MUNDO NÃO VÊ, O MERCADO NÃO PAGA.
          </h2>
          <div className="space-y-8 mb-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-white/5">
                <span className="material-symbols-outlined text-primary-container">visibility</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 font-headline">Visibilidade Global</h4>
                <p className="opacity-60">Sê descoberto por milhares de clientes que procuram exatamente o teu talento.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-white/5">
                <span className="material-symbols-outlined text-primary-container">trending_up</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 font-headline">Inteligência de Mercado</h4>
                <p className="opacity-60">Acede a sinais e tendências da indústria filtrados para Angola. Antecipa o que os teus clientes vão querer antes de pedirem.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-white/5">
                <span className="material-symbols-outlined text-primary-container">query_stats</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 font-headline">Analytics de Negócio</h4>
                <p className="opacity-60">Entende quem são os teus melhores clientes e quais serviços geram mais lucro.</p>
              </div>
            </div>
          </div>
          <button className="bg-primary-container text-on-primary-container px-10 py-5 text-lg font-black uppercase tracking-widest rounded-lg transition-all hover:brightness-110">Quero Crescer na Barza</button>
        </div>
        <div className="flex-1 order-1 md:order-2 relative w-full">
          <div className="relative z-10 rounded-3xl overflow-hidden aspect-square border border-outline-variant/20 shadow-2xl">
            <img className="w-full h-full object-cover" alt="Portrait of a young successful professional woman looking ahead with determination, soft cinematic lighting in a modern dark interior" data-alt="Portrait of a young successful professional woman looking ahead with determination, soft cinematic lighting in a modern dark interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0DSxwyoZlY8f79sCqUyHtPliG-jGkLHZl5-oBByXQneCPtimKA61f3aeCwK5H3eof3sbjIs9vPyhIqpKap27fAEJcWRJ_W1q90UGLvvLe6VBBwqvbCaa3Akft9e-UQmSjIs8oEBjJqXWSu7ErMLuHGVfmjUcIIy6mAchBXRlFfGPJ3ZdbFs9h8DgL_p6HtZbVZyWdY_nhtVMTREAI798OmndPwPNH_IQArd4JN39_806tqepXaolNv6Hm8n8BfJx7hy5wEA7UbAY" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/20 to-transparent"></div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-tertiary-container rounded-full mix-blend-screen blur-3xl opacity-30"></div>
        </div>
      </div>
    </section>
  );
}
