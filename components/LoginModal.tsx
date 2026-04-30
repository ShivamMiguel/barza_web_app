"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleButton } from "@/components/GoogleButton";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
};

export function LoginModal({ isOpen, onClose, onSignupClick }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Erro ao entrar. Tenta novamente.");
      setLoading(false);
      return;
    }

    router.push("/community");
    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-surface-container-lowest/40 backdrop-blur-md">
      <div className="glass-panel relative w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 text-on-surface/60 hover:text-primary-container transition-colors p-2 hover:bg-white/5 rounded-full"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        {/* Left image — desktop only */}
        <div className="w-full md:w-5/12 relative hidden md:block">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfuJk6KiUqymKNWr83R9_7tcV8_zZVt10OGukS7UKcoATXkAfJmdyxdfBfQAEGOQ5IQed4HE7H1RjhEwu-gFe2LvJixO5X244Zi7x39H0VhN3EEy6PKlGaRJxLAfO3mFiVyA5uO45uUQQ81DGoww_D_roW-MLf6c0MkUCxcH1XT_7UuQ41qSsgjesusrXcQ5oROTLJhZmmwivOczpEo4KcrLWjX93q8kcMGevNVEUieu5MRDBzGVWiPAPG-8GOCDb_i-riQsuL1_8"
            alt="Barza login"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent opacity-80" />
          <div className="absolute bottom-12 left-12 right-12 space-y-2">
            <span className="font-label text-[10px] tracking-[0.2em] text-primary-container font-bold uppercase">Barza</span>
            <p className="font-headline text-2xl font-bold tracking-tight text-on-surface">Bom ver-te de volta.</p>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex-1 p-8 md:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto md:mx-0 w-full space-y-8">
            <div className="space-y-2">
              <h2 className="font-headline text-4xl font-black tracking-tighter text-on-surface leading-none">Entrar</h2>
              <div className="h-1 w-12 volcanic-gradient rounded-full" />
              <p className="font-body text-sm text-on-surface-variant">O teu progresso continua de onde paraste.</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-semibold">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 focus:border-primary-container/50 focus:ring-0 rounded-lg py-3 px-4 text-on-surface placeholder:text-zinc-600 transition-all outline-none"
                  placeholder="O teu email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="block font-label text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-semibold">
                    Senha
                  </label>
                  <a
                    className="text-[0.6875rem] uppercase tracking-widest text-primary-container hover:text-primary transition-colors font-semibold"
                    href="#"
                  >
                    Esqueci
                  </a>
                </div>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 focus:border-primary-container/50 focus:ring-0 rounded-lg py-3 px-4 pr-12 text-on-surface placeholder:text-zinc-600 transition-all outline-none"
                    placeholder="A tua palavra-passe"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-primary-container transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                  >
                    <span className="material-symbols-outlined text-sm">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full volcanic-gradient text-on-primary py-4 rounded-lg font-headline font-bold text-lg active:scale-95 transition-transform shadow-lg shadow-primary-container/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>}
                {loading ? "A entrar..." : "Entrar"}
              </button>
            </form>

            {/* Google OAuth */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-grow bg-outline-variant/20" />
              <span className="text-[0.6875rem] uppercase tracking-widest text-outline-variant/60">Ou</span>
              <div className="h-px flex-grow bg-outline-variant/20" />
            </div>

            <GoogleButton label="Continuar com Google" />

            <div className="space-y-3">
              <p className="text-on-surface-variant text-xs text-center">Ainda não tens conta?</p>
              <button
                onClick={() => {
                  onClose();
                  onSignupClick();
                }}
                className="w-full border-2 border-primary-container text-primary-container hover:bg-primary-container/5 py-3 rounded-lg font-headline font-bold text-center transition-all duration-300 active:scale-95"
              >
                Criar Conta Agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
