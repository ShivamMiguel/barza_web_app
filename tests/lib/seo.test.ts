import { describe, it, expect } from 'vitest'
import {
  SITE_URL,
  SITE_NAME,
  canonical,
  pageTitle,
  baseOG,
  twitterCard,
} from '@/lib/seo'

describe('canonical()', () => {
  it('prepends SITE_URL to a relative path', () => {
    expect(canonical('/pro/carlos-fade')).toBe('https://barza.app/pro/carlos-fade')
  })

  it('adds a leading slash if missing', () => {
    expect(canonical('pro/carlos-fade')).toBe('https://barza.app/pro/carlos-fade')
  })

  it('handles root path', () => {
    expect(canonical('/')).toBe('https://barza.app/')
  })

  it('handles nested paths', () => {
    expect(canonical('/barza-insights/glow-2026')).toBe(
      'https://barza.app/barza-insights/glow-2026'
    )
  })
})

describe('pageTitle()', () => {
  it('appends site name with pipe separator', () => {
    expect(pageTitle('Manicure em Luanda')).toBe(`Manicure em Luanda | ${SITE_NAME}`)
  })

  it('works with single word titles', () => {
    expect(pageTitle('Home')).toBe(`Home | ${SITE_NAME}`)
  })
})

describe('baseOG()', () => {
  const opts = {
    title: 'Barbeiros em Luanda',
    description: 'Os melhores barbeiros',
    path: '/s/barbeiros-luanda',
  }

  it('returns a url using canonical()', () => {
    const og = baseOG(opts)
    expect((og as { url: string }).url).toBe(`${SITE_URL}/s/barbeiros-luanda`)
  })

  it('defaults OG image to /og-default.jpg when not provided', () => {
    const og = baseOG(opts) as { images: { url: string }[] }
    expect(og.images[0].url).toBe('/og-default.jpg')
  })

  it('uses the provided image when supplied', () => {
    const og = baseOG({ ...opts, image: '/custom-og.jpg' }) as {
      images: { url: string }[]
    }
    expect(og.images[0].url).toBe('/custom-og.jpg')
  })

  it('sets siteName to Barza', () => {
    const og = baseOG(opts) as { siteName: string }
    expect(og.siteName).toBe(SITE_NAME)
  })

  it('sets locale to pt_AO', () => {
    const og = baseOG(opts) as { locale: string }
    expect(og.locale).toBe('pt_AO')
  })
})

describe('twitterCard()', () => {
  const opts = { title: 'Barza', description: 'A beleza é presença' }

  it('returns summary_large_image card type', () => {
    const tw = twitterCard(opts) as { card: string }
    expect(tw.card).toBe('summary_large_image')
  })

  it('defaults image to /og-default.jpg', () => {
    const tw = twitterCard(opts) as { images: string[] }
    expect(tw.images[0]).toBe('/og-default.jpg')
  })

  it('sets @barzaapp as the site handle', () => {
    const tw = twitterCard(opts) as { site: string }
    expect(tw.site).toBe('@barzaapp')
  })
})
