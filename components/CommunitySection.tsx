export function CommunitySection() {
  return (
    <section className="py-32 px-8 overflow-hidden bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black font-headline tracking-tighter mb-6">AS PESSOAS NÃO ENTRAM SÓ PARA MARCAR.</h2>
          <h3 className="text-4xl font-headline text-primary-container">ENTRAM PARA PERTENCER.</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-12">
          <div className="w-[280px] h-[580px] bg-black rounded-[3rem] border-[8px] border-surface-variant p-3 shadow-2xl relative">
            <div className="bg-surface-container-lowest h-full w-full rounded-[2.5rem] overflow-hidden relative">
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-black text-primary-container">BARZA FEED</span>
                <span className="material-symbols-outlined text-sm">notifications</span>
              </div>
              <div className="h-full overflow-y-auto pb-20">
                <img className="w-full h-64 object-cover" alt="In-app smartphone screen showing a vibrant social feed with images of creative hairstyles and beauty tips" data-alt="In-app smartphone screen showing a vibrant social feed with images of creative hairstyles and beauty tips" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEJLRINK8FJq86hsxkr7a6bVGOSixKUL9pzyLL52EzUx1VbcWyWshwkPl99MS3ZLJwh29KUaIwGwaWYneKBc1udValPuV5YwtZvw1GiFNN0jojL-qNt6-lJQ61M3su5zyA42xEkRoYTzUIVT8qx6T0NzKhUGO7MkfNQ7BzWLvNl0IFAGpk4Ktrf_oyR8E286AAPTd9WHJPnzPwbeYihUrYnTxFuNlYHra5L4IGybPwKowrmdVACRmkQKLTY67vejrAQ6UF6-VvgYs" />
                <div className="p-4">
                  <div className="flex gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-container"></div>
                    <div>
                      <p className="text-[10px] font-bold">Aline Silva</p>
                      <p className="text-[8px] opacity-50">Há 2 horas • Luanda</p>
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed mb-4">A nova coleção de tranças da @StudioAfro está simplesmente incrível. O que acham deste brilho?</p>
                  <div className="flex gap-4 opacity-60">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    <span className="material-symbols-outlined text-sm">chat_bubble</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[280px] h-[580px] bg-black rounded-[3rem] border-[8px] border-surface-variant p-3 shadow-2xl relative md:-mt-12">
            <div className="bg-surface-container-lowest h-full w-full rounded-[2.5rem] overflow-hidden relative">
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-primary-container">search</span>
                <span className="text-[10px] opacity-40 uppercase tracking-widest">Encontrar pro...</span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                <div className="bg-surface-container h-24 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                  <span className="material-symbols-outlined text-primary-container mb-1">face</span>
                  <p className="text-[8px] font-bold uppercase">Barbearia</p>
                </div>
                <div className="bg-surface-container h-24 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                  <span className="material-symbols-outlined text-primary-container mb-1">brush</span>
                  <p className="text-[8px] font-bold uppercase">Unhas</p>
                </div>
                <div className="bg-surface-container h-24 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                  <span className="material-symbols-outlined text-primary-container mb-1">spa</span>
                  <p className="text-[8px] font-bold uppercase">Spa &amp; Skin</p>
                </div>
                <div className="bg-surface-container h-24 rounded-lg flex flex-col items-center justify-center p-2 text-center border border-primary-container/30">
                  <span className="material-symbols-outlined text-primary-container mb-1">content_cut</span>
                  <p className="text-[8px] font-bold uppercase">Cabelo</p>
                </div>
              </div>
              <div className="px-4 mt-2">
                <p className="text-[10px] font-bold mb-3 uppercase tracking-widest opacity-40">Profissionais Perto de Ti</p>
                <div className="flex gap-3 bg-surface-container p-2 rounded-xl mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gray-800"></div>
                  <div className="flex-grow">
                    <p className="text-[9px] font-bold">Mestre Kikas</p>
                    <p className="text-[8px] opacity-50">Viana, Luanda</p>
                  </div>
                  <div className="text-[8px] text-primary-container">★ 4.9</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
