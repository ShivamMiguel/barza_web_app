import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo'

// ─── Professional / LocalBusiness ─────────────────────────────────────────────

/**
 * Schema.org `LocalBusiness` + `Person` composite for a beauty professional.
 * Maps to /pro/[slug] pages.
 */
export function schemaProfessional(pro: {
  name: string
  slug: string
  specialty: string
  city: string
  bio: string
  image: string
  rating: number
  reviewCount: number
  priceRange: string
  url: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/pro/${pro.slug}#business`,
    name: pro.name,
    description: pro.bio,
    image: pro.image,
    url: pro.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: pro.city,
      addressCountry: 'AO',
    },
    priceRange: pro.priceRange,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: pro.specialty,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: pro.rating,
      reviewCount: pro.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

// ─── Product ──────────────────────────────────────────────────────────────────

/**
 * Schema.org `Product` for the shop/product pages.
 * Maps to /product/[slug] pages.
 */
export function schemaProduct(product: {
  name: string
  description: string
  price: number
  currency: string
  image: string
  rating: number
  reviewCount: number
  url: string
  availability: 'InStock' | 'OutOfStock'
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      url: product.url,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

// ─── Service Page ─────────────────────────────────────────────────────────────

/**
 * Schema.org `Service` for city-scoped service landing pages.
 * Maps to /s/[service]-[city] pages.
 */
export function schemaServicePage(opts: {
  name: string
  description: string
  url: string
  city: string
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'City',
      name: opts.city,
    },
  }
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

/**
 * Schema.org `BreadcrumbList` for any page with a visible breadcrumb trail.
 * @example
 * schemaBreadcrumb([
 *   { name: 'Home', url: 'https://barza.app' },
 *   { name: 'Manicure', url: 'https://barza.app/s/manicure-luanda' },
 * ])
 */
export function schemaBreadcrumb(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ─── WebSite (SiteLinksSearchBox) ─────────────────────────────────────────────

/**
 * Schema.org `WebSite` with a `SearchAction` (SiteLinksSearchBox) for barza.app.
 * Used in the root layout so Google can surface the search box in SERPs.
 */
export function schemaWebSite(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'pt-AO',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/s/{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// ─── Organization ─────────────────────────────────────────────────────────────

/**
 * Schema.org `Organization` for barza.app.
 * Used in the root layout for brand knowledge graph signals.
 */
export function schemaOrganization(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    description: SITE_DESCRIPTION,
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Luanda',
        addressCountry: 'AO',
      },
    },
    sameAs: [
      'https://www.instagram.com/barzaapp',
      'https://www.tiktok.com/@barzaapp',
      'https://twitter.com/barzaapp',
    ],
  }
}
