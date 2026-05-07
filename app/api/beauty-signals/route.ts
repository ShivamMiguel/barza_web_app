import { NextResponse } from 'next/server'
import { fetchExternalSignals } from '@/lib/beauty-signals/external'

export async function GET() {
  const signals = await fetchExternalSignals()
  return NextResponse.json(signals)
}
