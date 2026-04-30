export type SignalCategory =
  | 'Trend'
  | 'Comportamento'
  | 'Mercado'
  | 'Cultura'
  | 'Oportunidade'

export type BeautySignal = {
  id: string
  slug: string           // kebab-case from headline
  headline: string       // short, impactful: "O brilho está de volta"
  subtext: string        // 1 sentence context
  category: SignalCategory
  image: string          // editorial image URL
  body: {
    signal: string       // global explanation (1 paragraph)
    whatIsChanging: string // 1-2 paragraphs
    angola: string       // Angola-specific block
    opportunity: string  // for barbers/creators/brands
  }
  cta: { label: string; href: string }
  source: { name: string; url: string; publishedAt: string }
  scrapedAt: string
}

export type RawArticle = {
  title: string
  description: string   // cleaned HTML stripped
  url: string
  image: string
  publishedAt: string
  sourceName: string
}
