import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  followUser,
  unfollowUser,
  getFollowSummary,
} from '@/lib/supabase/follows'

/**
 * POST /api/users/[id]/follow
 *  Authenticated. The caller starts following [id]. Idempotent — calling
 *  twice doesn't error, the second call is a no-op.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    if (user.id === id) {
      return NextResponse.json(
        { error: 'Não podes seguir-te a ti próprio.' },
        { status: 400 },
      )
    }

    const result = await followUser(user.id, id)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const summary = await getFollowSummary(id, user.id)
    return NextResponse.json({
      success: true,
      already_following: result.alreadyFollowing ?? false,
      ...summary,
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

/**
 * DELETE /api/users/[id]/follow
 *  Authenticated. The caller stops following [id]. Idempotent.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const result = await unfollowUser(user.id, id)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    const summary = await getFollowSummary(id, user.id)
    return NextResponse.json({ success: true, ...summary })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

/**
 * GET /api/users/[id]/follow
 *  Returns the relationship summary for [id]:
 *  { followers, following, is_following }
 *  - `is_following` is null for unauthenticated callers and for self.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const summary = await getFollowSummary(id, user?.id ?? null)
    return NextResponse.json(summary)
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
