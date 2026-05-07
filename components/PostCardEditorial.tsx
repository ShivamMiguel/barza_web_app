'use client'

import Image from 'next/image'
import type { PostWithUser } from '@/lib/supabase/posts'

interface PostCardEditorialProps {
  post: PostWithUser
  currentUserId?: string
  onDelete?: (postId: string) => void
  onLike?: (postId: string) => void
}

export function PostCardEditorial({
  post,
  currentUserId,
  onDelete,
  onLike,
}: PostCardEditorialProps) {
  const timeAgo = getTimeAgo(new Date(post.created_at))
  const isOwner = currentUserId === post.user_id

  const lines = post.content.split('\n').filter(Boolean)
  const title = lines[0] ?? ''
  const body = lines.slice(1).join('\n')

  const titleParts = title.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={i} className="text-primary-container">
          {part.slice(2, -2)}
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })

  const handleDelete = async () => {
    if (!confirm('Tem certeza que quer deletar este post?')) return
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
      if (res.ok) onDelete?.(post.id)
      else alert('Erro ao deletar o post')
    } catch {
      alert('Erro ao deletar o post')
    }
  }

  return (
    <article className="w-full liquid-obsidian-glass refractive-highlight glow-bloom rounded-xl overflow-hidden border border-[rgba(86,67,58,0.1)]">
      {/* User Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[rgba(255,145,86,0.2)] flex-shrink-0">
            <Image
              src={post.user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop'}
              alt={post.user?.full_name || 'User'}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-on-surface tracking-tight">
                {post.user?.full_name || 'Anonymous'}
              </span>
              {post.user?.role_profile && (
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-label text-[0.625rem] font-bold uppercase tracking-widest">
                  {post.user.role_profile}
                </span>
              )}
            </div>
            <span className="font-label text-[0.6875rem] text-on-surface-variant/60 tracking-wider uppercase">
              {timeAgo}
            </span>
          </div>
        </div>
        <button
          onClick={isOwner ? handleDelete : undefined}
          className="text-on-surface-variant hover:text-primary-container transition-colors duration-300"
          title={isOwner ? 'Deletar post' : undefined}
        >
          <span className="material-symbols-outlined">
            {isOwner ? 'delete' : 'more_horiz'}
          </span>
        </button>
      </header>

      {/* Post Content */}
      <div className="px-6 pb-8 space-y-4">
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface leading-tight tracking-[-0.03em]">
          {titleParts}
        </h1>
        {body && (
          <p className="font-body text-base text-on-surface-variant leading-relaxed opacity-90">
            {body}
          </p>
        )}
      </div>

      {/* Interaction Footer */}
      <footer className="px-6 py-5 bg-surface-container-high/40 border-t border-[rgba(86,67,58,0.1)] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onLike?.(post.id)}
            className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all duration-300 group"
          >
            <span
              className="material-symbols-outlined group-hover:scale-110 transition-transform"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <span className="font-label text-xs font-semibold tracking-tighter">
              {post.likes_count > 0 ? post.likes_count : '0'}
            </span>
          </button>
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all duration-300 group">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
              chat_bubble
            </span>
            <span className="font-label text-xs font-semibold tracking-tighter">
              {post.comments_count > 0 ? post.comments_count : '0'}
            </span>
          </button>
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all duration-300 group">
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
    </article>
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
