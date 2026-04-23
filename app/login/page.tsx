import Link from 'next/link';

export const metadata = {
  title: 'Login | BARZA',
};

export default function LoginPage() {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-fixed">
      <div className="ambient-glow"></div>
      
      {/* Header Section */}
      <header className="fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 bg-transparent">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-primary-container font-headline">
            Barza
          </Link>
          <div className="flex gap-4 items-center">
            <button className="text-zinc-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined" data-icon="help">help</span>
            </button>
            <button className="text-zinc-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined" data-icon="info">info</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex justify-center px-4 relative z-10 lg:grid lg:grid-cols-2 lg:px-0 pt-20 lg:pt-0">
        {/* Left Side - Image (Desktop Only) */}
        <div className="hidden lg:block relative h-full w-full overflow-hidden">
          <img
            alt="Welcoming professionals"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfuJk6KiUqymKNWr83R9_7tcV8_zZVt10OGukS7UKcoATXkAfJmdyxdfBfQAEGOQ5IQed4HE7H1RjhEwu-gFe2LvJixO5X244Zi7x39H0VhN3EEy6PKlGaRJxLAfO3mFiVyA5uO45uUQQ81DGoww_D_roW-MLf6c0MkUCxcH1XT_7UuQ41qSsgjesusrXcQ5oROTLJhZmmwivOczpEo4KcrLWjX93q8kcMGevNVEUieu5MRDBzGVWiPAPG-8GOCDb_i-riQsuL1_8"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-background shadow-[inset_-100px_0_100px_-50px_#131313]"></div>
          <div className="absolute bottom-12 left-12 z-20">
            <div className="bg-primary-container/10 backdrop-blur-md border border-primary-container/20 p-6 rounded-xl">
              <p className="text-primary-container font-headline font-bold text-xl mb-1">Bem-vindo à Experiência Barza</p>
              <p className="text-on-surface-variant text-sm">Onde a sofisticação encontra o cuidado profissional.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md glass-panel refractive-edge rounded-xl p-8 md:p-12 lg:justify-self-center lg:my-auto">
          {/* Editorial Headline */}
          <div className="mb-12">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface mb-2">
              Bom ver-te de volta.
            </h1>
            <p className="text-on-surface-variant text-sm font-medium tracking-tight">
              O progresso continua de onde paraste.
            </p>
          </div>

          <form className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-semibold">
                Email
              </label>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-primary/40 focus:ring-0 rounded-lg py-3 px-4 text-on-surface placeholder:text-zinc-600 transition-all outline-none"
                  placeholder="Email ou número"
                  type="email"
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none border-t border-primary/20"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-semibold">
                  Senha
                </label>
                <a className="text-[0.6875rem] uppercase tracking-widest text-primary-fixed-dim hover:text-primary transition-colors font-semibold" href="#">
                  Esqueci a palavra-passe
                </a>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/15 focus:border-primary/40 focus:ring-0 rounded-lg py-3 px-4 text-on-surface placeholder:text-zinc-600 transition-all outline-none"
                  placeholder="A tua palavra-passe"
                  type="password"
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none border-t border-primary/20"></div>
              </div>
            </div>

            {/* Primary CTA */}
            <button
              className="w-full volcanic-gradient text-on-primary py-4 rounded-lg font-headline font-bold text-lg active:scale-95 transition-transform shadow-lg shadow-primary-container/10"
              type="submit"
            >
              Entrar
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-grow bg-outline-variant opacity-20"></div>
            <span className="text-[0.6875rem] uppercase tracking-widest text-outline-variant opacity-60">Ou</span>
            <div className="h-px flex-grow bg-outline-variant opacity-20"></div>
          </div>

          {/* Sign Up Link with Modern Button */}
          <div className="space-y-3">
            <p className="text-on-surface-variant text-xs text-center">
              Ainda não tens conta?
            </p>
            <Link
              href="/criar-conta"
              className="block w-full border-2 border-primary-container text-primary-container hover:bg-primary-container/5 py-3 rounded-lg font-headline font-bold text-center transition-all duration-300 hover:border-primary-container/80 active:scale-95"
            >
              Criar Conta Agora
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
