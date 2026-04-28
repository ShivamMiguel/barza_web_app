import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Community | BARZA",
};

export default function CommunityPage() {
  return (
    <div className="bg-surface-container-lowest text-on-surface font-body selection:bg-primary-container selection:text-on-primary min-h-screen flex flex-col lg:flex-row">
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
          <button className="w-full volcanic-gradient text-on-primary py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_20px_40px_-10px_rgba(255,145,86,0.3)] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">add</span>
            <span>Create Post</span>
          </button>
          {/* User Profile Card */}
          <Link
            href="/community/profile"
            className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-[#201f1f] transition-all group border-t border-white/5 pt-3"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#ff9156]/40 flex-shrink-0">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY"
                alt="Beatriz Luanda"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface group-hover:text-[#ff9156] transition-colors truncate">
                Beatriz Luanda
              </p>
              <p className="text-[10px] text-on-surface-variant/50 font-label uppercase tracking-widest">Ambassador</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/30 text-sm group-hover:text-[#ff9156]/60 transition-colors">
              chevron_right
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:ml-64 lg:mr-80 min-h-screen bg-surface-container-lowest p-4 sm:p-6 lg:p-8 relative">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 mb-6 sm:mb-8 lg:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[3.5rem] font-headline font-extrabold tracking-tighter leading-none mb-2">
              Discover
            </h2>
            <div className="h-1 w-12 volcanic-gradient rounded-full"></div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 sm:p-3 bg-surface-container rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-lg sm:text-base">tune</span>
            </button>
          </div>
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
        <div className="space-y-12 max-w-3xl mx-auto">
          {/* Professional Post */}
          <article className="bg-surface-container rounded-3xl overflow-hidden shadow-[0_40px_60px_-15px_rgba(255,255,255,0.04)] border-t border-primary/20">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvWbJrwkh9rm1AWaAizoot_oRmZYIa-a5hk9hQvSQKBKAm_-xtbrzVtPeIldN6AauiYqtxq98NKcvmGD6CJIQKRKxJL9CAdSvInm6YvLwHlKmMN0nPVzmFvVTj4VPMQZ1BtO2US2sdVW4cpfaAL4HHHQFWlpt_OP43ZHsNWOMlYUSfVbkagkc9YXrdE5D1jMrjTUCUcIXHnk2kDSBWaamwobb7f6Jf45EsV1M_L9CSYFliLbGPV5JpniwyQ6jnkD-YHd9SKfoliuQ"
                  alt="Carlos Fade Studio"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-sm">Carlos Fade Studio</h3>
                    <span
                      className="material-symbols-outlined text-[16px] text-primary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant opacity-60">Luanda, Angola • 2h ago</p>
                </div>
              </div>
              <button className="material-symbols-outlined opacity-50 hover:opacity-100">more_horiz</button>
            </div>
            <div className="relative aspect-square w-full bg-surface-container-highest overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa5P37XvWjwJAJA0V0T62PA1pea9eXalF7n38KxH8ZIA5hkkdtrTLYXVKKbrc3oytmrHyH-yY2j43sTUa4jcmlzluraW8SUtxm665tpm90OR9Fp0bmDIKZlV7l5AIn7f0W9Wu0NiVnkJuphTgxK4KwovVxgq9m2GrVHEU1yxFWheaEhsBiGDaKk9J9uPuncViKVogffveiWiJOExKhqVNnz7l08IIyrP4akh3NMkpFvhaMsmEarc6km-fe53zzcWqlm2wxzbk24DA"
                alt="Professional haircut"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="flex gap-4 w-full">
                  <button className="flex-1 volcanic-gradient text-on-primary py-3 rounded-xl font-bold active:scale-95 transition-all">
                    Agendar Agora
                  </button>
                  <button className="flex-1 bg-surface-variant/80 backdrop-blur-md text-on-surface py-3 rounded-xl font-bold border-t border-white/10 active:scale-95 transition-all">
                    Ver Perfil
                  </button>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full">
                <span className="material-symbols-outlined text-white">videocam</span>
              </div>
            </div>
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 hover:text-primary-container transition-colors">
                  <span className="material-symbols-outlined">favorite</span>
                  <span className="text-xs font-bold uppercase tracking-wider">1.2k</span>
                </button>
                <button className="flex items-center gap-2 hover:text-primary-container transition-colors">
                  <span className="material-symbols-outlined">mode_comment</span>
                  <span className="text-xs font-bold uppercase tracking-wider">84</span>
                </button>
                <button className="flex items-center gap-2 hover:text-primary-container transition-colors">
                  <span className="material-symbols-outlined">share</span>
                </button>
              </div>
              <button className="material-symbols-outlined hover:text-primary-container transition-colors">bookmark</button>
            </div>
          </article>

          {/* User Post */}
          <article className="bg-surface-container-low rounded-3xl p-6 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrzgf9C9xCklkfrHiJJzRPpW2DfurCxtBh2QpSzxHXLAs0j7bn5QSGcsjwEwXgqfrqU-6GSL79cAN_Rh78pLV91KoBb4PNdNKZtw1dDZwXK0wXIJg7NTzLTe7514sZ5hu5aXv6hfmLX0OJQojMHjPt8g8KIVcZj3q7rLPH8a_naoSOZjLYPDV5vGs075Axy1Y_Bf0tUXTYN6rQ-GsO9npNywPyKqbZKZoFEBQe4dHl2fgRsDz1ub-eWjk9g4wj2xdCy0vTDm-T1sY"
                alt="Elena Kizua"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-sm">Elena Kizua</h3>
                <p className="text-xs text-on-surface-variant opacity-60">Client • 4h ago</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVf9uiVkQwBaz1VCekWU_W5OLk5TKquGgN729VJ7Mh3sl9YlloVmdR-KB7BCLYN7oO45mvK0iXfdv8JDYjwl_-jYMNntINqLLeVTwnWFm_lcaZ9YMH4LrmB5OQv7-bp3t1GE3MxhrNfW1XRmJDZkljZ3hvA9ZndcSD1rb4k-4dVYgxcy6eGrRGcZ-SussPzV84Tnfq5M2J2AxDGFArKCeoDbY8ureMo2DEL8vqJWF_1Eh3w4U_lnPZbDWrUWW97-Z7ge_nOKRL7oA"
                alt="Elena new hairstyle"
                className="w-full aspect-[4/5] object-cover rounded-2xl"
              />
              <div className="flex flex-col justify-between">
                <p className="text-sm italic font-light leading-relaxed">
                  &ldquo;Quando cuidas da imagem, a alma agradece. O melhor toque de Luanda! ✨&rdquo;
                </p>
                <div className="bg-surface-container-lowest p-4 rounded-2xl border-t border-primary/10">
                  <p className="text-[10px] font-label uppercase tracking-widest opacity-40 mb-2">Verified Experience</p>
                  <p className="text-xs font-bold">Atendido por Carlos Fade Studio</p>
                  <button className="mt-4 text-primary-container font-bold text-xs flex items-center gap-1 uppercase tracking-wider">
                    Reservar Também
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Trending Article */}
          <article className="relative h-[400px] rounded-3xl overflow-hidden group cursor-pointer border border-primary/10">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiAxnKPk4Jxz6fwJXcYdS6Tr6NtVz66SuXfie4I6eD1WYUkTbg2Nb4p0R66gfLSqkFUkaCvTB8aupO5KgLvJujSSu3eOTInaTt0HpHHC7TIAE5KOn8NzENFufFUqMbevQRwXP6pJLjjw2TtGe1KOaHAvWK5Stux9BiSFQZLgHABzbVVbmDN2RNCLA3_68l9vO0u0fJaVoibD1V3ejrQ4MW2N4EYXWN0MvPgsPune-1wuZGqn3e5yreQS2DvT8bw-sJs32b9eZjl_4"
              alt="Luanda skyline"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent p-10 flex flex-col justify-end">
              <span className="bg-primary-container/20 backdrop-blur-md text-primary-container text-[10px] font-label uppercase tracking-[0.2em] px-3 py-1 rounded-full w-fit mb-4">
                Trending Article
              </span>
              <h2 className="text-3xl font-headline font-bold tracking-tight mb-6 max-w-md leading-tight">
                5 tendências masculinas que estão a crescer em Luanda
              </h2>
              <button className="w-fit flex items-center gap-3 group">
                <span className="text-sm font-bold uppercase tracking-widest">Ler Artigo</span>
                <div className="w-10 h-10 rounded-full volcanic-gradient flex items-center justify-center transition-transform group-hover:translate-x-2">
                  <span className="material-symbols-outlined text-on-primary">north_east</span>
                </div>
              </button>
            </div>
          </article>

          {/* Product Post */}
          <article className="bg-surface-container rounded-3xl p-2 flex border-t border-primary/5">
            <div className="w-1/3 aspect-square rounded-2xl overflow-hidden relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAO67T6DeLRMvQWSXz2p7SD1J8JMFAgTfUM8WCPctIAHUAz0kKnV8aomUdOXPrL9rvQzUQlm55kcQmyts4PAyaX4OTQOJ_bj-GLzpodeOk_8aI1FeyjpzkL2rg4iz1XFooC4zPqVVceTy1JpngDFa5xJy0SvRfLnv33QJoetatcBHUG77kM4usuI6UdOE8-JENVgCEupOkpFcWiMbhfK911jTvwINh5mXBgcd0PXUtiSo5Ve6NHLNn1p2j3NyzQ_A-ry5Pm2ssTQGY"
                alt="Beard Oil"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-primary-container text-on-primary text-[10px] font-label uppercase font-black px-2 py-1 rounded-sm">
                Best Seller
              </span>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-label uppercase tracking-widest opacity-40 mb-1">Essential Oils</p>
                <h3 className="text-lg font-bold">Silk Texture Beard Oil</h3>
                <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">
                  Premium hydration for the modern gentleman. Infused with Angolan Marula oil.
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-headline font-black text-primary-container">12.500 Kz</span>
                <button className="bg-surface-variant px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-primary-container transition-colors hover:text-on-primary">
                  Comprar
                </button>
              </div>
            </div>
          </article>

          {/* AI Insight Card */}
          <article className="glass-panel rounded-3xl p-8 border-l-4 border-primary-container">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-primary-container/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span
                  className="material-symbols-outlined text-primary-container text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  psychology
                </span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-label uppercase tracking-widest text-primary-container mb-2">Barza AI Insight</p>
                <h4 className="text-xl font-bold mb-3">O que África pode aprender com a digitalização da beleza global?</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                  Exploramos como as ferramentas de Realidade Aumentada estão a transformar a experiência de consumo em Luanda e
                  Joanesburgo.
                </p>
                <button className="flex items-center gap-2 text-primary-container font-bold text-xs uppercase tracking-[0.15em]">
                  Explorar
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              </div>
            </div>
          </article>
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

        {/* Trending Professionals */}
        <section className="mb-10">
          <h3 className="text-[10px] font-label uppercase tracking-[0.2em] opacity-40 mb-6">Trending Professionals</h3>
          <div className="space-y-6">
            {[
              {
                name: "Marco Estilo",
                role: "Men's Grooming Specialist",
                trend: "+4.2%",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9HfCoTnb8KFEjf3Kf9AY1utalCitwvKuP4GSIAG0rMtzQ6ob1d_chlMDuPM23jwLfaO4iT3hP-UV5pVaHlTdWjd17vwk_AW71T6siQOYvYY3cB93zkrSTARC58qvmPM-l2HqKXP4qrQ-s8vAmsRhjpKLv8K7TQMxrFp7eR7s7ggD0ngIXSIspHB4S2qPq0F2wptO3LRoU-bQMXnI36M_3BgZ4R7aRUUHMnu7gtGHs8cRqRELfJLEQx7SSgU_cDMPD3k-36l5EJ3A",
                handle: "marco_estilo",
              },
              {
                name: "Ana Nails VIP",
                role: "High-End Nail Artistry",
                trend: "+3.8%",
                img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB52nVhRZzNl4e-qSuk_B7ApmrDEbxPfmW1yvGwh3iWS8ODd9LOE1FnUgLO4ltSw85Df70UY5Won2oG4Z3ducQlCxoVjbaZtFgGsJtFoNY59CgZ4wZFzYTuxVTy5VnqqkqUIDamkOW92jrUolCR5wb0_CphL-9mSAL19WGtJ_chnAM-JYfpYN0EWnYCN3pF1vhanMkMkKsQ03yHJ7jhC-VcMH51_4zAt-ScwC1PSEms7-OZECbxIhiV-Yhc-lv9WRWe_-ojnChaXrY",
                handle: "ana_nails_vip",
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
                <span className="text-[10px] font-bold text-primary-container">{pro.trend}</span>
              </Link>
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
    </div>
  );
}
