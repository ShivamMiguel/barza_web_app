import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { canonical, pageTitle, baseOG, twitterCard, SITE_URL } from '@/lib/seo'
import { schemaBreadcrumb } from '@/lib/schema'

// ── Types ──────────────────────────────────────────────────────────────────────

type TrendSection  = { heading: string; body: string }
type RelatedPro    = { name: string; slug: string; avatar: string; specialty: string }

type Trend = {
  slug: string; title: string; description: string
  heroImage: string; publishedAt: string; updatedAt: string
  tags: string[]; readTime: string
  sections: TrendSection[]; relatedPros: RelatedPro[]
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const TRENDS: Trend[] = [
  {
    slug: 'glow-makeup-2026',
    title: 'Glow Makeup 2026: A Nova Era da Beleza Africana',
    description: 'O glow makeup está a revolucionar a beleza feminina em Angola e em toda a África. Descobre as técnicas, produtos e profissionais que lideram esta tendência que mistura luminosidade natural com pigmentos intensos.',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0',
    publishedAt: '2025-01-15',
    updatedAt: '2025-02-10',
    tags: ['makeup', 'glow', 'angola', 'beleza-africana', 'glow-angola'],
    readTime: '5 min',
    sections: [
      {
        heading: 'O que é o Glow Makeup?',
        body: 'O glow makeup é uma abordagem à maquilhagem que prioriza a luminosidade natural da pele, amplificada por produtos estratégicos como iluminadores, primers hidratantes e bases de cobertura ligeira. Em vez de cobrir a pele, o objetivo é realçar a sua textura natural e criar um efeito "lit from within" — como se a beleza viesse de dentro. Esta tendência nasceu da cultura de beleza sul-coreana mas foi completamente reinterpretada pelas artistas de maquilhagem africanas, que a adaptaram aos tons de pele mais ricos e à pele naturalmente luminosa das mulheres angolanas.',
      },
      {
        heading: 'As Técnicas Mais Populares em Angola',
        body: 'Em Luanda, as MUAs (Makeup Artists) mais requisitadas dominam três técnicas principais de glow makeup. O "Glass Skin" angolano utiliza séros de ácido hialurónico locais misturados com iluminadores líquidos para criar uma pele translúcida e perfeita. O "Dewy Base" combina base stick com concealer e fixador em spray para um acabamento húmido e fresco. Por fim, o "Highlights on the Move" aplica iluminadores em pó em pontos estratégicos — arcos do supercílio, ponte do nariz e canto interno dos olhos — para um efeito dramático que fotografa de forma excepcional.',
      },
      {
        heading: 'Como Conseguir o Look Perfeito',
        body: 'Para replicar o glow makeup em casa, começa com uma limpeza e hidratação intensiva 24 horas antes. Na hora da maquilhagem, usa um primer iluminador como base, seguido de uma foundation leve ou BB cream com SPF. O segredo está na aplicação do iluminador: menos é mais, mas a qualidade do produto faz toda a diferença. Para os tons de pele angolanos, iluminadores dourados, cobrizos e champagne funcionam melhor do que os rosés ou prateados. Finaliza com um fixing spray hidratante para garantir que o glow dura o dia todo.',
      },
      {
        heading: 'Os Produtos Essenciais para o Glow Angolano',
        body: 'O mercado de beleza em Angola tem evoluído rapidamente, com produtos internacionais disponíveis nas principais lojas de Luanda e Talatona. Os mais procurados para o glow makeup são: iluminadores líquidos Charlotte Tilbury e Fenty Beauty, primers hidratantes da Tatcha e Milk Makeup, e fixadores em spray da Mario Badescu e Urban Decay. Localmente, a Barza Shop oferece uma selecção curada de produtos premium disponíveis para entrega em Luanda.',
      },
    ],
    relatedPros: [
      {
        name: 'Ana Nails',
        slug: 'ana-nails',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB52nVhRZzNl4e-qSuk_B7ApmrDEbxPfmW1yvGwh3iWS8ODd9LOE1FnUgLO4ltSw85Df70UY5Won2oG4Z3ducQlCxoVjbaZtFgGsJtFoNY59CgZ4wZFzYTuxVTy5VnqqkqUIDamkOW92jrUolCR5wb0_CphL-9mSAL19WGtJ_chnAM-JYfpYN0EWnYCN3pF1vhanMkMkKsQ03yHJ7jhC-VcMH51_4zAt-ScwC1PSEms7-OZECbxIhiV-Yhc-lv9WRWe_-ojnChaXrY',
        specialty: 'Nail Artist',
      },
      {
        name: 'Beatriz Luanda',
        slug: 'beatriz-luanda',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD91KlW51XeRQF4P1dkcoJJ5JfAMByhxbghht1rt3WJs-pCeLhYrb1Z1rzpgo6w1Jk0J_7XcdHIi02tJPP86eDMSCfwYgT6FAd51GsWConpE02xkbIYcvQVCpe7US5URy9IfApkJVbywf-bDINQ4ZIzrl_K1Mb9ac7dyNK2uOrIX7XcrimxLo0U5JOaWd4U7tgVn1VhRS7eB174XPG1r-f5MmntQhBw0hzr3_WZhEbEUhqvNXoHghn3Z8jdL56Y2IaNUeijSPhkBFY',
        specialty: 'Beauty Ambassador',
      },
    ],
  },
  {
    slug: 'barber-fade-angola',
    title: 'Barber Fade Angola: O Corte que Definiu uma Geração',
    description: 'O fade tornou-se o corte de cabelo mais pedido em Angola. De Luanda ao Huambo, este estilo conquistou as barbearias angolanas e hoje é símbolo de identidade, profissionalismo e pertença à nova geração urbana.',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY',
    publishedAt: '2025-01-20',
    updatedAt: '2025-03-01',
    tags: ['barber', 'fade', 'angola', 'corte-masculino', 'barber-luanda'],
    readTime: '4 min',
    sections: [
      {
        heading: 'A Ascensão do Fade em Angola',
        body: 'O fade deixou de ser apenas um estilo de corte para se tornar um movimento cultural. Introduzido em Angola no início dos anos 2010 pela influência da cultura afro-americana e caribenha, o fade rapidamente conquistou as barbearias de Luanda, especialmente nos bairros do Miramar, Maianga e Talatona. Hoje, segundo dados da Barza, o fade representa mais de 60% de todos os pedidos de corte masculino na plataforma — uma hegemonia que não mostra sinais de abrandar.',
      },
      {
        heading: 'Os Tipos de Fade Mais Pedidos',
        body: 'Existem múltiplas variações do fade que os homens angolanos mais pedem. O Low Fade é o mais clássico e versátil — o degrade começa baixo, junto às orelhas e à nuca. O Mid Fade oferece um contraste mais dramático e é preferido para estilos com textura no topo. O High Fade, o mais audacioso, começa alto na cabeça e cria um contraste impactante. O Skin Fade ou Zero Fade vai até à pele, criando uma transição quase invisível. Mais recentemente, o Fade com Risco (linha desenhada com navalha) ganhou popularidade entre a juventude de Luanda.',
      },
      {
        heading: 'Como Escolher o Fade Certo para o Teu Rosto',
        body: 'A escolha do fade ideal depende da forma do rosto, da textura do cabelo e do estilo de vida. Rostos ovais são os mais versáteis — ficam bem com qualquer variação de fade. Rostos quadrados beneficiam de um low ou mid fade que suaviza os ângulos. Rostos redondos favorecem um high fade que alonga visualmente a face. Para cabelos com mais textura ou caracóis, o fade com afro no topo (também chamado de "Afro Fade" ou "Sponge Fade") é a opção mais popular entre os jovens angolanos.',
      },
    ],
    relatedPros: [
      {
        name: 'Carlos Fade',
        slug: 'carlos-fade',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvWbJrwkh9rm1AWaAizoot_oRmZYIa-a5hk9hQvSQKBKAm_-xtbrzVtPeIldN6AauiYqtxq98NKcvmGD6CJIQKRKxJL9CAdSvInm6YvLwHlKmMN0nPVzmFvVTj4VPMQZ1BtO2US2sdVW4cpfaAL4HHHQFWlpt_OP43ZHsNWOMlYUSfVbkagkc9YXrdE5D1jMrjTUCUcIXHnk2kDSBWaamwobb7f6Jf45EsV1M_L9CSYFliLbGPV5JpniwyQ6jnkD-YHd9SKfoliuQ',
        specialty: 'Barbeiro Premium',
      },
      {
        name: 'Marco Estilo',
        slug: 'marco-estilo',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9HfCoTnb8KFEjf3Kf9AY1utalCitwvKuP4GSIAG0rMtzQ6ob1d_chlMDuPM23jwLfaO4iT3hP-UV5pVaHlTdWjd17vwk_AW71T6siQOYvYY3cB93zkrSTARC58qvmPM-l2HqKXP4qrQ-s8vAmsRhjpKLv8K7TQMxrFp7eR7s7ggD0ngIXSIspHB4S2qPq0F2wptO3LRoU-bQMXnI36M_3BgZ4R7aRUUHMnu7gtGHs8cRqRELfJLEQx7SSgU_cDMPD3k-36l5EJ3A',
        specialty: "Men's Grooming",
      },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function findTrend(slug: string): Trend | undefined {
  return TRENDS.find(t => t.slug === slug)
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
  return TRENDS.map(t => ({ slug: t.slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const trend = findTrend(slug)
  if (!trend) return { title: pageTitle('Tendência não encontrada') }

  const title       = `${trend.title} | Tendências | Barza`
  const description = trend.description.slice(0, 160)

  return {
    title,
    description,
    alternates: { canonical: canonical(`/trend/${trend.slug}`) },
    openGraph: {
      ...baseOG({ title, description, path: `/trend/${trend.slug}`, image: trend.heroImage }),
      type: 'article',
      publishedTime: trend.publishedAt,
      modifiedTime: trend.updatedAt,
    } as Metadata['openGraph'],
    twitter: twitterCard({ title, description, image: trend.heroImage }),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function TrendPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const trend = findTrend(slug)
  if (!trend) notFound()

  const breadcrumbs = [
    { name: 'Início',       url: SITE_URL },
    { name: 'Tendências',   url: `${SITE_URL}/trend` },
    { name: trend.title,    url: `${SITE_URL}/trend/${trend.slug}` },
  ]

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: trend.title,
    description: trend.description,
    image: trend.heroImage,
    datePublished: trend.publishedAt,
    dateModified: trend.updatedAt,
    url: `${SITE_URL}/trend/${trend.slug}`,
    author: { '@type': 'Organization', name: 'Barza', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Barza',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/barza_logo.png` },
    },
    keywords: trend.tags.join(', '),
  }

  const schemas = [articleSchema, schemaBreadcrumb(breadcrumbs)]

  const formattedDate = new Date(trend.publishedAt).toLocaleDateString('pt-AO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

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
              <span className="text-on-surface/80 truncate max-w-[200px] sm:max-w-none">{item.name}</span>
            )}
          </span>
        ))}
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: '440px' }}>
        <img
          src={trend.heroImage}
          alt={trend.title}
          width={1440} height={440}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {trend.tags.slice(0, 4).map(tag => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="bg-primary-container/20 text-primary-container text-xs font-label uppercase tracking-wider px-3 py-1 rounded-full border border-primary-container/30 hover:bg-primary-container/30 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold tracking-tight leading-tight mb-4">
            {trend.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant/70">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
              {trend.readTime} de leitura
            </span>
            <span className="opacity-30">·</span>
            <time dateTime={trend.publishedAt}>{formattedDate}</time>
          </div>
        </div>
      </section>

      {/* ── Article Body ────────────────────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 mt-12">
        <p className="text-lg text-on-surface-variant leading-relaxed mb-10">{trend.description}</p>

        {trend.sections.map((section, idx) => (
          <div key={idx} className="mb-10">
            <h2 className="text-2xl font-headline font-bold mb-4 text-on-surface">{section.heading}</h2>
            <p className="text-on-surface-variant leading-relaxed">{section.body}</p>
          </div>
        ))}
      </article>

      {/* ── Related Professionals ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <h2 className="text-xl font-headline font-bold mb-6">Especialistas nesta tendência</h2>
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
          {trend.relatedPros.map(pro => (
            <Link
              key={pro.slug}
              href={`/pro/${pro.slug}`}
              className="flex-shrink-0 w-48 bg-surface-container rounded-2xl p-4 flex flex-col items-center gap-3 border-t border-white/5 hover:border-primary-container/20 transition-all group text-center"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-primary-container/20">
                <img src={pro.avatar} alt={pro.name} width={64} height={64} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div>
                <p className="font-bold text-sm group-hover:text-primary-container transition-colors">{pro.name}</p>
                <p className="text-xs text-on-surface-variant/50 mt-0.5">{pro.specialty}</p>
              </div>
              <span className="text-xs text-primary-container font-bold font-label uppercase tracking-wide">Ver Perfil →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Tags ────────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-10">
        <p className="text-xs text-on-surface-variant/50 font-label uppercase tracking-widest mb-3">Tags</p>
        <div className="flex flex-wrap gap-2">
          {trend.tags.map(tag => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="bg-surface-container-high text-on-surface-variant/70 text-xs font-label uppercase tracking-wider px-3 py-1.5 rounded-full border border-transparent hover:text-primary-container hover:border-primary-container/30 transition-all"
            >
              #{tag}
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

      {/* ── JSON-LD ──────────────────────────────────────────────────────────── */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </div>
  )
}
