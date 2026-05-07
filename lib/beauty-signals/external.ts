export interface ExternalSignal {
  title: string
  summary: string
  image: string | null
  source: string
  url: string
  category: string
  tags: string[]
  type: 'article' | 'youtube'
  created_at: string
}

const EDGE_URL = 'https://vuqlvieuqimcaywcxteg.supabase.co/functions/v1/beauty-signals'

const CACHE_TTL = 60 * 60 * 1000
let cache: { data: ExternalSignal[]; ts: number } | null = null

export async function fetchExternalSignals(): Promise<ExternalSignal[]> {
  if (cache && Date.now() - cache.ts < CACHE_TTL) return cache.data

  try {
    const res = await fetch(EDGE_URL, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''}`,
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`Edge function responded ${res.status}`)

    const json = await res.json()
    const data: ExternalSignal[] = json.data ?? []
    cache = { data, ts: Date.now() }
    return data
  } catch (err) {
    console.error('Failed to fetch beauty signals:', err)
    return cache?.data ?? []
  }
}
