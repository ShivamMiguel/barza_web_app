'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PostCardEditorial } from '@/components/PostCardEditorial'
import { useCommunity } from '@/lib/community-context'
import { usePosts } from '@/hooks/api'

export default function HashtagPage() {
  const params = useParams<{ tag: string }>()
  const tag = decodeURIComponent(params?.tag ?? '').toLowerCase()
  const { userProfile } = useCommunity()

  const { data, isLoading } = usePosts({ hashtag: tag, limit: 50 })
  const posts = data?.data ?? []

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8">
      <header className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10">
        <div>
          <Link
            href="/community"
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 hover:text-primary-container transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Voltar ao feed
          </Link>
          <h2 className="text-2xl sm:text-3xl lg:text-[3.5rem] font-headline font-extrabold tracking-tighter leading-none mb-2">
            <span className="text-primary-container">#</span>{tag}
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {isLoading ? 'A carregar…' : `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`}
          </p>
        </div>
      </header>

      <div className="space-y-8 max-w-3xl mx-auto">
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <span className="material-symbols-outlined text-primary-container text-5xl animate-spin">refresh</span>
          </div>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="bg-surface-container rounded-3xl p-10 text-center text-on-surface-variant/40">
            <span className="material-symbols-outlined text-5xl block mb-3">tag</span>
            <p className="text-sm font-label uppercase tracking-widest mb-1">Sem posts com #{tag}</p>
            <p className="text-xs opacity-60">Sê o primeiro a usar esta hashtag.</p>
          </div>
        )}

        {posts.map(post => (
          <PostCardEditorial
            key={post.id}
            post={post}
            currentUserId={userProfile?.id}
          />
        ))}
      </div>
    </div>
  )
}
