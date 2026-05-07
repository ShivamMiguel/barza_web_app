'use client'

import { useEffect, useState } from 'react'
import { PostCardEditorial } from '@/components/PostCardEditorial'
import type { PostWithUser } from '@/lib/supabase/posts'

interface PostsFeedProps {
  currentUserId?: string
  userId?: string
  limit?: number
}

export function PostsFeed({ currentUserId, userId, limit = 20 }: PostsFeedProps) {
  const [posts, setPosts] = useState<PostWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async (newOffset = 0) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      params.set('limit', String(limit))
      params.set('offset', String(newOffset))
      if (userId) params.set('user_id', userId)

      const res = await fetch(`/api/posts?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to load posts')

      const data = await res.json()
      const newPosts: PostWithUser[] = data.data || []

      if (newOffset === 0) {
        setPosts(newPosts)
      } else {
        setPosts((prev) => [...prev, ...newPosts])
      }

      setHasMore(newPosts.length === limit)
      setOffset(newOffset + limit)
      setError(null)
    } catch (err) {
      console.error('Error loading posts:', err)
      setError('Erro ao carregar posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId))
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

  if (error && posts.length === 0) {
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
            onClick={() => loadPosts(offset)}
            disabled={isLoading}
            className="px-6 py-3 rounded-full bg-surface-container text-on-surface font-semibold
                       hover:bg-surface-container-high transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      )}
    </>
  )
}
