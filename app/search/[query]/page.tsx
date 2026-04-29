import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { canonical, pageTitle, twitterCard } from '@/lib/seo'

// ── Types ──────────────────────────────────────────────────────────────────────

type ResultCard = {
  slug: string; name: string; specialty: string
  avatar: string; rating: number; reviewCount: number
  priceRange: string; city: string
}

type SearchData = {
  query: string; displayQuery: string; resultCount: number
  results: ResultCard[]
}

// ── Known Queries ──────────────────────────────────────────────────────────────

const KNOWN_QUERIES: SearchData[] = [
  {
    query: 'barbeiro-talatona',
    displayQuery: 'barbeiro talatona',
    resultCount: 12,
    results: [
      {
        slug: 'carlos-fade', name: 'Carlos Fade',
        specialty: 'Barbeiro Premium',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvWbJrwkh9rm1AWaAizoot_oRmZYIa-a5hk9hQvSQKBKAm_-xtbrzVtPeIldN6AauiYqtxq98NKcvmGD6CJIQKRKxJL9CAdSvInm6YvLwHlKmMN0nPVzmFvVTj4VPMQZ1BtO2US2sdVW4cpfaAL4HHHQFWlpt_OP43ZHsNWOMlYUSfVbkagkc9YXrdE5D1jMrjTUCUcIXHnk2kDSBWaamwobb7f6Jf45EsV1M_L9CSYFliLbGPV5JpniwyQ6jnkD-YHd9SKfoliuQ',
        rating: 4.9, reviewCount: 127, priceRange: '2 500–6 000 AOA', city: 'Talatona, Luanda',
      },
      {
        slug: 'marco-estilo', name: 'Marco Estilo',
        specialty: "Men's Grooming",
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9HfCoTnb8KFEjf3Kf9AY1utalCitwvKuP4GSIAG0rMtzQ6ob1d_chlMDuPM23jwLfaO4iT3hP-UV5pVaHlTdWjd17vwk_AW71T6siQOYvYY3cB93zkrSTARC58qvmPM-l2HqKXP4qrQ-s8vAmsRhjpKLv8K7TQMxrFp7eR7s7ggD0ngIXSIspHB4S2qPq0F2wptO3LRoU-bQMXnI36M_3BgZ4R7aRUUHMnu7gtGHs8cRqRELfJLEQx7SSgU_cDMPD3k-36l5EJ3A',
        rating: 4.7, reviewCount: 93, priceRange: '2 000–5 000 AOA', city: 'Talatona, Luanda',
      },
      {
        slug: 'diogo-cuts', name: 'Diogo Cuts',
        specialty: 'Barbeiro Clássico',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY',
        rating: 4.6, reviewCount: 54, priceRange: '1 500–4 000 AOA', city: 'Talatona, Luanda',
      },
      {
        slug: 'beto-style', name: 'Beto Style',
        specialty: 'Fade & Barba',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0',
        rating: 4.5, reviewCount: 41, priceRange: '2 000–4 500 AOA', city: 'Talatona, Luanda',
      },
    ],
  },
  {
    query: 'manicure-luanda',
    displayQuery: 'manicure luanda',
    resultCount: 23,
    results: [
      {
        slug: 'ana-nails', name: 'Ana Nails',
        specialty: 'Nail Artist',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB52nVhRZzNl4e-qSuk_B7ApmrDEbxPfmW1yvGwh3iWS8ODd9LOE1FnUgLO4ltSw85Df70UY5Won2oG4Z3ducQlCxoVjbaZtFgGsJtFoNY59CgZ4wZFzYTuxVTy5VnqqkqUIDamkOW92jrUolCR5wb0_CphL-9mSAL19WGtJ_chnAM-JYfpYN0EWnYCN3pF1vhanMkMkKsQ03yHJ7jhC-VcMH51_4zAt-ScwC1PSEms7-OZECbxIhiV-Yhc-lv9WRWe_-ojnChaXrY',
        rating: 4.8, reviewCount: 89, priceRange: '3 000–9 000 AOA', city: 'Talatona, Luanda',
      },
      {
        slug: 'bella-nails', name: 'Bella Nails Studio',
        specialty: 'Gel & Acrílico',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw',
        rating: 4.6, reviewCount: 61, priceRange: '4 000–10 000 AOA', city: 'Miramar, Luanda',
      },
      {
        slug: 'luxury-nails', name: 'Luxury Nails AO',
        specialty: 'Nail Art Premium',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzE-lQp-OnAM1IjXorEsFZSU1uyoPsdcBVDcBTb8kuj2cQ2XArL8VSN8wDR9CK08vA2-jVH72iCK3GBv7UP6jFsR2TaVZqjWkr9jHsNZ3UVyRYmLXth62rsRRB2F72PaaTenOdN-zzTKSjNAuPV0nfbIz1JGzz_G9fA8u7jYzBgi2x2CaUdhI3gYdnW575q4ZKU3zmyBaHZF8UZRHTebZlIZRnScJv5rq5cyOSNOm7BOav0lVT9jmoF9ubcqs21Kj1KebFoyCDF6k',
        rating: 4.5, reviewCount: 38, priceRange: '5 000–12 000 AOA', city: 'Luanda',
      },
      {
        slug: 'nails-by-luana', name: 'Nails by Luana',
        specialty: 'Manicure & Pedicure',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8',
        rating: 4.4, reviewCount: 29, priceRange: '2 500–7 000 AOA', city: 'Maianga, Luanda',
      },
    ],
  },
  {
    query: 'trancas-miramar',
    displayQuery: 'tranças miramar',
    resultCount: 8,
    results: [
      {
        slug: 'trancas-da-mama', name: 'Tranças da Mamã',
        specialty: 'Tranças Tradicionais',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8',
        rating: 4.9, reviewCount: 73, priceRange: '3 500–8 000 AOA', city: 'Miramar, Luanda',
      },
      {
        slug: 'braid-queen', name: 'Braid Queen AO',
        specialty: 'Box Braids & Knotless',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnkomdXPuuum3ck-BkVaClvauz1bc_Ucin4yMhP6c1AZ31OQHMfe3_xO9dFkto8-A-ugOAxJSZ3FLg1ThG2jBNRkL4_xMPS01xzm01ElcLzcjQPvAyVh0jj3Qdno2vyZfQxc28zPXKuURUrt6xn2QO5FWCiohty5Tq0puhk9AGoZTNel9bkxV4d1tE9pOXveoVuQ6qrDFKluLhhTCNOZ8ajqB2Wzibo8tB-14JrL6q6x5_B9qOPHge8yKoVL3A_6BBG-dc1Jw4j2E',
        rating: 4.7, reviewCount: 42, priceRange: '5 000–12 000 AOA', city: 'Miramar, Luanda',
      },
      {
        slug: 'angola-braids', name: 'Angola Braids Studio',
        specialty: 'Faux Locs & Cornrows',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzE-lQp-OnAM1IjXorEsFZSU1uyoPsdcBVDcBTb8kuj2cQ2XArL8VSN8wDR9CK08vA2-jVH72iCK3GBv7UP6jFsR2TaVZqjWkr9jHsNZ3UVyRYmLXth62rsRRB2F72PaaTenOdN-zzTKSjNAuPV0nfbIz1JGzz_G9fA8u7jYzBgi2x2CaUdhI3gYdnW575q4ZKU3zmyBaHZF8UZRHTebZlIZRnScJv5rq5cyOSNOm7BOav0lVT9jmoF9ubcqs21Kj1KebFoyCDF6k',
        rating: 4.5, reviewCount: 29, priceRange: '4 000–10 000 AOA', city: 'Miramar, Luanda',
      },
      {
        slug: 'knotless-queen', name: 'Knotless Queen',
        specialty: 'Knotless & Twist',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg5h9HiQn-YI9vLqNmwzLgst5PEISMcZGwVyJxapuwAYJGdOkotAS4TpFoDpFI4DPVIstnnK9z4GKDc_5fcdH2Pd7WJpPyZ3rBR7DOLqjkq6nz4B7UtgDI0rmoV1qLLkb3b2_es9Y5dAnrGNsa90MmAipXI-AlCv93MySSLrX7prylzXGfKD-zaEVcPM34O1neYBxqmZa5bSmHINLiv2DkAhYtC7pfPBdiF4vp8ZqjR5JTaFniI6teXBpGCvJnC_8zYeQLTXjbGYE',
        rating: 4.3, reviewCount: 21, priceRange: '4 500–9 500 AOA', city: 'Miramar, Luanda',
      },
    ],
  },
  {
    query: 'makeup-kilamba',
    displayQuery: 'makeup kilamba',
    resultCount: 6,
    results: [
      {
        slug: 'beatriz-mua', name: 'Beatriz MUA',
        specialty: 'Makeup Artist',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY',
        rating: 4.8, reviewCount: 56, priceRange: '5 000–15 000 AOA', city: 'Kilamba',
      },
      {
        slug: 'amara-beauty', name: 'Amara Beauty',
        specialty: 'Glow & Bridal',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw',
        rating: 4.6, reviewCount: 33, priceRange: '6 000–20 000 AOA', city: 'Kilamba',
      },
      {
        slug: 'kilamba-glam', name: 'Kilamba Glam Studio',
        specialty: 'Full Glam & Events',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0',
        rating: 4.4, reviewCount: 18, priceRange: '4 000–12 000 AOA', city: 'Kilamba',
      },
      {
        slug: 'glam-by-tais', name: 'Glam by Taís',
        specialty: 'Natural & Editorial',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8',
        rating: 4.3, reviewCount: 12, priceRange: '3 500–10 000 AOA', city: 'Kilamba',
      },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function findSearch(query: string): SearchData | undefined {
  return KNOWN_QUERIES.find(d => d.query === query)
}

function isKnownQuery(query: string): boolean {
  return KNOWN_QUERIES.some(d => d.query === query)
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-primary-container"
          style={{ fontSize: '13px', fontVariationSettings: `'FILL' ${i < Math.round(rating) ? 1 : 0}` }}
        >
          star
        </span>
      ))}
    </span>
  )
}

