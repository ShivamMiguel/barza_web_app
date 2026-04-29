import type { Metadata } from 'next'

// ─── Constants ────────────────────────────────────────────────────────────────

export const SITE_URL = 'https://barza.app'
export const SITE_NAME = 'Barza'
export const SITE_DESCRIPTION =
  'Barza é a plataforma de beleza que une comunidade, profissionais e produtos num só lugar — descobre tendências, marca serviços e compra com confiança.'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Builds an absolute canonical URL from a relative path.
 * @example canonical('/pro/ana-costa') → 'https://barza.app/pro/ana-costa'
 */
export function canonical(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

/**
 * Builds a formatted page title.
 * @example pageTitle('Manicure em Luanda') → 'Manicure em Luanda | Barza'
 */
export function pageTitle(title: string): string {
  return `${title} | ${SITE_NAME}`
}

/**
 * Builds base OpenGraph fields to be spread into a page's `metadata.openGraph`.
 */
export function baseOG(opts: {
  title: string
  description: string
  path: string
  image?: string
}): Metadata['openGraph'] {
  const { title, description, path, image } = opts
  return {
    title,
    description,
    url: canonical(path),
    siteName: SITE_NAME,
    locale: 'pt_AO',
    type: 'website',
    images: [
      {
        url: image ?? '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  }
}

/**
 * Builds Twitter card fields to be spread into a page's `metadata.twitter`.
 */
export function twitterCard(opts: {
  title: string
  description: string
  image?: string
}): Metadata['twitter'] {
  const { title, description, image } = opts
  return {
    card: 'summary_large_image',
    site: '@barzaapp',
    title,
    description,
    images: [image ?? '/og-default.jpg'],
  }
}
