'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { CreatePostModal } from '../CreatePostModal';

export function Sidebar() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)

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
        <button 
          onClick={() => setIsCreatePostOpen(true)}
          className="w-full volcanic-gradient text-on-primary py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(255,145,86,0.3)] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Create Post</span>
        </button>
        {/* User Profile Card */}
        <Link
          href="/community/profile"
          className="flex items-center gap-3 px-2 py-3 rounded-2xl hover:bg-[#201f1f] transition-all group border-t border-white/5 pt-4"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#ff9156]/40 flex-shrink-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY"
              alt="Beatriz Luanda"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#e5e2e1] group-hover:text-[#ff9156] transition-colors truncate">Beatriz Luanda</p>
            <p className="text-[10px] text-[#e5e2e1]/40 font-label uppercase tracking-widest">Ambassador</p>
          </div>
          <span className="material-symbols-outlined text-[#e5e2e1]/20 text-sm group-hover:text-[#ff9156]/60 transition-colors">chevron_right</span>
        </Link>
      </div>
      </aside>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </>
  );
}
