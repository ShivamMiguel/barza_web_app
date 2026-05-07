'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Avatar } from '@/components/Avatar';
import type { UserProfile } from '@/lib/supabase/profile';

interface SidebarProps {
  profile?: UserProfile
}

export function Sidebar({ profile }: SidebarProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(profile || null)

  useEffect(() => {
    if (!profile) {
      // Fetch profile on client side if not provided
      async function fetchProfile() {
        try {
          const res = await fetch('/api/profile')
          if (res.ok) {
            const data = await res.json()
            setUserProfile(data)
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error)
        }
      }
      fetchProfile()
    }
  }, [profile])

  if (!userProfile) {
    return null
  }

  return (
    <>
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0e0e0e] flex flex-col pt-12 pb-8 px-4 gap-y-6 z-50 transition-all duration-200 ease-in-out bg-gradient-to-r from-[#201f1f] to-[#0e0e0e]">
      <div className="px-4 mb-8">
        <h1 className="text-xl font-extrabold text-[#ff9156] font-display tracking-tighter">Barza</h1>
        <p className="text-[0.6875rem] font-label tracking-widest uppercase opacity-50">Community</p>
      </div>
      <nav className="flex flex-col gap-y-1">
        <a className="flex items-center gap-4 px-4 py-3 text-[#e5e2e1]/60 font-label text-sm tracking-wide uppercase hover:text-[#e5e2e1] hover:bg-[#201f1f] transition-all rounded-xl group" href="#">
          <span className="material-symbols-outlined transition-transform group-active:scale-95">home</span>
          <span>Home</span>
        </a>
        <a className="flex items-center gap-4 px-4 py-3 text-[#ff9156] border-r-2 border-[#ff9156] bg-[#ff9156]/5 font-label text-sm tracking-wide uppercase transition-all rounded-xl" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dynamic_feed</span>
          <span>Feed</span>
        </a>
        <a className="flex items-center gap-4 px-4 py-3 text-[#e5e2e1]/60 font-label text-sm tracking-wide uppercase hover:text-[#e5e2e1] hover:bg-[#201f1f] transition-all rounded-xl group" href="#">
          <span className="material-symbols-outlined transition-transform group-active:scale-95">event</span>
          <span>Agenda</span>
        </a>
        <a className="flex items-center gap-4 px-4 py-3 text-[#e5e2e1]/60 font-label text-sm tracking-wide uppercase hover:text-[#e5e2e1] hover:bg-[#201f1f] transition-all rounded-xl group" href="#">
          <span className="material-symbols-outlined transition-transform group-active:scale-95">local_mall</span>
          <span>Shop</span>
        </a>
      </nav>
      <div className="mt-auto px-4 flex flex-col gap-4">
        {/* User Profile Card */}
        <Link
          href="/community/profile"
          className="flex items-center gap-3 px-2 py-3 rounded-2xl hover:bg-[#201f1f] transition-all group border-t border-white/5 pt-4"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#ff9156]/40 flex-shrink-0">
            <Avatar name={userProfile.full_name} avatarUrl={userProfile.avatar_url} textSize="text-xs" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#e5e2e1] group-hover:text-[#ff9156] transition-colors truncate">{userProfile.full_name}</p>
            <p className="text-[10px] text-[#e5e2e1]/40 font-label uppercase tracking-widest">{userProfile.profession || 'User'}</p>
          </div>
          <span className="material-symbols-outlined text-[#e5e2e1]/20 text-sm group-hover:text-[#ff9156]/60 transition-colors">chevron_right</span>
        </Link>
      </div>
      </aside>
    </>
  );
}
