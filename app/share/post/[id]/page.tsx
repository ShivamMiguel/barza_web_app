import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://barza.ao'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('content, created_at, user:profiles(full_name)')
    .eq('id', id)
    .single()

  if (!post) {
    return { title: 'Barza' }
  }

  const lines = (post.content as string).split('\n').filter(Boolean)
  const rawTitle = lines[0]?.replace(/\*\*/g, '') ?? 'Post no Barza'
  const description =
    lines.slice(1).join(' ').slice(0, 160) ||
    'Descubra os melhores profissionais de beleza e barbearia em Angola.'

  const authorName = (post.user as any)?.full_name ?? ''
  const ogImageUrl = `${APP_URL}/api/og?title=${encodeURIComponent(rawTitle)}&author=${encodeURIComponent(authorName)}`

  return {
    title: `${rawTitle} | Barza`,
    description,
    openGraph: {
      title: rawTitle,
      description,
      type: 'article',
      url: `${APP_URL}/share/post/${id}`,
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
    <div
      style={{ background: '#0e0e0e', minHeight: '100vh' }}
      className="flex items-center justify-center p-6"
    >
      <div className="w-full max-w-lg">
        {/* Barza Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-8 h-8 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #ff9156, #ff4757)' }}
          />
          <span
            className="text-xl font-black tracking-tighter"
            style={{ color: '#ff9156' }}
          >
            BARZA
          </span>
        </div>

        {/* Post Card */}
        <div
          className="rounded-3xl overflow-hidden border shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #1a1a1a, #111)',
            borderColor: 'rgba(255,145,86,0.1)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,145,86,0.05)',
          }}
        >
          {/* Top accent */}
          <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(90deg, #ff9156, #ff4757)' }}
          />

          <div className="p-8">
            {/* Author */}
            {author && (
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #ff9156, #ff4757)' }}
                >
                  {(author.full_name as string)?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{author.full_name}</p>
                  {author.role_profile && (
                    <p
                      className="text-[10px] uppercase tracking-widest font-bold"
                      style={{ color: 'rgba(255,145,86,0.6)' }}
                    >
                      {author.role_profile}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <h1
              className="text-3xl font-black leading-tight mb-4"
              style={{ color: '#ffffff', letterSpacing: '-0.03em' }}
            >
              {title}
            </h1>

            {/* Body */}
            {body && (
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {body.slice(0, 300)}{body.length > 300 ? '…' : ''}
              </p>
            )}

            {/* Stats row */}
            {post && (
              <div
                className="flex items-center gap-6 py-4 border-t border-b mb-6"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="material-symbols-outlined text-lg">favorite</span>
                  <span className="text-sm font-semibold">{post.likes_count}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="material-symbols-outlined text-lg">chat_bubble</span>
                  <span className="text-sm font-semibold">{post.comments_count}</span>
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              href="/community"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-sm text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #ff9156, #ff4757)' }}
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
              Ver no Barza
            </Link>
          </div>
        </div>

        <p
          className="text-center mt-6 text-xs uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          A comunidade de beleza de Angola
        </p>
      </div>
    </div>
  )
}
