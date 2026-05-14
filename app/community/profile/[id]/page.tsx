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

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [profile, loggedUser] = await Promise.all([
    getUserProfileById(id),
    getLoggedUserProfile(),
  ])

  if (!profile) notFound()

  const isOwnProfile = loggedUser?.id === profile.id

  // Redirect own profile to the dedicated page
  if (isOwnProfile) {
    const { redirect } = await import('next/navigation')
    redirect('/community/profile')
  }

  const [{ posts }, followSummary] = await Promise.all([
    getPosts(50, 0, profile.id),
    getFollowSummary(profile.id, loggedUser?.id ?? null),
  ])

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('pt-AO', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* ── Back link ───────────────────────────────────────────────── */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-on-surface-variant/60 hover:text-on-surface transition-colors text-xs font-label uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Comunidade
        </Link>

        {/* ── Profile Header Card ─────────────────────────────────────── */}
        <div className="liquid-obsidian-glass refractive-highlight glow-bloom rounded-3xl border border-[rgba(86,67,58,0.1)] overflow-hidden">
          {/* Cover gradient */}
          <div
            className="h-24 sm:h-32 relative"
            style={{ background: 'linear-gradient(135deg, rgba(255,145,86,0.12) 0%, rgba(255,71,87,0.04) 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111]/80" />
          </div>

          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            {/* Avatar + action row */}
            <div className="-mt-14 sm:-mt-16 mb-4 flex items-end justify-between gap-4">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[3px] volcanic-gradient">
                  <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[#111]">
                    <Avatar
                      name={profile.full_name}
                      avatarUrl={profile.avatar_url}
                      textSize="text-3xl"
                    />
                  </div>
                </div>
              </div>
              <div className="pb-1">
                <FollowButton
                  userId={profile.id}
                  initialIsFollowing={followSummary.is_following ?? undefined}
                />
              </div>
            </div>

            {/* Name / profession / bio */}
            <div className="mb-5">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-on-surface leading-tight">
                {profile.full_name}
              </h1>
              {profile.profession && (
                <p className="text-primary-container font-label text-xs uppercase tracking-widest font-bold mt-1 mb-2">
                  {profile.profession}
                </p>
              )}
              {profile.bio && (
                <p className="text-on-surface-variant text-sm leading-relaxed max-w-lg mt-2">
                  {profile.bio}
                </p>
              )}
              {(profile.profile_location?.city || memberSince) && (
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {profile.profile_location?.city && (
                    <span className="flex items-center gap-1 text-[11px] text-on-surface-variant/50">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {profile.profile_location.city}
                    </span>
                  )}
                  {memberSince && (
                    <span className="flex items-center gap-1 text-[11px] text-on-surface-variant/50">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      desde {memberSince}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {profile.interests.slice(0, 8).map((interest) => (
                  <span
                    key={interest}
                    className="text-[9px] font-label uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant/70"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-8 sm:gap-12 border-t border-[rgba(86,67,58,0.12)] pt-5">
              {[
                { label: 'Posts', value: posts.length },
                { label: 'Seguidores', value: followSummary.followers },
                { label: 'Seguindo', value: followSummary.following },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl sm:text-2xl font-black font-display text-on-surface">{s.value}</p>
                  <p className="text-[9px] font-label uppercase tracking-widest text-on-surface-variant/60 mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Posts / Tabs ────────────────────────────────────────────── */}
        <ProfileTabs posts={posts} currentUserId={loggedUser?.id} />

      </div>
    </div>
  )
}
