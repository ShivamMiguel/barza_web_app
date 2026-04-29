import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { canonical, pageTitle, baseOG, twitterCard, SITE_URL } from '@/lib/seo'
import { schemaServicePage, schemaBreadcrumb } from '@/lib/schema'

// ── Types ──────────────────────────────────────────────────────────────────────

type ProCard = {
  slug: string; name: string; specialty: string
  avatar: string; rating: number; reviewCount: number; priceRange: string
}

type ServiceCityData = {
  slug: string; service: string; city: string; proCount: number
  description: string; localInfo: string[]; professionals: ProCard[]
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const DATA: ServiceCityData[] = [
  {
    slug: 'barbeiros-luanda',
    service: 'Barbeiros',
    city: 'Luanda',
    proCount: 48,
    description: 'Encontra os melhores barbeiros em Luanda. Vê preços, avaliações e agenda online na Barza.',
    localInfo: [
      'Luanda é o epicentro da cultura de barbearia em Angola. Com uma cena urbana em crescimento acelerado, a cidade conta com mais de 48 barbeiros profissionais listados na Barza — desde salões clássicos no Miramar e Maianga até estúdios premium em Talatona e Morro Bento. A procura por cortes de qualidade tem crescido mais de 40% ao ano, impulsionada por uma geração jovem que valoriza o visual cuidado e a experiência no salão.',
      'Na Barza, podes comparar preços, ler avaliações reais de clientes e reservar o teu horário em segundos. Os barbeiros de Luanda listados na plataforma cobrem todos os estilos — do clássico angolano ao fade técnico inspirado nas tendências internacionais. Agenda hoje e descobre porque é que a Barza é a plataforma de referência para serviços de beleza em Angola.',
    ],
    professionals: [
      {
        slug: 'carlos-fade', name: 'Carlos Fade', specialty: 'Barbeiro Premium',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvWbJrwkh9rm1AWaAizoot_oRmZYIa-a5hk9hQvSQKBKAm_-xtbrzVtPeIldN6AauiYqtxq98NKcvmGD6CJIQKRKxJL9CAdSvInm6YvLwHlKmMN0nPVzmFvVTj4VPMQZ1BtO2US2sdVW4cpfaAL4HHHQFWlpt_OP43ZHsNWOMlYUSfVbkagkc9YXrdE5D1jMrjTUCUcIXHnk2kDSBWaamwobb7f6Jf45EsV1M_L9CSYFliLbGPV5JpniwyQ6jnkD-YHd9SKfoliuQ',
        rating: 4.9, reviewCount: 127, priceRange: '2 500–6 000 AOA',
      },
      {
        slug: 'marco-estilo', name: 'Marco Estilo', specialty: "Men's Grooming",
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9HfCoTnb8KFEjf3Kf9AY1utalCitwvKuP4GSIAG0rMtzQ6ob1d_chlMDuPM23jwLfaO4iT3hP-UV5pVaHlTdWjd17vwk_AW71T6siQOYvYY3cB93zkrSTARC58qvmPM-l2HqKXP4qrQ-s8vAmsRhjpKLv8K7TQMxrFp7eR7s7ggD0ngIXSIspHB4S2qPq0F2wptO3LRoU-bQMXnI36M_3BgZ4R7aRUUHMnu7gtGHs8cRqRELfJLEQx7SSgU_cDMPD3k-36l5EJ3A',
        rating: 4.7, reviewCount: 93, priceRange: '2 000–5 000 AOA',
      },
      {
        slug: 'diogo-cuts', name: 'Diogo Cuts', specialty: 'Barbeiro Clássico',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY',
        rating: 4.6, reviewCount: 54, priceRange: '1 500–4 000 AOA',
      },
    ],
  },
  {
    slug: 'manicure-talatona',
    service: 'Manicure',
    city: 'Talatona',
    proCount: 23,
    description: 'Encontra as melhores manicures em Talatona. Vê preços, avaliações e agenda online na Barza.',
    localInfo: [
      'Talatona tornou-se o destino de eleição para serviços premium de manicure em Luanda. O bairro concentra alguns dos melhores estúdios de nail art de Angola, onde talentosas nail artists combinam técnicas internacionais com uma estética moderna e sofisticada. Os preços variam entre 3 000 e 12 000 AOA, dependendo da complexidade do trabalho e dos materiais utilizados.',
      'Com a Barza, podes consultar portfólios reais, ler avaliações de clientes verificados e reservar online em qualquer estúdio de Talatona. Seja para um gel simples, nail art detalhada ou pedicure completa, a plataforma tem a profissional certa para ti. Mais de 23 nail artists activas em Talatona aguardam a tua reserva.',
    ],
    professionals: [
      {
        slug: 'ana-nails', name: 'Ana Nails', specialty: 'Nail Artist',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB52nVhRZzNl4e-qSuk_B7ApmrDEbxPfmW1yvGwh3iWS8ODd9LOE1FnUgLO4ltSw85Df70UY5Won2oG4Z3ducQlCxoVjbaZtFgGsJtFoNY59CgZ4wZFzYTuxVTy5VnqqkqUIDamkOW92jrUolCR5wb0_CphL-9mSAL19WGtJ_chnAM-JYfpYN0EWnYCN3pF1vhanMkMkKsQ03yHJ7jhC-VcMH51_4zAt-ScwC1PSEms7-OZECbxIhiV-Yhc-lv9WRWe_-ojnChaXrY',
        rating: 4.8, reviewCount: 89, priceRange: '3 000–9 000 AOA',
      },
      {
        slug: 'bella-nails', name: 'Bella Nails Studio', specialty: 'Gel & Acrílico',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw',
        rating: 4.6, reviewCount: 61, priceRange: '4 000–10 000 AOA',
      },
      {
        slug: 'luxury-nails', name: 'Luxury Nails AO', specialty: 'Nail Art Premium',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0',
        rating: 4.5, reviewCount: 38, priceRange: '5 000–12 000 AOA',
      },
    ],
  },
  {
    slug: 'trancas-kilamba',
    service: 'Tranças',
    city: 'Kilamba',
    proCount: 17,
    description: 'Encontra as melhores especialistas em tranças em Kilamba. Vê preços, avaliações e agenda online na Barza.',
    localInfo: [
      'Kilamba Kiaxi é um dos bairros que mais tem crescido em serviços de beleza em Angola. As especialistas em tranças desta zona distinguem-se pelo domínio de técnicas tradicionais africanas e modernas — desde box braids e cornrows a knotless braids e faux locs. Os preços são competitivos e os resultados, notáveis. A duração dos serviços varia geralmente entre 2 a 6 horas, dependendo do comprimento e estilo escolhido.',
      'A Barza conecta-te directamente com as melhores especialistas em tranças do Kilamba. Podes ver o portfólio completo de cada profissional, verificar a disponibilidade em tempo real e reservar sem precisar de telefonar. Mais de 17 especialistas activas em Kilamba esperem pela tua reserva — descobre a tua na Barza hoje.',
    ],
    professionals: [
      {
        slug: 'trancas-da-mama', name: 'Tranças da Mamã', specialty: 'Tranças Tradicionais',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8',
        rating: 4.9, reviewCount: 73, priceRange: '3 500–8 000 AOA',
      },
      {
        slug: 'braid-queen', name: 'Braid Queen AO', specialty: 'Box Braids & Knotless',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnkomdXPuuum3ck-BkVaClvauz1bc_Ucin4yMhP6c1AZ31OQHMfe3_xO9dFkto8-A-ugOAxJSZ3FLg1ThG2jBNRkL4_xMPS01xzm01ElcLzcjQPvAyVh0jj3Qdno2vyZfQxc28zPXKuURUrt6xn2QO5FWCiohty5Tq0puhk9AGoZTNel9bkxV4d1tE9pOXveoVuQ6qrDFKluLhhTCNOZ8ajqB2Wzibo8tB-14JrL6q6x5_B9qOPHge8yKoVL3A_6BBG-dc1Jw4j2E',
        rating: 4.7, reviewCount: 42, priceRange: '5 000–12 000 AOA',
      },
      {
        slug: 'angola-braids', name: 'Angola Braids Studio', specialty: 'Faux Locs & Cornrows',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzE-lQp-OnAM1IjXorEsFZSU1uyoPsdcBVDcBTb8kuj2cQ2XArL8VSN8wDR9CK08vA2-jVH72iCK3GBv7UP6jFsR2TaVZqjWkr9jHsNZ3UVyRYmLXth62rsRRB2F72PaaTenOdN-zzTKSjNAuPV0nfbIz1JGzz_G9fA8u7jYzBgi2x2CaUdhI3gYdnW575q4ZKU3zmyBaHZF8UZRHTebZlIZRnScJv5rq5cyOSNOm7BOav0lVT9jmoF9ubcqs21Kj1KebFoyCDF6k',
        rating: 4.5, reviewCount: 29, priceRange: '4 000–10 000 AOA',
      },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function findData(slug: string): ServiceCityData | undefined {
  return DATA.find(d => d.slug === slug)
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-primary-container"
          style={{ fontSize: '14px', fontVariationSettings: `'FILL' ${i < Math.round(rating) ? 1 : 0}` }}
        >
          star
        </span>
      ))}
    </span>
  )
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
  return DATA.map(d => ({ serviceCity: d.slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ serviceCity: string }> }
): Promise<Metadata> {
  const { serviceCity } = await params
  const data = findData(serviceCity)
  if (!data) return { title: pageTitle('Serviço não encontrado') }

  const title       = `${data.service} em ${data.city} | Melhores Profissionais | Barza`
  const description = `Encontra os melhores ${data.service.toLowerCase()} em ${data.city}. Vê preços, avaliações e agenda online na Barza.`

  return {
    title,
    description,
    alternates: { canonical: canonical(`/s/${data.slug}`) },
    openGraph: baseOG({ title, description, path: `/s/${data.slug}` }),
    twitter:   twitterCard({ title, description }),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ serviceCity: string }>
}) {
  const { serviceCity } = await params
  const data = findData(serviceCity)
  if (!data) notFound()

  const breadcrumbs = [
    { name: 'Início',       url: SITE_URL },
    { name: data.service,   url: `${SITE_URL}/s/${data.slug}` },
    { name: data.city,      url: `${SITE_URL}/s/${data.slug}` },
  ]

  const schemas = [
    schemaServicePage({
      name: `${data.service} em ${data.city}`,
      description: data.description,
      url: `${SITE_URL}/s/${data.slug}`,
      city: data.city,
    }),
    schemaBreadcrumb(breadcrumbs),
  ]

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body min-h-screen">
      <SeoNav />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-xs text-on-surface-variant/60 font-label flex flex-wrap items-center gap-1">
        {breadcrumbs.map((item, idx) => (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="opacity-40">›</span>}
            {idx < breadcrumbs.length - 1 ? (
              <Link href={item.url.replace(SITE_URL, '') || '/'} className="hover:text-primary-container transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className="text-on-surface/80">{item.name}</span>
            )}
          </span>
        ))}
      </nav>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="mb-1">
          <h1 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight">
            Melhores <span className="text-primary-container">{data.service}</span> em {data.city}
          </h1>
          <div className="h-1 w-16 volcanic-gradient rounded-full mt-3 mb-4" />
        </div>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">{data.description}</p>
        <p className="mt-2 text-sm text-on-surface-variant/50">
          <span className="font-bold text-primary-container">{data.proCount}</span> profissionais disponíveis em {data.city}
        </p>
      </section>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {['Melhor Avaliado', 'Disponível Hoje', 'Preço ↑', 'Preço ↓', 'Mais Perto'].map(filter => (
            <button
              key={filter}
              className="bg-surface-container text-on-surface-variant/70 text-xs font-label uppercase tracking-wider px-4 py-2 rounded-full border border-outline-variant/30 hover:border-primary-container/40 hover:text-primary-container transition-all first:bg-primary-container/15 first:text-primary-container first:border-primary-container/30"
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* ── Professionals Grid ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.professionals.map(pro => (
            <div key={pro.slug} className="bg-surface-container rounded-2xl overflow-hidden border-t border-white/5 hover:border-primary-container/20 transition-all group">
              <div className="p-5 flex gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-primary-container/20">
                  <img src={pro.avatar} alt={pro.name} width={64} height={64} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate group-hover:text-primary-container transition-colors">{pro.name}</h3>
                  <p className="text-xs text-on-surface-variant/60 mb-2">{pro.specialty}</p>
                  <div className="flex items-center gap-2">
                    <Stars rating={pro.rating} />
                    <span className="text-xs font-bold">{pro.rating}</span>
                    <span className="text-xs text-on-surface-variant/40">({pro.reviewCount})</span>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5 flex items-center justify-between">
                <span className="text-xs text-on-surface-variant/50">{pro.priceRange}</span>
                <Link
                  href={`/pro/${pro.slug}`}
                  className="volcanic-gradient text-on-primary-container px-4 py-2 rounded-xl font-bold text-xs hover:scale-105 transition-transform"
                >
                  Ver Perfil
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Local Info ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <h2 className="text-xl font-headline font-bold mb-6">
          Sobre os serviços de {data.service.toLowerCase()} em {data.city}
        </h2>
        <div className="space-y-4 max-w-3xl">
          {data.localInfo.map((para, idx) => (
            <p key={idx} className="text-on-surface-variant leading-relaxed">{para}</p>
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

      {/* ── JSON-LD ──────────────────────────────────────────────────────────── */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </div>
  )
}
