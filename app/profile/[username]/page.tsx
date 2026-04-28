'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const userProfile = {
    name: 'Amara Vance',
    handle: '@amara_curates',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw',
    bio: 'Global Beauty Curator & Creative Director. Carving modern aesthetics from ancient roots. Exploring the intersection of obsidian-grade skin and volcanic energy.',
    stats: { posts: '1.2k', followers: '84.5k', following: '420' },
    verified: true,
    visuals: [
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg5h9HiQn-YI9vLqNmwzLgst5PEISMcZGwVyJxapuwAYJGdOkotAS4TpFoDpFI4DPVIstnnK9z4GKDc_5fcdH2Pd7WJpPyZ3rBR7DOLqjkq6nz4B7UtgDI0rmoV1qLLkb3b2_es9Y5dAnrGNsa90MmAipXI-AlCv93MySSLrX7prylzXGfKD-zaEVcPM34O1neYBxqmZa5bSmHINLiv2DkAhYtC7pfPBdiF4vp8ZqjR5JTaFniI6teXBpGCvJnC_8zYeQLTXjbGYE',
        tag: 'Skin Ritual',
      },
      {
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzE-lQp-OnAM1IjXorEsFZSU1uyoPsdcBVDcBTb8kuj2cQ2XArL8VSN8wDR9CK08vA2-jVH72iCK3GBv7UP6jFsR2TaVZqjWkr9jHsNZ3UVyRYmLXth62rsRRB2F72PaaTenOdN-zzTKSjNAuPV0nfbIz1JGzz_G9fA8u7jYzBgi2x2CaUdhI3gYdnW575q4ZKU3zmyBaHZF8UZRHTebZlIZRnScJv5rq5cyOSNOm7BOav0lVT9jmoF9ubcqs21Kj1KebFoyCDF6k',
        tag: 'Editorial',
      },
    ],
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0e0e0e] flex flex-col pt-8 pb-8 px-4 gap-y-6 z-50 transition-all duration-200 ease-in-out">
        <div className="px-4 mb-8">
          <img src="/barza_logo.png" alt="Barza Logo" className="h-16 w-auto mb-4" style={{ mixBlendMode: 'screen' }} />
          <p className="text-[0.6875rem] font-label tracking-widest uppercase opacity-50">Profile</p>
        </div>
        <nav className="flex flex-col gap-y-1">
          <Link href="/community" className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group">
            <span className="material-symbols-outlined transition-transform group-active:scale-95">home</span>
            <span>Home</span>
          </Link>
          <a className="flex items-center gap-4 px-4 py-3 text-primary-container border-r-2 border-primary-container bg-primary-container/5 font-label text-sm tracking-wide uppercase transition-all rounded-xl" href="#">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
            <span>Profile</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group" href="#">
            <span className="material-symbols-outlined transition-transform group-active:scale-95">event</span>
            <span>Agenda</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group" href="#">
            <span className="material-symbols-outlined transition-transform group-active:scale-95">local_mall</span>
            <span>Shop</span>
          </a>
        </nav>

        {/* Sidebar FAB */}
        <div className="mt-auto px-4 flex flex-col gap-4">
          <button className="w-full volcanic-gradient text-on-primary py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(255,145,86,0.3)] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">add</span>
            <span>Create Post</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mr-80 min-h-screen bg-surface-container-lowest relative">
        {/* Hero Section */}
        <div className="relative h-[300px] w-full overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFObsrLYs1saGjQKew21M4CLVEgGAMVPnMmrL4Nhs1UywUnzfL99axeEGVW_Vg-xVQ46MR9FJyUilnk_HWwQDokVA6nPzr_BGHLE1mdu06u5OBSg2nrpuvOuijdSnc4bwzYdD78uMMcVQRRKo71Iron3OSK_W7nduVxaOwMS62umRNfTWWcwQE-OJCpq-hlq12leryOg1evoizvLSoXtP8prqg_1K-5OLEi5tNLclFGOCUgEOfMzunMtWdpW88zGaEeGVyJ5J6FI0"
            alt="Profile hero"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 w-full px-8 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-container to-primary-container/50 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative w-32 h-32 rounded-full border-4 border-surface-container-lowest overflow-hidden">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start pb-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tighter text-on-surface">
                    {userProfile.name}
                  </h1>
                  {userProfile.verified && (
                    <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  )}
                </div>
                <p className="text-on-surface-variant font-headline tracking-wide mt-1">{userProfile.handle}</p>
                <p className="text-on-surface-variant max-w-md mt-3 text-sm leading-relaxed">{userProfile.bio}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-4">
              <button className="glass-panel px-8 py-3 rounded-full text-on-surface font-headline font-bold text-sm transition-all hover:bg-surface-variant/80 active:scale-95">
                Message
              </button>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className="volcanic-gradient px-10 py-3 rounded-full text-on-primary font-headline font-bold text-sm transition-all hover:brightness-110 active:scale-95"
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-8 py-6 bg-surface-container/30 backdrop-blur-md border-b border-outline/10">
          <div className="flex flex-wrap gap-12 justify-start">
            <div className="text-left">
              <p className="text-2xl font-headline font-black text-on-surface tracking-tighter">{userProfile.stats.posts}</p>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Posts</p>
            </div>
            <div className="text-left">
              <p className="text-2xl font-headline font-black text-on-surface tracking-tighter">{userProfile.stats.followers}</p>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Followers</p>
            </div>
            <div className="text-left">
              <p className="text-2xl font-headline font-black text-on-surface tracking-tighter">{userProfile.stats.following}</p>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Following</p>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="px-8 border-b border-outline-variant/10 flex gap-12 overflow-x-auto scrollbar-hide">
          {['posts', 'vault', 'favorites', 'collaborations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-6 border-b-2 font-headline font-bold text-sm tracking-wide transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-primary-container text-primary-container'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-8 py-12 max-w-full">
          {activeTab === 'posts' && (
            <section>
              <h2 className="text-2xl font-headline font-bold tracking-tight mb-8">Recent Visuals</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userProfile.visuals.map((visual, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden group relative">
                    <img
                      src={visual.url}
                      alt={visual.tag}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <span className="text-[10px] font-label uppercase tracking-widest text-primary-container">{visual.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'vault' && (
            <section className="glass-panel rounded-3xl p-12">
              <h2 className="text-3xl font-headline font-black tracking-tighter text-on-surface uppercase mb-8">The Vault</h2>
              <p className="text-on-surface-variant max-w-2xl mb-12">Curated selections personally tested and recommended. Exclusive access to premium beauty staples.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'Obsidian Essence Oil', price: '$124', brand: 'Midnight Skincare' },
                  { name: 'Volcanic Clay Mask', price: '$89', brand: 'Detox Series' },
                  { name: 'Deep Flow Sculptor', price: '$210', brand: 'Tools & Gear' },
                ].map((product, idx) => (
                  <div key={idx} className="bg-surface-container-lowest/50 rounded-2xl p-6 group hover:-translate-y-1 transition-all border border-transparent hover:border-primary-container/20">
                    <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-surface-container-high"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-headline font-bold text-lg">{product.name}</h4>
                      <p className="text-primary-container font-headline font-bold">{product.price}</p>
                    </div>
                    <p className="text-on-surface-variant text-xs font-label tracking-widest uppercase mb-4">{product.brand}</p>
                    <button className="w-full py-3 border border-outline-variant/30 rounded-lg text-[10px] font-label uppercase tracking-[0.2em] hover:bg-primary-container hover:text-on-primary hover:border-primary-container transition-all">
                      Purchase Item
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'favorites' && (
            <section>
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-30">favorite</span>
                <p className="text-on-surface-variant mt-4">No favorites yet</p>
              </div>
            </section>
          )}

          {activeTab === 'collaborations' && (
            <section>
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-30">people</span>
                <p className="text-on-surface-variant mt-4">No collaborations yet</p>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Right Sidebar - Discovery */}
      <aside className="w-80 h-screen fixed right-0 top-0 bg-[#0e0e0e] border-l border-white/5 p-6 obsidian-scroll overflow-y-auto">
        {/* Search & Tabs */}
        <div className="mb-10">
          <div className="relative group mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-container">search</span>
            <input className="w-full bg-surface-container-lowest border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary-container/40 text-sm placeholder:text-on-surface-variant/40" placeholder="Search Barza..." type="text"/>
          </div>
          <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl">
            <button className="flex-1 py-2 text-[10px] font-label uppercase font-bold tracking-widest bg-surface-variant rounded-lg">Profissionais</button>
            <button className="flex-1 py-2 text-[10px] font-label uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity">Conteúdo</button>
            <button className="flex-1 py-2 text-[10px] font-label uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity">Produtos</button>
          </div>
        </div>

        {/* Similar Profiles */}
        <section className="mb-10">
          <h3 className="text-[10px] font-label uppercase tracking-[0.2em] opacity-40 mb-6">More Profiles</h3>
          <div className="space-y-6">
            {[
              { name: 'Marco Estilo', role: 'Men\'s Grooming', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9HfCoTnb8KFEjf3Kf9AY1utalCitwvKuP4GSIAG0rMtzQ6ob1d_chlMDuPM23jwLfaO4iT3hP-UV5pVaHlTdWjd17vwk_AW71T6siQOYvYY3cB93zkrSTARC58qvmPM-l2HqKXP4qrQ-s8vAmsRhjpKLv8K7TQMxrFp7eR7s7ggD0ngIXSIspHB4S2qPq0F2wptO3LRoU-bQMXnI36M_3BgZ4R7aRUUHMnu7gtGHs8cRqRELfJLEQx7SSgU_cDMPD3k-36l5EJ3A', handle: 'marco_estilo' },
            ].map((pro, idx) => (
              <Link key={idx} href={`/profile/${pro.handle}`} className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity">
                <img src={pro.img} alt={pro.name} className="w-12 h-12 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="text-xs font-bold group-hover:text-primary-container transition-colors">{pro.name}</p>
                  <p className="text-[10px] text-on-surface-variant opacity-60">{pro.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Info */}
        <section>
          <div className="text-center py-8 border-t border-white/5">
            <p className="text-[10px] font-label uppercase tracking-widest opacity-40 mb-2">Profile Member Since</p>
            <p className="text-xs font-bold">April 2024</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
