'use client'

import { useState, useEffect, useCallback } from 'react'
import { Avatar } from './Avatar'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  imageUrl?: string
  shareUrl: string
  authorName?: string
  authorAvatarUrl?: string
  category?: string
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  description,
  imageUrl,
  shareUrl,
  authorName,
  authorAvatarUrl,
  category,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleClose = useCallback(() => {
    setCopied(false)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, handleClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      const el = document.createElement('input')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 3500)
  }

  if (!isOpen) return null

  const encodedUrl = encodeURIComponent(shareUrl)

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-sm mx-0 sm:mx-4 bg-[#111111] rounded-t-3xl sm:rounded-3xl overflow-hidden border border-white/8 shadow-[0_-20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,145,86,0.05)]">
        {/* Mobile handle */}
        <div className="flex justify-center pt-3 pb-0 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        <div className="p-5 pt-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[10px] font-label font-bold uppercase tracking-[0.25em] text-on-surface/50">
              Partilhar
            </h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-on-surface-variant hover:text-on-surface transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Preview Card */}
          <div className="bg-[#1c1c1c] rounded-2xl overflow-hidden mb-4 border border-white/5 shadow-lg">
            {imageUrl && (
              <div className="w-full h-32 overflow-hidden">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
            )}
            {!imageUrl && (
              <div
                className="w-full h-20"
                style={{ background: 'linear-gradient(135deg, #1a0f0a 0%, #2a1510 50%, #1a0f0a 100%)' }}
              >
                <div className="w-full h-full flex items-center justify-center opacity-30">
                  <div className="w-12 h-12 rounded-full" style={{ background: 'linear-gradient(135deg, #ff9156, #ff4757)' }} />
                </div>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ff9156, #ff4757)' }}
                />
                <span className="text-[9px] text-[#ff9156] font-bold uppercase tracking-[0.2em]">Barza</span>
                {category && (
                  <>
                    <span className="text-[9px] text-on-surface-variant/30">·</span>
                    <span className="text-[9px] text-on-surface-variant/50 uppercase tracking-widest truncate">
                      {category}
                    </span>
                  </>
                )}
              </div>
              <p className="font-bold text-sm text-on-surface leading-snug line-clamp-2 mb-1">
                {title}
              </p>
              {description && (
                <p className="text-[11px] text-on-surface-variant/60 line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
              {authorName && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                    <Avatar name={authorName} avatarUrl={authorAvatarUrl} textSize="text-[6px]" />
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50">{authorName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Platform Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all active:scale-95"
              style={{ background: 'rgba(24,119,242,0.08)', border: '1px solid rgba(24,119,242,0.2)' }}
            >
              <FacebookSVG />
              <span className="text-[9px] font-label font-bold uppercase tracking-wider text-[#1877F2]">
                Facebook
              </span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all active:scale-95"
              style={{ background: 'rgba(10,102,194,0.08)', border: '1px solid rgba(10,102,194,0.2)' }}
            >
              <LinkedInSVG />
              <span className="text-[9px] font-label font-bold uppercase tracking-wider text-[#0A66C2]">
                LinkedIn
              </span>
            </a>

            <button
              onClick={handleCopy}
              className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl transition-all active:scale-95"
              style={{ background: 'rgba(221,42,123,0.08)', border: '1px solid rgba(221,42,123,0.2)' }}
            >
              <InstagramSVG />
              <span className="text-[9px] font-label font-bold uppercase tracking-wider text-[#DD2A7B]">
                Instagram
              </span>
            </button>
          </div>

          {/* Instagram tip */}
          {copied && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#DD2A7B]/8 border border-[#DD2A7B]/15 mb-3">
              <span className="material-symbols-outlined text-[#DD2A7B] text-sm flex-shrink-0">check_circle</span>
              <p className="text-[10px] text-[#DD2A7B]/80 leading-tight">
                Link copiado! Cola no Instagram Stories para partilhar.
              </p>
            </div>
          )}

          {/* Copy Link Row */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-[#1c1c1c] border border-white/5 hover:border-[#ff9156]/30 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="material-symbols-outlined text-base text-on-surface-variant group-hover:text-[#ff9156] transition-colors flex-shrink-0">
                link
              </span>
              <span className="text-[10px] text-on-surface-variant/40 truncate">{shareUrl}</span>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ml-2 transition-colors ${
                copied ? 'text-green-400' : 'text-[#ff9156]'
              }`}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function FacebookSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        fill="#1877F2"
      />
    </svg>
  )
}

function LinkedInSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
        fill="#0A66C2"
      />
    </svg>
  )
}

function InstagramSVG() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
        fill="#DD2A7B"
      />
    </svg>
  )
}
