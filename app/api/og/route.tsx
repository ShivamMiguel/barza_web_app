import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Barza'
  const author = searchParams.get('author') ?? ''
  const category = searchParams.get('category') ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#0e0e0e',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,145,86,0.15) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,71,87,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ff9156, #ff4757, #ff9156)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '64px',
          }}
        >
          {/* Barza brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff9156, #ff4757)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.9)',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '28px',
                fontWeight: '900',
                color: '#ff9156',
                letterSpacing: '-1px',
              }}
            >
              BARZA
            </span>
            {category && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'rgba(255,145,86,0.6)',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginLeft: '8px',
                  paddingTop: '4px',
                }}
              >
                · {category}
              </span>
            )}
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
            <p
              style={{
                fontSize: title.length > 60 ? '44px' : '56px',
                fontWeight: '900',
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-2px',
                margin: 0,
                maxWidth: '900px',
              }}
            >
              {title.length > 80 ? title.slice(0, 80) + '…' : title}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            {author && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff9156, #ff4757)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '900',
                    color: 'white',
                  }}
                >
                  {author.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>
                  {author}
                </span>
              </div>
            )}
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: '700',
              }}
            >
              barza.ao
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
