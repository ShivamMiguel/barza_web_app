import type { BeautySignal, RawArticle, SignalCategory } from './types'

// ── Category detection ─────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<SignalCategory, string[]> = {
  Trend: ['skincare', 'glow', 'skin', 'moistur', 'serum', 'spf', 'sunscreen'],
  Mercado: ['market', 'industry', 'revenue', 'growth', 'billion', 'brand', 'launch'],
  Comportamento: ['consumer', 'behaviour', 'shopping', 'prefer', 'habit', 'survey'],
  Cultura: ['africa', 'culture', 'identity', 'heritage', 'tradition', 'natural'],
  Oportunidade: [],
}

function detectCategory(title: string, description: string): SignalCategory {
  const text = `${title} ${description}`.toLowerCase()

  // Check categories in priority order (Oportunidade is the default)
  const ordered: SignalCategory[] = ['Trend', 'Mercado', 'Comportamento', 'Cultura']
  for (const cat of ordered) {
    if (CATEGORY_KEYWORDS[cat].some((kw) => text.includes(kw))) {
      return cat
    }
  }
  return 'Oportunidade'
}

// ── Angola context templates ───────────────────────────────────────────────────

const ANGOLA_CONTEXT: Record<SignalCategory, string> = {
  Trend:
    'Em Luanda, esta tendência já se faz sentir nos estúdios premium de Talatona e Miramar. Os profissionais que apostarem primeiro têm vantagem competitiva real.',
  Mercado:
    'O mercado angolano de beleza cresce a dois dígitos. Quem posicionar o seu negócio agora vai liderar quando o volume chegar.',
  Comportamento:
    'O consumidor angolano está cada vez mais informado e exigente — o digital acelerou este processo em menos de 3 anos.',
  Cultura:
    'Angola tem uma identidade estética única. À medida que o mundo olha para África, os profissionais locais têm uma narrativa autêntica que nenhuma marca global consegue replicar.',
  Oportunidade:
    'Para os profissionais angolanos que actuam agora, a janela está aberta. O mercado ainda tem espaço para quem construir reputação antes da saturação.',
}

// ── Opportunity templates ──────────────────────────────────────────────────────

const OPPORTUNITY: Record<SignalCategory, string> = {
  Trend:
    'Para barbeiros e esteticistas: incorporar esta tendência no menu de serviços agora, antes que se torne standard.',
  Mercado:
    'Para marcas e distribuidores: o momento de entrar no mercado angolano é antes do pico, não depois.',
  Comportamento:
    'Para criadores de conteúdo: este comportamento gera engagement real. Conteúdo que responde a este sinal vai crescer organicamente.',
  Cultura:
    'Para todos os profissionais: a narrativa cultural é o maior diferenciador. Use-a antes que as marcas globais a descubram.',
  Oportunidade:
    'Para empreendedores: identifica o nicho específico dentro desta oportunidade e domina-o.',
}

// ── What-is-changing bridging sentences ────────────────────────────────────────

const BRIDGING: Record<SignalCategory, string> = {
  Trend:
    'Esta mudança reflecte uma viragem cultural onde os consumidores priorizam a autenticidade e os resultados visíveis.',
  Mercado:
    'O cenário competitivo está a redefinir-se rapidamente, criando espaço para novos líderes de mercado.',
  Comportamento:
    'Os hábitos de consumo estão a evoluir de forma acelerada, impulsionados pelo acesso digital e pela exposição global.',
  Cultura:
    'O mundo está a olhar para África como fonte de inovação estética — e Angola está no centro desta narrativa.',
  Oportunidade:
    'Esta janela de oportunidade tem uma duração limitada: os primeiros a agir consolidarão vantagem difícil de replicar.',
}

// ── CTA config ─────────────────────────────────────────────────────────────────

const CTA: Record<SignalCategory, { label: string; href: string }> = {
  Trend:        { label: 'Explorar Tendências', href: '/community' },
  Mercado:      { label: 'Ver Produtos',         href: '/community' },
  Comportamento:{ label: 'Ver Profissionais',    href: '/s/barbeiros-luanda' },
  Cultura:      { label: 'Explorar Feed',        href: '/community' },
  Oportunidade: { label: 'Marcar Agora',         href: '/community' },
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function cleanHeadline(title: string): string {
  // Remove " | Source", " – Source", " - Source" suffixes
  return title
    .replace(/\s*[|–—-]\s*[^|–—-]+$/, '')
    .trim()
    .slice(0, 80)
}

function firstSentence(text: string, maxLen = 140): string {
  const parts = text.split(/\.\s+/)
  const sentence = parts[0]?.trim() ?? text.trim()
  const result = sentence.endsWith('.') ? sentence : `${sentence}.`
  return result.slice(0, maxLen)
}

function makeSlug(headline: string): string {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

// ── Main transform ─────────────────────────────────────────────────────────────

export function transformArticles(articles: RawArticle[]): BeautySignal[] {
  return articles.map((article, index) => {
    const category = detectCategory(article.title, article.description)
    const headline = cleanHeadline(article.title)
    const subtext  = firstSentence(article.description)
    const slug     = makeSlug(headline)

    const signalText = article.description.slice(0, 250).trim()

    const whatIsChanging =
      `${article.description.slice(0, 200).trim()} ${BRIDGING[category]}`.trim()

    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${index}`

    return {
      id,
      slug,
      headline,
      subtext,
      category,
      image: article.image,
      body: {
        signal: signalText,
        whatIsChanging,
        angola:      ANGOLA_CONTEXT[category],
        opportunity: OPPORTUNITY[category],
      },
      cta:    CTA[category],
      source: {
        name:        article.sourceName,
        url:         article.url,
        publishedAt: article.publishedAt,
      },
      scrapedAt: new Date().toISOString(),
    }
  })
}
