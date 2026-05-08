'use client'

import { BeautySignalCard } from "@/components/BeautySignalCard"
import { ProfessionalSpaceCard } from "@/components/ProfessionalSpaceCard"
import { PostCardEditorial } from "@/components/PostCardEditorial"
import { CreatePostBox } from "@/components/CreatePostBox"
import { useEffect, useState } from "react"
import { useCommunity } from "@/lib/community-context"
import type { ServiceWithSpace } from "@/lib/supabase/professional-spaces"
import type { PostWithUser } from "@/lib/supabase/posts"
import type { ExternalSignal } from "@/lib/beauty-signals/external"

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
  const { userProfile } = useCommunity()
  const [isLoading, setIsLoading] = useState(true)
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [postOffset, setPostOffset] = useState(POSTS_PER_PAGE)
  const [hasMorePosts, setHasMorePosts] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const [spacesRes, postsRes, signalsRes] = await Promise.all([
          fetch('/api/professional-spaces?limit=20'),
          fetch(`/api/posts?limit=${POSTS_PER_PAGE}`),
          fetch('/api/beauty-signals'),
        ])

        const services: ServiceWithSpace[] = spacesRes.ok ? await spacesRes.json() : []
        const postsData = postsRes.ok ? await postsRes.json() : { data: [] }
        const posts: PostWithUser[] = postsData.data ?? []
        const signals: ExternalSignal[] = signalsRes.ok ? await signalsRes.json() : []

        setFeedItems(buildFeed(services, posts, signals))
        setHasMorePosts(posts.length === POSTS_PER_PAGE)
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
    <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8">
      {/* Header */}
      <header className="flex justify-between items-end mb-6 sm:mb-8 lg:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-[3.5rem] font-headline font-extrabold tracking-tighter leading-none mb-2">
            Discover
          </h2>
          <div className="h-1 w-12 volcanic-gradient rounded-full"></div>
        </div>
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
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnkomdXPuuum3ck-BkVaClvauz1bc_Ucin4yMhP6c1AZ31OQHMfe3_9dFkto8-A-ugOAxJSZ3FLg1ThG2jBNRkL4_xMPS01xzm01ElcLzcjQPvAyVh0jj3Qdno2vyZfQxc28zPXKuURUrt6xn2QO5FWCiohty5Tq0puhk9AGoZTNel9bkxV4d1tE9pOXveoVuQ6qrDFKluLhhTCNOZ8ajqB2Wzibo8tB-14JrL6q6x5_B9qOPHge8yKoVL3A_6BBG-dc1Jw4j2E",
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
    </div>
  )
}
