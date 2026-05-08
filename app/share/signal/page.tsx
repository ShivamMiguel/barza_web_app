import { headers } from 'next/headers'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ title?: string; description?: string; image?: string; source?: string; url?: string; category?: string }>
}

async function getBaseUrl(): Promise<string> {
  const h = await headers()
  const host = h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams
  const title = sp.title ?? 'Tendências de Beleza | Barza'
  const description = sp.description ?? 'Descubra as últimas tendências de beleza e barbearia em Angola na Barza.'
  const category = sp.category ?? ''
  const source = sp.source ?? ''
  const baseUrl = await getBaseUrl()

  const ogParams = new URLSearchParams({ title, category: category || source })
  const ogImageUrl = `${baseUrl}/api/og?${ogParams.toString()}`
  const pageUrl = `${baseUrl}/share/signal?${new URLSearchParams(sp as Record<string, string>).toString()}`

  return {
    title: `${title} | Barza`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: pageUrl,
      siteName: 'Barza',
      images: sp.image
        ? [
            { url: sp.image, width: 1200, height: 630, alt: title },
            { url: ogImageUrl, width: 1200, height: 630, alt: title },
          ]
        : [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [sp.image ?? ogImageUrl],
    },
  }
}

export default async function ShareSignalPage({ searchParams }: Props) {
  const sp = await searchParams
  const title = sp.title ?? 'Sinal de Beleza'
  const description = sp.description ?? ''
  const image = sp.image ?? ''
  const source = sp.source ?? ''
  const externalUrl = sp.url ?? '/community'
  const category = sp.category ?? ''

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#0a0a0a' }}>
      {/* Background glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, rgba(255,145,86,0.08) 0%, transparent 60%)' }}
      />

      <div className="relative w-full max-w-md">
        {/* Barza Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ff9156, #ff4757)' }}
          >
            <div className="w-4 h-4 rounded-full bg-white opacity-90" />
          </div>
          <span className="text-2xl font-black tracking-tighter" style={{ color: '#ff9156' }}>
            BARZA
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] ml-1 mt-1" style={{ color: 'rgba(255,145,86,0.4)' }}>
            Signal
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl overflow-hidden border"
          style={{
            background: 'linear-gradient(160deg, #1c1c1c 0%, #141414 100%)',
            borderColor: 'rgba(255,145,86,0.12)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #ff9156 0%, #ff4757 50%, #ff9156 100%)' }} />

          {/* Image */}
          {image && (
            <div className="w-full h-52 overflow-hidden">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-7">
            {/* Category + source */}
            <div className="flex items-center gap-2 mb-4">
              {category && (
                <span
                  className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: 'rgba(255,145,86,0.12)', color: '#ff9156' }}
                >
                  {category}
                </span>
              )}
              {source && (
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  via {source}
                </span>
              )}
            </div>

            <h1 className="text-xl font-black leading-tight mb-3 text-white" style={{ letterSpacing: '-0.02em' }}>
              {title}
            </h1>

            {description && (
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {description.length > 220 ? description.slice(0, 220) + '…' : description}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #ff9156 0%, #ff4757 100%)', boxShadow: '0 8px 32px rgba(255,145,86,0.3)' }}
              >
                <span className="material-symbols-outlined text-base">open_in_new</span>
                Ver Artigo Original
              </a>
              <Link
                href="/community"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm border transition-all"
                style={{ borderColor: 'rgba(255,145,86,0.25)', color: '#ff9156' }}
              >
                Entrar na Barza Community
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.15)' }}>
          A comunidade de beleza de Angola
        </p>
      </div>
    </div>
  )
}
