import { createClient as createServerClient } from './server'

export interface Post {
  id: string
  user_id: string
  content: string
  image_url?: string
  likes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  // These will be added when joining with profiles
  user?: {
    id: string
    full_name: string
    avatar_url?: string
    role_profile?: string
  }
}

export interface PostWithUser extends Post {
  user: {
    id: string
    full_name: string
    avatar_url?: string
    role_profile?: string
  }
}

/**
 * Fetch posts feed with user information
 * Can optionally filter by user_id
 */
export async function getPosts(
  limit: number = 20,
  offset: number = 0,
  userId?: string
): Promise<{ posts: PostWithUser[]; total: number }> {
  try {
    const supabase = await createServerClient()

    let query = supabase
      .from('posts')
      .select(
        `
        *,
        user:profiles(id, full_name, avatar_url, role_profile)
      `,
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: posts, count, error } = await query

    if (error) {
      console.error('Error fetching posts:', error.message)
      return { posts: [], total: 0 }
    }

    return {
      posts: (posts || []) as PostWithUser[],
      total: count || 0,
    }
  } catch (error) {
    console.error('Unexpected error fetching posts:', error)
    return { posts: [], total: 0 }
  }
}

/**
 * Fetch posts for a specific user
 */
export async function getUserPosts(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ posts: PostWithUser[]; total: number }> {
  return getPosts(limit, offset, userId)
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string): Promise<PostWithUser | null> {
  try {
    const supabase = await createServerClient()

    const { data: post, error } = await supabase
      .from('posts')
      .select(
        `
        *,
        user:profiles(id, full_name, avatar_url, role_profile)
      `
      )
      .eq('id', postId)
      .single()

    if (error) {
      console.error('Error fetching post:', error.message)
      return null
    }

    return post as PostWithUser
  } catch (error) {
    console.error('Unexpected error fetching post:', error)
    return null
  }
}
