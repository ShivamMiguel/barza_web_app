import * as cheerio from 'cheerio'
import type { BeautySignal, RawArticle } from './types'
import { transformArticles } from './transform'

// ── Config ─────────────────────────────────────────────────────────────────────

const FEEDS = [
  { url: 'https://www.allure.com/feed/rss',   sourceName: 'Allure' },
  { url: 'https://wwd.com/feed/',              sourceName: 'WWD' },
  { url: 'https://beautymatter.com/feed',      sourceName: 'Beauty Matter' },
]

const MAX_ITEMS_PER_FEED = 4
const CACHE_TTL_MS       = 60 * 60 * 1000 // 1 hour
const FALLBACK_IMAGE     =
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80'

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (compatible; BarzaSignalBot/1.0; +https://barza.app)',
  'Accept': 'application/rss+xml, application/xml, text/xml',
}

// ── In-memory cache ────────────────────────────────────────────────────────────

const cache: { data: BeautySignal[] | null; ts: number } = {
  data: null,
  ts:   0,
}

// ── HTML stripping ─────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

// ── Image extraction from HTML snippet ────────────────────────────────────────

function extractImgSrc(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match ? match[1] ?? null : null
}

// ── Single-feed scraper ────────────────────────────────────────────────────────

async function scrapeFeed(
  feedUrl: string,
  sourceName: string,
): Promise<RawArticle[]> {
  const res = await fetch(feedUrl, { headers: FETCH_HEADERS, cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Feed ${feedUrl} responded with status ${res.status}`)
  }

  const xml = await res.text()
  const $   = cheerio.load(xml, { xmlMode: true })

  const articles: RawArticle[] = []

  $('item').each((_i, el) => {
    if (articles.length >= MAX_ITEMS_PER_FEED) return false

    const $item = $(el)

    const title       = $item.find('title').first().text().trim()
    const rawDesc     = $item.find('description').first().text()
    const description = stripHtml(rawDesc).slice(0, 300)

    // URL: prefer <link>, fallback to <guid>
    const url =
      $item.find('link').first().text().trim() ||
      $item.find('guid').first().text().trim()

    // Image: media:content → enclosure → first <img> in description HTML
    const image =
      $item.find('media\\:content').attr('url') ??
      $item.find('enclosure').attr('url')       ??
      extractImgSrc(rawDesc)                    ??
      FALLBACK_IMAGE

    const publishedAt = $item.find('pubDate').first().text().trim()

    if (title && url) {
      articles.push({ title, description, url, image, publishedAt, sourceName })
    }
  })

  return articles
}

// ── scrapeAll ──────────────────────────────────────────────────────────────────

export async function scrapeAll(): Promise<BeautySignal[]> {
  const results = await Promise.allSettled(
    FEEDS.map((feed) => scrapeFeed(feed.url, feed.sourceName)),
  )

  const rawArticles: RawArticle[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') {
      rawArticles.push(...result.value)
    }
    // silently skip failed feeds
  }

  const signals = transformArticles(rawArticles)
  return signals
}

// ── getSignals (with cache) ────────────────────────────────────────────────────

export async function getSignals(): Promise<BeautySignal[]> {
  const now = Date.now()
  if (cache.data !== null && now - cache.ts < CACHE_TTL_MS) {
    return cache.data
  }

  try {
    const signals  = await scrapeAll()
    cache.data = signals
    cache.ts   = now
    return signals
  } catch {
    // If scraping completely fails, return cached stale data or []
    return cache.data ?? []
  }
}
