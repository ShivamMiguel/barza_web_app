import { describe, it, expect } from 'vitest'
import {
  schemaProfessional,
  schemaProduct,
  schemaServicePage,
  schemaBreadcrumb,
  schemaWebSite,
  schemaOrganization,
} from '@/lib/schema'
import { SITE_URL } from '@/lib/seo'

const proProp = {
  name: 'Carlos Fade',
  slug: 'carlos-fade-luanda',
  specialty: 'Barbearia',
  city: 'Luanda',
  bio: 'Master barber',
  image: 'https://example.com/photo.jpg',
  rating: 4.9,
  reviewCount: 120,
  priceRange: '$$',
  url: `${SITE_URL}/pro/carlos-fade-luanda`,
}

describe('schemaProfessional()', () => {
  it('has @context https://schema.org', () => {
    const s = schemaProfessional(proProp)
    expect(s['@context']).toBe('https://schema.org')
  })

  it('has @type LocalBusiness', () => {
    expect(schemaProfessional(proProp)['@type']).toBe('LocalBusiness')
  })

  it('includes aggregateRating with correct values', () => {
    const s = schemaProfessional(proProp) as {
      aggregateRating: { ratingValue: number; reviewCount: number }
    }
    expect(s.aggregateRating.ratingValue).toBe(4.9)
    expect(s.aggregateRating.reviewCount).toBe(120)
  })

  it('sets addressCountry to AO', () => {
    const s = schemaProfessional(proProp) as {
      address: { addressCountry: string }
    }
    expect(s.address.addressCountry).toBe('AO')
  })

  it('@id contains the slug', () => {
    const s = schemaProfessional(proProp) as { '@id': string }
    expect(s['@id']).toContain('carlos-fade-luanda')
  })
})

describe('schemaProduct()', () => {
  const prod = {
    name: 'Obsidian Beard Oil',
    description: 'Premium beard oil',
    price: 32,
    currency: 'USD',
    image: 'https://example.com/oil.jpg',
    rating: 4.7,
    reviewCount: 85,
    url: `${SITE_URL}/product/obsidian-beard-oil`,
    availability: 'InStock' as const,
  }

  it('has @type Product', () => {
    expect(schemaProduct(prod)['@type']).toBe('Product')
  })

  it('offer availability maps to schema.org URI', () => {
    const s = schemaProduct(prod) as { offers: { availability: string } }
    expect(s.offers.availability).toBe('https://schema.org/InStock')
  })

  it('out of stock maps correctly', () => {
    const s = schemaProduct({ ...prod, availability: 'OutOfStock' }) as {
      offers: { availability: string }
    }
    expect(s.offers.availability).toBe('https://schema.org/OutOfStock')
  })

  it('price is a number', () => {
    const s = schemaProduct(prod) as { offers: { price: number } }
    expect(s.offers.price).toBe(32)
  })
})

describe('schemaServicePage()', () => {
  const svc = {
    name: 'Barbeiros em Luanda',
    description: 'Os melhores barbeiros de Luanda',
    url: `${SITE_URL}/s/barbeiros-luanda`,
    city: 'Luanda',
  }

  it('has @type Service', () => {
    expect(schemaServicePage(svc)['@type']).toBe('Service')
  })

  it('areaServed city matches', () => {
    const s = schemaServicePage(svc) as {
      areaServed: { name: string }
    }
    expect(s.areaServed.name).toBe('Luanda')
  })

  it('provider name is Barza', () => {
    const s = schemaServicePage(svc) as {
      provider: { name: string }
    }
    expect(s.provider.name).toBe('Barza')
  })
})

describe('schemaBreadcrumb()', () => {
  const items = [
    { name: 'Início', url: SITE_URL },
    { name: 'Barbeiros', url: `${SITE_URL}/s/barbeiros-luanda` },
    { name: 'Carlos Fade', url: `${SITE_URL}/pro/carlos-fade` },
  ]

  it('has @type BreadcrumbList', () => {
    expect(schemaBreadcrumb(items)['@type']).toBe('BreadcrumbList')
  })

  it('position is 1-indexed', () => {
    const s = schemaBreadcrumb(items) as {
      itemListElement: { position: number; name: string }[]
    }
    expect(s.itemListElement[0].position).toBe(1)
    expect(s.itemListElement[2].position).toBe(3)
  })

  it('has correct item count', () => {
    const s = schemaBreadcrumb(items) as { itemListElement: unknown[] }
    expect(s.itemListElement).toHaveLength(3)
  })

  it('first item is Início', () => {
    const s = schemaBreadcrumb(items) as {
      itemListElement: { name: string }[]
    }
    expect(s.itemListElement[0].name).toBe('Início')
  })
})

describe('schemaWebSite()', () => {
  it('has @type WebSite', () => {
    expect(schemaWebSite()['@type']).toBe('WebSite')
  })

  it('@id ends with /#website', () => {
    const s = schemaWebSite() as { '@id': string }
    expect(s['@id']).toMatch(/#website$/)
  })

  it('has a SearchAction potentialAction', () => {
    const s = schemaWebSite() as {
      potentialAction: { '@type': string; 'query-input': string }
    }
    expect(s.potentialAction['@type']).toBe('SearchAction')
    expect(s.potentialAction['query-input']).toContain('required')
  })
})

describe('schemaOrganization()', () => {
  it('has @type Organization', () => {
    expect(schemaOrganization()['@type']).toBe('Organization')
  })

  it('@id ends with /#organization', () => {
    const s = schemaOrganization() as { '@id': string }
    expect(s['@id']).toMatch(/#organization$/)
  })

  it('has at least one sameAs entry', () => {
    const s = schemaOrganization() as { sameAs: string[] }
    expect(s.sameAs.length).toBeGreaterThan(0)
  })

  it('foundingLocation is in Angola', () => {
    const s = schemaOrganization() as {
      foundingLocation: { address: { addressCountry: string } }
    }
    expect(s.foundingLocation.address.addressCountry).toBe('AO')
  })
})
