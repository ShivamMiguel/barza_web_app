'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar } from '@/components/Avatar'
import { EmojiPicker } from '@/components/EmojiPicker'
import { ConfirmDialog } from '@/components/ConfirmDialog'

interface CommentUser {
  id: string
  full_name: string
  avatar_url?: string
  profession?: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
  user?: CommentUser
}

interface SectionProps {
  postId: string
  currentUserId?: string
  onCountChange?: (count: number) => void
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'agora'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`
  return new Date(dateStr).toLocaleDateString('pt-AO', { day: 'numeric', month: 'short' })
}

function firstName(name?: string): string {
  return (name ?? '').trim().split(/\s+/)[0] ?? ''
}

// ─────────────────────────────────────────────────────────
// Composer — used for both top-level comments and replies
// ─────────────────────────────────────────────────────────

interface ComposerProps {
  postId: string
  parentId?: string | null
  initialContent?: string
  autoFocus?: boolean
  placeholder?: string
  size?: 'sm' | 'md'
  onSubmitted: (comment: Comment, count: number) => void
  onCancel?: () => void
}

function Composer({
  postId,
  parentId = null,
  initialContent = '',
  autoFocus,
  placeholder,
  size = 'md',
  onSubmitted,
  onCancel,
}: ComposerProps) {
  const [content, setContent] = useState(initialContent)
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      const ta = textareaRef.current
      ta.focus()
      const len = ta.value.length
      ta.setSelectionRange(len, len)
    }
  }, [autoFocus])

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
    setContent(content.slice(0, start) + emoji + content.slice(end))
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
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed, parent_id: parentId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erro ao publicar')
        return
      }
      setContent('')
      onSubmitted(data.comment, data.comments_count)
    } catch {
      setError('Erro de conexão')
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <div>
      <div className="bg-surface-container-high rounded-2xl px-4 py-2 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={placeholder}
          maxLength={500}
          disabled={isPosting}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            } else if (e.key === 'Escape' && onCancel) {
              e.preventDefault()
              onCancel()
            }
          }}
          className="flex-1 bg-transparent text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none resize-none font-body text-sm leading-relaxed py-1.5 max-h-32"
        />
        <EmojiPicker onSelect={insertEmoji} disabled={isPosting} size={size} />
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPosting}
            className="p-2 rounded-full text-on-surface-variant/60 hover:bg-surface-container-highest hover:text-on-surface transition-colors"
            aria-label="Cancelar"
            title="Cancelar"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || isPosting}
          className="p-2 rounded-full text-primary-container hover:bg-primary-container/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Publicar"
        >
          <span
            className={`material-symbols-outlined text-xl ${isPosting ? 'animate-spin' : ''}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isPosting ? 'progress_activity' : 'send'}
          </span>
        </button>
      </div>
      {error && <p className="text-error text-xs mt-2">{error}</p>}
      <p className="text-[10px] text-on-surface-variant/30 font-label tabular-nums mt-1 text-right">
        {content.length}/500
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Single comment (with replies & per-comment reply composer)
// ─────────────────────────────────────────────────────────

interface CommentItemProps {
  comment: Comment
  replies: Comment[]
  postId: string
  currentUserId?: string
  onReply: (comment: Comment, count: number) => void
  onDelete: (commentId: string) => void
  isReply?: boolean
  // For replies: the parent of this thread (so "Reply" stays at top-level parent)
  threadParentId?: string
  // Called when the user clicks "Reply" on a sub-reply — bubbles up to the parent CommentItem
  onRequestReply?: (mention: string) => void
}

