import { NextResponse } from 'next/server'
import { scrapeAll } from '@/lib/beauty-signals/scraper'

export async function POST() {
  const signals = await scrapeAll()
  return NextResponse.json({ count: signals.length, signals })
}
