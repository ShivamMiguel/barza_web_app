import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export interface TrendingProfessional {
  space_id: string
  space_name: string
  logo: string | null
  avg_stars: number
  rating_count: number
  top_category: string | null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '5'), 20)

    const supabase = await createClient()

    // Fetch all ratings with their space info
    const { data: ratings, error: ratingsError } = await supabase
      .from('professional_space_ratings')
      .select('space_id, stars, professional_space(id, space_name, logo)')

    if (ratingsError) {
      console.error('Error fetching ratings:', ratingsError)
      return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 })
    }

    if (!ratings || ratings.length === 0) {
      return NextResponse.json([])
    }

    // Aggregate ratings per space
    const grouped: Record<string, { space: any; totalStars: number; count: number }> = {}

    for (const r of ratings) {
      const space = r.professional_space as any
      if (!space) continue
      const sid = r.space_id
      if (!grouped[sid]) {
        grouped[sid] = { space, totalStars: 0, count: 0 }
      }
      grouped[sid].totalStars += r.stars
      grouped[sid].count += 1
    }

    // Sort by avg_stars DESC, then count DESC and take top N
    const ranked = Object.entries(grouped)
      .map(([space_id, g]) => ({
        space_id,
        space_name: g.space.space_name as string,
        logo: (g.space.logo as string | null) ?? null,
        avg_stars: g.totalStars / g.count,
        rating_count: g.count,
      }))
      .sort((a, b) =>
        b.avg_stars !== a.avg_stars
          ? b.avg_stars - a.avg_stars
          : b.rating_count - a.rating_count
      )
      .slice(0, limit)

    if (ranked.length === 0) {
      return NextResponse.json([])
    }

    // Fetch top service category for each space
    const spaceIds = ranked.map((r) => r.space_id)
    const { data: services } = await supabase
      .from('professional_services')
      .select('professional_space_id, category')
      .in('professional_space_id', spaceIds)
      .eq('is_active', true)

    // Pick the most common category per space
    const categoryBySpace: Record<string, string> = {}
    if (services) {
      const categoryCount: Record<string, Record<string, number>> = {}
      for (const svc of services) {
        const sid = svc.professional_space_id
        if (!categoryCount[sid]) categoryCount[sid] = {}
        categoryCount[sid][svc.category] = (categoryCount[sid][svc.category] ?? 0) + 1
      }
      for (const [sid, counts] of Object.entries(categoryCount)) {
        categoryBySpace[sid] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
      }
    }

    const result: TrendingProfessional[] = ranked.map((r) => ({
      ...r,
      top_category: categoryBySpace[r.space_id] ?? null,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
