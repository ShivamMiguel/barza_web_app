'use client'

import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { BeautySignalCard } from "@/components/BeautySignalCard";
import { ProfessionalSpaceCard } from "@/components/ProfessionalSpaceCard";
import { PostCardEditorial } from "@/components/PostCardEditorial";
import { CreatePostBox } from "@/components/CreatePostBox";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/community/Sidebar";
import type { UserProfile } from "@/lib/supabase/profile";
import type { ServiceWithSpace } from "@/lib/supabase/professional-spaces";
import type { PostWithUser } from "@/lib/supabase/posts";
import type { ExternalSignal } from "@/lib/beauty-signals/external";
import type { TrendingProfessional } from "@/app/api/trending-professionals/route";

type FeedItem =
  | { kind: 'service'; data: ServiceWithSpace }
  | { kind: 'post'; data: PostWithUser }
  | { kind: 'signal'; data: ExternalSignal }

function buildFeed(
  services: ServiceWithSpace[],
  posts: PostWithUser[],
  signals: ExternalSignal[]
): FeedItem[] {
  const buckets: FeedItem[][] = [
    services.map(d => ({ kind: 'service' as const, data: d })),
    posts.map(d => ({ kind: 'post' as const, data: d })),
    signals.map(d => ({ kind: 'signal' as const, data: d })),
  ]
  const result: FeedItem[] = []
  const max = Math.max(...buckets.map(b => b.length))
  for (let i = 0; i < max; i++) {
    for (const bucket of buckets) {
      if (i < bucket.length) result.push(bucket[i])
    }
  }
  return result
}

const POSTS_PER_PAGE = 10

