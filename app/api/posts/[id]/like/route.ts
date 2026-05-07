/**
 * POST /api/posts/[id]/like
 * Toggles a like on a post for the authenticated user.
 * Returns the new liked state and the updated likes_count.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check whether the user has already liked this post
    const { data: existing } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle()

    let liked: boolean

    if (existing) {
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existing.id)

      if (deleteError) {
        console.error('Failed to delete like:', deleteError)
        return NextResponse.json({ error: 'Failed to unlike post' }, { status: 500 })
      }
      liked = false
    } else {
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: user.id })

      if (insertError) {
        console.error('Failed to insert like:', insertError)
        return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
      }
      liked = true
    }

    // Recompute the count from the source of truth and persist it.
    const { count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)

    const likesCount = count ?? 0

    await supabase
      .from('posts')
      .update({ likes_count: likesCount })
      .eq('id', postId)

    return NextResponse.json({ liked, likes_count: likesCount })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}
