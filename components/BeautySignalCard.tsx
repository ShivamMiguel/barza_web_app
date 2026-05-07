'use client'

import type { ExternalSignal } from '@/lib/beauty-signals/external'

function signalStrength(title: string): number {
  const hash = title.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return 75 + (hash % 25)
}

function readTime(summary: string): string {
  const words = summary.trim().split(/\s+/).length
  return `${Math.max(2, Math.ceil(words / 200))} Min Read`
}

function categoryLabel(category: string, type: string): string {
  if (type === 'youtube') return 'Video'
  const map: Record<string, string> = {
    product: 'Product News',
    culture: 'Culture',
    trend: 'Trend Report',
    video: 'Video',
  }
  return map[category] ?? category.charAt(0).toUpperCase() + category.slice(1)
}

const FALLBACK_BG: Record<string, string> = {
  product: 'from-[#1a0f06] via-[#201508] to-[#2a1a0a]',
  culture: 'from-[#080f1a] via-[#0d1520] to-[#111c2a]',
  video:   'from-[#1a0808] via-[#200d0d] to-[#2a1010]',
}

export function BeautySignalCard({ signal }: { signal: ExternalSignal }) {
  const isVideo = signal.type === 'youtube'
  const strength = signalStrength(signal.title)
  const fallbackBg = FALLBACK_BG[signal.category] ?? 'from-[#0e0e0e] via-[#141414] to-[#1a1a1a]'

  return (
    <article className="relative w-full group cursor-pointer transition-transform duration-500 hover:scale-[1.005]">
      {/* Atmospheric hover glow */}
      <div className="absolute -inset-4 bg-primary-container/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full pointer-events-none" />

      <div className="relative overflow-hidden rounded-xl bg-surface-container glow-bloom refractive-highlight border border-[rgba(86,67,58,0.08)]">

        {/* ── Media 16:9 ── */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {signal.image ? (
            <img
              src={signal.image}
              alt={signal.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${fallbackBg} flex items-center justify-center`}>
              {isVideo ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center shadow-xl shadow-red-900/40">
                    <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </div>
                  {signal.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 px-8">
                      {signal.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-label uppercase tracking-widest text-white/60">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 px-10 text-center">
                  <span className="material-symbols-outlined text-primary-container/30 text-6xl">article</span>
                  {signal.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {signal.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-label uppercase tracking-widest text-white/50">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Top overlay: category + source */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-2">
            <span className="volcanic-gradient text-on-primary font-label text-[0.625rem] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-lg shadow-primary-container/20 flex-shrink-0">
              {categoryLabel(signal.category, signal.type)}
            </span>
            <div className="liquid-glass px-3 py-1.5 rounded-full flex items-center gap-1.5 flex-shrink-0">
              {isVideo ? (
                <span className="material-symbols-outlined text-[14px] text-red-400" style={{ fontVariationSettings: "'FILL' 1" }}>smart_display</span>
              ) : (
                <span className="material-symbols-outlined text-[14px] text-primary-container">language</span>
              )}
              <span className="font-label text-[0.6875rem] tracking-wider uppercase text-on-surface truncate max-w-[120px]">
                {signal.source}
              </span>
            </div>
          </div>

          {/* Bottom overlay: signal strength + read time */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-surface-container-lowest/90 to-transparent">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <span className="font-label text-[0.625rem] text-on-surface-variant font-semibold tracking-widest uppercase">
                  Signal: {strength}%
                </span>
              </div>
              <div className="w-px h-3 bg-outline-variant/30" />
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-on-surface-variant text-sm">
                  {isVideo ? 'play_circle' : 'schedule'}
                </span>
                <span className="font-label text-[0.625rem] text-on-surface-variant font-semibold tracking-widest uppercase">
                  {isVideo ? 'Watch Now' : readTime(signal.summary)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="space-y-3">
            <h2 className="font-headline text-xl sm:text-2xl md:text-3xl font-bold leading-[1.15] tracking-tight text-on-surface group-hover:text-primary-container transition-colors duration-300">
              {signal.title}
            </h2>
            <p className="font-body text-on-surface-variant text-sm leading-relaxed line-clamp-3">
              {signal.summary}
            </p>
          </div>

          {/* Footer */}
          <div className="pt-5 border-t border-[rgba(86,67,58,0.1)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="font-label text-[0.625rem] text-on-surface-variant uppercase tracking-widest">Live Signal</span>
            </div>
            <a
              href={signal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary-container font-label text-[0.6875rem] font-bold tracking-[0.15em] uppercase hover:gap-2.5 transition-all duration-300"
            >
              {isVideo ? 'Watch Video' : 'View Original'}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>

        {/* Corner glow */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary-container/10 blur-[60px] pointer-events-none" />
      </div>
    </article>
  )
}
