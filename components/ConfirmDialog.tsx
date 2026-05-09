'use client'

import { useEffect } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  icon?: string
  isLoading?: boolean
  error?: string | null
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  icon,
  isLoading = false,
  error,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const isDanger = variant === 'danger'
  const defaultIcon = isDanger ? 'warning' : 'help'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={isLoading ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-7 border shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
        style={{
          background: 'linear-gradient(135deg, #1a120a 0%, #110a04 100%)',
          borderColor: isDanger ? 'rgba(255,71,87,0.25)' : 'rgba(255,145,86,0.2)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-4">
          <div
            className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: isDanger ? 'rgba(255,71,87,0.12)' : 'rgba(255,145,86,0.12)',
              border: `1px solid ${isDanger ? 'rgba(255,71,87,0.25)' : 'rgba(255,145,86,0.25)'}`,
            }}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ color: isDanger ? '#ff4757' : '#ff9156' }}
            >
              {icon ?? defaultIcon}
            </span>
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h2 id="confirm-dialog-title" className="text-lg font-bold text-white leading-tight mb-1.5">
              {title}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {message}
            </p>
          </div>
        </div>

        {error && (
          <div
            className="rounded-xl px-3 py-2.5 mb-4 text-xs"
            style={{
              background: 'rgba(255,71,87,0.08)',
              border: '1px solid rgba(255,71,87,0.2)',
              color: '#ff4757',
            }}
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-full font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant hover:bg-white/5 active:scale-95 transition-all disabled:opacity-40"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-full font-label text-xs uppercase tracking-widest font-bold text-white active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
            style={{
              background: isDanger
                ? 'linear-gradient(90deg, #ff4757, #ff2e44)'
                : 'linear-gradient(90deg, #ff9156, #ff4757)',
            }}
          >
            {isLoading && (
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
