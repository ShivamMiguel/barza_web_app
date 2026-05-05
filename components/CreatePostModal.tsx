'use client'

import { useState } from 'react'

type CreatePostModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('O post não pode estar vazio')
      return
    }

    setError(null)
    setIsPosting(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Erro ao criar post')
        setIsPosting(false)
        return
      }

      // Reset and close
      setContent('')
      setError(null)
      onClose()
      // Optionally refresh the feed
      window.location.reload()
    } catch (err) {
      setError('Erro de conexão. Tenta novamente.')
      setIsPosting(false)
    }
  }

  function handleClose() {
    if (!isPosting) {
      setContent('')
      setError(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-surface-container-lowest/40 backdrop-blur-md">
      <div className="glass-panel relative w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isPosting}
          className="absolute top-6 right-6 z-50 text-on-surface/60 hover:text-on-surface transition-colors p-2 hover:bg-white/5 rounded-full disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-on-surface/10">
          <h2 className="font-headline text-3xl font-black tracking-tighter text-on-surface">
            Criar Post
          </h2>
          <div className="h-1 w-12 volcanic-gradient rounded-full mt-2" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-8 flex flex-col gap-6">
          {/* Textarea */}
          <div className="space-y-3">
            <label htmlFor="content" className="block text-sm font-semibold text-on-surface-variant">
              O que está a pensar?
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partilha a tua opinião, experiência ou pergunta com a comunidade Barza..."
              className="w-full h-48 p-4 rounded-2xl bg-surface-container border border-on-surface/10 text-on-surface placeholder-on-surface/40 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent resize-none font-body text-base"
              disabled={isPosting}
            />
            <p className="text-xs text-on-surface/50">
              {content.length} / 1000 caracteres
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 rounded-xl bg-error/10 border border-error/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-error text-xl flex-shrink-0 mt-0.5">
                error
              </span>
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPosting}
              className="px-6 py-3 rounded-full border border-on-surface/20 text-on-surface font-semibold hover:bg-on-surface/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPosting || !content.trim()}
              className="px-6 py-3 rounded-full volcanic-gradient text-on-primary font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isPosting ? (
                <>
                  <span className="animate-spin inline-block">
                    <span className="material-symbols-outlined text-base">hourglass_top</span>
                  </span>
                  <span>A postar...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Postar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
