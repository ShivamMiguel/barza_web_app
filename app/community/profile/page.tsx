import Link from 'next/link';
import { Avatar } from '@/components/Avatar';
import { PostCardEditorial } from '@/components/PostCardEditorial';
import { ProfileEditButton } from '@/components/ProfileEditButton';
import { getPosts } from '@/lib/supabase/posts';
import { getLoggedUserProfile } from '@/lib/supabase/profile';

export const metadata = {
  title: 'Perfil | BARZA',
};

export default async function ProfilePage() {
  const profile = await getLoggedUserProfile();

  if (!profile) {
    return (
      <div className="bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Perfil não encontrado</h2>
          <p className="text-on-surface-variant mb-4">Não conseguimos carregar seu perfil</p>
          <Link href="/community" className="text-primary-container hover:underline">
            Voltar para comunidade
          </Link>
        </div>
      </div>
    );
  }

  const { posts } = await getPosts(100, 0, profile.id);

  const stats = [
    { value: posts?.length ?? 0, label: 'Posts' },
    { value: '0', label: 'Seguidores' },
    { value: '0', label: 'Seguindo' },
    { value: '0', label: 'Reservas' },
  ];

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary min-h-screen">

      {/* ── DESKTOP SIDEBAR ───────────────────────────────────────────── */}
      <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 bg-[#0e0e0e] flex-col pt-8 pb-8 px-4 gap-y-6 z-50">
        <div className="px-4 mb-8">
          <img src="/barza_logo.png" alt="Barza Logo" className="h-16 w-auto mb-4" style={{ mixBlendMode: 'screen' }} />
          <p className="text-[0.6875rem] font-label tracking-widest uppercase opacity-50">Community</p>
        </div>
        <nav className="flex flex-col gap-y-1">
          <Link className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group" href="/community">
            <span className="material-symbols-outlined transition-transform group-active:scale-95">home</span>
            <span>Home</span>
          </Link>
          <a className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group" href="#">
            <span className="material-symbols-outlined transition-transform group-active:scale-95">dynamic_feed</span>
            <span>Feed</span>
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
        <div className="mt-auto px-4">
          <div className="flex items-center gap-3 px-2 py-3 rounded-2xl bg-[#ff9156]/5 border-t border-white/5 pt-4">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#ff9156] flex-shrink-0">
              <Avatar name={profile.full_name} avatarUrl={profile.avatar_url} textSize="text-xs" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#ff9156] truncate">{profile.full_name}</p>
              <p className="text-[10px] text-on-surface-variant/50 font-label uppercase tracking-widest">{profile.profession || 'User'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MOBILE TOP APP BAR ────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-[#ff9156]/20 shadow-[0_40px_60px_-15px_rgba(255,255,255,0.04)] flex justify-between items-center px-6 h-16">
        <h1 className="text-2xl font-bold tracking-tighter text-[#ff9156] font-display">Barza</h1>
        <div className="flex items-center gap-4">
          <button className="active:scale-95 duration-200 text-on-surface/60 hover:text-[#ff9156] transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
          <button className="active:scale-95 duration-200 text-on-surface/60 hover:text-[#ff9156] transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </header>

      {/* ── MOBILE LAYOUT ─────────────────────────────────────────────── */}
      <div className="lg:hidden pt-16 pb-24">

        {/* Profile Header */}
        <section className="px-6 pt-8 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-3xl" style={{ boxShadow: '0 0 60px -15px rgba(255,145,86,0.3)' }}></div>
            <div className="relative w-32 h-32 rounded-full p-1 volcanic-gradient overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Avatar name={profile.full_name} avatarUrl={profile.avatar_url} textSize="text-4xl" />
              </div>
            </div>
            {profile.profession && (
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap border border-surface-container-lowest">
                {profile.profession}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-display font-extrabold tracking-tight text-on-surface mt-2 mb-2">{profile.full_name}</h1>

          {profile.bio ? (
            <p className="text-on-surface-variant text-sm max-w-[280px] leading-relaxed mb-8">{profile.bio}</p>
          ) : (
            <div className="mb-8" />
          )}

          {/* Stats Grid */}
          <div className="w-full grid grid-cols-4 gap-2 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center py-3 bg-surface-container rounded-xl border border-[rgba(86,67,58,0.1)]">
                <span className="text-primary-container font-display font-bold text-lg">{s.value}</span>
                <span className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 font-bold">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-3 mb-10">
            <ProfileEditButton profile={profile} className="w-full py-3.5" />
            <button className="bg-surface-variant/60 backdrop-blur-md border-t border-white/10 text-on-surface font-bold py-3.5 rounded-xl active:scale-95 transition-transform text-sm">
              Insights
            </button>
          </div>
        </section>

        {/* Sticky Tabs */}
        <nav className="sticky top-16 z-40 bg-surface-container-lowest/80 backdrop-blur-md">
          <div className="flex overflow-x-auto no-scrollbar px-6 gap-8 border-b border-[rgba(86,67,58,0.1)]">
            <button className="py-4 border-b-2 border-primary-container text-primary-container font-bold text-sm whitespace-nowrap">Posts</button>
            <button className="py-4 border-b-2 border-transparent text-on-surface-variant/40 font-semibold text-sm whitespace-nowrap">Produtos Comprados</button>
            <button className="py-4 border-b-2 border-transparent text-on-surface-variant/40 font-semibold text-sm whitespace-nowrap">Agendamentos</button>
            <button className="py-4 border-b-2 border-transparent text-on-surface-variant/40 font-semibold text-sm whitespace-nowrap">Favoritos</button>
          </div>
        </nav>

        {/* Posts */}
        <section className="p-4 pt-6">
          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCardEditorial key={post.id} post={post} currentUserId={profile.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4 block">post_add</span>
              <p className="text-on-surface-variant text-lg">Nenhum post publicado ainda</p>
            </div>
          )}
        </section>
      </div>

      {/* ── DESKTOP LAYOUT ────────────────────────────────────────────── */}
      <main className="hidden lg:block lg:ml-64 min-h-screen bg-surface-container-lowest p-8 obsidian-scroll">

        {/* Profile Header Card */}
        <section className="max-w-6xl mx-auto mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-surface-container-low p-8 md:p-12 shadow-2xl">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start">
              <div className="relative flex-shrink-0">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-1 volcanic-gradient">
                  <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-[#1c1b1b]">
                    <Avatar name={profile.full_name} avatarUrl={profile.avatar_url} textSize="text-5xl" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-primary-container p-2 rounded-full shadow-xl">
                  <span className="material-symbols-outlined text-on-primary-container text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
                  <h1 className="text-5xl md:text-6xl font-black text-on-surface font-display tracking-[-0.04em]">{profile.full_name}</h1>
                  {profile.profession && (
                    <span className="bg-surface-variant px-4 py-1 rounded-full text-[10px] uppercase tracking-widest text-primary-container font-bold mb-2">
                      {profile.profession}
                    </span>
                  )}
                </div>
                {profile.bio && (
                  <p className="text-on-surface-variant text-lg max-w-xl mb-8 leading-relaxed font-light">{profile.bio}</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className="bg-surface-container p-4 rounded-2xl border-t border-[#ff9156]/10">
                      <span className="block text-2xl font-black text-on-surface font-display">{s.value}</span>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 font-bold">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto flex-shrink-0">
                <ProfileEditButton profile={profile} />
                <button className="liquid-glass px-8 py-3 rounded-xl font-bold text-primary-container text-sm uppercase tracking-widest active:scale-95 transition-all">Insights</button>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Tabs */}
        <section className="max-w-6xl mx-auto mb-8 border-b border-[#2a2a2a]">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            <button className="pb-4 text-primary-container font-bold text-sm uppercase tracking-[0.2em] border-b-2 border-[#ff9156] whitespace-nowrap flex-shrink-0">Posts</button>
            <button className="pb-4 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors text-sm uppercase tracking-[0.2em] whitespace-nowrap flex-shrink-0">Produtos Comprados</button>
            <button className="pb-4 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors text-sm uppercase tracking-[0.2em] whitespace-nowrap flex-shrink-0">Agendamentos</button>
            <button className="pb-4 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors text-sm uppercase tracking-[0.2em] whitespace-nowrap flex-shrink-0">Favoritos</button>
          </div>
        </section>

        {/* Desktop Posts */}
        <section className="max-w-6xl mx-auto">
          {posts && posts.length > 0 ? (
            <div className="space-y-12">
              {posts.map(post => (
                <PostCardEditorial key={post.id} post={post} currentUserId={profile.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4 block">post_add</span>
              <p className="text-on-surface-variant text-lg">Nenhum post publicado ainda</p>
            </div>
          )}
        </section>
      </main>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────────── */}
      <footer className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 bg-[#0e0e0e]/90 backdrop-blur-2xl border-t border-[#ff9156]/10 shadow-[0_-10px_40px_rgba(255,145,86,0.05)]">
        <Link href="/community" className="flex flex-col items-center justify-center text-on-surface/40 hover:text-on-surface/70 active:scale-90 duration-200 transition-colors">
          <span className="material-symbols-outlined">dynamic_feed</span>
          <span className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold">Feed</span>
        </Link>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface/40 hover:text-on-surface/70 active:scale-90 duration-200 transition-colors">
          <span className="material-symbols-outlined">event</span>
          <span className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold">Agenda</span>
        </a>
        <a href="#" className="flex flex-col items-center justify-center text-on-surface/40 hover:text-on-surface/70 active:scale-90 duration-200 transition-colors">
          <span className="material-symbols-outlined">local_mall</span>
          <span className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold">Shop</span>
        </a>
        <div className="flex flex-col items-center justify-center text-[#ff9156] bg-[#ff9156]/10 rounded-xl px-4 py-1">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="font-label text-[10px] uppercase tracking-[0.1em] font-semibold">Perfil</span>
        </div>
      </footer>

    </div>
  );
}