export default function CommunityPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [postOffset, setPostOffset] = useState(POSTS_PER_PAGE)
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [trendingPros, setTrendingPros] = useState<TrendingProfessional[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [profileRes, spacesRes, postsRes, signalsRes, trendingRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/professional-spaces?limit=20'),
          fetch(`/api/posts?limit=${POSTS_PER_PAGE}`),
          fetch('/api/beauty-signals'),
          fetch('/api/trending-professionals?limit=3'),
        ])

        if (profileRes.ok) {
          setUserProfile(await profileRes.json())
        }

        const services: ServiceWithSpace[] = spacesRes.ok ? await spacesRes.json() : []
        const postsData = postsRes.ok ? await postsRes.json() : { data: [] }
        const posts: PostWithUser[] = postsData.data ?? []
        const signals: ExternalSignal[] = signalsRes.ok ? await signalsRes.json() : []

        setFeedItems(buildFeed(services, posts, signals))
        setHasMorePosts(posts.length === POSTS_PER_PAGE)

        if (trendingRes.ok) {
          setTrendingPros(await trendingRes.json())
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  async function loadMorePosts() {
    try {
      setIsLoadingMore(true)
      const res = await fetch(`/api/posts?limit=${POSTS_PER_PAGE}&offset=${postOffset}`)
      if (!res.ok) return

      const data = await res.json()
      const newPosts: PostWithUser[] = data.data ?? []

      setFeedItems(prev => [
        ...prev,
        ...newPosts.map(p => ({ kind: 'post' as const, data: p })),
      ])
      setPostOffset(prev => prev + POSTS_PER_PAGE)
      setHasMorePosts(newPosts.length === POSTS_PER_PAGE)
    } catch (error) {
      console.error("Error loading more posts:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary min-h-screen flex flex-col lg:flex-row">
      {/* Mobile Top App Bar — hidden on desktop */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-[#ff9156]/20 shadow-[0_40px_60px_-15px_rgba(255,255,255,0.04)] flex justify-between items-center px-6 h-16">
        <h1 className="text-2xl font-bold tracking-tighter text-[#ff9156] font-display">Barza</h1>
        <div className="flex items-center gap-4">
          <button className="active:scale-95 duration-200 text-on-surface/60 hover:text-[#ff9156] transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="active:scale-95 duration-200 text-on-surface/60 hover:text-[#ff9156] transition-colors">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </header>

      {/* Sidebar Navigation - Hidden on mobile */}
      <aside className="hidden lg:flex lg:h-screen lg:w-64 lg:fixed lg:left-0 lg:top-0 bg-[#0e0e0e] lg:flex-col z-50">
        {/* Logo */}
        <div className="px-8 pt-8 pb-4 flex-shrink-0">
          <img src="/barza_logo.png" alt="Barza Logo" className="h-10 w-auto mb-3" style={{ mixBlendMode: "screen" }} />
          <p className="text-[0.6875rem] font-label tracking-widest uppercase opacity-50">Community</p>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-y-1 pb-2">
          <a
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
            href="#"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">home</span>
            <span>Home</span>
          </a>
          <a
            className="flex items-center gap-4 px-4 py-3 text-primary-container border-r-2 border-primary-container bg-primary-container/5 font-label text-sm tracking-wide uppercase transition-all rounded-xl"
            href="#"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              dynamic_feed
            </span>
            <span>Feed</span>
          </a>
          <a
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
            href="#"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">event</span>
            <span>Agenda</span>
          </a>
          <a
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
            href="#"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">local_mall</span>
            <span>Shop</span>
          </a>

          {/* My Pages */}
          <p className="px-4 pt-5 pb-1 text-[9px] font-label tracking-[0.2em] uppercase text-on-surface-variant/30">My Pages</p>
          <Link
            href="/profile/andre_santos/pro"
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">store</span>
            <span className="truncate">André Santos Studio</span>
          </Link>
        </nav>

        {/* Bottom actions — always visible */}
        <div className="flex-shrink-0 px-4 pb-4 pt-4 border-t border-white/5 flex flex-col gap-3">
          <Link
            href="/profile/create-page"
            className="w-full border border-primary-container/40 text-primary-container py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container/10 transition-all text-sm"
          >
            <span className="material-symbols-outlined text-sm">add_business</span>
            <span>Create Page</span>
          </Link>
          {/* User Profile Card */}
          <Link
            href="/community/profile"
            className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-[#201f1f] transition-all group border-t border-white/5 pt-3"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#ff9156]/40 flex-shrink-0">
              <Avatar name={userProfile?.full_name || 'User'} avatarUrl={userProfile?.avatar_url} textSize="text-xs" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface group-hover:text-[#ff9156] transition-colors truncate">
                {userProfile?.full_name || 'Loading...'}
              </p>
              <p className="text-[10px] text-on-surface-variant/50 font-label uppercase tracking-widest">{userProfile?.profession || 'User'}</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/30 text-sm group-hover:text-[#ff9156]/60 transition-colors">
              chevron_right
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:ml-64 lg:mr-80 min-h-screen bg-surface-container-lowest p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8 relative">
        {/* Header */}
        <header className="flex justify-between items-end mb-6 sm:mb-8 lg:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[3.5rem] font-headline font-extrabold tracking-tighter leading-none mb-2">
              Discover
            </h2>
            <div className="h-1 w-12 volcanic-gradient rounded-full"></div>
          </div>
          {/* Filter button — desktop only (mobile has it in the top bar) */}
          <button className="hidden lg:flex p-3 bg-surface-container rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-base">tune</span>
          </button>
        </header>

        {/* Stories Bar */}
        <section className="flex gap-6 overflow-x-auto no-scrollbar mb-12 py-2">
          {[
            {
              name: "Trends",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0",
            },
            {
              name: "Barber of the week",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY",
            },
            {
              name: "Nails Today",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8",
            },
            {
              name: "New Drops",
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnkomdXPuuum3ck-BkVaClvauz1bc_Ucin4yMhP6c1AZ31OQHMfe3_xO9dFkto8-A-ugOAxJSZ3FLg1ThG2jBNRkL4_xMPS01xzm01ElcLzcjQPvAyVh0jj3Qdno2vyZfQxc28zPXKuURUrt6xn2QO5FWCiohty5Tq0puhk9AGoZTNel9bkxV4d1tE9pOXveoVuQ6qrDFKluLhhTCNOZ8ajqB2Wzibo8tB-14JrL6q6x5_B9qOPHge8yKoVL3A_6BBG-dc1Jw4j2E",
            },
          ].map((story, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
              <div className="w-20 h-20 rounded-full p-[3px] volcanic-gradient">
                <div className="w-full h-full rounded-full border-4 border-surface-container-lowest overflow-hidden">
                  <img
                    src={story.img}
                    alt={story.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="text-[0.6875rem] font-label uppercase tracking-widest font-bold">{story.name}</span>
            </div>
          ))}
        </section>

        {/* Feed Section */}
        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Inline Composer */}
          <CreatePostBox
            profile={userProfile}
            onPostCreated={(post) =>
              setFeedItems(prev => [{ kind: 'post', data: post }, ...prev])
            }
          />

          {isLoading && feedItems.length === 0 && (
            <div className="flex justify-center items-center py-16">
              <span className="material-symbols-outlined text-primary-container text-5xl animate-spin">refresh</span>
            </div>
          )}

          {!isLoading && feedItems.length === 0 && (
            <div className="bg-surface-container rounded-3xl p-10 text-center text-on-surface-variant/40">
              <span className="material-symbols-outlined text-5xl block mb-3">article</span>
              <p className="text-sm font-label uppercase tracking-widest">Nenhum conteúdo disponível</p>
            </div>
          )}

          {feedItems.map((item, idx) => {
            if (item.kind === 'service') {
              return <ProfessionalSpaceCard key={`service-${item.data.id}`} service={item.data} />
            }
            if (item.kind === 'post') {
              return <PostCardEditorial key={`post-${item.data.id}`} post={item.data} currentUserId={userProfile?.id} />
            }
            return <BeautySignalCard key={`signal-${idx}-${item.data.url}`} signal={item.data} />
          })}

          {hasMorePosts && (
            <div className="flex justify-center pt-2 pb-4">
              <button
                onClick={loadMorePosts}
                disabled={isLoadingMore}
                className="flex items-center gap-2 px-8 py-3 rounded-full border border-[#ff9156]/30 text-[#ff9156] font-label text-sm uppercase tracking-widest hover:bg-[#ff9156]/10 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                    Carregando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">expand_more</span>
                    Ver mais
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Discovery - Hidden on mobile/tablet */}
      <aside className="hidden xl:block xl:w-80 xl:h-screen xl:fixed xl:right-0 xl:top-0 bg-[#0e0e0e] border-l border-white/5 p-6">
        {/* Search & Tabs */}
        <div className="mb-10">
          <div className="relative group mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-container">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary-container/40 text-sm placeholder:text-on-surface-variant/40"
              placeholder="Search Barza..."
              type="text"
            />
          </div>
        </div>

        {/* Trending Professionals */}
        <section className="mb-10">
          <h3 className="text-[10px] font-label uppercase tracking-[0.2em] opacity-40 mb-6">Trending Professionals</h3>
          <div className="space-y-6">
            {trendingPros.length === 0 && !isLoading && (
              <p className="text-[10px] text-on-surface-variant/40 font-label uppercase tracking-widest">
                Nenhuma avaliação ainda
              </p>
            )}
            {trendingPros.map((pro) => (
              <div
                key={pro.space_id}
                className="flex items-center gap-4 group"
              >
                {pro.logo ? (
                  <img
                    src={pro.logo}
                    alt={pro.space_name}
                    className="w-12 h-12 rounded-2xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl volcanic-gradient flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {pro.space_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">{pro.space_name}</p>
                  <p className="text-[10px] text-on-surface-variant opacity-60 truncate">
                    {pro.top_category ?? 'Profissional'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary-container">
                    {pro.avg_stars.toFixed(1)}★
                  </span>
                  <span className="text-[9px] text-on-surface-variant/40">
                    {pro.rating_count} aval.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Market Insights */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-label uppercase tracking-[0.2em] opacity-40">Market Insights</h3>
            <span className="material-symbols-outlined text-xs opacity-40">info</span>
          </div>
          <div className="bg-surface-container rounded-2xl p-6 border-t border-white/5">
            <div className="flex justify-between items-end gap-2 h-32 mb-4">
              {[40, 65, 30, 85, 55].map((height, idx) => (
                <div key={idx} className="flex-1 volcanic-gradient rounded-t-lg" style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between text-[8px] font-label uppercase tracking-widest opacity-40">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs font-bold leading-tight">Agendamentos subiram 12% nesta semana em Luanda Sul</p>
              <p className="text-[10px] text-on-surface-variant mt-2">Maior demanda: Barbearia Clássica</p>
            </div>
          </div>
        </section>
      </aside>

      {/* Mobile Bottom Nav */}
      <footer className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 bg-[#0e0e0e]/90 backdrop-blur-2xl border-t border-[#ff9156]/10 shadow-[0_-10px_40px_rgba(255,145,86,0.05)]">
        <div className="flex flex-col items-center justify-center text-[#ff9156] bg-[#ff9156]/10 rounded-xl px-4 py-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dynamic_feed</span>
          <span className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold">Feed</span>
        </div>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface/40 hover:text-on-surface/70 active:scale-90 duration-200 transition-colors">
          <span className="material-symbols-outlined">event</span>
          <span className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold">Agenda</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface/40 hover:text-on-surface/70 active:scale-90 duration-200 transition-colors">
          <span className="material-symbols-outlined">local_mall</span>
          <span className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold">Shop</span>
        </a>
        <Link href="/community/profile" className="flex flex-col items-center justify-center text-on-surface/40 hover:text-on-surface/70 active:scale-90 duration-200 transition-colors">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold">Perfil</span>
        </Link>
      </footer>
    </div>
  );
}
