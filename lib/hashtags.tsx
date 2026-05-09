import Link from 'next/link'
import type { ReactNode } from 'react'

const TOKEN_REGEX = /(\*\*[^*]+\*\*|#[\p{L}\p{N}_]+)/gu
const HASHTAG_GLOBAL_REGEX = /#([\p{L}\p{N}_]+)/gu

export function extractHashtags(text: string): string[] {
  const matches = [...text.matchAll(HASHTAG_GLOBAL_REGEX)]
  return [...new Set(matches.map(m => m[1].toLowerCase()))]
}

export function renderRichText(text: string, opts: { withBold?: boolean } = {}): ReactNode[] {
  const { withBold = false } = opts
  return text.split(TOKEN_REGEX).map((part, i) => {
    if (!part) return null

    if (withBold && part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <span key={i} className="text-primary-container">
          {part.slice(2, -2)}
        </span>
      )
    }

    if (part.startsWith('#') && /^#[\p{L}\p{N}_]+$/u.test(part)) {
      const tag = part.slice(1).toLowerCase()
      return (
        <Link
          key={i}
          href={`/community/hashtag/${encodeURIComponent(tag)}`}
          onClick={(e) => e.stopPropagation()}
          className="text-primary-container hover:underline font-semibold"
        >
          {part}
        </Link>
      )
    }

    return <span key={i}>{part}</span>
  })
}
