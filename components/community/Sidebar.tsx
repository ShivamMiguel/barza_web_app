export function Sidebar() {
  return (
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
        <a className="flex items-center gap-4 px-4 py-3 text-[#e5e2e1]/60 font-label text-sm tracking-wide uppercase hover:text-[#e5e2e1] hover:bg-[#201f1f] transition-all rounded-xl group" href="#">
          <span className="material-symbols-outlined transition-transform group-active:scale-95">account_circle</span>
          <span>Profile</span>
        </a>
      </nav>
      <div className="mt-auto px-4">
        <button className="w-full volcanic-gradient text-on-primary py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(255,145,86,0.3)] active:scale-95 transition-transform">
          <span className="material-symbols-outlined">add</span>
          <span>Create Post</span>
        </button>
      </div>
    </aside>
  );
}
