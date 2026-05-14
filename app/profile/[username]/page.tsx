import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Avatar } from '@/components/Avatar'
import { FollowButton } from '@/components/FollowButton'
import { ProfileTabs } from '@/components/ProfileTabs'
import { getUserProfileById } from '@/lib/supabase/profile'
import { getLoggedUserProfile } from '@/lib/supabase/profile'
import { getPosts } from '@/lib/supabase/posts'
import { getFollowSummary } from '@/lib/supabase/follows'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const [profile, loggedUser] = await Promise.all([
    getUserProfileById(username),
    getLoggedUserProfile(),
  ])

  if (!profile) notFound()

  const [{ posts }, followSummary] = await Promise.all([
    getPosts(50, 0, profile.id),
    getFollowSummary(profile.id, loggedUser?.id ?? null),
  ])

  const isOwnProfile = loggedUser?.id === profile.id

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('pt-AO', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary min-h-screen flex">
      {/* Left Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0e0e0e] flex flex-col z-50">
        <div className="px-8 pt-8 pb-4 flex-shrink-0">
          <img src="/barza_logo.png" alt="Barza Logo" className="h-10 w-auto mb-3" style={{ mixBlendMode: 'screen' }} />
          <p className="text-[0.6875rem] font-label tracking-widest uppercase opacity-50">Profile</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-y-1 pb-2">
          <Link
            href="/community"
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">home</span>
            <span>Home</span>
          </Link>
          <a
            className="flex items-center gap-4 px-4 py-3 text-primary-container border-r-2 border-primary-container bg-primary-container/5 font-label text-sm tracking-wide uppercase transition-all rounded-xl"
            href="#"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              person
            </span>
            <span>Profile</span>
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
        </nav>

        <div className="flex-shrink-0 px-4 pb-6 pt-4 border-t border-white/5 flex flex-col gap-3">
          <button className="w-full volcanic-gradient text-on-primary py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(255,145,86,0.3)] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">add</span>
            <span>Criar Post</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 mr-80 min-h-screen bg-surface-container-lowest relative">
        {/* Hero Section */}
        <div className="relative h-[300px] w-full overflow-hidden bg-surface-container">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />

          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 w-full px-8 pb-8 flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-container to-primary-container/50 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative w-32 h-32 rounded-full border-4 border-surface-container-lowest overflow-hidden">
                  <Avatar name={profile.full_name} avatarUrl={profile.avatar_url} textSize="text-4xl" />
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start pb-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tighter text-on-surface">
                    {profile.full_name}
                  </h1>
                  <span
                    className="material-symbols-outlined text-primary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                {profile.profession && (
                  <p className="text-on-surface-variant font-headline tracking-wide mt-1">
                    {profile.profession}
                  </p>
                )}
                {profile.bio && (
                  <p className="text-on-surface-variant max-w-md mt-3 text-sm leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {!isOwnProfile && (
              <div className="flex items-center gap-4 pb-4">
                <FollowButton
                  userId={profile.id}
                  initialIsFollowing={followSummary.is_following ?? undefined}
                />
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-8 py-6 bg-surface-container/30 backdrop-blur-md border-b border-outline/10">
          <div className="flex flex-wrap gap-12 justify-start">
            <div className="text-left">
              <p className="text-2xl font-headline font-black text-on-surface tracking-tighter">{posts.length}</p>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Posts</p>
            </div>
            <div className="text-left">
              <p className="text-2xl font-headline font-black text-on-surface tracking-tighter">{followSummary.followers}</p>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Seguidores</p>
            </div>
            <div className="text-left">
              <p className="text-2xl font-headline font-black text-on-surface tracking-tighter">{followSummary.following}</p>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Seguindo</p>
            </div>
          </div>
        </div>

        <ProfileTabs posts={posts} currentUserId={loggedUser?.id} />
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 h-screen fixed right-0 top-0 bg-[#0e0e0e] border-l border-white/5 p-6 flex flex-col">
        {/* Search */}
        <div className="mb-10">
          <div className="relative group mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary-container">
              search
            </span>
            <input
              className="w-full bg-surface-container-lowest border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-1 focus:ring-primary-container/40 text-sm placeholder:text-on-surface-variant/40 outline-none"
              placeholder="Pesquisar Barza..."
              type="text"
            />
          </div>
        </div>

        {/* Profile Info */}
        <section className="mb-10">
          <h3 className="text-[10px] font-label uppercase tracking-[0.2em] opacity-40 mb-6">Sobre</h3>
          <div className="space-y-4">
            {profile.profession && (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant/40 text-base">work</span>
                <span className="text-sm text-on-surface-variant">{profile.profession}</span>
              </div>
            )}
            {profile.profile_location?.city && (
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant/40 text-base">location_on</span>
                <span className="text-sm text-on-surface-variant">{profile.profile_location.city}</span>
              </div>
            )}
            {profile.interests && profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.interests.slice(0, 6).map((interest) => (
                  <span
                    key={interest}
                    className="text-[10px] font-label uppercase tracking-widest font-bold px-2 py-1 rounded-full bg-surface-container text-on-surface-variant"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-auto">
          <div className="text-center py-8 border-t border-white/5">
            <p className="text-[10px] font-label uppercase tracking-widest opacity-40 mb-2">Membro desde</p>
            <p className="text-xs font-bold">{memberSince ?? '—'}</p>
          </div>
        </section>
      </aside>
    </div>
  )
}
