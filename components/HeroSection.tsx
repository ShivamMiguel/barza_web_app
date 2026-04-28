import Link from 'next/link';

type HeroSectionProps = {
  onDownloadClick: () => void;
};

export function HeroSection({ onDownloadClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 sm:pt-24 lg:pt-32 overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover opacity-40"
          alt="Stunning portrait of a confident African woman with artistic braids in a high-end fashion studio setting with dramatic warm side lighting"
          data-alt="Stunning portrait of a confident African woman with artistic braids in a high-end fashion studio setting with dramatic warm side lighting"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBD7U-EPjUDIJ6hUoy6bYXK3Y0G6bqsvumju1bSPaxMmyZhS7fn80E5RUJ1wi6dAN8987Kl8nZ8-OnfV3CkAwwz5RX44-ZFzR2VlHchLvb0fGKpeEtqMaGgJOg62QPO0SweRsgSy4L1-J-756yJjJ_CchNNDO2akh7jZ3jfUegEY15xc5lB7tpSEvswJf7hL_pju4QHS5rSE_WykYswWo0V4lNB7Wy5gunaIWWsFnP2j0Cb7QmXdb9FGlRx8XagVNhy2HfW67DgC0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-10 w-full">
        <div className="lg:col-span-8">
          <h1 className="text-4xl sm:text-5xl lg:text-[5.5rem] font-extrabold font-headline leading-[0.95] tracking-tighter mb-4 sm:mb-6 lg:mb-8 text-on-background">
            A BELEZA NUNCA FOI SÓ APARÊNCIA.<br/>
            <span className="text-primary-container">É PRESENÇA.</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-2xl text-on-surface/80 max-w-xl mb-6 sm:mb-8 lg:mb-12 font-body leading-relaxed">
            Barza junta comunidade, serviços e produtos numa só plataforma. Descobre tendências, marca profissionais e compra com confiança.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-6 items-start sm:items-center">
            <button onClick={onDownloadClick} className="bg-primary-container text-on-primary-container px-6 sm:px-10 py-3 sm:py-5 text-sm sm:text-base lg:text-lg font-black uppercase tracking-widest rounded-lg transition-all hover:brightness-110 shadow-2xl shadow-primary-container/20 flex items-center gap-2 w-full sm:w-auto justify-center">
              Baixar App
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <Link href="/criar-conta" className="border border-outline-variant px-6 sm:px-10 py-3 sm:py-5 text-sm sm:text-base lg:text-lg font-bold rounded-lg hover:bg-surface-variant/30 transition-all inline-flex items-center justify-center w-full sm:w-auto">
              Criar Conta Grátis
            </Link>
            <Link className="text-primary-container font-bold underline underline-offset-8 decoration-2 hover:text-white transition-all text-sm sm:text-base lg:text-lg w-full sm:w-auto text-center sm:text-left" href="/community">Usar Versão Web</Link>
          </div>
          <div className="pt-8 sm:pt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 opacity-60">
            <div className="flex -space-x-3">
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8xgaihEzpkQDF-dLktwcsNwPJM1Hsl9pTlpRL4DjfCEFbdnyx0m--lmt4BQRwGPVSEsf8BWIBrC8qQ3TPoFpI45VQ_iIrbjHNgpjo79Y-KCtkXD_WneikBG-Mn5bkG7URrY6PQT8o5PiB-KpdGz-Vs65upQ7T9v0HNrzBZ3BFFELViw1R4gAXbcMoSOA_GZp-MJuFS3wkBr8-Ue7kJnGwCJuY1W1fbvOk_pUhqRe-DswWF4ydOsYP0E9frxoXGY6VHiHA4ZxMcww" alt="" />
              </div>
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2N6Z560YzDBhDaaRG_GUR6aeRlUfUVAy-ZSbumIWT75p4Fww_M9Eo6RwkU-7a1ormMapRvW28UL17QqZRyxSs6LfVpB9GtXAQtRbx_u-neaLltdz33sU5Pp_ix0Lsnc54pces_1VudAhynx3a48XevfiYNYPrh40dCU4IL_NIImdoVUXL7LeQ6UjKJdHK2Uhrk8qgRwpy7aYnhNd7DvHxfC_DvL9KdVIiYMNaA0mWe1T454rjeIMeIr7zd7rvZqadfsR9vkePmWc" alt="" />
              </div>
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKmndB5B4VbMiHt6fdAc3-RWzZcTRyCd9Pwbc_t-PmarxkKVBdIRRubiZMKAPPxIJFU2lbH_6Vs1Gzq3A7e6bhJeXAkeQ70FYkrmNiLp2xvoQnjhiXWeM0bW2wmkvgtPov6GpfxOu74WEADGhzd6Jvdnlp2Hp8iWvvspSd93tE-bUkecj7gLRx0FH1t6RG-8Wr0RjPbLpGy58dw-Wykz2M4JimxOSxTPZqGMR2nKMZwp8PYpp8IpoUrCgwdD-OS6_rlVk-FEKLqgk" alt="" />
              </div>
            </div>
            <p className="text-[0.65rem] sm:text-xs font-label uppercase tracking-widest">+15,000 profissionais já a bordo</p>
          </div>
        </div>
        <div className="lg:col-span-4 relative hidden lg:block">
          <div className="relative z-10 p-4 sm:p-6 bg-surface-container/60 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl mb-4 sm:mb-6">
            <p className="text-[0.65rem] sm:text-xs font-label uppercase tracking-widest text-primary-container mb-1">Destaque da Semana</p>
            <p className="text-base sm:text-lg font-bold">Studio Afro-Futurista: A revolução do corte em Luanda.</p>
          </div>
          <div className="p-4 sm:p-6 bg-surface-variant/70 backdrop-blur-2xl rounded-xl border border-white/5 shadow-2xl w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <div>
                <p className="text-xs font-label uppercase tracking-tighter opacity-60">Trending</p>
                <p className="font-bold text-sm lg:text-base">Tranças Nagô</p>
              </div>
            </div>
            <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary-container w-[85%] h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
