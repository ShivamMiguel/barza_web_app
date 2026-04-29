import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { canonical, pageTitle, baseOG, twitterCard, SITE_URL } from '@/lib/seo'
import { schemaProduct, schemaBreadcrumb } from '@/lib/schema'

// ── Types ──────────────────────────────────────────────────────────────────────

type ProductReview = { author: string; text: string; rating: number }
type RelatedProduct = { slug: string; name: string; price: number; image: string }

type Product = {
  slug: string; name: string; description: string; longDescription: string
  price: number; currency: string; image: string
  rating: number; reviewCount: number
  availability: 'InStock' | 'OutOfStock'
  brand: string; category: string; categorySlug: string
  ingredients: string; howToUse: string
  reviews: ProductReview[]; related: RelatedProduct[]
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    slug: 'obsidian-beard-oil',
    name: 'Obsidian Beard Oil',
    description: 'Óleo premium para barba com base de argan e jojoba',
    longDescription: 'O Obsidian Beard Oil é um óleo premium formulado com uma base de óleo de argan marroquino 100% puro, jojoba orgânica e extractos de carvão activado. A fórmula exclusiva nutre a barba em profundidade, elimina o comichão e proporciona um brilho subtil e saudável. Ideal para barbas de 3 dias a barbas longas, adequado a todos os tipos de pele. Dermatologicamente testado e aprovado.',
    price: 4500,
    currency: 'AOA',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnkomdXPuuum3ck-BkVaClvauz1bc_Ucin4yMhP6c1AZ31OQHMfe3_xO9dFkto8-A-ugOAxJSZ3FLg1ThG2jBNRkL4_xMPS01xzm01ElcLzcjQPvAyVh0jj3Qdno2vyZfQxc28zPXKuURUrt6xn2QO5FWCiohty5Tq0puhk9AGoZTNel9bkxV4d1tE9pOXveoVuQ6qrDFKluLhhTCNOZ8ajqB2Wzibo8tB-14JrL6q6x5_B9qOPHge8yKoVL3A_6BBG-dc1Jw4j2E',
    rating: 4.7,
    reviewCount: 43,
    availability: 'InStock',
    brand: 'Barza Lab',
    category: 'Cuidado de Barba',
    categorySlug: 'beard-care',
    ingredients: 'Óleo de Argan (Argania Spinosa), Óleo de Jojoba (Simmondsia Chinensis), Carvão Activado, Vitamina E (Tocopherol), Óleo Essencial de Lavanda, Óleo de Amêndoa Doce, Extracto de Aloe Vera.',
    howToUse: '1. Aplica 3–5 gotas na palma da mão. 2. Esfrega as mãos para aquecer o óleo. 3. Massaja suavemente na barba e na pele por baixo. 4. Penteia para distribuir uniformemente. Usa diariamente, de preferência após o banho quando a barba está limpa e ligeiramente húmida.',
    reviews: [
      { author: 'Hélder M.', text: 'Produto incrível! A barba ficou completamente diferente — macia, com brilho e sem comichão. Comprei a segunda embalagem.', rating: 5 },
      { author: 'Carlos F.', text: 'Uso há 3 meses e recomendo sem hesitar. O aroma é discreto e agradável. Qualidade excelente.', rating: 5 },
      { author: 'Kwame A.', text: 'Bom produto, resultados visíveis em 2 semanas. Podia ter uma embalagem maior pelo preço.', rating: 4 },
    ],
    related: [
      { slug: 'matte-clay-pro', name: 'Matte Clay Pro', price: 3800,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY' },
      { slug: 'volcanic-face-wash', name: 'Volcanic Face Wash', price: 3200,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0' },
      { slug: 'barba-balm-luanda', name: 'Barba Balm Luanda', price: 2900,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8' },
    ],
  },
  {
    slug: 'matte-clay-pro',
    name: 'Matte Clay Pro',
    description: 'Pomada mate de fixação forte para styling masculino',
    longDescription: 'O Matte Clay Pro é uma pomada de argila premium com fixação extra-forte e acabamento 100% matte. Formulada com argila de caulino e cera de abelha natural, mantém qualquer estilo em posição durante todo o dia sem deixar resíduos ou aspecto gorduroso. Ideal para cortes curtos a médios, fades e qualquer estilo que exija definição e controlo sem brilho.',
    price: 3800,
    currency: 'AOA',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY',
    rating: 4.5,
    reviewCount: 28,
    availability: 'InStock',
    brand: 'Barza Lab',
    category: 'Styling',
    categorySlug: 'styling',
    ingredients: 'Argila de Caulino, Cera de Abelha, Lanolina, Óleo de Rícino, Vitamina B5 (Pantenol), Extracto de Bambu, Fragância Natural.',
    howToUse: '1. Aplica uma pequena quantidade (tamanho de uma moeda) nas pontas dos dedos. 2. Emulsiona entre as palmas das mãos. 3. Aplica no cabelo seco ou ligeiramente húmido. 4. Modela conforme o estilo pretendido. Re-aplicável ao longo do dia. Lava com champô.',
    reviews: [
      { author: 'Tomás R.', text: 'O melhor produto de styling que já usei. Fixação incrível sem aquele aspecto de "plástico". Totalmente recomendado.', rating: 5 },
      { author: 'André S.', text: 'Funciona muito bem para o meu fade. O acabamento matte é mesmo como eu gosto. Boa qualidade.', rating: 4 },
      { author: 'Diogo C.', text: 'Bom produto. A fixação é forte mas o cabelo fica natural. Relação qualidade-preço razoável.', rating: 4 },
    ],
    related: [
      { slug: 'obsidian-beard-oil', name: 'Obsidian Beard Oil', price: 4500,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnkomdXPuuum3ck-BkVaClvauz1bc_Ucin4yMhP6c1AZ31OQHMfe3_xO9dFkto8-A-ugOAxJSZ3FLg1ThG2jBNRkL4_xMPS01xzm01ElcLzcjQPvAyVh0jj3Qdno2vyZfQxc28zPXKuURUrt6xn2QO5FWCiohty5Tq0puhk9AGoZTNel9bkxV4d1tE9pOXveoVuQ6qrDFKluLhhTCNOZ8ajqB2Wzibo8tB-14JrL6q6x5_B9qOPHge8yKoVL3A_6BBG-dc1Jw4j2E' },
      { slug: 'volcanic-face-wash', name: 'Volcanic Face Wash', price: 3200,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0' },
      { slug: 'barba-balm-luanda', name: 'Barba Balm Luanda', price: 2900,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG7NrKCRgXkxaMafVgoD9YQojXQIaIGnTkWW3-bwTQt_xJjMul5uAFyG3Ig_Ws2Orm79qDjrZ3dAR-bu6w2QVrHadqJRKurfeOnh7TE538L2WTdGfUI_x4PtV4P-pL0cHGgqR-j1J-RTS2ugpdMgR8V6naBS0f3KSc-111pmp9VtaENh0qAktBrt2dL0RV4_Ie5LbnuoOPWzF9X52mA0opnUCd7WqBkL_qpx-OI9ywr6N8-7dIYQgVnm_BTj53eqWGWX6F14ijjT8' },
    ],
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function findProduct(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-primary-container"
          style={{ fontSize: `${size}px`, fontVariationSettings: `'FILL' ${i < Math.round(rating) ? 1 : 0}` }}
        >
          star
        </span>
      ))}
    </span>
  )
}

function SeoNav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/">
          <img src="/barza_logo.png" alt="Barza" className="h-10 w-auto" style={{ mixBlendMode: 'screen' }} />
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-xs font-label uppercase tracking-wider text-on-surface/60">
          <Link href="/s/barbeiros-luanda" className="hover:text-primary-container transition-colors">Profissionais</Link>
          <Link href="/barza-insights"     className="hover:text-primary-container transition-colors">Insights</Link>
        </nav>
        <a href="/" className="volcanic-gradient text-on-primary-container px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap">
          Baixar App
        </a>
      </div>
    </header>
  )
}

// ── Static Params ──────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  // TODO: replace with DB query
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const product = findProduct(slug)
  if (!product) return { title: pageTitle('Produto não encontrado') }

  const title       = `${product.name} | ${product.brand} | Barza Shop`
  const description = product.description + ` — Disponível na Barza Shop. ${product.reviewCount} avaliações, nota ${product.rating}/5.`

  return {
    title,
    description,
    robots: product.availability === 'OutOfStock' ? { index: false } : { index: true, follow: true },
    alternates: { canonical: canonical(`/product/${product.slug}`) },
    openGraph: baseOG({ title, description, path: `/product/${product.slug}`, image: product.image }),
    twitter:   twitterCard({ title, description, image: product.image }),
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = findProduct(slug)
  if (!product) notFound()

  const breadcrumbs = [
    { name: 'Início',           url: SITE_URL },
    { name: 'Shop',             url: `${SITE_URL}/shop` },
    { name: product.category,   url: `${SITE_URL}/shop/${product.categorySlug}` },
    { name: product.name,       url: `${SITE_URL}/product/${product.slug}` },
  ]

  const schemas = [
    schemaProduct({
      name: product.name, description: product.description,
      price: product.price, currency: product.currency,
      image: product.image, rating: product.rating,
      reviewCount: product.reviewCount, url: `${SITE_URL}/product/${product.slug}`,
      availability: product.availability,
    }),
    schemaBreadcrumb(breadcrumbs),
  ]

  // Star breakdown percentages (mock)
  const starBreakdown = [
    { stars: 5, pct: 65 },
    { stars: 4, pct: 22 },
    { stars: 3, pct: 8  },
    { stars: 2, pct: 3  },
    { stars: 1, pct: 2  },
  ]

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body min-h-screen">
      <SeoNav />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-xs text-on-surface-variant/60 font-label flex flex-wrap items-center gap-1">
        {breadcrumbs.map((item, idx) => (
          <span key={idx} className="flex items-center gap-1">
            {idx > 0 && <span className="opacity-40">›</span>}
            {idx < breadcrumbs.length - 1 ? (
              <Link href={item.url.replace(SITE_URL, '') || '/'} className="hover:text-primary-container transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className="text-on-surface/80">{item.name}</span>
            )}
          </span>
        ))}
      </nav>

      {/* ── Product Hero ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden bg-surface-container aspect-square max-w-lg mx-auto lg:mx-0 w-full">
            <img
              src={product.image}
              alt={product.name}
              width={600} height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center gap-4">
            <div>
              <span className="text-xs font-label uppercase tracking-widest text-primary-container">{product.brand}</span>
              <h1 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight mt-1">{product.name}</h1>
              <p className="text-on-surface-variant mt-2">{product.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <Stars rating={product.rating} />
              <span className="font-bold">{product.rating}</span>
              <span className="text-on-surface-variant/50 text-sm">({product.reviewCount} avaliações)</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-headline font-extrabold text-primary-container">
                {product.price.toLocaleString('pt-AO')} AOA
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${product.availability === 'InStock' ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-on-surface-variant/70">
                {product.availability === 'InStock' ? 'Em stock' : 'Esgotado'}
              </span>
            </div>

            {product.availability === 'InStock' && (
              <div className="flex gap-3 mt-2">
                <a href="/" className="volcanic-gradient text-on-primary-container flex-1 py-3 rounded-xl font-bold text-center shadow-[0_20px_40px_-10px_rgba(255,145,86,0.35)] hover:scale-105 transition-transform">
                  Adicionar ao Carrinho
                </a>
                <a href="/" className="border border-primary-container/40 text-primary-container px-5 py-3 rounded-xl font-bold hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>favorite_border</span>
                </a>
              </div>
            )}

            <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant/50 mt-2">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>local_shipping</span> Entrega em Luanda</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span> Produto Barza Lab</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Description Tabs ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        {/* Tab headers — static, first active */}
        <div className="flex gap-1 border-b border-outline-variant/20 mb-8">
          {['Descrição', 'Ingredientes', 'Como Usar'].map((tab, idx) => (
            <span
              key={tab}
              className={`px-5 py-3 text-sm font-bold font-label uppercase tracking-wide cursor-default border-b-2 -mb-px transition-colors ${
                idx === 0
                  ? 'border-primary-container text-primary-container'
                  : 'border-transparent text-on-surface-variant/50'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* First tab content */}
        <div className="max-w-2xl space-y-4">
          <p className="text-on-surface-variant leading-relaxed">{product.longDescription}</p>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <h2 className="text-xl font-headline font-bold mb-8">Avaliações ({product.reviewCount})</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Star breakdown */}
          <div className="bg-surface-container rounded-2xl p-6 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="text-5xl font-headline font-extrabold text-primary-container">{product.rating}</div>
            <Stars rating={product.rating} size={20} />
            <p className="text-xs text-on-surface-variant/50">{product.reviewCount} avaliações</p>
            <div className="w-full space-y-2 mt-2">
              {starBreakdown.map(row => (
                <div key={row.stars} className="flex items-center gap-2 text-xs">
                  <span className="text-on-surface-variant/60 w-3 text-right">{row.stars}</span>
                  <span className="material-symbols-outlined text-primary-container" style={{ fontSize: '12px', fontVariationSettings: "'FILL' 1" }}>star</span>
                  <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full volcanic-gradient rounded-full" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="text-on-surface-variant/40 w-7">{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="lg:col-span-2 space-y-4">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="bg-surface-container rounded-2xl p-5 border-t border-white/5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-container/15 flex items-center justify-center font-bold text-primary-container text-sm flex-shrink-0">
                      {review.author.charAt(0)}
                    </div>
                    <p className="font-bold text-sm">{review.author}</p>
                  </div>
                  <Stars rating={review.rating} size={14} />
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Products ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <h2 className="text-xl font-headline font-bold mb-6">Produtos Relacionados</h2>
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
          {product.related.map(rel => (
            <Link
              key={rel.slug}
              href={`/product/${rel.slug}`}
              className="flex-shrink-0 w-44 bg-surface-container rounded-2xl overflow-hidden border-t border-white/5 hover:border-primary-container/20 transition-all group"
            >
              <div className="h-40 overflow-hidden">
                <img src={rel.image} alt={rel.name} width={176} height={160} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <p className="text-sm font-bold truncate group-hover:text-primary-container transition-colors">{rel.name}</p>
                <p className="text-xs text-primary-container font-bold mt-1">{rel.price.toLocaleString('pt-AO')} AOA</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <h2 className="text-xl font-headline font-bold mb-6">Perguntas Frequentes</h2>
        <div className="space-y-3 max-w-3xl">
          {[
            {
              q: `O ${product.name} é adequado para pele sensível?`,
              a: `Sim, o ${product.name} da Barza Lab foi dermatologicamente testado e é formulado sem parabenos, sulfatos ou corantes artificiais. É adequado para todos os tipos de pele, incluindo pele sensível. Em caso de reacção, interrompe o uso e consulta um dermatologista.`,
            },
            {
              q: `Qual é a duração de uma embalagem de ${product.name}?`,
              a: `Com uso diário, uma embalagem de ${product.name} dura aproximadamente 4 a 6 semanas, dependendo da quantidade aplicada. Recomendamos começar com pequenas quantidades e ajustar conforme a necessidade.`,
            },
            {
              q: `O ${product.name} tem entrega em todo Angola?`,
              a: `Actualmente entregamos em Luanda (Luanda cidade, Talatona, Cacuaco e Viana) com envio a partir de 1 500 AOA. Estamos a expandir para outras províncias — acompanha as novidades na app Barza.`,
            },
          ].map((faq, idx) => (
            <details key={idx} className="bg-surface-container rounded-2xl border-t border-white/5 group">
              <summary className="p-5 font-bold cursor-pointer list-none flex items-center justify-between gap-3 hover:text-primary-container transition-colors">
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-primary-container/60 flex-shrink-0 group-open:rotate-180 transition-transform" style={{ fontSize: '20px' }}>expand_more</span>
              </summary>
              <p className="px-5 pb-5 text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="w-full py-12 px-8 mt-16 bg-[#0e0e0e] border-t border-[#353534]/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
          <div className="text-xl font-black text-primary-container font-headline uppercase tracking-widest">BARZA</div>
          <div className="flex flex-wrap justify-center gap-8 font-body text-[0.6875rem] uppercase tracking-[0.1em]">
            <a href="/" className="text-on-surface/60 hover:text-primary-container transition-colors">Política de Privacidade</a>
            <a href="/" className="text-on-surface/60 hover:text-primary-container transition-colors">Termos de Serviço</a>
            <a href="/" className="text-on-surface/60 hover:text-primary-container transition-colors">Suporte</a>
          </div>
          <p className="font-body text-[0.6875rem] text-on-surface/40">© 2025 Barza. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* ── JSON-LD ───────────────────────────────────────────────────────────── */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </div>
  )
}
