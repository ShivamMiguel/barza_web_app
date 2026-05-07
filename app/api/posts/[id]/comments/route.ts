/**
 * GET  /api/posts/[id]/comments — list comments for a post (oldest first)
 * POST /api/posts/[id]/comments — create a comment (authenticated)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SELECT_COMMENT = `
  id,
  post_id,
  user_id,
  parent_id,
  content,
  created_at,
  updated_at,
  user:profiles(id, full_name, avatar_url, profession:role_profile)
`

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('post_comments')
      .select(SELECT_COMMENT)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) {
      // Most common cause: the post_comments table hasn't been created yet.
      // Degrade gracefully so the UI just shows "no comments".
      console.warn('post_comments unavailable:', error.message)
      return NextResponse.json({ data: [] })
    }

    return NextResponse.json({ data: data ?? [] })
  } catch (error) {
    console.warn('Error fetching comments, returning empty:', error)
    return NextResponse.json({ data: [] })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const { content, parent_id } = await request.json()

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
    }
    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Comment must be 500 characters or less' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Resolve parent_id: one level deep — if the parent itself is a reply,
    // attach the new reply to its top-level ancestor instead.
    let resolvedParentId: string | null = null
    if (parent_id && typeof parent_id === 'string') {
      const { data: parent } = await supabase
        .from('post_comments')
        .select('id, parent_id, post_id')
        .eq('id', parent_id)
        .single()

      if (!parent || parent.post_id !== postId) {
        return NextResponse.json({ error: 'Invalid parent comment' }, { status: 400 })
      }
      resolvedParentId = parent.parent_id ?? parent.id
    }

    const { data: comment, error: insertError } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
        parent_id: resolvedParentId,
      })
      .select(SELECT_COMMENT)
      .single()

    if (insertError || !comment) {
      console.error('Error creating comment:', insertError)
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    // Recompute and persist comments_count on the post
    const { count } = await supabase
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)

    const commentsCount = count ?? 0

    await supabase
      .from('posts')
      .update({ comments_count: commentsCount })
      .eq('id', postId)

    return NextResponse.json(
      { comment, comments_count: commentsCount },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
