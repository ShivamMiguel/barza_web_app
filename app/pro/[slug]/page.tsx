import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { canonical, pageTitle, baseOG, twitterCard, SITE_URL } from '@/lib/seo'
import { schemaProfessional, schemaBreadcrumb } from '@/lib/schema'

// ── Types ──────────────────────────────────────────────────────────────────────

type Service  = { name: string; price: string; duration: string }
type Review   = { author: string; text: string; rating: number; date: string }

type Professional = {
  slug: string; name: string; specialty: string; city: string
  neighborhood: string; bio: string; rating: number; reviewCount: number
  priceRange: string; avatar: string; coverImage: string
  services: Service[]; reviews: Review[]; tags: string[]; available: boolean
  serviceCitySlug: string; serviceLabel: string
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const PROFESSIONALS: Professional[] = [
  {
    slug: 'carlos-fade',
    name: 'Carlos Fade',
    specialty: 'Barbeiro Premium',
    city: 'Luanda',
    neighborhood: 'Miramar',
    bio: 'Especialista em fades e cortes modernos com mais de 8 anos de experiência em Luanda. Carlos combina técnicas tradicionais angolanas com as mais recentes tendências internacionais de barbearia, criando um estilo único e personalizado para cada cliente.',
    rating: 4.9,
    reviewCount: 127,
    priceRange: '2 500–6 000 AOA',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvWbJrwkh9rm1AWaAizoot_oRmZYIa-a5hk9hQvSQKBKAm_-xtbrzVtPeIldN6AauiYqtxq98NKcvmGD6CJIQKRKxJL9CAdSvInm6YvLwHlKmMN0nPVzmFvVTj4VPMQZ1BtO2US2sdVW4cpfaAL4HHHQFWlpt_OP43ZHsNWOMlYUSfVbkagkc9YXrdE5D1jMrjTUCUcIXHnk2kDSBWaamwobb7f6Jf45EsV1M_L9CSYFliLbGPV5JpniwyQ6jnkD-YHd9SKfoliuQ',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY',
    services: [
      { name: 'Corte Clássico',  price: '2 500 AOA', duration: '30 min' },
      { name: 'Fade Premium',    price: '4 000 AOA', duration: '45 min' },
      { name: 'Barba Completa',  price: '2 000 AOA', duration: '20 min' },
      { name: 'Pacote Full Look',price: '6 000 AOA', duration: '75 min' },
    ],
    reviews: [
      { author: 'Tomás A.',  text: 'Melhor barbeiro de Luanda, sem dúvida. O fade ficou absolutamente perfeito!',              rating: 5, date: '10 Mar 2025' },
      { author: 'Hélder F.', text: 'Profissionalismo a toda a prova. Sou cliente fiel há 2 anos e nunca dececionou.',           rating: 5, date: '22 Fev 2025' },
      { author: 'Kwanza B.', text: 'Bom ambiente, ótimo trabalho. Recomendo a toda a gente em Luanda.',                        rating: 4, date: '15 Jan 2025' },
    ],
    tags: ['barbeiro', 'fade', 'luanda', 'miramar', 'corte-masculino'],
    available: true,
    serviceCitySlug: 'barbeiros-luanda',
    serviceLabel: 'Barbeiros em Luanda',
  },
  {
    slug: 'ana-nails',
    name: 'Ana Nails',
    specialty: 'Nail Artist',
    city: 'Luanda',
    neighborhood: 'Talatona',
    bio: 'Ana é uma das nail artists mais requisitadas de Talatona. Especialista em gel, acrílico e nail art personalizada, com estúdio próprio e mais de 6 anos de experiência no sector da beleza angolana.',
    rating: 4.8,
    reviewCount: 89,
    priceRange: '3 000–9 000 AOA',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB52nVhRZzNl4e-qSuk_B7ApmrDEbxPfmW1yvGwh3iWS8ODd9LOE1FnUgLO4ltSw85Df70UY5Won2oG4Z3ducQlCxoVjbaZtFgGsJtFoNY59CgZ4wZFzYTuxVTy5VnqqkqUIDamkOW92jrUolCR5wb0_CphL-9mSAL19WGtJ_chnAM-JYfpYN0EWnYCN3pF1vhanMkMkKsQ03yHJ7jhC-VcMH51_4zAt-ScwC1PSEms7-OZECbxIhiV-Yhc-lv9WRWe_-ojnChaXrY',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8',
    services: [
      { name: 'Manicure Simples', price: '3 000 AOA', duration: '40 min' },
      { name: 'Gel Completo',     price: '6 000 AOA', duration: '90 min'  },
      { name: 'Nail Art Premium', price: '9 000 AOA', duration: '120 min' },
      { name: 'Pedicure Clássica',price: '3 500 AOA', duration: '50 min'  },
    ],
    reviews: [
      { author: 'Beatriz L.', text: 'Ana é simplesmente incrível! As unhas ficaram perfeitas, exactamente como eu queria.', rating: 5, date: '5 Mar 2025'  },
      { author: 'Sofia M.',   text: 'Ambiente lindo, serviço de alto nível. Definitivamente voltarei com a minha irmã.',      rating: 5, date: '18 Fev 2025' },
      { author: 'Cláudia P.', text: 'Profissional excelente, muito detalhista e criativa. Vale cada kwanza!',                 rating: 5, date: '30 Jan 2025' },
    ],
    tags: ['manicure', 'nail-art', 'talatona', 'gel', 'unhas'],
    available: true,
    serviceCitySlug: 'manicure-talatona',
    serviceLabel: 'Manicure em Talatona',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function findPro(slug: string): Professional | undefined {
  return PROFESSIONALS.find(p => p.slug === slug)
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-primary-container"
          style={{ fontSize: `${size}px`, fontVariationSettings: `'FILL' ${i < Math.round(rating) ? 1 : 0}` }}
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
  return PROFESSIONALS.map(p => ({ slug: p.slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const pro = findPro(slug)
  if (!pro) return { title: pageTitle('Profissional não encontrado') }

  const title       = `${pro.name} | ${pro.specialty} em ${pro.city} | Barza`
  const description = `${pro.name} — ${pro.specialty} em ${pro.city}. ${pro.reviewCount} avaliações, nota ${pro.rating}/5. Agenda já na Barza.`

  return {
    title,
    description,
    robots: pro.available ? { index: true, follow: true } : { index: false },
    alternates: { canonical: canonical(`/pro/${pro.slug}`) },
    openGraph: baseOG({ title, description, path: `/pro/${pro.slug}`, image: pro.coverImage }),
    twitter:   twitterCard({ title, description, image: pro.coverImage }),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function ProPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pro = findPro(slug)
  if (!pro) notFound()

  const breadcrumbs = [
    { name: 'Início',               url: SITE_URL },
    { name: pro.serviceLabel,        url: `${SITE_URL}/s/${pro.serviceCitySlug}` },
    { name: pro.name,                url: `${SITE_URL}/pro/${pro.slug}` },
  ]

  const schemas = [
    schemaProfessional({
      name: pro.name, slug: pro.slug, specialty: pro.specialty,
      city: pro.city, bio: pro.bio, image: pro.avatar,
      rating: pro.rating, reviewCount: pro.reviewCount,
      priceRange: pro.priceRange, url: `${SITE_URL}/pro/${pro.slug}`,
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

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative">
        <div className="relative w-full overflow-hidden" style={{ height: '280px' }}>
          <img
            src={pro.coverImage}
            alt={`${pro.name} cover`}
            width={1440} height={280}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-14 relative z-10 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-primary-container/40 flex-shrink-0 bg-surface-container">
              <img src={pro.avatar} alt={pro.name} width={96} height={96} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-headline font-extrabold tracking-tight">{pro.name}</h1>
                <span className="bg-primary-container/15 text-primary-container text-xs font-label uppercase tracking-wider px-3 py-1 rounded-full border border-primary-container/20">
                  {pro.specialty}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-on-surface-variant/70">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '14px' }}>location_on</span>
                  {pro.neighborhood}, {pro.city}
                </span>
                <span className="opacity-30">·</span>
                <Stars rating={pro.rating} />
                <span className="font-bold text-on-surface">{pro.rating}</span>
                <span className="opacity-50">({pro.reviewCount} avaliações)</span>
              </div>
            </div>

            {/* CTA */}
            <a href="/" className="volcanic-gradient text-on-primary-container px-6 py-3 rounded-xl font-bold shadow-[0_20px_40px_-10px_rgba(255,145,86,0.35)] hover:scale-105 transition-transform flex-shrink-0">
              Agendar Agora
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { icon: 'star',          label: 'Avaliação',    value: `${pro.rating}/5`       },
            { icon: 'reviews',       label: 'Avaliações',   value: String(pro.reviewCount) },
            { icon: 'payments',      label: 'Preços',       value: pro.priceRange          },
            { icon: 'location_city', label: 'Localização',  value: `${pro.neighborhood}, ${pro.city}` },
          ] as const).map(stat => (
            <div key={stat.label} className="bg-surface-container rounded-2xl p-4 flex flex-col gap-1 border-t border-white/5">
              <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '20px' }}>{stat.icon}</span>
              <p className="text-xs text-on-surface-variant/50 font-label uppercase tracking-wider mt-1">{stat.label}</p>
              <p className="font-bold text-sm">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bio ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <p className="text-on-surface-variant leading-relaxed max-w-2xl">{pro.bio}</p>
      </section>

      {/* ── Services ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <h2 className="text-xl font-headline font-bold mb-1">Serviços</h2>
        <p className="text-sm text-on-surface-variant/60 mb-6">Escolhe o serviço e reserva directamente na app Barza.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pro.services.map(service => (
            <div key={service.name} className="bg-surface-container rounded-2xl p-5 flex flex-col gap-3 border-t border-white/5 hover:border-primary-container/20 transition-all">
              <h3 className="font-bold text-base">{service.name}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-container font-bold">{service.price}</span>
                <span className="text-on-surface-variant/50 flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                  {service.duration}
                </span>
              </div>
              <a href="/" className="mt-auto w-full border border-primary-container/40 text-primary-container py-2 rounded-xl font-bold text-sm text-center hover:bg-primary-container/10 transition-colors">
                Reservar
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reviews ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <h2 className="text-xl font-headline font-bold mb-6">
          O que dizem os clientes
          <span className="ml-2 text-sm font-body text-on-surface-variant/50 font-normal">({pro.reviewCount} avaliações)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pro.reviews.map((review, idx) => (
            <div key={idx} className="bg-surface-container rounded-2xl p-5 flex flex-col gap-3 border-t border-white/5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-container/15 flex items-center justify-center font-bold text-primary-container text-sm flex-shrink-0">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-tight">{review.author}</p>
                    <p className="text-xs text-on-surface-variant/40">{review.date}</p>
                  </div>
                </div>
                <Stars rating={review.rating} size={14} />
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">"{review.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <h2 className="text-xl font-headline font-bold mb-6">Perguntas Frequentes</h2>
        <div className="space-y-3 max-w-3xl">
          {[
            {
              q: `Como agendar um serviço com ${pro.name}?`,
              a: `Para agendar com ${pro.name}, descarrega a app Barza, pesquisa por nome ou localização em ${pro.city}, e escolhe o serviço e horário disponível. O processo é rápido e demora menos de 2 minutos.`,
            },
            {
              q: `Qual é o tempo de espera para marcar com ${pro.name}?`,
              a: `${pro.name} tem agenda disponível na plataforma Barza. Normalmente os slots mais próximos estão disponíveis com 24–48 horas de antecedência. Para datas específicas, recomendamos agendar com pelo menos 1 semana de antecedência.`,
            },
            {
              q: `Quais as formas de pagamento aceites por ${pro.name}?`,
              a: `${pro.name} aceita múltiplas formas de pagamento, incluindo dinheiro, transferência bancária e pagamento via app Barza. Confirma as opções ao fazer a reserva na plataforma.`,
            },
          ].map((faq, idx) => (
            <details key={idx} className="bg-surface-container rounded-2xl border-t border-white/5 group">
              <summary className="p-5 font-bold cursor-pointer list-none flex items-center justify-between gap-3 hover:text-primary-container transition-colors">
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-primary-container/60 flex-shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
              </summary>
              <p className="px-5 pb-5 text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Tags ────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pb-4">
        <div className="flex flex-wrap gap-2">
          {pro.tags.map(tag => (
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
      <footer className="w-full py-12 px-8 mt-12 bg-[#0e0e0e] border-t border-[#353534]/30">
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
