import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Barza'
  const author = searchParams.get('author') ?? ''
  const role = searchParams.get('role') ?? ''
  const category = searchParams.get('category') ?? ''
  const source = searchParams.get('source') ?? ''

  const shortTitle = title.length > 72 ? title.slice(0, 72) + '…' : title
  const fontSize = title.length > 50 ? 52 : title.length > 30 ? 64 : 72

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          background: '#0e0e0e',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* ── Background texture ── */}
        {/* Radial glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-100px',
            width: '700px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,145,86,0.18) 0%, rgba(255,71,87,0.08) 40%, transparent 70%)',
          }}
        />
        {/* Radial glow bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,71,87,0.1) 0%, transparent 65%)',
          }}
        />
        {/* Subtle grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* ── Top orange bar ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #ff9156 0%, #ff4757 50%, #ff9156 100%)',
          }}
        />

        {/* ── Left accent stripe ── */}
        <div
          style={{
            position: 'absolute',
            left: '72px',
            top: '5px',
            bottom: 0,
            width: '3px',
            background: 'linear-gradient(180deg, #ff9156 0%, rgba(255,145,86,0.1) 100%)',
          }}
        />

        {/* ── Content ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px 60px 104px',
            height: '100%',
            width: '100%',
          }}
        >
          {/* Header: Barza brand + category/source */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Logo mark */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #ff9156, #ff4757)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(255,145,86,0.4)',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.95)',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#ff9156',
                  letterSpacing: '-1.5px',
                }}
              >
                BARZA
              </span>
            </div>

            {/* Category / source badge */}
            {(category || source) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,145,86,0.1)',
                  border: '1px solid rgba(255,145,86,0.25)',
                  borderRadius: '999px',
                  padding: '8px 20px',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#ff9156',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                  }}
                >
                  {category || source}
                </span>
              </div>
            )}
          </div>

          {/* Title — main focus */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <p
              style={{
                fontSize: `${fontSize}px`,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.05,
                letterSpacing: '-2.5px',
                margin: 0,
                textShadow: '0 2px 40px rgba(255,145,86,0.15)',
              }}
            >
              {shortTitle}
            </p>
          </div>

          {/* Footer: author + domain */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {author ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Avatar circle */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff9156, #ff4757)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 900,
                    color: 'white',
                    boxShadow: '0 0 0 3px rgba(255,145,86,0.25)',
                  }}
                >
                  {author.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>
                    {author}
                  </span>
                  {role && (
                    <span
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255,145,86,0.6)',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      {role}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div />
            )}

            <span
              style={{
                fontSize: '16px',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              barza.ao
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
