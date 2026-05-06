import Link from 'next/link';
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

  const firstName = profile.full_name.split(' ')[0];

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0e0e0e] flex flex-col pt-8 pb-8 px-4 gap-y-6 z-50 transition-all duration-200 ease-in-out">
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

        {/* Sidebar Bottom */}
        <div className="mt-auto px-4 flex flex-col gap-4">
          <button className="w-full volcanic-gradient text-on-primary py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(255,145,86,0.3)] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">add</span>
            <span>Create Post</span>
          </button>
          {/* Active User Profile Card */}
          <div className="flex items-center gap-3 px-2 py-3 rounded-2xl bg-[#ff9156]/5 border-t border-white/5 pt-4">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#ff9156] flex-shrink-0">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#ff9156] truncate">{profile.full_name}</p>
              <p className="text-[10px] text-on-surface-variant/50 font-label uppercase tracking-widest">{profile.role_profile || 'User'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-64 min-h-screen bg-surface-container-lowest p-8 flex-1 obsidian-scroll">
        {/* Profile Header Section */}
        <section className="max-w-6xl mx-auto mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-surface-container-low p-8 md:p-12 shadow-2xl">
            {/* Abstract Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start">
              {/* Avatar Area */}
              <div className="relative flex-shrink-0">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-1 volcanic-gradient">
                  <div className="w-full h-full rounded-full overflow-hidden border-[6px] border-[#1c1b1b]">
                    <img
                      alt={profile.full_name}
                      src={profile.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-primary-container p-2 rounded-full shadow-xl">
                  <span className="material-symbols-outlined text-on-primary-container text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              {/* Info Area */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
                  <h1 className="text-5xl md:text-6xl font-black text-on-surface font-display tracking-[-0.04em]">{profile.full_name}</h1>
                  {profile.role_profile && (
                    <span className="bg-surface-variant px-4 py-1 rounded-full text-[10px] uppercase tracking-widest text-primary-container font-bold mb-2">
                      {profile.role_profile}
                    </span>
                  )}
                </div>
                {profile.profile_location?.bio && (
                  <p className="text-on-surface-variant text-lg max-w-xl mb-8 leading-relaxed font-light">
                    {profile.profile_location.bio}
                  </p>
                )}
                {/* Stats Bento - Placeholder */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-surface-container p-4 rounded-2xl border-t border-[#ff9156]/10">
                    <span className="block text-2xl font-black text-on-surface font-display">0</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 font-bold">Posts</span>
                  </div>
                  <div className="bg-surface-container p-4 rounded-2xl border-t border-[#ff9156]/10">
                    <span className="block text-2xl font-black text-on-surface font-display">0</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 font-bold">Followers</span>
                  </div>
                  <div className="bg-surface-container p-4 rounded-2xl border-t border-[#ff9156]/10">
                    <span className="block text-2xl font-black text-on-surface font-display">0</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 font-bold">Following</span>
                  </div>
                  <div className="bg-surface-container p-4 rounded-2xl border-t border-[#ff9156]/10">
                    <span className="block text-2xl font-black text-on-surface font-display">0</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 font-bold">Bookings</span>
                  </div>
                </div>
              </div>
              {/* Quick Actions */}
              <div className="flex flex-col gap-3 w-full md:w-auto flex-shrink-0">
                <button className="volcanic-gradient px-8 py-3 rounded-xl font-bold text-on-primary text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-transform">Edit Profile</button>
                <button className="liquid-glass px-8 py-3 rounded-xl font-bold text-primary-container text-sm uppercase tracking-widest active:scale-95 transition-all">Insights</button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <section className="max-w-6xl mx-auto mb-8 border-b border-[#2a2a2a]">
          <div className="flex gap-12">
            <button className="pb-4 text-primary-container font-bold text-sm uppercase tracking-[0.2em] border-b-2 border-[#ff9156]">Posts</button>
            <button className="pb-4 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors text-sm uppercase tracking-[0.2em]">Produtos Comprados</button>
            <button className="pb-4 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors text-sm uppercase tracking-[0.2em]">Agendamentos</button>
            <button className="pb-4 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors text-sm uppercase tracking-[0.2em]">Favoritos</button>
          </div>
        </section>

        {/* Dynamic Content Area */}
        <section className="max-w-6xl mx-auto">
          {/* Empty Posts State */}
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4 block">post_add</span>
            <p className="text-on-surface-variant text-lg">Nenhum post publicado ainda</p>
          </div>
        </section>
      </main>
    </div>
  );
}
