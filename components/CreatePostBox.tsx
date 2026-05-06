'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CreatePostModal } from './CreatePostModal'
import type { UserProfile } from '@/lib/supabase/profile'

interface CreatePostBoxProps {
  profile?: UserProfile
}

export function CreatePostBox({ profile }: CreatePostBoxProps) {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)

  const userImage = profile?.avatar_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop"
  const userName = profile?.full_name || "User"

  return (
    <>
      <article className="bg-surface-container rounded-3xl p-6 mb-12 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary-container/40">
            <img
              src={userImage}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Input Box */}
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="flex-1 h-12 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors px-6 flex items-center text-on-surface-variant hover:text-on-surface transition-colors text-start font-body"
          >
            O que está a pensar, {userName.split(' ')[0]}?
          </button>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsCreatePostOpen(true)}
              className="p-2.5 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary-container"
              title="Criar post com imagem"
            >
              <span className="material-symbols-outlined text-xl">image</span>
            </button>
            <button 
              onClick={() => setIsCreatePostOpen(true)}
              className="p-2.5 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary-container"
              title="Criar post com emoções"
            >
              <span className="material-symbols-outlined text-xl">mood</span>
            </button>
          </div>
        </div>
      </article>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </>
  )
}
