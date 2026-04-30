import { describe, it, expect } from 'vitest'
import { transformArticles } from '@/lib/beauty-signals/transform'
import type { RawArticle } from '@/lib/beauty-signals/types'

// ── Mock articles ──────────────────────────────────────────────────────────────

const BEAUTY_ARTICLE: RawArticle = {
  title: 'Glow Skin Revolution: The Skincare Trends Dominating 2025 | Allure',
  description:
    'The skincare world is shifting. New glow serums and SPF innovations are redefining how we think about radiant skin. Brands are racing to launch the next viral moisturiser.',
  url: 'https://www.allure.com/story/glow-skin-revolution',
  image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  publishedAt: 'Mon, 01 Jan 2024 00:00:00 GMT',
  sourceName: 'Allure',
}

const MARKET_ARTICLE: RawArticle = {
  title: 'Beauty Industry Revenue Growth Hits Record $580 Billion | WWD',
  description:
    'The beauty market is experiencing explosive revenue growth as major brands launch new lines. Industry analysts predict continued expansion into emerging markets.',
  url: 'https://wwd.com/beauty/market-growth',
  image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  publishedAt: 'Tue, 02 Jan 2024 00:00:00 GMT',
  sourceName: 'WWD',
}

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('transformArticles()', () => {
  it('returns an array of BeautySignals', () => {
    const result = transformArticles([BEAUTY_ARTICLE])
    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(1)
  })

  it('returns empty array for empty input', () => {
    const result = transformArticles([])
    expect(result).toEqual([])
  })

  it('each signal has all required fields', () => {
    const [signal] = transformArticles([BEAUTY_ARTICLE])

    expect(signal).toHaveProperty('id')
    expect(signal).toHaveProperty('slug')
    expect(signal).toHaveProperty('headline')
    expect(signal).toHaveProperty('subtext')
    expect(signal).toHaveProperty('category')
    expect(signal).toHaveProperty('image')
    expect(signal).toHaveProperty('body')
    expect(signal.body).toHaveProperty('signal')
    expect(signal.body).toHaveProperty('whatIsChanging')
    expect(signal.body).toHaveProperty('angola')
    expect(signal.body).toHaveProperty('opportunity')
    expect(signal).toHaveProperty('cta')
    expect(signal.cta).toHaveProperty('label')
    expect(signal.cta).toHaveProperty('href')
    expect(signal).toHaveProperty('source')
    expect(signal.source).toHaveProperty('name')
    expect(signal.source).toHaveProperty('url')
    expect(signal.source).toHaveProperty('publishedAt')
    expect(signal).toHaveProperty('scrapedAt')
  })

  it('slug is URL-safe (only lowercase letters, digits, hyphens)', () => {
    const [signal] = transformArticles([BEAUTY_ARTICLE])
    expect(signal.slug).toMatch(/^[a-z0-9-]+$/)
  })

  it('slug does not start or end with a hyphen', () => {
    const [signal] = transformArticles([BEAUTY_ARTICLE])
    expect(signal.slug).not.toMatch(/^-|-$/)
  })

  it('slug is max 60 characters', () => {
    const [signal] = transformArticles([BEAUTY_ARTICLE])
    expect(signal.slug.length).toBeLessThanOrEqual(60)
  })

  it('detects Trend category from skincare/glow keywords', () => {
    const [signal] = transformArticles([BEAUTY_ARTICLE])
    expect(signal.category).toBe('Trend')
  })

  it('detects Mercado category from market/revenue keywords', () => {
    const [signal] = transformArticles([MARKET_ARTICLE])
    expect(signal.category).toBe('Mercado')
  })

  it('defaults to Oportunidade when no keywords match', () => {
    const noKeyword: RawArticle = {
      ...BEAUTY_ARTICLE,
      title: 'Something completely unrelated',
      description: 'A totally generic article with no beauty keywords whatsoever.',
    }
    const [signal] = transformArticles([noKeyword])
    expect(signal.category).toBe('Oportunidade')
  })

  it('angola body is never empty', () => {
    const results = transformArticles([BEAUTY_ARTICLE, MARKET_ARTICLE])
    for (const signal of results) {
      expect(signal.body.angola.length).toBeGreaterThan(0)
    }
  })

  it('headline strips source suffix from title', () => {
    const [signal] = transformArticles([BEAUTY_ARTICLE])
    // "| Allure" should be removed
    expect(signal.headline).not.toContain('| Allure')
    expect(signal.headline).not.toContain('Allure')
  })

  it('headline is max 80 characters', () => {
    const longTitle: RawArticle = {
      ...BEAUTY_ARTICLE,
      title: 'A'.repeat(100),
    }
    const [signal] = transformArticles([longTitle])
    expect(signal.headline.length).toBeLessThanOrEqual(80)
  })

  it('CTA label matches Trend category mapping', () => {
    const [signal] = transformArticles([BEAUTY_ARTICLE])
    expect(signal.category).toBe('Trend')
    expect(signal.cta.label).toBe('Explorar Tendências')
  })

  it('CTA label matches Mercado category mapping', () => {
    const [signal] = transformArticles([MARKET_ARTICLE])
    expect(signal.category).toBe('Mercado')
    expect(signal.cta.label).toBe('Ver Produtos')
  })

  it('source fields are mapped correctly', () => {
    const [signal] = transformArticles([BEAUTY_ARTICLE])
    expect(signal.source.name).toBe('Allure')
    expect(signal.source.url).toBe(BEAUTY_ARTICLE.url)
    expect(signal.source.publishedAt).toBe(BEAUTY_ARTICLE.publishedAt)
  })

  it('scrapedAt is a valid ISO 8601 date string', () => {
    const [signal] = transformArticles([BEAUTY_ARTICLE])
    expect(() => new Date(signal.scrapedAt)).not.toThrow()
    expect(new Date(signal.scrapedAt).toISOString()).toBe(signal.scrapedAt)
  })

  it('handles multiple articles and returns same count', () => {
    const results = transformArticles([BEAUTY_ARTICLE, MARKET_ARTICLE])
    expect(results).toHaveLength(2)
  })
})
