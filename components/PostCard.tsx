'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { EditPostModal } from '@/components/EditPostModal'

interface Post {
  id: string
  user_id: string
  content: string
  image_url?: string
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  // Optional: user profile data if joined
  user?: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  }
}

interface PostCardProps {
  post: Post
  currentUserId?: string
  onDelete?: (postId: string) => void
  onEdit?: (post: Post) => void
  onLike?: (postId: string) => void
}

export function PostCard({
  post,
  currentUserId,
  onDelete,
  onEdit,
  onLike,
}: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState(post)

  const isOwner = currentUserId === post.user_id
  const createdTime = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR,
  })

  const handleDelete = async () => {
    if (!confirm('Tem certeza que quer deletar este post?')) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setIsDeleted(true)
        onDelete?.(post.id)
      } else {
        alert('Erro ao deletar o post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Erro ao deletar o post')
    } finally {
      setIsDeleting(false)
    }
  }

  const handlePostUpdated = (updatedPost: Post) => {
    setCurrentPost(updatedPost)
    setIsEditOpen(false)
    onEdit?.(updatedPost)
  }

  if (isDeleted) {
    return null
  }

  return (
    <>
      <article
        className="w-full rounded-xl bg-gradient-to-br from-surface-container to-surface-container/80 
                   border border-outline/20 overflow-hidden transition-all duration-300 
                   hover:border-outline/40 hover:shadow-lg backdrop-blur-sm"
      >
        {/* Post Header */}
        <div className="px-6 py-4 flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {post.user?.user_metadata?.avatar_url && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={post.user.user_metadata.avatar_url}
                  alt={post.user?.user_metadata?.full_name || 'User'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-on-surface truncate">
                {post.user?.user_metadata?.full_name || 'Anonymous'}
              </p>
              <p className="text-sm text-on-surface/60">{createdTime}</p>
            </div>
          </div>

          {/* Action Menu - Only visible to owner */}
          {isOwner && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditOpen(true)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors 
                         text-on-surface/60 hover:text-primary"
                title="Editar post"
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 hover:bg-error/10 rounded-lg transition-colors 
                         text-on-surface/60 hover:text-error disabled:opacity-50"
                title="Deletar post"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="px-6">
          <p className="text-base text-on-surface leading-relaxed whitespace-pre-wrap break-words">
            {currentPost.content}
          </p>
        </div>

        {/* Post Image */}
        {currentPost.image_url && (
          <div className="mt-4 px-6">
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-on-surface/10">
              <Image
                src={currentPost.image_url}
                alt="Post image"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        {/* Post Stats */}
        <div className="px-6 py-4 border-t border-outline/10 flex items-center justify-between">
          <button
            onClick={() => onLike?.(post.id)}
            className="flex items-center gap-2 text-on-surface/60 hover:text-primary 
                     transition-colors hover:bg-primary/10 px-3 py-2 rounded-lg"
          >
            <span className="material-symbols-outlined">favorite</span>
            <span className="text-sm font-medium">{currentPost.likes_count}</span>
          </button>

          <button
            className="flex items-center gap-2 text-on-surface/60 hover:text-primary 
                     transition-colors hover:bg-primary/10 px-3 py-2 rounded-lg"
          >
            <span className="material-symbols-outlined">chat</span>
            <span className="text-sm font-medium">{currentPost.comments_count}</span>
          </button>
        </div>
      </article>

      {/* Edit Modal */}
      <EditPostModal
        isOpen={isEditOpen}
        post={currentPost}
        onClose={() => setIsEditOpen(false)}
        onPostUpdated={handlePostUpdated}
      />
    </>
  )
}
