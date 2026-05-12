'use client'

import { useState, useRef, useEffect } from 'react'
import { Avatar } from '@/components/Avatar'
import { EmojiPicker } from '@/components/EmojiPicker'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/supabase/profile'
import type { PostWithUser } from '@/lib/supabase/posts'

interface Props {
  profile?: UserProfile | null
  onPostCreated?: (post: PostWithUser) => void
  placeholder?: string
  autoFocus?: boolean
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024
const STORAGE_BUCKET = 'logo'

export function CreatePostBox({ profile, onPostCreated, placeholder, autoFocus }: Props) {
  const [content, setContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content])

  useEffect(() => {
    if (!autoFocus) return
    const id = window.setTimeout(() => {
      textareaRef.current?.focus()
      textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
    return () => window.clearTimeout(id)
  }, [autoFocus])

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null)
      return
    }
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

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

  function handleFilePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('O ficheiro deve ser uma imagem.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('A imagem ultrapassa 4MB.')
      return
    }

    setError(null)
    setImageFile(file)
  }

  function clearImage() {
    setImageFile(null)
  }

  async function uploadImage(file: File, userId: string): Promise<string> {
    const supabase = createClient()
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const path = `posts/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit() {
    const trimmed = content.trim()
    if (!trimmed || isPosting) return
    setIsPosting(true)
    setError(null)
    try {
      let image_url: string | undefined
      if (imageFile && profile?.id) {
        try {
          image_url = await uploadImage(imageFile, profile.id)
        } catch (e) {
          console.error('Upload error:', e)
          setError('Erro ao enviar a imagem.')
          return
        }
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed, image_url }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erro ao criar post')
        return
      }
      setContent('')
      setImageFile(null)

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
            placeholder={placeholder ?? `O que está a pensar, ${firstName}?`}
            maxLength={1000}
            disabled={isPosting}
            rows={1}
            className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none resize-none font-body text-base leading-relaxed py-2"
          />

          {imagePreview && (
            <div className="relative mt-3 rounded-2xl overflow-hidden border border-[rgba(255,145,86,0.2)]">
              <img src={imagePreview} alt="Preview" className="w-full max-h-80 object-cover" />
              <button
                type="button"
                onClick={clearImage}
                disabled={isPosting}
                aria-label="Remover imagem"
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/80 active:scale-95 transition-all disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-white text-lg">close</span>
              </button>
            </div>
          )}

          {error && (
            <p className="text-error text-xs mt-2">{error}</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFilePick}
            className="hidden"
          />

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-[rgba(86,67,58,0.1)]">
            <div className="flex items-center gap-1">
              <EmojiPicker onSelect={insertEmoji} disabled={isPosting} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPosting}
                aria-label="Adicionar imagem"
                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">image</span>
              </button>
            </div>

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
