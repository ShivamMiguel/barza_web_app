import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)
  const spaceId = searchParams.get('space_id')

  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('*, professional_space!space_id(id, space_name, logo, owner)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (spaceId) {
    query = query.eq('space_id', spaceId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
