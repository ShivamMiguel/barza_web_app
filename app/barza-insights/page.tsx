import type { Metadata } from 'next'
import Link from 'next/link'
import { canonical, baseOG, twitterCard } from '@/lib/seo'

// ── Mock Data ──────────────────────────────────────────────────────────────────

const ARTICLES = [
  {
    slug: 'ranking-barbeiros-luanda-2025',
    title: 'Top 10 Barbeiros de Luanda em 2025',
    excerpt: 'Descobrimos os melhores barbeiros da capital angolana. Da Maianga a Talatona, estes profissionais estão a redefinir o que significa um corte de qualidade em Angola.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXu475Q90pXSudFTSP5EszioqKC1pr-3Tf1ucz3xUepXze4r5ALy2M4WeCTTfXNA2ox7xusSYVfUwxrSAskemmrA7hCzb1jpwqWyFlhBMHFyPkGg-7ssTM-D6ezGF08zPHLRQS7Seva8GrHKwL6tkv7mUhN7Gwa0sINGpeQuS0vquz2j17aHtqYlNlVQTBmNg_aN5mMIrLI2HoJ5iUyg676AcAmHWbDoUDOlPz5DBHKQyLlfo9lWskBL1PYuQP8MMFJSy2QhmZonY',
    publishedAt: '2025-02-01',
    category: 'Rankings',
    readTime: '6 min',
  },
  {
    slug: 'glow-makeup-guia',
    title: 'Guia Completo de Glow Makeup para Pele Negra',
    excerpt: 'Tudo o que precisas de saber sobre produtos, técnicas e truques para conseguir um glow perfeito em tons de pele mais ricos — testado e aprovado por MUAs angolanas.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAC3l_xOgy-k2Ec-IORYlT2TAhfSdLTSCY7qF4DLmgd5tJA2VVwh0L0fn8i7eDaKOLeLxDwgO0dSwYL7xiLbyBIqKgsa7dV1qZNTZuX5biFr2IKWfDefmQEH8ijD_4W46goMNstL_zaS__QfXPXdts5gZg8NwhTXHXwqrYlcqV81oZCiCS7B_0kOIvMmSZ78JST8-iV2Up6Ju4EQ5kVKazpCVdgsvL7xfyOzoTgIz9yJCHdD7dLZ5k7zCorYD9ZoXdXwyvb7FNfsR0',
    publishedAt: '2025-01-28',
    category: 'Guias',
    readTime: '8 min',
  },
  {
    slug: 'beleza-angolana-2025',
    title: 'O Estado da Beleza Angolana em 2025',
    excerpt: 'A indústria da beleza em Angola vale mais de 500 milhões de USD e está a crescer 20% ao ano. Analisamos as tendências, os desafios e as oportunidades do sector.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgFDd2XohlhKtZzdwsB3IZ5UhPGktzIs4MoG2idfz53LfooAstbFWGF8EHhjKZQaN-8Wu7djg1p2SFKlpSqYxMXia2UuERASQJKyiARfa6srily0Bc5_SWMVGKxoRX8pVJy3NSrmd0obybIatdzVYspDAa3gE0cS3NsXNgJznsGEzflNfNjnYWtQpJRU8kFAdKfJRwf4TH308164QkMFH9Mr4zHiTkD-YOx4KelkQMYt3tzgLBZrw020WeRr_7jRSgJLbYYaQgSSw',
    publishedAt: '2025-01-20',
    category: 'Tendências',
    readTime: '5 min',
  },
  {
    slug: 'cuidado-cabelo-natural-angola',
    title: 'Cuidado do Cabelo Natural: Dicas para o Clima Angolano',
    excerpt: 'O calor e a humidade de Angola exigem uma rotina de cuidado do cabelo específica. Dermatologistas e cabeleireiras locais partilham os seus segredos.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg5h9HiQn-YI9vLqNmwzLgst5PEISMcZGwVyJxapuwAYJGdOkotAS4TpFoDpFI4DPVIstnnK9z4GKDc_5fcdH2Pd7WJpPyZ3rBR7DOLqjkq6nz4B7UtgDI0rmoV1qLLkb3b2_es9Y5dAnrGNsa90MmAipXI-AlCv93MySSLrX7prylzXGfKD-zaEVcPM34O1neYBxqmZa5bSmHINLiv2DkAhYtC7pfPBdiF4vp8ZqjR5JTaFniI6teXBpGCvJnC_8zYeQLTXjbGYE',
    publishedAt: '2025-01-12',
    category: 'Dicas',
    readTime: '4 min',
  },
]

const CATEGORIES = ['Tendências', 'Guias', 'Rankings', 'Dicas']

