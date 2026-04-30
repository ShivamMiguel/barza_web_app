import { NextResponse } from 'next/server'
import { getSignals } from '@/lib/beauty-signals/scraper'

export async function GET() {
  const signals = await getSignals()
  return NextResponse.json(signals)
}
