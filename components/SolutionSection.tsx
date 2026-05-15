export function SolutionSection() {
  return (
    <section className="py-32 px-8 relative overflow-hidden">
      <div className="absolute -left-40 top-1/2 w-[600px] h-[600px] volcanic-glow opacity-20"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl font-black font-headline mb-16 max-w-3xl tracking-tighter">
          BARZA TRANSFORMA FRAGMENTAÇÃO EM ECOSSISTEMA.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-surface-variant/40 backdrop-blur-xl p-8 rounded-2xl refractive-edge shadow-xl flex flex-col h-full">
            <div className="aspect-video mb-8 rounded-lg overflow-hidden border border-white/5">
              <img className="w-full h-full object-cover" alt="Close-up of a stylish diverse group of friends smiling and talking, highlighting vibrant skin tones and professional hairstyles" data-alt="Close-up of a stylish diverse group of friends smiling and talking, highlighting vibrant skin tones and professional hairstyles" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6vtxF5AYkEd7eSj51N8G_JQUj28_Ute7UFvT2QOIsPQzJYRi_o4xR2FcoNzV1SjlKNnRpkYMG_JDE8ViIa_7w3df3wDHWy_0dRUcBhrGIq6He5blTb_tEN6pLaSPKXOhDi_v7Zn8aLY100B7yu7xX96eKBPLAB_p6gVvUUuraLhYGp5TknGuyO-rd9NxsTVTsMUjv2mdJqCYoXltB0a8PufVOa2s1HfHLvkQ6D2qVYI01mFvz_mKK6r2VWun6cnMQ7YPU9caKQsw" />
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter font-headline">Comunidade</h3>
            <p className="text-on-surface-variant mb-8 flex-grow">O feed social onde a inspiração ganha vida. Partilha looks, descobre tendências e liga-te a quem dita o estilo.</p>
            <a className="text-primary-container font-bold flex items-center gap-2 group" href="#">Explorar Feed <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span></a>
          </div>
          <div className="bg-surface-variant/40 backdrop-blur-xl p-8 rounded-2xl refractive-edge shadow-xl flex flex-col h-full md:mt-12">
            <div className="aspect-video mb-8 rounded-lg overflow-hidden border border-white/5">
              <img className="w-full h-full object-cover" alt="Expert hands performing a professional manicure with precision, soft warm glow on the dark surface" data-alt="Expert hands performing a professional manicure with precision, soft warm glow on the dark surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlMibmgBx-bk5Kr-P2m0GNEE3AbhJM2OND9KM22y-HrB5yvIzKu24M7L0TYSrWmfC9bkI-fnoUVqMca_upVy_VdNdGt04X8gOPQXiYqlaL03GYwsOiwPwKHarZ0Do2cVqFyJidXxcE14OKTp_UoueJaKvaJN0OkhAOGx3oa5UwUtkpjsZL6Y0E6sPVNXA4G2ZrP18wCOFqNK1vJGdqEjFCUrgQVZPkJp89ETTBt6CIvRHVnx_V10SGl2tnsrGdZYamTSl1sXp-nu0" />
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter font-headline">Descoberta</h3>
            <p className="text-on-surface-variant mb-8 flex-grow">Encontra o profissional certo pelo estilo, localização e presença na comunidade. O contacto e o agendamento acontecem directamente entre ti e o profissional.</p>
            <a className="text-primary-container font-bold flex items-center gap-2 group" href="#">Explorar Profissionais <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span></a>
          </div>
          <div className="bg-surface-variant/40 backdrop-blur-xl p-8 rounded-2xl refractive-edge shadow-xl flex flex-col h-full">
            <div className="aspect-video mb-8 rounded-lg overflow-hidden border border-white/5">
              <img className="w-full h-full object-cover" alt="Premium cosmetic bottles arranged on dark volcanic rock with soft orange ambient lighting" data-alt="Premium cosmetic bottles arranged on dark volcanic rock with soft orange ambient lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlnm08zYUK0gLrxTH-_EpsGSXKrnLKjfPOaG_8hsVKzqPg4XD6mmR4rGa_ZheH51ybfO7SJRebu7ZJ4wSjIbo2aEv6S_S61kla48D52Nt5vP_JniI_HIW4GtcEH3zPUzP9bzY7pkGO38hqXkc3BrOO050BvnigypRUKAVgcRBokxFKkHnDkdPX2oYrPIK1ep3ZBPYDDNUYxTKIgHWEajumhagXI6yDUdOtbt6Xp6pTweGQp7MlULNkO3ZW-bsdDQXYllwd7BBnC-U" />
            </div>
            <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter font-headline">Inteligência</h3>
            <p className="text-on-surface-variant mb-8 flex-grow">Tendências globais filtradas para o contexto angolano. Sinais de mercado em tempo real para que o teu negócio antecipe o que vem a seguir.</p>
            <a className="text-primary-container font-bold flex items-center gap-2 group" href="#">Ver Sinais <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
