import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/pro/',
          '/s/',
          '/product/',
          '/trend/',
          '/tag/',
          '/barza-insights/',
        ],
        disallow: [
          '/api/',
          '/community/',
          '/profile/',
          '/_next/',
        ],
      },
    ],
    sitemap: 'https://barza.app/sitemap.xml',
    host: 'https://barza.app',
  }
}