// ── Static Params ──────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  // TODO: replace with DB query
  return KNOWN_QUERIES.map(d => ({ query: d.query }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ query: string }> }
): Promise<Metadata> {
  const { query } = await params
  const displayQuery = query.replace(/-/g, ' ')
  const title       = `${displayQuery} | Resultados na Barza`
  const description = `Resultados para "${displayQuery}" na Barza — encontra profissionais, produtos e tendências de beleza em Angola.`

  return {
    title,
    description,
    robots: isKnownQuery(query) ? { index: true, follow: true } : { index: false },
    alternates: isKnownQuery(query) ? { canonical: canonical(`/search/${query}`) } : undefined,
    twitter: isKnownQuery(query) ? twitterCard({ title, description }) : undefined,
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function SearchPage({
  params,
}: {
  params: Promise<{ query: string }>
}) {
  const { query } = await params

  // For unknown queries, show a minimal stub (noindex already set in metadata)
  if (!isKnownQuery(query)) notFound()

  const data = findSearch(query)
  if (!data) notFound()

  const tabs = ['Profissionais', 'Produtos', 'Tendências']

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/">
            <img src="/barza_logo.png" alt="Barza" className="h-10 w-auto" style={{ mixBlendMode: 'screen' }} />
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-xs font-label uppercase tracking-wider text-on-surface/60">
            <Link href="/s/barbeiros-luanda" className="hover:text-primary-container transition-colors">Profissionais</Link>
            <Link href="/barza-insights"     className="hover:text-primary-container transition-colors">Insights</Link>
          </nav>
          <a href="/" className="volcanic-gradient text-on-primary-container px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap">
            Baixar App
          </a>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-xs text-on-surface-variant/60 font-label flex flex-wrap items-center gap-1">
        <Link href="/" className="hover:text-primary-container transition-colors">Início</Link>
        <span className="opacity-40 mx-1">›</span>
        <span className="text-on-surface/80">Resultados</span>
        <span className="opacity-40 mx-1">›</span>
        <span className="text-on-surface/80">{data.displayQuery}</span>
      </nav>

      {/* ── Search Header ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '24px' }}>search</span>
          <h1 className="text-2xl sm:text-3xl font-headline font-extrabold tracking-tight">
            Resultados para: <span className="text-primary-container">{data.displayQuery}</span>
          </h1>
        </div>
        <p className="text-on-surface-variant/60 text-sm">
          <span className="font-bold text-on-surface">{data.resultCount}</span> profissionais encontrados em Angola
        </p>
      </section>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-2">
        <div className="flex gap-1 border-b border-outline-variant/20 mb-6">
          {tabs.map((tab, idx) => (
            <span
              key={tab}
              className={`px-5 py-3 text-sm font-bold font-label uppercase tracking-wide cursor-default border-b-2 -mb-px transition-colors ${
                idx === 0
                  ? 'border-primary-container text-primary-container'
                  : 'border-transparent text-on-surface-variant/40'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </section>

      {/* ── Results Grid ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.results.map(result => (
            <Link
              key={result.slug}
              href={`/pro/${result.slug}`}
              className="bg-surface-container rounded-2xl overflow-hidden border-t border-white/5 hover:border-primary-container/20 transition-all group"
            >
              <div className="p-5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4 ring-2 ring-primary-container/20 mx-auto">
                  <img src={result.avatar} alt={result.name} width={64} height={64} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-center group-hover:text-primary-container transition-colors truncate">{result.name}</h3>
                <p className="text-xs text-on-surface-variant/60 text-center mt-0.5 mb-3">{result.specialty}</p>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Stars rating={result.rating} />
                  <span className="text-xs font-bold">{result.rating}</span>
                  <span className="text-xs text-on-surface-variant/40">({result.reviewCount})</span>
                </div>
                <p className="text-xs text-on-surface-variant/50 text-center mb-3">{result.city}</p>
                <p className="text-xs text-primary-container font-bold text-center mb-4">{result.priceRange}</p>
                <span className="volcanic-gradient text-on-primary-container w-full py-2 rounded-xl font-bold text-xs text-center block">
                  Ver Perfil
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Block ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-14">
        <div className="bg-surface-container rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6 border-t border-primary-container/20 text-center sm:text-left">
          <div className="flex-1">
            <h2 className="text-xl font-headline font-bold mb-2">Não encontraste o que queres?</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              A app Barza tem mais de 500 profissionais verificados em todo Angola. Descarrega grátis e encontra o teu profissional de beleza ideal em segundos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a href="/" className="volcanic-gradient text-on-primary-container px-6 py-3 rounded-xl font-bold shadow-[0_20px_40px_-10px_rgba(255,145,86,0.35)] hover:scale-105 transition-transform whitespace-nowrap">
              Descarregar App
            </a>
            <a href="/" className="border border-primary-container/40 text-primary-container px-6 py-3 rounded-xl font-bold hover:bg-primary-container/10 transition-colors whitespace-nowrap">
              Ver Todos
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="w-full py-12 px-8 mt-16 bg-[#0e0e0e] border-t border-[#353534]/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="text-xl font-black text-primary-container font-headline uppercase tracking-widest">BARZA</div>
          <div className="flex flex-wrap justify-center gap-8 font-body text-[0.6875rem] uppercase tracking-[0.1em]">
            <a href="/" className="text-on-surface/60 hover:text-primary-container transition-colors">Política de Privacidade</a>
            <a href="/" className="text-on-surface/60 hover:text-primary-container transition-colors">Termos de Serviço</a>
            <a href="/" className="text-on-surface/60 hover:text-primary-container transition-colors">Suporte</a>
          </div>
          <p className="font-body text-[0.6875rem] text-on-surface/40">© 2025 Barza. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
