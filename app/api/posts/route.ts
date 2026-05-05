/**
 * POST /api/posts
 * Create a new post from authenticated user
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

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

    // TODO: Save post to database
    // For now, return success mock
    const post = {
      id: crypto.randomUUID?.() || `post-${Date.now()}`,
      user_id: user.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
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
 * GET /api/posts?limit=20&offset=0
 * Get posts feed
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)

    // TODO: Fetch posts from database
    // For now, return empty array
    const posts: any[] = []

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        limit,
        offset,
        total: 0,
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