function CommentItem({
  comment,
  replies,
  postId,
  currentUserId,
  onReply,
  onDelete,
  isReply,
  onRequestReply,
}: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [mention, setMention] = useState<string>('')

  const isOwner = currentUserId && comment.user_id === currentUserId
  const avatarSize = isReply ? 'w-7 h-7' : 'w-9 h-9'

  function openReplyComposer(prefilled: string) {
    setMention(prefilled)
    setReplyOpen(true)
  }

  function handleReplyClick() {
    const prefilled = isReply && comment.user?.full_name ? `@${firstName(comment.user.full_name)} ` : ''
    if (isReply && onRequestReply) {
      onRequestReply(prefilled)
    } else {
      openReplyComposer(prefilled)
    }
  }

  return (
    <article className="flex items-start gap-3">
      <div className={`${avatarSize} rounded-full overflow-hidden flex-shrink-0 ring-1 ring-primary-container/20`}>
        <Avatar
          name={comment.user?.full_name ?? 'User'}
          avatarUrl={comment.user?.avatar_url}
          textSize={isReply ? 'text-[9px]' : 'text-[10px]'}
        />
      </div>
      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="bg-surface-container-high rounded-2xl rounded-tl-md px-4 py-2.5">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className={`font-headline font-bold ${isReply ? 'text-xs' : 'text-sm'} text-on-surface truncate`}>
              {comment.user?.full_name ?? 'Anonymous'}
            </span>
            {isOwner && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-on-surface-variant/40 hover:text-error transition-colors flex-shrink-0"
                aria-label="Apagar"
                title="Apagar"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            )}
          </div>
          <p className={`${isReply ? 'text-xs' : 'text-sm'} text-on-surface/90 whitespace-pre-wrap break-words leading-relaxed`}>
            {comment.content}
          </p>
        </div>

        {/* Meta row: time + reply */}
        <div className="flex items-center gap-3 mt-1 px-2">
          <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/40">
            {timeAgo(comment.created_at)}
          </span>
          {currentUserId && (
            <button
              onClick={handleReplyClick}
              className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 hover:text-primary-container transition-colors font-bold"
            >
              Responder
            </button>
          )}
        </div>

        {/* Replies — only on top-level comments */}
        {!isReply && replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                replies={[]}
                postId={postId}
                currentUserId={currentUserId}
                onReply={onReply}
                onDelete={onDelete}
                isReply
                onRequestReply={openReplyComposer}
              />
            ))}
          </div>
        )}

        {/* Inline reply composer (top-level comments only) */}
        {!isReply && replyOpen && currentUserId && (
          <div className="mt-3">
            <Composer
              postId={postId}
              parentId={comment.id}
              initialContent={mention}
              autoFocus
              size="sm"
              placeholder="Escreve uma resposta..."
              onSubmitted={(c, count) => {
                onReply(c, count)
                setReplyOpen(false)
                setMention('')
              }}
              onCancel={() => {
                setReplyOpen(false)
                setMention('')
              }}
            />
          </div>
        )}
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────
// Top-level container
// ─────────────────────────────────────────────────────────

export function CommentsSection({ postId, currentUserId, onCountChange }: SectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [isDeletingComment, setIsDeletingComment] = useState(false)
  const [deleteCommentError, setDeleteCommentError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/posts/${postId}/comments`)
        if (!res.ok) {
          if (!cancelled) setComments([])
          return
        }
        const json = await res.json().catch(() => ({ data: [] }))
        if (!cancelled) setComments(Array.isArray(json.data) ? json.data : [])
      } catch {
        if (!cancelled) setComments([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [postId])

  const { topLevel, repliesByParent } = useMemo(() => {
    const top: Comment[] = []
    const map: Record<string, Comment[]> = {}
    for (const c of comments) {
      if (c.parent_id) {
        ;(map[c.parent_id] = map[c.parent_id] ?? []).push(c)
      } else {
        top.push(c)
      }
    }
    return { topLevel: top, repliesByParent: map }
  }, [comments])

  function handleNewComment(comment: Comment, count: number) {
    setComments(prev => [...prev, comment])
    onCountChange?.(count)
  }

  function requestDelete(commentId: string) {
    setDeleteCommentError(null)
    setPendingDeleteId(commentId)
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return
    setIsDeletingComment(true)
    setDeleteCommentError(null)
    try {
      const res = await fetch(`/api/posts/${postId}/comments/${pendingDeleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setDeleteCommentError(data.error ?? 'Erro ao apagar o comentário.')
        return
      }
      const data = await res.json()
      setComments(prev => prev.filter(c => c.id !== pendingDeleteId && c.parent_id !== pendingDeleteId))
      onCountChange?.(data.comments_count)
      setPendingDeleteId(null)
    } catch {
      setDeleteCommentError('Erro de conexão. Tenta novamente.')
    } finally {
      setIsDeletingComment(false)
    }
  }

  return (
    <section className="border-t border-[rgba(86,67,58,0.1)] bg-surface-container-low/40">
      {/* List */}
      <div className="p-5 sm:p-6 space-y-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <span className="material-symbols-outlined text-primary-container text-2xl animate-spin">refresh</span>
          </div>
        ) : topLevel.length === 0 ? (
          <p className="text-center text-on-surface-variant/40 text-xs font-label uppercase tracking-widest py-4">
            Sê o primeiro a comentar
          </p>
        ) : (
          topLevel.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              replies={repliesByParent[comment.id] ?? []}
              postId={postId}
              currentUserId={currentUserId}
              onReply={handleNewComment}
              onDelete={requestDelete}
            />
          ))
        )}
      </div>

      {/* Top-level composer */}
      {currentUserId && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <Composer
            postId={postId}
            placeholder="Escreve um comentário..."
            onSubmitted={handleNewComment}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={pendingDeleteId !== null}
        onClose={() => !isDeletingComment && setPendingDeleteId(null)}
        onConfirm={confirmDelete}
        title="Apagar comentário?"
        message="Esta acção não pode ser desfeita. As respostas a este comentário também serão removidas."
        confirmLabel="Apagar"
        cancelLabel="Cancelar"
        variant="danger"
        icon="delete"
        isLoading={isDeletingComment}
        error={deleteCommentError}
      />
    </section>
  )
}
