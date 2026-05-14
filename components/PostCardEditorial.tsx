'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Avatar } from '@/components/Avatar'
import { CommentsSection } from '@/components/CommentsSection'
import { FollowButton } from '@/components/FollowButton'
import { ShareModal } from '@/components/ShareModal'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { renderRichText } from '@/lib/hashtags'
import type { PostWithUser } from '@/lib/supabase/posts'

interface PostCardEditorialProps {
  post: PostWithUser
  currentUserId?: string
  onDelete?: (postId: string) => void
  onLike?: (postId: string, liked: boolean, likesCount: number) => void
  onUpdate?: (post: PostWithUser) => void
}

export function PostCardEditorial({
  post,
  currentUserId,
  onDelete,
  onLike,
  onUpdate,
}: PostCardEditorialProps) {
  const timeAgo = getTimeAgo(new Date(post.created_at))
  const isOwner = currentUserId === post.user_id

  const [liked, setLiked] = useState<boolean>(post.liked_by_me ?? false)
  const [likesCount, setLikesCount] = useState<number>(post.likes_count)
  const [isToggling, setIsToggling] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentsCount, setCommentsCount] = useState<number>(post.comments_count)
  const [shareOpen, setShareOpen] = useState(false)

  const [content, setContent] = useState(post.content)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [isSaving, setIsSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleLike = async () => {
    if (isToggling) return

    const wasLiked = liked
    const previousCount = likesCount
    const optimisticCount = Math.max(0, previousCount + (wasLiked ? -1 : 1))

    setLiked(!wasLiked)
    setLikesCount(optimisticCount)
    setIsToggling(true)

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const data = await res.json()
      setLiked(!!data.liked)
      setLikesCount(typeof data.likes_count === 'number' ? data.likes_count : optimisticCount)
      onLike?.(post.id, !!data.liked, data.likes_count ?? optimisticCount)
    } catch {
      setLiked(wasLiked)
      setLikesCount(previousCount)
    } finally {
      setIsToggling(false)
    }
  }

  const lines = content.split('\n').filter(Boolean)
  const title = lines[0] ?? ''
  const body = lines.slice(1).join('\n')

  const titleParts = renderRichText(title, { withBold: true })
  const bodyParts = body ? renderRichText(body) : null

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setDeleteError(data.error ?? 'Erro ao eliminar o post.')
        return
      }
      setConfirmDeleteOpen(false)
      onDelete?.(post.id)
    } catch {
      setDeleteError('Erro de conexão. Tenta novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const startEdit = () => {
    setEditContent(content)
    setEditError(null)
    setIsEditing(true)
    setMenuOpen(false)
  }

  const cancelEdit = () => {
    setEditContent(content)
    setEditError(null)
    setIsEditing(false)
  }

  const saveEdit = async () => {
    const trimmed = editContent.trim()
    if (!trimmed) {
      setEditError('O conteúdo não pode estar vazio.')
      return
    }
    if (trimmed === content) {
      setIsEditing(false)
      return
    }
    setIsSaving(true)
    setEditError(null)
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed }),
      })
      const data = await res.json()
      if (!res.ok) {
        setEditError(data.error ?? 'Erro ao guardar as alterações.')
        return
      }
      setContent(trimmed)
      setIsEditing(false)
      onUpdate?.({ ...post, ...data.post, content: trimmed, user: post.user })
    } catch {
      setEditError('Erro de conexão. Tenta novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <article className="w-full liquid-obsidian-glass refractive-highlight glow-bloom rounded-xl overflow-hidden border border-[rgba(86,67,58,0.1)]">
        {/* User Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Link href={`/community/profile/${post.user_id}`} className="relative w-12 h-12 rounded-full overflow-hidden border border-[rgba(255,145,86,0.2)] flex-shrink-0 hover:opacity-80 transition-opacity">
              <Avatar name={post.user?.full_name || 'User'} avatarUrl={post.user?.avatar_url} />
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Link href={`/community/profile/${post.user_id}`} className="font-headline font-bold text-on-surface tracking-tight hover:text-primary-container transition-colors">
                  {post.user?.full_name || 'Anonymous'}
                </Link>
                {post.user?.profession && (
                  <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-label text-[0.625rem] font-bold uppercase tracking-widest">
                    {post.user.profession}
                  </span>
                )}
              </div>
              <span className="font-label text-[0.6875rem] text-on-surface-variant/60 tracking-wider uppercase">
                {timeAgo}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isOwner && (
              <FollowButton userId={post.user_id} compact />
            )}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => isOwner && setMenuOpen(o => !o)}
                className="text-on-surface-variant hover:text-primary-container transition-colors duration-300 p-1"
                aria-label={isOwner ? 'Opções do post' : undefined}
                aria-haspopup={isOwner ? 'menu' : undefined}
                aria-expanded={isOwner ? menuOpen : undefined}
              >
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
              {isOwner && menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-44 rounded-2xl py-1.5 z-20 border shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]"
                  style={{
                    background: 'linear-gradient(135deg, #1a120a 0%, #110a04 100%)',
                    borderColor: 'rgba(255,145,86,0.2)',
                  }}
                >
                  <button
                    role="menuitem"
                    onClick={startEdit}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-base text-on-surface-variant">edit</span>
                    Editar
                  </button>
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false)
                      setDeleteError(null)
                      setConfirmDeleteOpen(true)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors text-left"
                    style={{ color: '#ff4757' }}
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="px-6 pb-8 space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                disabled={isSaving}
                maxLength={1000}
                rows={Math.max(3, editContent.split('\n').length + 1)}
                className="w-full bg-black/30 border border-[rgba(255,145,86,0.2)] rounded-2xl p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary-container/40 resize-none font-body text-base leading-relaxed"
                autoFocus
              />
              {editError && (
                <div
                  className="rounded-xl px-3 py-2.5 text-xs"
                  style={{
                    background: 'rgba(255,71,87,0.08)',
                    border: '1px solid rgba(255,71,87,0.2)',
                    color: '#ff4757',
                  }}
                >
                  {editError}
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-on-surface-variant/40 font-label tabular-nums">
                  {editContent.length}/1000
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-full font-label text-xs uppercase tracking-widest font-bold text-on-surface-variant hover:bg-white/5 active:scale-95 transition-all disabled:opacity-40"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    disabled={isSaving || !editContent.trim()}
                    className="px-5 py-2 rounded-full volcanic-gradient text-on-primary font-bold text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    ) : (
                      <>
                        <span>Guardar</span>
                        <span className="material-symbols-outlined text-base">check</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface leading-tight tracking-[-0.03em]">
                {titleParts}
              </h1>
              {bodyParts && (
                <p className="font-body text-base text-on-surface-variant leading-relaxed opacity-90 whitespace-pre-wrap">
                  {bodyParts}
                </p>
              )}
              {post.image_url && (
                <div className="relative rounded-2xl overflow-hidden border border-[rgba(255,145,86,0.15)] bg-black/20">
                  <img
                    src={post.image_url}
                    alt=""
                    className="w-full max-h-[600px] object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Interaction Footer */}
        <footer className="px-6 py-5 bg-surface-container-high/40 border-t border-[rgba(86,67,58,0.1)] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              disabled={isToggling}
              aria-pressed={liked}
              aria-label={liked ? 'Remover like' : 'Curtir post'}
              className={`flex items-center gap-2 transition-all duration-300 group disabled:cursor-wait ${
                liked ? 'text-[#ff4757]' : 'text-on-surface-variant hover:text-primary-container'
              }`}
            >
              <span
                className="material-symbols-outlined group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span className="font-label text-xs font-semibold tracking-tighter">
                {likesCount}
              </span>
            </button>
            <button
              onClick={() => setCommentsOpen(o => !o)}
              aria-pressed={commentsOpen}
              aria-label={commentsOpen ? 'Fechar comentários' : 'Abrir comentários'}
              className={`flex items-center gap-2 transition-all duration-300 group ${
                commentsOpen ? 'text-primary-container' : 'text-on-surface-variant hover:text-primary-container'
              }`}
            >
              <span
                className="material-symbols-outlined group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: commentsOpen ? "'FILL' 1" : "'FILL' 0" }}
              >
                chat_bubble
              </span>
              <span className="font-label text-xs font-semibold tracking-tighter">
                {commentsCount}
              </span>
            </button>
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all duration-300 group"
              aria-label="Partilhar post"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                share
              </span>
            </button>
          </div>
          <button className="text-on-surface-variant hover:text-primary-container transition-colors duration-300">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              bookmark
            </span>
          </button>
        </footer>

        {commentsOpen && (
          <CommentsSection
            postId={post.id}
            currentUserId={currentUserId}
            onCountChange={setCommentsCount}
          />
        )}

        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          title={title.replace(/\*\*/g, '')}
          description={body || undefined}
          shareUrl={typeof window !== 'undefined' ? `${window.location.origin}/share/post/${post.id}` : ''}
          authorName={post.user?.full_name ?? undefined}
          authorAvatarUrl={post.user?.avatar_url ?? undefined}
          category={post.user?.profession ?? undefined}
        />
      </article>

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => !isDeleting && setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar post?"
        message="Esta acção não pode ser desfeita. O post e todos os comentários serão removidos permanentemente."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        icon="delete"
        isLoading={isDeleting}
        error={deleteError}
      />
    </>
  )
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'agora'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString('pt-AO', { year: '2-digit', month: 'short', day: 'numeric' })
}
