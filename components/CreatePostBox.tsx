'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar } from '@/components/Avatar'
import { EmojiPicker } from '@/components/EmojiPicker'
import type { UserProfile } from '@/lib/supabase/profile'
import type { PostWithUser } from '@/lib/supabase/posts'

interface Props {
  profile?: UserProfile | null
  onPostCreated?: (post: PostWithUser) => void
}

export function CreatePostBox({ profile, onPostCreated }: Props) {
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  function insertEmoji(emoji: string) {
    const ta = textareaRef.current
    if (!ta) {
      setContent(c => c + emoji)
      return
    }
    const start = ta.selectionStart ?? content.length
    const end = ta.selectionEnd ?? content.length
    const next = content.slice(0, start) + emoji + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(start + emoji.length, start + emoji.length)
    })
  }

  async function handleSubmit() {
    const trimmed = content.trim()
    if (!trimmed || isPosting) return
    setIsPosting(true)
    setError(null)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erro ao criar post')
        return
      }
      setContent('')

      if (onPostCreated && data.post && profile) {
        const postWithUser: PostWithUser = {
          ...data.post,
          user: {
            id: profile.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
            profession: profile.profession,
          },
        }
        onPostCreated(postWithUser)
      }
    } catch {
      setError('Erro de conexão. Tenta novamente.')
    } finally {
      setIsPosting(false)
    }
  }

  const userName = profile?.full_name ?? 'User'
  const firstName = userName.split(' ')[0]
  const canPost = content.trim().length > 0 && !isPosting

  return (
    <article className="bg-surface-container rounded-3xl p-5 sm:p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] border-t border-[rgba(86,67,58,0.1)]">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary-container/30">
          <Avatar name={userName} avatarUrl={profile?.avatar_url} textSize="text-xs" />
        </div>

        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={`O que está a pensar, ${firstName}?`}
            maxLength={1000}
            disabled={isPosting}
            rows={1}
            className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none resize-none font-body text-base leading-relaxed py-2"
          />

          {error && (
            <p className="text-error text-xs mt-1">{error}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-[rgba(86,67,58,0.1)]">
            <EmojiPicker onSelect={insertEmoji} disabled={isPosting} />

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-on-surface-variant/40 font-label tabular-nums">{content.length}/1000</span>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canPost}
                className="px-5 py-2 rounded-full volcanic-gradient text-on-primary font-bold text-sm uppercase tracking-wide active:scale-95 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isPosting ? (
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span>Postar</span>
                    <span className="material-symbols-outlined text-base">send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
