'use client'

import Image from 'next/image'
import Link from 'next/link'
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
  const createdDate = new Date(post.created_at)
  const timeAgo = getTimeAgo(createdDate)
  const isOwner = currentUserId === post.user_id

  const handleDelete = async () => {
    if (!confirm('Tem certeza que quer deletar este post?')) return

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onDelete?.(post.id)
      } else {
        alert('Erro ao deletar o post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Erro ao deletar o post')
    }
  }

  return (
    <article className="relative group">
      <div className="liquid-glass glow-shadow p-8 md:p-12 rounded-3xl overflow-hidden flex flex-col gap-10">
        {/* User Meta Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-primary/20">
                <Image
                  src={post.user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=56&h=56&fit=crop'}
                  alt={post.user?.full_name || 'User'}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              {post.user?.role_profile && (
                <div className="absolute -right-1 -bottom-1 bg-primary-container p-1 rounded-full border-2 border-surface-container-lowest flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[10px] text-on-primary font-bold"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface leading-tight">
                {post.user?.full_name || 'Anonymous'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {post.user?.role_profile && (
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-[10px] font-label font-bold tracking-[0.1em] uppercase text-on-secondary-container">
                    {post.user.role_profile}
                  </span>
                )}
                <span className="text-[10px] text-stone-500 font-label tracking-widest uppercase">
                  • {timeAgo}
                </span>
              </div>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="text-stone-500 hover:text-on-surface transition-colors p-2 hover:bg-surface-container/50 rounded-lg"
                title="Deletar post"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Editorial Content */}
        <div className="max-w-3xl">
          {/* Extract first line as title if long, or use full content */}
          <p className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold text-on-surface editorial-text leading-tight">
            {post.content.split('\n')[0]}
          </p>

          {/* Show rest of content as description if multi-line */}
          {post.content.includes('\n') && (
            <p className="mt-6 text-stone-400 font-body text-lg md:text-xl leading-relaxed">
              {post.content.split('\n').slice(1).join('\n')}
            </p>
          )}
        </div>

        {/* Post Interactions */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onLike?.(post.id)}
              className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors group"
            >
              <span className="material-symbols-outlined group-active:scale-125 transition-transform">
                favorite
              </span>
              <span className="text-sm font-label font-semibold tracking-wider">
                {post.likes_count > 0 ? post.likes_count : ''}
              </span>
            </button>
            <button className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors group">
              <span className="material-symbols-outlined">chat_bubble_outline</span>
              <span className="text-sm font-label font-semibold tracking-wider">
                {post.comments_count > 0 ? post.comments_count : ''}
              </span>
            </button>
            <button className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors group">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
          <button className="flex items-center gap-2 text-stone-400 hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">bookmark_border</span>
          </button>
        </div>
      </div>
    </article>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'agora'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`

  return date.toLocaleDateString('pt-AO', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
  })
}
