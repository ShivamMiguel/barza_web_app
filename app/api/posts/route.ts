/**
 * POST /api/posts
 * Create a new post from authenticated user
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { content, image_url } = await request.json()

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Post content must be 1000 characters or less' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Save post to database
    const { data: post, error: insertError } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        content: content.trim(),
        image_url: image_url || null,
        likes_count: 0,
        comments_count: 0,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
        post,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/posts?limit=20&offset=0&user_id=<optional>
 * Get posts feed - fetch all posts or filter by user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)
    const filterUserId = searchParams.get('user_id')
    const hashtag = searchParams.get('hashtag')?.replace(/^#/, '').toLowerCase().trim()

    const supabase = await createClient()

    let query = supabase
      .from('posts')
      .select('*, user:profiles(id, full_name, avatar_url, profession:role_profile)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (filterUserId) {
      query = query.eq('user_id', filterUserId)
    }

    if (hashtag && /^[\p{L}\p{N}_]+$/u.test(hashtag)) {
      query = query.ilike('content', `%#${hashtag}%`)
    }

    const { data: posts, count, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    let result: any[] = posts || []

    // Attach liked_by_me for the authenticated user, if any
    const authResult = await supabase.auth.getUser()
    const userId = authResult?.data?.user?.id ?? null

    if (userId && result.length > 0) {
      try {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', userId)
          .in('post_id', result.map((p) => p.id))

        const likedSet = new Set((likes ?? []).map((l: { post_id: string }) => l.post_id))
        result = result.map((p) => ({ ...p, liked_by_me: likedSet.has(p.id) }))
      } catch {
        // No-op if post_likes is unavailable (e.g. table missing); fall back to default state
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        limit,
        offset,
        total: count || 0,
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
