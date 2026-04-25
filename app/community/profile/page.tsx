import Link from 'next/link';

export const metadata = {
  title: 'Perfil | BARZA',
};

export default function ProfilePage() {
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY"
                alt="Beatriz Luanda"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#ff9156] truncate">Beatriz Luanda</p>
              <p className="text-[10px] text-on-surface-variant/50 font-label uppercase tracking-widest">Ambassador</p>
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
                      alt="High-end avatar of a stylish user"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY"
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
                  <h1 className="text-5xl md:text-6xl font-black text-on-surface font-display tracking-[-0.04em]">Beatriz Luanda</h1>
                  <span className="bg-surface-variant px-4 py-1 rounded-full text-[10px] uppercase tracking-widest text-primary-container font-bold mb-2">Ambassador</span>
                </div>
                <p className="text-on-surface-variant text-lg max-w-xl mb-8 leading-relaxed font-light">
                  Apaixonada por autocuidado e tendências de Luanda. Redefining African beauty through the lens of modern minimalism.
                </p>
                {/* Stats Bento */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-surface-container p-4 rounded-2xl border-t border-[#ff9156]/10">
                    <span className="block text-2xl font-black text-on-surface font-display">124</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 font-bold">Posts</span>
                  </div>
                  <div className="bg-surface-container p-4 rounded-2xl border-t border-[#ff9156]/10">
                    <span className="block text-2xl font-black text-on-surface font-display">12.8k</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 font-bold">Followers</span>
                  </div>
                  <div className="bg-surface-container p-4 rounded-2xl border-t border-[#ff9156]/10">
                    <span className="block text-2xl font-black text-on-surface font-display">842</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 font-bold">Following</span>
                  </div>
                  <div className="bg-surface-container p-4 rounded-2xl border-t border-[#ff9156]/10">
                    <span className="block text-2xl font-black text-on-surface font-display">48</span>
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
          {/* Posts Grid (Active Tab) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Post 1 */}
            <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container shadow-xl">
              <img
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                alt="Artistic makeup transformation"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfDG9XvFYSmHTn4ozUr6Nsbyucley3dpL_m6GDAkFF6Yuk-a8XzFTnC_cMRhMmvmq_242-7SsjAJ4Bt3VxAPiE6dH8N9C2vicrlt5CtSuPuF8tn9b1wxV1NlTL4PO9gBYqm1VJRLD47Wb1XWynU81ahNXsTFy7IsK-nJx-E6mzpXoj_bPBmRxAu-LZDv4GYgrfNOPBId5OGIjCgLd0qnDzZTp_Pc55w1qsas61eKAoe9atRHwU1YlAVNWj7BE5OLXByNx9MM_3oJU"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <span className="text-primary-container text-[10px] font-bold uppercase tracking-widest mb-1">Makeup Art</span>
                <h4 className="text-on-surface font-bold text-lg mb-2">Golden Hour Transformation</h4>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs text-on-surface/60"><span className="material-symbols-outlined text-sm">favorite</span> 1.2k</span>
                  <span className="flex items-center gap-1 text-xs text-on-surface/60"><span className="material-symbols-outlined text-sm">chat_bubble</span> 42</span>
                </div>
              </div>
            </div>
            {/* Post 2 */}
            <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container shadow-xl">
              <img
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                alt="Intricate braided hair design"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-RnzI87zoM9AzedqXQ8NWMq6N94Yz3bO2IINZ7x1DSKy4B67c4Cy1rmNCloVW39r6woNgQWY-1STscYjSFp9SjRFhEkWPHgoUZ5gLkLcdl03rO9yq6JD8YalYwzzc91Xt18B8XJGtF0bD9a19PKIyAbWyv6IwyBFBG3YTYy9mk7zCVrqh0dCcKIpq9NMHzt_5IwQPwiU176g7VNNHXo5DMaqfd3BL11p8opQBDGckniENyT1_BXtotxopOAJBiDYfwr9dwH0dGnQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <span className="text-primary-container text-[10px] font-bold uppercase tracking-widest mb-1">Hair Styling</span>
                <h4 className="text-on-surface font-bold text-lg mb-2">Tribal Weave Concept</h4>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs text-on-surface/60"><span className="material-symbols-outlined text-sm">favorite</span> 890</span>
                  <span className="flex items-center gap-1 text-xs text-on-surface/60"><span className="material-symbols-outlined text-sm">chat_bubble</span> 18</span>
                </div>
              </div>
            </div>
            {/* Post 3 */}
            <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container shadow-xl">
              <img
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                alt="Detailed nail art"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgjZ2Q_FRYy0dCeGBOmni57oFcrtB-OWteAQsibGZ7VrHrhP9V3Rn1XBOK6K16uRhubU-BbbVkN0oefT7VmfOqD8zx_ftv_ia_m1dCyTg0Or8Jd1MwuWzR_x8LDnyWZifPtt23ZG_wceBGTrXDW_WaZ-xxmlkkXcCgm0OIxJNFaR4nYA9Yd4f_ClWrsvepSFq6ZU5lpK8q2boxbBoGbhFJ9IYx52Sxk1uvOrUpJwkSDZC1JPisx7Pmu-P2Lub2olKwP2pJ6SYhSHE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                <span className="text-primary-container text-[10px] font-bold uppercase tracking-widest mb-1">Nail Art</span>
                <h4 className="text-on-surface font-bold text-lg mb-2">Emerald Geometry</h4>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs text-on-surface/60"><span className="material-symbols-outlined text-sm">favorite</span> 2.4k</span>
                  <span className="flex items-center gap-1 text-xs text-on-surface/60"><span className="material-symbols-outlined text-sm">chat_bubble</span> 156</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subsection: Produtos Comprados (Preview) */}
          <div className="mt-20">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-3xl font-black text-on-surface font-display tracking-tight">Recent Purchases</h3>
                <p className="text-on-surface-variant/60 text-sm mt-2">Curated beauty essentials from the Aura Marketplace</p>
              </div>
              <button className="text-primary-container text-xs font-bold uppercase tracking-widest hover:underline transition-all">View All Products</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Product 1 */}
              <div className="bg-surface-container p-4 rounded-2xl border-t border-white/5 group hover:bg-surface-container-high transition-colors">
                <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-lowest mb-4">
                  <img
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    alt="Luxury black perfume bottle"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp2Smh40FbyW1P_XjN-0Tz-dZlVy7k4njp2SZnVLcg_2wBlZ72n6IOZYxdCE4iO8grl71Td17WIqMuwegOcZbfRmo-uYGXO9R2IfOS5EnwX2GJbhqkSHdOeqHYufIFX07gjmyKAxUoyJE1WuISbs3Zkvnbq1FXKaCewsxIVtPVtrv9Kj3Y0qAjpGI800-OqQJIhJzyck7yfWKRmtejY2Kw7pUUlNl3bP1fzeyQpefFizqHuBIVj5QqLGFsmkTOkhUGA7T2Osejpt4"
                  />
                </div>
                <span className="text-[10px] text-primary-container uppercase font-bold tracking-widest">Fragrance</span>
                <h5 className="text-on-surface font-medium mt-1">Noir de Obsidian EDP</h5>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-on-surface-variant font-bold">14.500 Kz</span>
                  <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </div>
              {/* Product 2 */}
              <div className="bg-surface-container p-4 rounded-2xl border-t border-white/5 group hover:bg-surface-container-high transition-colors">
                <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-lowest mb-4">
                  <img
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    alt="Premium beard oil glass dropper bottle"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDorM6VjJrbf4ExWfkeI2lqn8Jw0HM6nTvzzgnKXIGcwgdAXBRAZpUemIO_6iSmxEkjMI-rrRxJ_K_JoL50YOp5PkDVd1ju61D79C40BqSyJrETYSnRalzug917ektwp5CG0F5j0z4kn8Z3oVJw1VXK48zONlz9ink7d8-7Kn8vU9Nmaro05f6JSjztqp2KBvxL7AzzzrNCQr9911IlzzNHIkr6E9_3vN-6WyMVmK3dFZN4F8ZGDgrLYgzKdk3ykYrkGsnktfQ4XeA"
                  />
                </div>
                <span className="text-[10px] text-primary-container uppercase font-bold tracking-widest">Grooming</span>
                <h5 className="text-on-surface font-medium mt-1">Sandalwood Beard Elixir</h5>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-on-surface-variant font-bold">8.200 Kz</span>
                  <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </div>
              {/* Product 3 */}
              <div className="bg-surface-container p-4 rounded-2xl border-t border-white/5 group hover:bg-surface-container-high transition-colors">
                <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-lowest mb-4">
                  <img
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    alt="High-end face cream in frosted glass jar"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdy2XlxYxOPBzqRt8zBrCQB2yFEYVHRwKw72DY29TCVc2TfuGt6-Z4yo2AokD8aZpjpNN_wMJCK7p-qDyvherUNuPX8zRYtG8D9cuxQvno3AbUKWbcmexC8T3UDucmr4JBDyY4b1Wjywn2q2JAwC_WmBcd1_Wfi022pn9evYDc0nmwgMzc04p_89jzJdulMms8R_IjtcHLCM_PrJ5ASmz-OHi7JjTKgz777OHtTiRlRC_ob8_CSACpI9vcUoRaGnd2BEdFGHtXKwA"
                  />
                </div>
                <span className="text-[10px] text-primary-container uppercase font-bold tracking-widest">Skincare</span>
                <h5 className="text-on-surface font-medium mt-1">Hydra-Obsidian Serum</h5>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-on-surface-variant font-bold">19.900 Kz</span>
                  <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </div>
              {/* Product 4 - Explore */}
              <div className="bg-surface-container p-4 rounded-2xl border-t border-white/5 group hover:bg-surface-container-high transition-colors">
                <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-lowest mb-4 flex items-center justify-center border border-white/5">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">add_shopping_cart</span>
                </div>
                <span className="text-[10px] text-on-surface-variant/40 uppercase font-bold tracking-widest">Explore</span>
                <h5 className="text-on-surface-variant/40 font-medium mt-1 italic">Shop more looks...</h5>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
