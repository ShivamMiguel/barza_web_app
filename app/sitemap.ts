import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// ─── Mock stubs ───────────────────────────────────────────────────────────────
// TODO: replace each stub with the real DB / API query when the data layer is ready.

/** @stub replace with `db.professional.findMany({ select: { slug: true } })` */
const mockProfessionalSlugs: string[] = [
  'ana-costa-manicure',
  'khalid-barber-studio',
  'sofia-beauty-luanda',
]

/** @stub replace with a cross-product query of services × cities from the DB */
const mockServiceCityCombinations: Array<{ service: string; city: string }> = [
  { service: 'manicure', city: 'luanda' },
  { service: 'corte-cabelo', city: 'luanda' },
  { service: 'extensoes-pestanas', city: 'benguela' },
  { service: 'barbeiro', city: 'lubango' },
]

/** @stub replace with `db.product.findMany({ select: { slug: true } })` */
const mockProductSlugs: string[] = [
  'oleo-argan-marroquino',
  'kit-manicure-profissional',
  'shampoo-hidratante-cachos',
]

/** @stub replace with `db.trend.findMany({ select: { slug: true } })` */
const mockTrendSlugs: string[] = [
  'nail-art-tendencias-2025',
  'cabelo-afro-cuidados',
]

// ─── Sitemap ──────────────────────────────────────────────────────────────────

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── Static routes ──────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/barza-insights`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // ── Professionals: /pro/[slug] ─────────────────────────────────────────────
  // TODO: replace mockProfessionalSlugs with a real DB query.
  const professionalRoutes: MetadataRoute.Sitemap = mockProfessionalSlugs.map(
    (slug) => ({
      url: `${SITE_URL}/pro/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  )

  // ── Services by city: /s/[service]-[city] ─────────────────────────────────
  // TODO: replace mockServiceCityCombinations with a real DB query.
  const serviceRoutes: MetadataRoute.Sitemap = mockServiceCityCombinations.map(
    ({ service, city }) => ({
      url: `${SITE_URL}/s/${service}-${city}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  )

  // ── Products: /product/[slug] ──────────────────────────────────────────────
  // TODO: replace mockProductSlugs with a real DB query.
  const productRoutes: MetadataRoute.Sitemap = mockProductSlugs.map((slug) => ({
    url: `${SITE_URL}/product/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // ── Trends: /trend/[slug] ─────────────────────────────────────────────────
  // TODO: replace mockTrendSlugs with a real DB query.
  const trendRoutes: MetadataRoute.Sitemap = mockTrendSlugs.map((slug) => ({
    url: `${SITE_URL}/trend/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...professionalRoutes,
    ...serviceRoutes,
    ...productRoutes,
    ...trendRoutes,
  ]
}
