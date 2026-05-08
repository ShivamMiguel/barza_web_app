import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

async function getBaseUrl(): Promise<string> {
  const h = await headers()
  const host = h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const [supabase, baseUrl] = await Promise.all([createClient(), getBaseUrl()])

  const { data: post } = await supabase
    .from('posts')
    .select('content, created_at, user:profiles(full_name, role_profile)')
    .eq('id', id)
    .single()

  if (!post) return { title: 'Barza — Comunidade de Beleza' }

  const lines = (post.content as string).split('\n').filter(Boolean)
  const rawTitle = lines[0]?.replace(/\*\*/g, '') ?? 'Post no Barza'
  const description =
    lines.slice(1).join(' ').slice(0, 160) ||
    'Descubra os melhores profissionais de beleza e barbearia em Angola na Barza.'

  const author = (post.user as any)
  const ogParams = new URLSearchParams({
    title: rawTitle,
    author: author?.full_name ?? '',
    role: author?.role_profile ?? '',
  })
  const ogImageUrl = `${baseUrl}/api/og?${ogParams.toString()}`
  const pageUrl = `${baseUrl}/share/post/${id}`

  return {
    title: `${rawTitle} | Barza`,
    description,
    openGraph: {
      title: rawTitle,
      description,
      type: 'article',
      url: pageUrl,
      siteName: 'Barza',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: rawTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: rawTitle,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function SharePostPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('id, content, created_at, likes_count, comments_count, user:profiles(full_name, avatar_url, role_profile)')
    .eq('id', id)
    .single()

  const lines = post ? (post.content as string).split('\n').filter(Boolean) : []
  const title = lines[0]?.replace(/\*\*/g, '') ?? 'Post não encontrado'
  const body = lines.slice(1).join('\n')
  const author = post ? (post.user as any) : null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#0a0a0a' }}>
      {/* Background glow */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at top right, rgba(255,145,86,0.08) 0%, transparent 60%)' }}
      />
      <div
        className="fixed bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(circle at bottom left, rgba(255,71,87,0.05) 0%, transparent 60%)' }}
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
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em] ml-1 mt-1"
            style={{ color: 'rgba(255,145,86,0.4)' }}
          >
            Community
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
          {/* Orange top bar */}
          <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #ff9156 0%, #ff4757 50%, #ff9156 100%)' }} />

          <div className="p-7">
            {/* Author */}
            {author && (
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ff9156, #ff4757)', boxShadow: '0 0 0 3px rgba(255,145,86,0.2)' }}
                >
                  {(author.full_name as string)?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <p className="font-bold text-sm text-white leading-tight">{author.full_name}</p>
                  {author.role_profile && (
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#ff9156', opacity: 0.7 }}>
                      {author.role_profile}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl font-black leading-tight mb-3 text-white" style={{ letterSpacing: '-0.025em' }}>
              {title}
            </h1>

            {/* Body */}
            {body && (
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {body.length > 260 ? body.slice(0, 260) + '…' : body}
              </p>
            )}

            {/* Stats */}
            {post && (
              <div className="flex items-center gap-5 py-4 mb-6 border-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1", color: '#ff4757' }}>favorite</span>
                  <span className="text-xs font-bold">{post.likes_count}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <span className="material-symbols-outlined text-base">chat_bubble</span>
                  <span className="text-xs font-bold">{post.comments_count}</span>
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              href="/community"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm text-white transition-all active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #ff9156 0%, #ff4757 100%)', boxShadow: '0 8px 32px rgba(255,145,86,0.3)' }}
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
              Ver no Barza
            </Link>
          </div>
        </div>

        <p className="text-center mt-6 text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.15)' }}>
          A comunidade de beleza de Angola
        </p>
      </div>
    </div>
  )
}
