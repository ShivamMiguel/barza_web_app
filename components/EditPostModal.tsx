'use client'

import { useState, useEffect } from 'react'

interface Post {
  id: string
  user_id?: string
  content: string
  image_url?: string
  likes_count?: number
  comments_count?: number
  created_at?: string
  updated_at?: string
}

type EditPostModalProps = {
  isOpen: boolean
  post: Post | null
  onClose: () => void
  onPostUpdated?: (post: any) => void
}

export function EditPostModal({
  isOpen,
  post,
  onClose,
  onPostUpdated,
}: EditPostModalProps) {
  const [content, setContent] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (post) {
      setContent(post.content)
      setError(null)
      setSuccess(false)
    }
  }, [post])

  if (!isOpen || !post) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!post) {
      setError('Post not found')
      return
    }

    if (!content.trim()) {
      setError('O post não pode estar vazio')
      return
    }

    setError(null)
    setIsUpdating(true)

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error ?? 'Erro ao atualizar post')
        setIsUpdating(false)
        return
      }

      // Show success message
      setSuccess(true)
      setError(null)

      // Call callback if provided
      if (onPostUpdated && data.post) {
        onPostUpdated(data.post)
      }

      // Close modal after 1 second
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1000)
    } catch (err) {
      setError('Erro de conexão. Tenta novamente.')
      setIsUpdating(false)
    }
  }

  function handleClose() {
    if (!isUpdating) {
      setContent(post?.content || '')
      setError(null)
      setSuccess(false)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-surface-container-lowest/40 backdrop-blur-md">
      <div className="glass-panel relative w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={isUpdating}
          className="absolute top-6 right-6 z-50 text-on-surface/60 hover:text-on-surface transition-colors p-2 hover:bg-white/5 rounded-full disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-on-surface/10">
          <h2 className="font-headline text-3xl font-black tracking-tighter text-on-surface">
            Editar Post
          </h2>
          <div className="h-1 w-12 volcanic-gradient rounded-full mt-2" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-8 flex flex-col gap-6">
          {/* Textarea */}
          <div className="space-y-3">
            <label htmlFor="content" className="block text-sm font-semibold text-on-surface-variant">
              Edita o teu post
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-48 p-4 rounded-2xl bg-surface-container border border-on-surface/10 text-on-surface placeholder-on-surface/40 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent resize-none font-body text-base"
              disabled={isUpdating}
              maxLength={1000}
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

          {/* Success message */}
          {success && (
            <div className="p-4 rounded-xl bg-success/10 border border-success/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-success text-xl flex-shrink-0 mt-0.5">
                check_circle
              </span>
              <p className="text-sm text-success">Post atualizado com sucesso!</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUpdating}
              className="px-6 py-3 rounded-full border border-on-surface/20 text-on-surface font-semibold hover:bg-on-surface/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdating || !content.trim() || content === post.content}
              className="px-6 py-3 rounded-full volcanic-gradient text-on-primary font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isUpdating ? (
                <>
                  <span className="animate-spin inline-block">
                    <span className="material-symbols-outlined text-base">hourglass_top</span>
                  </span>
                  <span>A atualizar...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check</span>
                  <span>Atualizar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
