import Link from 'next/link'
import type { BeautySignal } from '@/lib/beauty-signals/types'

type Props = { signal: BeautySignal }

export function BeautySignalCard({ signal }: Props) {
  return (
    <article className="bg-[#0e0e0e] border border-primary-container/15 rounded-3xl overflow-hidden border-l-2 border-l-primary-container shadow-[0_40px_60px_-15px_rgba(0,0,0,0.6)]">
      {/* Top label row */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <span className="text-[10px] font-label uppercase tracking-[0.25em] text-primary-container font-bold">
          Beauty Signal
        </span>
        <span className="bg-primary-container/10 border border-primary-container/20 text-primary-container text-[9px] font-label uppercase tracking-[0.15em] px-3 py-1 rounded-full">
          {signal.category}
        </span>
      </div>

      {/* Editorial image */}
      <Link href={`/signal/${signal.slug}`} className="block relative w-full overflow-hidden" style={{ aspectRatio: '3/2' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={signal.image}
          alt={signal.headline}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {/* Subtle bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/60 via-transparent to-transparent pointer-events-none" />
      </Link>

      {/* Content */}
      <div className="px-6 pt-5 pb-6 space-y-3">
        {/* Headline */}
        <Link href={`/signal/${signal.slug}`} className="block group">
          <h2 className="font-headline font-bold text-xl tracking-tight leading-tight group-hover:text-primary-container transition-colors">
            {signal.headline}
          </h2>
        </Link>

        {/* Subtext */}
        <p className="text-sm text-on-surface-variant/70 leading-relaxed line-clamp-2">
          {signal.subtext}
        </p>

        {/* Source & date */}
        <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/40">
          {signal.source.name}
          {signal.source.publishedAt ? (
            <>
              {' '}·{' '}
              {new Date(signal.source.publishedAt).toLocaleDateString('pt-AO', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </>
          ) : null}
        </p>

        {/* CTA text link */}
        <Link
          href={`/signal/${signal.slug}`}
          className="inline-flex items-center gap-2 text-primary-container font-bold text-xs uppercase tracking-[0.15em] hover:gap-3 transition-all mt-2"
        >
          {signal.cta.label}
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </article>
  )
}