// ── Metadata ───────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Barza Insights | Tendências de Beleza em Angola',
  description: 'Guias, rankings, tendências e dicas de beleza para Angola e África. Conteúdo criado pela comunidade Barza.',
  alternates: { canonical: canonical('/barza-insights') },
  openGraph: baseOG({
    title: 'Barza Insights | Tendências de Beleza em Angola',
    description: 'Guias, rankings, tendências e dicas de beleza para Angola e África. Conteúdo criado pela comunidade Barza.',
    path: '/barza-insights',
    image: ARTICLES[0].coverImage,
  }),
  twitter: twitterCard({
    title: 'Barza Insights | Tendências de Beleza em Angola',
    description: 'Guias, rankings, tendências e dicas de beleza para Angola e África.',
    image: ARTICLES[0].coverImage,
  }),
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    Rankings:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
    Guias:      'bg-blue-500/15 text-blue-400 border-blue-500/20',
    Tendências: 'bg-primary-container/15 text-primary-container border-primary-container/20',
    Dicas:      'bg-green-500/15 text-green-400 border-green-500/20',
  }
  return map[cat] ?? 'bg-surface-container-high text-on-surface-variant/70 border-outline-variant/20'
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const [featured, ...rest] = ARTICLES

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 w-full bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/">
            <img src="/barza_logo.png" alt="Barza" className="h-10 w-auto" style={{ mixBlendMode: 'screen' }} />
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-xs font-label uppercase tracking-wider text-on-surface/60">
            <Link href="/s/barbeiros-luanda" className="hover:text-primary-container transition-colors">Profissionais</Link>
            <Link href="/barza-insights"     className="text-primary-container">Insights</Link>
          </nav>
          <a href="/" className="volcanic-gradient text-on-primary-container px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap">
            Baixar App
          </a>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 py-3 text-xs text-on-surface-variant/60 font-label flex flex-wrap items-center gap-1">
        <Link href="/" className="hover:text-primary-container transition-colors">Início</Link>
        <span className="opacity-40 mx-1">›</span>
        <span className="text-on-surface/80">Barza Insights</span>
      </nav>

      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            <p className="text-xs font-label uppercase tracking-widest text-primary-container mb-2">Barza Insights</p>
            <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight">
              Beleza em Angola,<br />contada por quem a vive.
            </h1>
            <div className="h-1 w-16 volcanic-gradient rounded-full mt-4" />
          </div>
          <p className="text-on-surface-variant max-w-md leading-relaxed sm:ml-auto sm:text-right">
            Guias, rankings, tendências e dicas criadas pela comunidade Barza para os amantes de beleza em Angola e em toda a África.
          </p>
        </div>
      </section>

      {/* ── Categories Filter ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          <span className="bg-primary-container/15 text-primary-container text-xs font-label uppercase tracking-wider px-4 py-2 rounded-full border border-primary-container/30 cursor-default">
            Todos
          </span>
          {CATEGORIES.map(cat => (
            <span
              key={cat}
              className={`text-xs font-label uppercase tracking-wider px-4 py-2 rounded-full border cursor-default ${categoryColor(cat)}`}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* ── Featured Article ────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
        <Link
          href={`/barza-insights/${featured.slug}`}
          className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface-container rounded-3xl overflow-hidden border-t border-white/5 hover:border-primary-container/20 transition-all"
        >
          <div className="overflow-hidden h-64 lg:h-auto">
            <img
              src={featured.coverImage}
              alt={featured.title}
              width={720} height={480}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-8 flex flex-col justify-center gap-4">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-label uppercase tracking-wider px-3 py-1 rounded-full border ${categoryColor(featured.category)}`}>
                {featured.category}
              </span>
              <span className="text-xs text-on-surface-variant/40 font-label">{featured.readTime} leitura</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-headline font-extrabold group-hover:text-primary-container transition-colors leading-tight">
              {featured.title}
            </h2>
            <p className="text-on-surface-variant leading-relaxed">{featured.excerpt}</p>
            <div className="flex items-center justify-between mt-2">
              <time className="text-xs text-on-surface-variant/40 font-label">
                {new Date(featured.publishedAt).toLocaleDateString('pt-AO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <span className="text-sm text-primary-container font-bold group-hover:translate-x-1 transition-transform inline-block">
                Ler artigo →
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Article Grid ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(article => (
            <Link
              key={article.slug}
              href={`/barza-insights/${article.slug}`}
              className="bg-surface-container rounded-2xl overflow-hidden border-t border-white/5 hover:border-primary-container/20 transition-all group"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  width={600} height={192}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-label uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${categoryColor(article.category)}`}>
                    {article.category}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/40 font-label">{article.readTime}</span>
                </div>
                <h3 className="font-bold leading-snug group-hover:text-primary-container transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-on-surface-variant/70 leading-relaxed line-clamp-2">{article.excerpt}</p>
                <time className="text-xs text-on-surface-variant/40 font-label mt-auto">
                  {new Date(article.publishedAt).toLocaleDateString('pt-AO', { year: 'numeric', month: 'short', day: 'numeric' })}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="w-full py-12 px-8 bg-[#0e0e0e] border-t border-[#353534]/30">
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
    </div>
  )
}
