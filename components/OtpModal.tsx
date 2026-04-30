"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type OtpModalProps = {
  isOpen: boolean;
  email: string;
  onClose: () => void;
};

export function OtpModal({ isOpen, email, onClose }: OtpModalProps) {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (!isOpen) return;
    // Batch into a single render by using a single setState-like pattern
    const reset = () => {
      setOtp(["", "", "", "", "", ""]);
      setError(null);
      setResendCooldown(60);
    };
    // Use startTransition-equivalent: defer to avoid cascading renders
    const id = setTimeout(reset, 0);
    return () => clearTimeout(id);
  }, [isOpen]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }, [isOpen]);

  const handleVerify = useCallback(
    async (code: string) => {
      setError(null);
      setLoading(true);

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Código inválido. Tenta novamente.");
        setLoading(false);
        // Clear inputs on error
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
        return;
      }

      router.push("/community");
      router.refresh();
      onClose();
    },
    [email, onClose, router],
  );

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(null);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 filled
    if (digit && newOtp.every((d) => d !== "")) {
      handleVerify(newOtp.join(""));
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((d) => d === "");
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus();
    } else {
      inputRefs.current[5]?.focus();
      handleVerify(newOtp.join(""));
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError(null);
    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } else {
      const data = await res.json();
      setError(data.error ?? "Erro ao reenviar.");
    }
  }

  if (!isOpen) return null;

  const codeComplete = otp.every((d) => d !== "");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-container-lowest/40 backdrop-blur-md">
      <div className="glass-panel relative w-full max-w-md rounded-2xl p-10 space-y-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-on-surface/40 hover:text-primary-container p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl volcanic-gradient flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              mark_email_read
            </span>
          </div>
          <h2 className="font-headline text-2xl font-black tracking-tighter text-on-surface">Verifica o teu email</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Enviámos um código de 6 dígitos para
            <br />
            <strong className="text-on-surface">{email}</strong>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              className={`w-12 h-14 text-center text-xl font-black rounded-xl border-2 bg-surface-container-lowest text-on-surface outline-none transition-all
                ${digit ? "border-primary-container text-primary-container" : "border-outline-variant/30"}
                ${error ? "border-error animate-shake" : ""}
                focus:border-primary-container focus:ring-0
                disabled:opacity-50`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={() => handleVerify(otp.join(""))}
          disabled={!codeComplete || loading}
          className="w-full volcanic-gradient text-on-primary py-4 rounded-xl font-headline font-bold text-base active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>}
          {loading ? "A verificar..." : "Confirmar Código"}
        </button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-on-surface-variant text-xs mb-2">Não recebeste o email?</p>
          {resendCooldown > 0 ? (
            <p className="text-on-surface-variant/50 text-xs">
              Podes reenviar em <span className="text-primary-container font-bold">{resendCooldown}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-primary-container text-xs font-bold uppercase tracking-widest hover:underline underline-offset-4 transition-colors"
            >
              Reenviar código
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
