import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSignals } from '@/lib/beauty-signals/scraper'
import { canonical, pageTitle, baseOG, twitterCard, SITE_URL } from '@/lib/seo'
import { schemaBreadcrumb } from '@/lib/schema'

// ── Helpers ────────────────────────────────────────────────────────────────────

async function findSignal(slug: string) {
  const signals = await getSignals()
  return signals.find((s) => s.slug === slug) ?? null
}

// ── Nav ────────────────────────────────────────────────────────────────────────

function SeoNav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/barza_logo.png"
            alt="Barza"
            className="h-10 w-auto"
            style={{ mixBlendMode: 'screen' }}
          />
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-xs font-label uppercase tracking-wider text-on-surface/60">
          <Link
            href="/community"
            className="hover:text-primary-container transition-colors"
          >
            Community
          </Link>
          <Link
            href="/s/barbeiros-luanda"
            className="hover:text-primary-container transition-colors"
          >
            Profissionais
          </Link>
        </nav>
        <Link
          href="/"
          className="volcanic-gradient text-on-primary-container px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap"
        >
          Baixar App
        </Link>
      </div>
    </header>
  )
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const signal = await findSignal(slug)

  if (!signal) return { title: pageTitle('Sinal não encontrado') }

  const title = pageTitle(signal.headline)
  const description = signal.subtext

  return {
    title,
    description,
    alternates: { canonical: canonical(`/signal/${signal.slug}`) },
    openGraph: {
      ...baseOG({
        title,
        description,
        path: `/signal/${signal.slug}`,
        image: signal.image,
      }),
      type: 'article',
      publishedTime: signal.source.publishedAt,
    } as Metadata['openGraph'],
    twitter: twitterCard({ title, description, image: signal.image }),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function SignalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const signal = await findSignal(slug)
  if (!signal) notFound()

  const breadcrumbs = [
    { name: 'Início', url: SITE_URL },
    { name: 'Feed',   url: `${SITE_URL}/community` },
    { name: signal.headline, url: `${SITE_URL}/signal/${signal.slug}` },
  ]

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: signal.headline,
    description: signal.subtext,
    image: signal.image,
    datePublished: signal.source.publishedAt,
    dateModified: signal.scrapedAt,
    url: `${SITE_URL}/signal/${signal.slug}`,
    author: {
      '@type': 'Organization',
      name: signal.source.name,
      url: signal.source.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Barza',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/barza_logo.png` },
    },
  }

  const formattedDate = signal.source.publishedAt
    ? new Date(signal.source.publishedAt).toLocaleDateString('pt-AO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body min-h-screen">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleSchema, schemaBreadcrumb(breadcrumbs)]),
        }}
      />

      <SeoNav />

      {/* Breadcrumb */}
      <nav
        aria-label="breadcrumb"
        className="max-w-3xl mx-auto px-4 sm:px-6 py-3 text-xs text-on-surface-variant/60 font-label flex flex-wrap items-center gap-1"
      >
        {breadcrumbs.map((item, idx) => (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="opacity-40">›</span>}
            {idx < breadcrumbs.length - 1 ? (
              <Link
                href={item.url.replace(SITE_URL, '') || '/'}
                className="hover:text-primary-container transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span className="text-on-surface/80 truncate max-w-[200px] sm:max-w-none">
                {item.name}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ height: '50vh', minHeight: '300px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={signal.image}
          alt={signal.headline}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-extrabold tracking-tight leading-tight">
            {signal.headline}
          </h1>
        </div>
      </section>

      {/* ── Label bar ──────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center gap-3 border-b border-outline-variant/20">
        <span className="text-[10px] font-label uppercase tracking-[0.25em] text-primary-container font-bold">
          Beauty Signal
        </span>
        <span className="bg-primary-container/10 border border-primary-container/20 text-primary-container text-[9px] font-label uppercase tracking-[0.15em] px-3 py-1 rounded-full">
          {signal.category}
        </span>
        <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/40 ml-auto">
          {signal.source.name}
          {formattedDate ? ` · ${formattedDate}` : ''}
        </span>
      </div>

      {/* ── Article body ───────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12 py-12">

        {/* Section: O Sinal */}
        <section>
          <h2 className="font-headline font-bold text-2xl tracking-tight mb-4">
            O Sinal
          </h2>
          <p className="text-on-surface-variant leading-relaxed text-base">
            {signal.body.signal}
          </p>
        </section>

        {/* Section: O que está a mudar */}
        <section>
          <h2 className="font-headline font-bold text-2xl tracking-tight mb-4">
            O que está a mudar
          </h2>
          <p className="text-on-surface-variant leading-relaxed text-base">
            {signal.body.whatIsChanging}
          </p>
        </section>

        {/* Highlighted block: Angola */}
        <section className="bg-[#0e0e0e] border border-primary-container/15 border-l-4 border-l-primary-container rounded-2xl p-8">
          <p className="text-[10px] font-label uppercase tracking-[0.2em] text-primary-container mb-4 font-bold">
            Angola em Foco
          </p>
          <p className="text-on-surface leading-relaxed text-base">
            {signal.body.angola}
          </p>
        </section>

        {/* Section: A Oportunidade */}
        <section>
          <h2 className="font-headline font-bold text-2xl tracking-tight mb-4">
            A Oportunidade
          </h2>
          <p className="text-on-surface-variant leading-relaxed text-base">
            {signal.body.opportunity}
          </p>
        </section>

        {/* CTA */}
        <div className="pt-4">
          <Link
            href={signal.cta.href}
            className="volcanic-gradient text-on-primary px-10 py-5 rounded-full font-bold text-base inline-flex items-center gap-3 shadow-[0_20px_40px_-10px_rgba(255,145,86,0.35)] hover:shadow-[0_24px_48px_-10px_rgba(255,145,86,0.45)] transition-shadow active:scale-95 transition-transform"
          >
            {signal.cta.label}
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        {/* Source attribution */}
        <div className="pt-4 border-t border-outline-variant/20">
          <p className="text-xs text-on-surface-variant/50 font-label">
            Fonte:{' '}
            <a
              href={signal.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-container transition-colors underline underline-offset-2"
            >
              {signal.source.name}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
