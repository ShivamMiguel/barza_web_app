import { NextRequest, NextResponse } from 'next/server'
import { getFollowing } from '@/lib/supabase/follows'

/**
 * GET /api/users/[id]/following?limit=20&offset=0
 * Returns the users that [id] follows, newest first.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10) || 20, 100)
    const offset = Math.max(parseInt(searchParams.get('offset') ?? '0', 10) || 0, 0)

    const { profiles, total } = await getFollowing(id, limit, offset)
    return NextResponse.json({
      data: profiles,
      pagination: { limit, offset, total },
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
