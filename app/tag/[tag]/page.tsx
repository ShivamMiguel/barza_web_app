import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { canonical, pageTitle, twitterCard, SITE_URL } from '@/lib/seo'

// ── Types ──────────────────────────────────────────────────────────────────────

type PostCard = {
  slug: string; title: string; date: string; image: string; type: 'trend' | 'article' | 'pro'
}

type TagData = {
  tag: string; label: string; postCount: number
  description: string; posts: PostCard[]; relatedTags: string[]
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const TAGS: TagData[] = [
  {
    tag: 'barber-luanda',
    label: 'Barber Luanda',
    postCount: 34,
    description: 'Tudo sobre barbearia em Luanda — tendências, rankings de barbeiros e dicas de corte.',
    posts: [
      { slug: 'barber-fade-angola',         title: 'Barber Fade Angola: O Corte que Definiu uma Geração', date: '20 Jan 2025', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY', type: 'trend' },
      { slug: 'ranking-barbeiros-luanda',   title: 'Top 10 Barbeiros de Luanda em 2025',                  date: '1 Fev 2025',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvWbJrwkh9rm1AWaAizoot_oRmZYIa-a5hk9hQvSQKBKAm_-xtbrzVtPeIldN6AauiYqtxq98NKcvmGD6CJIQKRKxJL9CAdSvInm6YvLwHlKmMN0nPVzmFvVTj4VPMQZ1BtO2US2sdVW4cpfaAL4HHHQFWlpt_OP43ZHsNWOMlYUSfVbkagkc9YXrdE5D1jMrjTUCUcIXHnk2kDSBWaamwobb7f6Jf45EsV1M_L9CSYFliLbGPV5JpniwyQ6jnkD-YHd9SKfoliuQ', type: 'article' },
      { slug: 'carlos-fade',                title: 'Carlos Fade — Barbeiro Premium em Miramar, Luanda',   date: '10 Mar 2025', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY', type: 'pro' },
      { slug: 'barbeiros-luanda',           title: 'Melhores Barbeiros em Luanda — Guia 2025',            date: '5 Jan 2025',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9HfCoTnb8KFEjf3Kf9AY1utalCitwvKuP4GSIAG0rMtzQ6ob1d_chlMDuPM23jwLfaO4iT3hP-UV5pVaHlTdWjd17vwk_AW71T6siQOYvYY3cB93zkrSTARC58qvmPM-l2HqKXP4qrQ-s8vAmsRhjpKLv8K7TQMxrFp7eR7s7ggD0ngIXSIspHB4S2qPq0F2wptO3LRoU-bQMXnI36M_3BgZ4R7aRUUHMnu7gtGHs8cRqRELfJLEQx7SSgU_cDMPD3k-36l5EJ3A', type: 'article' },
      { slug: 'fade-vs-corte',              title: 'Fade vs. Corte Clássico: Qual Escolher?',              date: '12 Fev 2025', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvWbJrwkh9rm1AWaAizoot_oRmZYIa-a5hk9hQvSQKBKAm_-xtbrzVtPeIldN6AauiYqtxq98NKcvmGD6CJIQKRKxJL9CAdSvInm6YvLwHlKmMN0nPVzmFvVTj4VPMQZ1BtO2US2sdVW4cpfaAL4HHHQFWlpt_OP43ZHsNWOMlYUSfVbkagkc9YXrdE5D1jMrjTUCUcIXHnk2kDSBWaamwobb7f6Jf45EsV1M_L9CSYFliLbGPV5JpniwyQ6jnkD-YHd9SKfoliuQ', type: 'article' },
      { slug: 'cuidado-barba',              title: 'Como Cuidar da Barba em Climas Tropicais',             date: '28 Jan 2025', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnkomdXPuuum3ck-BkVaClvauz1bc_Ucin4yMhP6c1AZ31OQHMfe3_xO9dFkto8-A-ugOAxJSZ3FLg1ThG2jBNRkL4_xMPS01xzm01ElcLzcjQPvAyVh0jj3Qdno2vyZfQxc28zPXKuURUrt6xn2QO5FWCiohty5Tq0puhk9AGoZTNel9bkxV4d1tE9pOXveoVuQ6qrDFKluLhhTCNOZ8ajqB2Wzibo8tB-14JrL6q6x5_B9qOPHge8yKoVL3A_6BBG-dc1Jw4j2E', type: 'article' },
    ],
    relatedTags: ['fade', 'corte-masculino', 'luanda', 'barber-fade-angola'],
  },
  {
    tag: 'glow-angola',
    label: 'Glow Angola',
    postCount: 21,
    description: 'Tendências de maquilhagem glow adaptadas à pele e ao clima de Angola.',
    posts: [
      { slug: 'glow-makeup-2026',           title: 'Glow Makeup 2026: A Nova Era da Beleza Africana',   date: '15 Jan 2025', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0', type: 'trend' },
      { slug: 'glass-skin-luanda',          title: 'Glass Skin em Luanda: Guia Completo',               date: '3 Fev 2025',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzE-lQp-OnAM1IjXorEsFZSU1uyoPsdcBVDcBTb8kuj2cQ2XArL8VSN8wDR9CK08vA2-jVH72iCK3GBv7UP6jFsR2TaVZqjWkr9jHsNZ3UVyRYmLXth62rsRRB2F72PaaTenOdN-zzTKSjNAuPV0nfbIz1JGzz_G9fA8u7jYzBgi2x2CaUdhI3gYdnW575q4ZKU3zmyBaHZF8UZRHTebZlIZRnScJv5rq5cyOSNOm7BOav0lVT9jmoF9ubcqs21Kj1KebFoyCDF6k', type: 'article' },
      { slug: 'iluminadores-pele-negra',    title: 'Melhores Iluminadores para Pele Negra 2025',        date: '22 Jan 2025', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg5h9HiQn-YI9vLqNmwzLgst5PEISMcZGwVyJxapuwAYJGdOkotAS4TpFoDpFI4DPVIstnnK9z4GKDc_5fcdH2Pd7WJpPyZ3rBR7DOLqjkq6nz4B7UtgDI0rmoV1qLLkb3b2_es9Y5dAnrGNsa90MmAipXI-AlCv93MySSLrX7prylzXGfKD-zaEVcPM34O1neYBxqmZa5bSmHINLiv2DkAhYtC7pfPBdiF4vp8ZqjR5JTaFniI6teXBpGCvJnC_8zYeQLTXjbGYE', type: 'article' },
      { slug: 'obsidian-beard-oil',         title: 'Obsidian Beard Oil: Review Completa',               date: '8 Fev 2025',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnkomdXPuuum3ck-BkVaClvauz1bc_Ucin4yMhP6c1AZ31OQHMfe3_xO9dFkto8-A-ugOAxJSZ3FLg1ThG2jBNRkL4_xMPS01xzm01ElcLzcjQPvAyVh0jj3Qdno2vyZfQxc28zPXKuURUrt6xn2QO5FWCiohty5Tq0puhk9AGoZTNel9bkxV4d1tE9pOXveoVuQ6qrDFKluLhhTCNOZ8ajqB2Wzibo8tB-14JrL6q6x5_B9qOPHge8yKoVL3A_6BBG-dc1Jw4j2E', type: 'article' },
      { slug: 'ana-nails',                  title: 'Ana Nails — Nail Artist em Talatona',               date: '5 Mar 2025',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8', type: 'pro' },
      { slug: 'beleza-angolana-2025',       title: 'O Estado da Beleza Angolana em 2025',               date: '2 Mar 2025',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw', type: 'article' },
    ],
    relatedTags: ['makeup', 'beleza-africana', 'angola', 'nail-art'],
  },
  {
    tag: 'trancas-angola',
    label: 'Tranças Angola',
    postCount: 18,
    description: 'Guias de tranças, box braids, cornrows e estilos afro em Angola.',
    posts: [
      { slug: 'trancas-kilamba',            title: 'Melhores Especialistas em Tranças no Kilamba',       date: '10 Jan 2025', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8', type: 'article' },
      { slug: 'box-braids-angola',          title: 'Box Braids em Angola: Guia Completo 2025',           date: '18 Jan 2025', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzE-lQp-OnAM1IjXorEsFZSU1uyoPsdcBVDcBTb8kuj2cQ2XArL8VSN8wDR9CK08vA2-jVH72iCK3GBv7UP6jFsR2TaVZqjWkr9jHsNZ3UVyRYmLXth62rsRRB2F72PaaTenOdN-zzTKSjNAuPV0nfbIz1JGzz_G9fA8u7jYzBgi2x2CaUdhI3gYdnW575q4ZKU3zmyBaHZF8UZRHTebZlIZRnScJv5rq5cyOSNOm7BOav0lVT9jmoF9ubcqs21Kj1KebFoyCDF6k', type: 'article' },
      { slug: 'knotless-braids-luanda',     title: 'Knotless Braids: A Tendência que Chegou a Luanda',  date: '25 Jan 2025', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0', type: 'trend' },
      { slug: 'trancas-da-mama',            title: 'Tranças da Mamã — Especialista em Kilamba',         date: '2 Fev 2025',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8', type: 'pro' },
      { slug: 'cuidar-trancas',             title: 'Como Cuidar das Tranças e Prolongar a Duração',     date: '14 Fev 2025', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnkomdXPuuum3ck-BkVaClvauz1bc_Ucin4yMhP6c1AZ31OQHMfe3_xO9dFkto8-A-ugOAxJSZ3FLg1ThG2jBNRkL4_xMPS01xzm01ElcLzcjQPvAyVh0jj3Qdno2vyZfQxc28zPXKuURUrt6xn2QO5FWCiohty5Tq0puhk9AGoZTNel9bkxV4d1tE9pOXveoVuQ6qrDFKluLhhTCNOZ8ajqB2Wzibo8tB-14JrL6q6x5_B9qOPHge8yKoVL3A_6BBG-dc1Jw4j2E', type: 'article' },
      { slug: 'historia-trancas-angola',    title: 'A História das Tranças em Angola',                   date: '1 Mar 2025',  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw', type: 'article' },
    ],
    relatedTags: ['cabelo-natural', 'angola', 'kilamba', 'afro'],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function findTag(tag: string): TagData | undefined {
  return TAGS.find(t => t.tag === tag)
}

function typeHref(post: PostCard): string {
  if (post.type === 'pro')      return `/pro/${post.slug}`
  if (post.type === 'trend')    return `/trend/${post.slug}`
  return `/barza-insights/${post.slug}`
}

function typeBadge(type: PostCard['type']): string {
  if (type === 'pro')    return 'Profissional'
  if (type === 'trend')  return 'Tendência'
  return 'Artigo'
}

function SeoNav() {
  return (
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
  )
}

// ── Static Params ──────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  // TODO: replace with DB query
  return TAGS.map(t => ({ tag: t.tag }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ tag: string }> }
): Promise<Metadata> {
  const { tag } = await params
  const data = findTag(tag)
  if (!data) return { title: pageTitle('Tag não encontrada') }

  const title       = `#${data.tag} | Barza`
  const description = `Explora todo o conteúdo sobre ${data.tag} na Barza — tendências, profissionais e muito mais.`

  return {
    title,
    description,
    alternates: { canonical: canonical(`/tag/${data.tag}`) },
    twitter: twitterCard({ title, description }),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const data = findTag(tag)
  if (!data) notFound()

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body min-h-screen">
      <SeoNav />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-xs text-on-surface-variant/60 font-label flex flex-wrap items-center gap-1">
        <Link href="/" className="hover:text-primary-container transition-colors">Início</Link>
        <span className="opacity-40 mx-1">›</span>
        <Link href="/barza-insights" className="hover:text-primary-container transition-colors">Insights</Link>
        <span className="opacity-40 mx-1">›</span>
        <span className="text-on-surface/80">#{data.tag}</span>
      </nav>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1 h-10 volcanic-gradient rounded-full" />
              <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight text-primary-container">
                #{data.tag}
              </h1>
            </div>
            <p className="text-on-surface-variant max-w-xl">{data.description}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1 pb-1">
            <span className="text-3xl font-headline font-extrabold">{data.postCount}</span>
            <span className="text-xs text-on-surface-variant/50 font-label uppercase tracking-widest">publicações</span>
          </div>
        </div>
      </section>

      {/* ── Posts Grid ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.posts.map(post => (
            <Link
              key={post.slug}
              href={typeHref(post)}
              className="bg-surface-container rounded-2xl overflow-hidden border-t border-white/5 hover:border-primary-container/20 transition-all group"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={post.image} alt={post.title} width={600} height={176} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-[#0e0e0e]/70 text-primary-container text-[10px] font-label uppercase tracking-wider px-2.5 py-1 rounded-full border border-primary-container/30 backdrop-blur-sm">
                  {typeBadge(post.type)}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm leading-snug group-hover:text-primary-container transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-xs text-on-surface-variant/40 mt-2 font-label">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Related Tags ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <h2 className="text-base font-headline font-bold mb-4 text-on-surface-variant/60 uppercase tracking-widest text-xs font-label">Tags Relacionadas</h2>
        <div className="flex flex-wrap gap-2">
          {data.relatedTags.map(relTag => (
            <Link
              key={relTag}
              href={`/tag/${relTag}`}
              className="bg-surface-container text-on-surface-variant/70 text-sm font-label px-4 py-2 rounded-full border border-outline-variant/30 hover:text-primary-container hover:border-primary-container/40 transition-all"
            >
              #{relTag}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
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
