'use client';

import { useRouter } from 'next/navigation';

type SignupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
};

export function SignupModal({ isOpen, onClose, onLoginClick }: SignupModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push('/community');
  }

  function handleLoginClick() {
    onClose();
    onLoginClick();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-surface-container-lowest/40 backdrop-blur-md">
      <div className="glass-panel relative w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 text-on-surface/60 hover:text-primary-container transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        {/* Left — editorial copy (desktop only) */}
        <div className="w-full md:w-5/12 relative hidden md:flex flex-col justify-end p-12 bg-surface-container-low">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-container opacity-[0.06] blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-tertiary-container opacity-[0.04] blur-[60px] rounded-full pointer-events-none"></div>
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <span className="font-headline text-xs font-bold text-primary-container uppercase tracking-widest">10k+ Activos</span>
            </div>
            <h2 className="font-headline text-3xl font-extrabold tracking-tighter leading-[0.95] text-on-surface">
              A tua próxima fase precisa apenas de um primeiro passo.
            </h2>
            <div className="h-1 w-12 volcanic-gradient rounded-full"></div>
            <p className="text-on-surface-variant text-sm leading-relaxed opacity-80">
              Cria a tua conta em menos de um minuto e junta-te à comunidade.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-md mx-auto md:mx-0 w-full space-y-6">

            <div className="space-y-1">
              <h2 className="font-headline text-3xl font-black tracking-tighter text-on-surface leading-none">
                Criar Conta
              </h2>
              <div className="h-1 w-12 volcanic-gradient rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
                  Nome Completo
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 focus:border-primary-container/50 focus:ring-0 rounded-lg py-3 px-4 pr-10 text-on-surface placeholder:text-zinc-600 transition-all outline-none"
                    placeholder="Como gostas de ser chamado?"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">person</span>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
                  Email
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 focus:border-primary-container/50 focus:ring-0 rounded-lg py-3 px-4 pr-10 text-on-surface placeholder:text-zinc-600 transition-all outline-none"
                    placeholder="O teu melhor email"
                    type="email"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">mail</span>
                </div>
              </div>

              {/* Telefone */}
              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
                  Telefone
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 focus:border-primary-container/50 focus:ring-0 rounded-lg py-3 px-4 pr-10 text-on-surface placeholder:text-zinc-600 transition-all outline-none"
                    placeholder="Número para acesso rápido"
                    type="tel"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">call</span>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold">
                  Palavra-passe
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 focus:border-primary-container/50 focus:ring-0 rounded-lg py-3 px-4 pr-10 text-on-surface placeholder:text-zinc-600 transition-all outline-none"
                    placeholder="Cria uma chave segura"
                    type="password"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 text-sm">lock</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full volcanic-gradient py-4 rounded-lg text-on-primary font-headline font-bold text-base active:scale-95 transition-transform shadow-lg shadow-primary-container/20"
              >
                Criar Conta
              </button>
            </form>

            <div className="flex items-center gap-4">
              <div className="h-px flex-grow bg-outline-variant/20"></div>
              <span className="text-[0.6875rem] uppercase tracking-widest text-outline-variant/60">Ou</span>
              <div className="h-px flex-grow bg-outline-variant/20"></div>
            </div>

            <div className="space-y-3">
              <p className="text-on-surface-variant text-xs text-center">Já tens conta?</p>
              <button
                onClick={handleLoginClick}
                className="w-full border-2 border-primary-container text-primary-container hover:bg-primary-container/5 py-3 rounded-lg font-headline font-bold text-center transition-all duration-300 active:scale-95"
              >
                Entrar na Conta
              </button>
            </div>

            <p className="font-body text-[11px] text-zinc-500 leading-relaxed text-center">
              Ao continuar, aceitas os{' '}
              <a className="text-primary hover:underline underline-offset-4" href="#">termos</a>{' '}
              e a visão de evoluir.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
