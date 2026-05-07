import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 50)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('professional_services')
      .select('*, professional_space(id, space_name, logo, location_space, rate, created_at)')
      .eq('is_active', true)
      .limit(limit)

    if (error) {
      console.error('Error fetching professional spaces:', error)
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
