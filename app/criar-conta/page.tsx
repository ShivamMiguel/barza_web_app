import Link from 'next/link';

export const metadata = {
  title: 'Criar Conta | BARZA',
};

export default function CriarContaPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center obsidian-glow px-6 py-24">
      <div className="absolute top-[15%] -left-[10%] w-[40%] h-[60%] bg-primary-container opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[50%] bg-tertiary-container opacity-[0.02] blur-[100px] rounded-full pointer-events-none"></div>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 lg:col-span-6 space-y-8 pr-0 md:pr-12">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] text-on-surface">
            A tua próxima fase precisa apenas de um primeiro passo.
          </h1>
          <p className="text-on-surface-variant text-lg max-w-md leading-relaxed opacity-80">
            Cria a tua conta em menos de um minuto.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="h-[1px] w-12 bg-outline-variant opacity-30"></div>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">
              Exclusividade Obsidian
            </span>
          </div>
        </div>
        <div className="md:col-span-7 lg:col-span-6 relative">
          <div className="glass-panel p-8 md:p-12 rounded-xl relative overflow-hidden">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="font-headline text-2xl font-bold tracking-tight">Criar uma conta</h2>
                <p className="font-body text-sm text-on-surface-variant">Cria a tua conta em menos de um minuto.</p>
              </div>
              <form className="space-y-6">
                <div className="space-y-2 group">
                  <label className="block font-label text-[11px] uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary/40 rounded-lg py-4 px-4 text-on-surface placeholder:text-zinc-700 transition-all shadow-inner"
                      placeholder="Como gostas de ser chamado?"
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">
                      person
                    </span>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block font-label text-[11px] uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors">
                    Endereço de E-mail
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary/40 rounded-lg py-4 px-4 text-on-surface placeholder:text-zinc-700 transition-all shadow-inner"
                      placeholder="O teu melhor email"
                      type="email"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">
                      mail
                    </span>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block font-label text-[11px] uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors">
                    Telefone
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary/40 rounded-lg py-4 px-4 text-on-surface placeholder:text-zinc-700 transition-all shadow-inner"
                      placeholder="Número para acesso rápido"
                      type="tel"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">
                      call
                    </span>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block font-label text-[11px] uppercase tracking-widest text-on-surface-variant group-focus-within:text-primary transition-colors">
                    Palavra-passe
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary/40 rounded-lg py-4 px-4 text-on-surface placeholder:text-zinc-700 transition-all shadow-inner"
                      placeholder="Cria uma chave segura"
                      type="password"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">
                      lock
                    </span>
                  </div>
                </div>
                <button
                  className="w-full volcanic-gradient py-5 rounded-lg text-on-primary font-headline font-bold text-sm tracking-tight hover:scale-[0.98] transition-transform duration-200 active:scale-95 shadow-lg shadow-primary-container/20"
                  type="submit"
                >
                  Criar Conta
                </button>

                {/* Already have account section - Modern Button */}
                <div className="space-y-3 pt-2">
                  <p className="text-on-surface-variant text-xs text-center">
                    Já tens conta?
                  </p>
                  <a
                    href="/login"
                    className="block w-full border-2 border-primary-container text-primary-container hover:bg-primary-container/5 py-3 px-4 rounded-lg font-headline font-bold text-center text-sm tracking-tight transition-all duration-300 hover:border-primary-container/80 active:scale-95"
                  >
                    Entrar na Conta
                  </a>
                </div>
              </form>
              <div className="pt-6 border-t border-outline-variant/10 space-y-2">
                <p className="font-body text-[12px] text-zinc-500 leading-relaxed text-center">
                  Ao continuar, aceitas os <a className="text-primary hover:underline underline-offset-4" href="#">termos</a> e a visão de evoluir.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
          </div>
          <div className="hidden lg:block absolute -right-8 -bottom-12 glass-panel p-6 rounded-lg max-w-[200px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-on-primary">verified</span>
              </div>
              <span className="font-headline text-[12px] font-bold">10k+ Ativos</span>
            </div>
            <div className="flex -space-x-2">
              <img
                className="w-6 h-6 rounded-full border border-surface-container"
                data-alt="portrait of a young professional woman with a soft background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoQf1UWN1z2DFjDZ-0buzMvNWybeOQXeqFe3Q1QrWgCBz945xSEpEDJIyu4zMXUlOB7jvl-e-Ie0mtomz0Xb6tAD5tiJuO3BgFEz2DF2WHFzoe8uu5tl5422mPX4xulCRNfL4r7xsCylRqs4_BFrJP9bJ99bMBZbgjDXPPRsKVkv0lGNAAFBu8jl3LmKdHLa_Yh2u22XUbRiQKigM5HIIC1z_Di6Dew2zYNAxDkIEccuXvxyD1KqcJUcEkma561mmCvW7T0EPEtyY"
              />
              <img
                className="w-6 h-6 rounded-full border border-surface-container"
                data-alt="close-up of a smiling man with sharp lighting"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtExh6Crqpkp8NzWIm0SRBM1jUVLOBhJO_6QvfGNYESJSeO7gc01j_9_JjTQMsnxJ8K9yhvIsbvaGXAsO35xXAmS4yD778vNiYghpgPskZIUvqhu2FvuFs6viA_C5T3QKYQWN7prBMI4x6APM0XnONqflDkbA-YaCFFy2EiekkbEmK8Jm2eHvhkQYEtqfJ5QQUfldT4Ym60UB1jrAUEUQtk34Piask2oAmX7g6BljccsZ9ds1OA4zJQ8ti0-YuVi8ir7zgDdHNbD4"
              />
              <img
                className="w-6 h-6 rounded-full border border-surface-container"
                data-alt="editorial style photo of a woman in minimalist clothing"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3GJCLXTJNI72YzRiXxqHRDWenUwl-m1Oqo6zz1_CJy17FwmJV6iGKWNrEOc_eTwG6KTguQyO0J86rrnYD88a7UdpJJUOqIZel5AwnxSJD1s5r36zgpft_TEJucS0mGJcK6yGRbU5EanLTorktRAbeNfnXRAvY71ThdNepzGoBFq4Igv2lSfWDL5m2NsmBkaLkhYAbDRCSHrfbzFoDNCiS48YdKPzsvgud7ZlQ8uovJJX_wAondj-sFnmiLSw_dI3bhJFmKnTzJ5A"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
