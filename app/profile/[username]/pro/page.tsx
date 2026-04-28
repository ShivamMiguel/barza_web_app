"use client";

import { useEffect } from "react";
import Link from "next/link";

const myProPages = [{ name: "André Santos Studio", handle: "andre_santos" }];

export default function ProPage() {
  useEffect(() => {
    document.title = "André Santos | Master Barber & Studio | BARZA";
  }, []);

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary min-h-screen flex">
      {/* ── Left Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#0e0e0e] flex flex-col z-50">
        {/* Logo */}
        <div className="px-8 pt-8 pb-4 flex-shrink-0">
          <img src="/barza_logo.png" alt="Barza Logo" className="h-10 w-auto mb-3" style={{ mixBlendMode: "screen" }} />
          <p className="text-[0.6875rem] font-label tracking-widest uppercase opacity-50">Profile</p>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-4 flex flex-col gap-y-1 pb-2">
          <Link
            href="/community"
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">home</span>
            <span>Home</span>
          </Link>
          <Link
            href="/profile/andre_santos"
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">person</span>
            <span>Profile</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">event</span>
            <span>Agenda</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 px-4 py-3 text-on-surface/60 font-label text-sm tracking-wide uppercase hover:text-on-surface hover:bg-[#201f1f] transition-all rounded-xl group"
          >
            <span className="material-symbols-outlined transition-transform group-active:scale-95">local_mall</span>
            <span>Shop</span>
          </a>
        </nav>

        {/* Bottom FAB */}
        <div className="flex-shrink-0 px-4 pb-6 pt-4 border-t border-white/5 flex flex-col gap-3">
          <button className="w-full volcanic-gradient text-on-primary py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(255,145,86,0.3)] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">add</span>
            <span>Create Post</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="ml-64 mr-80 flex-1 min-h-screen p-6 lg:p-8 space-y-12">
        {/* Hero Section */}
        <section className="relative h-[500px] rounded-[2rem] overflow-hidden group">
          <img
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="cinematic shot of a master barber André Santos in a luxury studio with dramatic lighting"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6DvjcU_QYs11W_waqsEsVo0cjuaNWNr1jc6kAv4CaKywLpjDHA9ChsBYjVgmleX2legzocOzm7W-TZX4MaGKkMJc82kb5EH4jsJZIAMC80NuMbgIuzSnCcNJZOoaAVUilT_XJmCOXuwJLvI9q3bbvwMy9Rnr9KcQdGAlJ-WmqbctpYW9wTdecKO3o-6EP1OChzDJOjhE5W7evUwkh0QbxeAbKv6oo0J2uMxx_wAgxASUpCM_G327LSYvsV9c8i6olMcqLI5_zxqc"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3 px-4 py-1.5 glass-panel w-fit rounded-full border border-primary-container/20">
                <span
                  className="material-symbols-outlined text-primary-container text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface">Verified Business</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] font-['Plus_Jakarta_Sans'] leading-none text-white drop-shadow-2xl">
                André Santos
              </h1>
              <p className="text-lg text-primary font-medium tracking-tight">Master Barber &amp; Studio Founder</p>
              <div className="flex gap-10 pt-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold font-['Plus_Jakarta_Sans']">14.2k</span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Followers</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold font-['Plus_Jakarta_Sans']">4.9</span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium flex items-center gap-1">
                    Rating{" "}
                    <span
                      className="material-symbols-outlined text-[10px] text-primary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold font-['Plus_Jakarta_Sans']">1.8k</span>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">Bookings</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-10 py-4 volcanic-gradient rounded-full text-on-primary font-bold tracking-tight text-lg active:scale-95 transition-transform">
                Book Now
              </button>
              <button className="px-10 py-4 glass-panel rounded-full text-white font-bold tracking-tight text-lg active:scale-95 transition-transform hover:bg-[#2a2a2a]">
                Message
              </button>
            </div>
          </div>
        </section>

        {/* Management Bar */}
        <section className="flex flex-col md:flex-row items-center justify-between p-1 bg-surface-container-high rounded-2xl border border-outline-variant/10">
          <div className="px-6 py-4 flex items-center gap-4">
            <span className="material-symbols-outlined text-primary-container">admin_panel_settings</span>
            <span className="text-sm font-semibold tracking-tight text-on-surface">Studio Owner Dashboard</span>
          </div>
          <div className="flex gap-2 p-2">
            <button className="px-6 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface hover:bg-surface-variant transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">insights</span> Business Insights
            </button>
            <button className="px-6 py-2 rounded-xl bg-primary-container/10 border border-primary-container/20 text-sm font-bold text-primary-container hover:bg-primary-container/20 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">publish</span> Publish as Page
            </button>
          </div>
        </section>

        {/* Services Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">Signature Services</h2>
            <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">View All Services</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Premium Fade */}
            <div className="group relative p-8 glass-panel rounded-3xl overflow-hidden transition-all duration-300 hover:bg-surface-container-high cursor-pointer">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-primary-container">content_cut</span>
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">Premium Fade</h3>
                <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed">
                  Artisan precision fade including a tailored consultation and post-cut finish.
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-sm">payments</span>
                    <span className="font-bold">$45.00</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant/60">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-medium uppercase tracking-widest">45 MIN</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Executive Grooming */}
            <div className="group relative p-8 glass-panel rounded-3xl overflow-hidden transition-all duration-300 hover:bg-surface-container-high cursor-pointer">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-primary-container">face</span>
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans']">Executive Grooming</h3>
                <p className="text-on-surface-variant text-sm max-w-xs leading-relaxed">
                  Full beard sculpt, hot towel treatment, and luxury grooming essence.
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-sm">payments</span>
                    <span className="font-bold">$60.00</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant/60">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span className="text-xs font-medium uppercase tracking-widest">60 MIN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">Featured Products</h2>
            <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">Shop Collection</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Obsidian Beard Oil */}
            <div className="flex flex-col gap-4 group">
              <div className="aspect-square rounded-[2rem] bg-surface-container overflow-hidden border border-outline-variant/10 relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Obsidian Beard Oil"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN4lrzRhbJrR9YZDiZ0zd_Q0ra7_bgXjQrUaLgU-XnX0wyGiipGDY-Pzl7jaNWUXAaxAj9IqK6w4nKHn_8ltwYYRi3uJkmZ7h4tEGd-AOulMwnPdpx_eIy9whghWAVv7P4-X6q5HOE66I3g2cJvxtv5fMdnmHpt3nvopUkizhJ2h4osVD12dVES9QZRCwST3zinZP2-He7ZzORDO9VXzKyaoEFEUzcPvz_Oo9cn8-g7xK62vT50usb6cjx8vVl6X3a-YI_TomObKM"
                />
                <button className="absolute bottom-4 right-4 h-12 w-12 rounded-full volcanic-gradient flex items-center justify-center text-on-primary shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>
              <div className="px-2">
                <h4 className="font-bold text-lg font-['Plus_Jakarta_Sans']">Obsidian Beard Oil</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-primary font-bold">$32.00</span>
                  <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-bold">In Stock</span>
                </div>
              </div>
            </div>
            {/* Matte Clay Pro */}
            <div className="flex flex-col gap-4 group">
              <div className="aspect-square rounded-[2rem] bg-surface-container overflow-hidden border border-outline-variant/10 relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Matte Clay Pro"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3CGHE4DQxGJBN5p709brxpjDkSUMS5N6LTF2-XR-4Ly1aBNqA9PaG7qgGnodt9bvz1qSAdh16eh7b2_hBjVpvEdRWwFEiBlhAbDz7DqLsvRb55CtpFl-pnANfjpbQY-H5nlmLMOPIzUSl3ZcJ2dOCbMPBjmYNrJpH_ShdNZRgfq9YC7IVSHCwjt6ZfME9dEiGvqjBohebNfgvNboTTcOjBvatQD2Hu3uGD87beZnco9tnx_h6EJ6uTfLTEGC4LpLJwhm_UwZhUFY"
                />
                <button className="absolute bottom-4 right-4 h-12 w-12 rounded-full volcanic-gradient flex items-center justify-center text-on-primary shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>
              <div className="px-2">
                <h4 className="font-bold text-lg font-['Plus_Jakarta_Sans']">Matte Clay Pro</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-primary font-bold">$28.00</span>
                  <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-bold">In Stock</span>
                </div>
              </div>
            </div>
            {/* Elite Styling Kit */}
            <div className="flex flex-col gap-4 group">
              <div className="aspect-square rounded-[2rem] bg-surface-container overflow-hidden border border-outline-variant/10 relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Elite Styling Kit"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBALyG3WKmSolDBbkwDF0B3YchWAwmy-o1L_WjgfPHk3NZMBQ3I9Um077wy1stBf7MO-yfjqZJUzL5x7FczwNR0oGP5ZgKmJt7r9YppAeVBIbv5Tq1wethHc-VGhP6lgLchvy0pGqw5_14RMjcAIhn1T1Al-wDhcEXAnWWXUy7dNQWbGI_FYgWr6JNqncSnbu5Aln5tcPW9n9d7Q0Uuwdq-_syHHpICAFn1AhI6Gwoyv6VbxR4gBzBKdBU2vNBIpqg5dVjct69DulI"
                />
                <button className="absolute bottom-4 right-4 h-12 w-12 rounded-full volcanic-gradient flex items-center justify-center text-on-primary shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>
              <div className="px-2">
                <h4 className="font-bold text-lg font-['Plus_Jakarta_Sans']">Elite Styling Kit</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-primary font-bold">$120.00</span>
                  <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest font-bold">Limited</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feed / Community Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">Studio Feed</h2>
            <div className="flex gap-4">
              <button className="p-2 rounded-full bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined">grid_on</span>
              </button>
              <button className="p-2 rounded-full text-on-surface-variant/40">
                <span className="material-symbols-outlined">movie</span>
              </button>
            </div>
          </div>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {/* Feed card 1 — image post */}
            <div className="break-inside-avoid rounded-3xl overflow-hidden glass-panel border border-outline-variant/5">
              <img
                className="w-full"
                alt="Shadow Fade transformation"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5wiobQVOyXCe-ra_pyAO8aDYAOrNqS1zcUuim1JRmoyweeEC2HKmW5mh8Nz6RgPnw92ZxM7WgQKp4KUG1pDYMhLkh35V9L4uvM8MPMeUyn-eVXpnWfVuQ644lQJ0Apy3rxNdjHWUgWns29i_Om87k2tNVMU60BV-W8VDWhpdZwiSWZf6IsIC1RLEncBZDB0goBADgQPbtf_uEfuXMli55jH_6u9voLrSvdpSneVHxDeBW72Xmv_fsjoPvzWFaXp-XNHjXow81BM0"
              />
              <div className="p-5 space-y-3">
                <p className="text-sm text-on-surface-variant">
                  The &apos;Shadow Fade&apos; transformation for the weekend. Sharp lines only. ✂️
                </p>
                <div className="flex items-center gap-4 text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>{" "}
                    1.2k
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">chat_bubble</span> 42
                  </span>
                </div>
              </div>
            </div>

            {/* Feed card 2 — pro tip */}
            <div className="break-inside-avoid rounded-3xl overflow-hidden bg-surface-container p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container">tips_and_updates</span>
                </div>
                <h4 className="font-bold text-on-surface uppercase tracking-widest text-[10px]">Professional Tip</h4>
              </div>
              <p className="text-lg font-medium leading-relaxed font-['Plus_Jakarta_Sans']">
                &quot;A great cut is 50% technical skill and 50% understanding the client&apos;s bone structure. Never skip the
                consultation.&quot;
              </p>
              <div className="h-px w-12 bg-primary-container"></div>
            </div>

            {/* Feed card 3 — image only */}
            <div className="break-inside-avoid rounded-3xl overflow-hidden glass-panel border border-outline-variant/5">
              <img
                className="w-full"
                alt="Barber working with precision"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB33YT5vbmeTpK3ANwu2zPxGcbVjaicq5IKW-zGV4Ge5UExZ9W5BDEBt0Lbaa8ypsT7TlbgE2mq3KRIOH_4KcR0z7ln90OrHU7_xCJdtpdLjPtnJ7zF3ND0wTj0Ra-2bdBTi67hM87dAPDBGTLGVuKOUVC3KeTHbO3SzMbdfF32TwkT5hqXgCPxqK9za4RrmMM7-KL_uylFhXeGu99knPKDCNAuiAjjzpvfE47VHCGHfbMM1MB8x3uXj8_eoaA0Qe0Nwp_R9jWKxbI"
              />
            </div>

            {/* Feed card 4 — review */}
            <div className="break-inside-avoid rounded-3xl overflow-hidden glass-panel border border-outline-variant/5">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-1 text-primary-container">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-on-surface-variant/40 font-bold uppercase">2 hours ago</span>
                </div>
                <p className="italic text-on-surface">
                  &quot;Best grooming experience in the city. The attention to detail is unmatched.&quot;
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">— Michael K.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Right Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-80 h-screen fixed right-0 top-0 bg-[#0e0e0e] border-l border-white/5 p-6 z-40">
        {/* My Pages */}
        <div className="mb-8">
          <p className="text-[9px] font-label tracking-[0.2em] uppercase text-on-surface-variant/30 mb-3">My Pages</p>
          <div className="flex flex-col gap-y-1 mb-4">
            {myProPages.map((page) => (
              <Link
                key={page.handle}
                href={`/profile/${page.handle}/pro`}
                className="flex items-center gap-3 px-3 py-2.5 text-primary-container bg-primary-container/5 border border-primary-container/20 font-label text-sm tracking-wide uppercase transition-all rounded-xl"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  store
                </span>
                <span className="truncate flex-1">{page.name}</span>
                <span className="material-symbols-outlined text-[14px] opacity-50">open_in_new</span>
              </Link>
            ))}
          </div>
          <Link
            href="/profile/create-page"
            className="w-full border border-primary-container/40 text-primary-container py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container/10 transition-all text-xs tracking-wide uppercase"
          >
            <span className="material-symbols-outlined text-sm">add_business</span>
            <span>Create Page</span>
          </Link>
        </div>

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
          <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl">
            <button className="flex-1 py-2 text-[10px] font-label uppercase font-bold tracking-widest bg-surface-variant rounded-lg">
              Profissionais
            </button>
            <button className="flex-1 py-2 text-[10px] font-label uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity">
              Conteúdo
            </button>
            <button className="flex-1 py-2 text-[10px] font-label uppercase font-bold tracking-widest opacity-40 hover:opacity-100 transition-opacity">
              Produtos
            </button>
          </div>
        </div>

        {/* Similar Profiles */}
        <section className="mb-10">
          <h3 className="text-[10px] font-label uppercase tracking-[0.2em] opacity-40 mb-6">More Profiles</h3>
          <div className="space-y-6">
            {[
              {
                name: "Marco Estilo",
                role: "Men's Grooming",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9HfCoTnb8KFEjf3Kf9AY1utalCitwvKuP4GSIAG0rMtzQ6ob1d_chlMDuPM23jwLfaO4iT3hP-UV5pVaHlTdWjd17vwk_AW71T6siQOYvYY3cB93zkrSTARC58qvmPM-l2HqKXP4qrQ-s8vAmsRhjpKLv8K7TQMxrFp7eR7s7ggD0ngIXSIspHB4S2qPq0F2wptO3LRoU-bQMXnI36M_3BgZ4R7aRUUHMnu7gtGHs8cRqRELfJLEQx7SSgU_cDMPD3k-36l5EJ3A",
                handle: "marco_estilo",
              },
            ].map((pro, idx) => (
              <Link
                key={idx}
                href={`/profile/${pro.handle}`}
                className="flex items-center gap-4 group cursor-pointer hover:opacity-80 transition-opacity"
              >
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
            <p className="text-[10px] font-label uppercase tracking-widest opacity-40 mb-2">Studio Since</p>
            <p className="text-xs font-bold">January 2020</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
