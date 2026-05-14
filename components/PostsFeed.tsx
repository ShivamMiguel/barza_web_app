'use client'

import { useState } from 'react'
import { PostCardEditorial } from '@/components/PostCardEditorial'
import { usePosts } from '@/hooks/api'
import type { PostWithUser } from '@/lib/supabase/posts'

interface PostsFeedProps {
  currentUserId?: string
  userId?: string
  limit?: number
}

export function PostsFeed({ currentUserId, userId, limit = 20 }: PostsFeedProps) {
  const { data: firstPageData, isLoading, isError } = usePosts({ limit, offset: 0, userId })
  const firstPage = firstPageData?.data ?? []

  const [extraPosts, setExtraPosts] = useState<PostWithUser[]>([])
  const [hasMore, setHasMore] = useState(() => firstPage.length === limit)
  const [offset, setOffset] = useState(limit)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const posts = [...firstPage, ...extraPosts]

  const loadMore = async () => {
    try {
      setIsLoadingMore(true)
      const params = new URLSearchParams()
      params.set('limit', String(limit))
      params.set('offset', String(offset))
      if (userId) params.set('user_id', userId)

      const res = await fetch(`/api/posts?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load posts')

      const data = await res.json()
      const newPosts: PostWithUser[] = data.data || []

      setExtraPosts(prev => [...prev, ...newPosts])
      setHasMore(newPosts.length === limit)
      setOffset(prev => prev + limit)
      setError(null)
    } catch (err) {
      console.error('Error loading posts:', err)
      setError('Erro ao carregar posts')
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handlePostDeleted = (postId: string) => {
    setExtraPosts(prev => prev.filter(p => p.id !== postId))
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin">
          <span className="material-symbols-outlined text-primary text-6xl">refresh</span>
        </div>
      </div>
    )
  }

  if ((isError || error) && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-error text-base font-medium">{error}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-on-surface/40 text-8xl">article</span>
        <p className="text-on-surface/60 text-lg mt-4">
          Nenhum post ainda. Seja o primeiro a compartilhar!
        </p>
      </div>
    )
  }

  return (
    <>
      {posts.map((post) => (
        <PostCardEditorial
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onDelete={handlePostDeleted}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 rounded-full bg-surface-container text-on-surface font-semibold
                       hover:bg-surface-container-high transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      )}
    </>
  )
}
