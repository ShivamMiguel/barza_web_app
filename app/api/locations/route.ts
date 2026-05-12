import { NextRequest, NextResponse } from 'next/server'
import { LOCATIONS, searchLocations } from '@/lib/locations'

/**
 * GET /api/locations
 *
 *  - No params  → full country/city/neighborhood tree
 *  - ?q=foo     → flat list of city suggestions matching the query
 *  - ?country=AO → cities (with neighborhoods) for that country only
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const country = searchParams.get('country')?.toUpperCase()

  if (q !== null) {
    return NextResponse.json({ suggestions: searchLocations(q) })
  }

  if (country) {
    const node = LOCATIONS.find((c) => c.code === country)
    if (!node) {
      return NextResponse.json({ error: 'País não encontrado' }, { status: 404 })
    }
    return NextResponse.json(node)
  }

  return NextResponse.json({ countries: LOCATIONS })
}
