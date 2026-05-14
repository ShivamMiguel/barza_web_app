import Link from 'next/link'
import { Avatar } from '@/components/Avatar'
import { PostCardEditorial } from '@/components/PostCardEditorial'
import { ProfileEditButton } from '@/components/ProfileEditButton'
import { getPosts } from '@/lib/supabase/posts'
import { getLoggedUserProfile } from '@/lib/supabase/profile'
import { getFollowSummary } from '@/lib/supabase/follows'

export const metadata = {
  title: 'Perfil | BARZA',
}

export default async function ProfilePage() {
  const profile = await getLoggedUserProfile()

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-8 pt-20 lg:pt-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Perfil não encontrado</h2>
          <p className="text-on-surface-variant mb-4">Não conseguimos carregar o teu perfil</p>
          <Link href="/community" className="text-primary-container hover:underline">
            Voltar para a comunidade
          </Link>
        </div>
      </div>
    )
  }

  const [{ posts }, followSummary] = await Promise.all([
    getPosts(100, 0, profile.id),
    getFollowSummary(profile.id, profile.id),
  ])

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 pb-24 lg:pb-8">
      <div className="max-w-3xl mx-auto space-y-8">

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
                <ProfileEditButton profile={profile} />
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
            </div>

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

        {/* ── Posts ───────────────────────────────────────────────────── */}
        <div>
          <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/40 mb-5">
            Posts
          </p>

          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <PostCardEditorial
                  key={post.id}
                  post={post}
                  currentUserId={profile.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-container rounded-3xl border border-[rgba(86,67,58,0.1)]">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-4 block">
                post_add
              </span>
              <p className="text-on-surface-variant mb-5">Nenhum post publicado ainda</p>
              <Link
                href="/community?action=post"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full volcanic-gradient text-on-primary text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Criar Post
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
