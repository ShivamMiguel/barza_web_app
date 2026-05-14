'use client'

import { useState } from 'react'
import { PostCardEditorial } from '@/components/PostCardEditorial'
import type { PostWithUser } from '@/lib/supabase/posts'

interface ProfileTabsProps {
  posts: PostWithUser[]
  currentUserId?: string
}

const TABS = ['Posts', 'Vault', 'Favoritos', 'Colaborações'] as const

export function ProfileTabs({ posts, currentUserId }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Posts')

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-[rgba(86,67,58,0.12)] flex gap-8 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 border-b-2 font-label font-bold text-xs tracking-widest uppercase transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-primary-container text-primary-container'
                : 'border-transparent text-on-surface-variant/40 hover:text-on-surface-variant'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pt-6">
        {activeTab === 'Posts' && (
          <section>
            {posts.length > 0 ? (
              <div className="space-y-8">
                {posts.map((post) => (
                  <PostCardEditorial
                    key={post.id}
                    post={post}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4 block">
                  post_add
                </span>
                <p className="text-on-surface-variant">Nenhum post publicado ainda</p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'Vault' && (
          <section className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">inventory_2</span>
            <p className="text-on-surface-variant mt-4">Vault em breve</p>
          </section>
        )}

        {activeTab === 'Favoritos' && (
          <section className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">favorite</span>
            <p className="text-on-surface-variant mt-4">Sem favoritos ainda</p>
          </section>
        )}

        {activeTab === 'Colaborações' && (
          <section className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">people</span>
            <p className="text-on-surface-variant mt-4">Sem colaborações ainda</p>
          </section>
        )}
      </div>
    </>
  )
}
