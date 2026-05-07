import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PATCH, DELETE, GET } from '@/app/api/posts/[id]/route'
import { NextRequest } from 'next/server'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: () => mockSupabaseClient,
}))

// ─── Test Data ────────────────────────────────────────────────────────────────

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
}

const anotherUser = {
  id: 'user-456',
  email: 'other@example.com',
}

const mockPost = {
  id: 'post-123',
  user_id: 'user-123',
  content: 'Original post content',
  image_url: null,
  likes_count: 5,
  comments_count: 2,
  created_at: '2026-05-06T14:31:22.873Z',
  updated_at: '2026-05-06T14:31:22.873Z',
}

const params = {
  id: 'post-123',
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── Tests: PATCH /api/posts/[id] ──────────────────────────────────────────────

describe('PATCH /api/posts/[id]', () => {
  describe('authentication', () => {
    it('returns 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/posts/post-123',
        {
          method: 'PATCH',
          body: JSON.stringify({ content: 'Updated content' }),
        }
      )

      const response = await PATCH(request, { params })
      expect(response.status).toBe(401)
    })
  })

  describe('authorization', () => {
    it('returns 403 if user is not the post owner', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: anotherUser },
        error: null,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: () =>
            Promise.resolve({
              data: mockPost,
              error: null,
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/posts/post-123',
        {
          method: 'PATCH',
          body: JSON.stringify({ content: 'Updated content' }),
        }
      )

      const response = await PATCH(request, { params })
      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data.error).toContain('own posts')
    })

    it('returns 404 if post does not exist', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: () =>
            Promise.resolve({
              data: null,
              error: new Error('Not found'),
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/posts/nonexistent',
        {
          method: 'PATCH',
          body: JSON.stringify({ content: 'Updated content' }),
        }
      )

      const response = await PATCH(request, { params: { id: 'nonexistent' } })
      expect(response.status).toBe(404)
    })
  })

  describe('validation', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: () =>
            Promise.resolve({
              data: mockPost,
              error: null,
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })
    })

    it('returns 400 if content is empty', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/posts/post-123',
        {
          method: 'PATCH',
          body: JSON.stringify({ content: '' }),
        }
      )

      const response = await PATCH(request, { params })
      expect(response.status).toBe(400)
    })

    it('returns 400 if content exceeds 1000 characters', async () => {
      const longContent = 'a'.repeat(1001)
      const request = new NextRequest(
        'http://localhost:3000/api/posts/post-123',
        {
          method: 'PATCH',
          body: JSON.stringify({ content: longContent }),
        }
      )

      const response = await PATCH(request, { params })
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('1000')
    })
  })

  describe('success', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('updates post content successfully', async () => {
      const updatedPost = {
        ...mockPost,
        content: 'Updated content',
        updated_at: '2026-05-06T14:35:00.000Z',
      }

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: () =>
            Promise.resolve({
              data: mockPost,
              error: null,
            }),
        }),
      })

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: updatedPost,
                error: null,
              }),
          }),
        }),
      })

      const fromSpy = vi.fn()
      fromSpy.mockReturnValueOnce({
        select: mockSelect,
      })
      fromSpy.mockReturnValueOnce({
        update: mockUpdate,
      })

      mockSupabaseClient.from.mockImplementation(fromSpy)

      const request = new NextRequest(
        'http://localhost:3000/api/posts/post-123',
        {
          method: 'PATCH',
          body: JSON.stringify({ content: 'Updated content' }),
        }
      )

      const response = await PATCH(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.post.content).toBe('Updated content')
    })

    it('trims content whitespace', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: () =>
            Promise.resolve({
              data: mockPost,
              error: null,
            }),
        }),
      })

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: mockPost,
                error: null,
              }),
          }),
        }),
      })

      const fromSpy = vi.fn()
      fromSpy.mockReturnValueOnce({
        select: mockSelect,
      })
      fromSpy.mockReturnValueOnce({
        update: mockUpdate,
      })

      mockSupabaseClient.from.mockImplementation(fromSpy)

      const request = new NextRequest(
        'http://localhost:3000/api/posts/post-123',
        {
          method: 'PATCH',
          body: JSON.stringify({ content: '  Updated content  ' }),
        }
      )

      await PATCH(request, { params })

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Updated content',
        })
      )
    })
  })
})

// ─── Tests: DELETE /api/posts/[id] ─────────────────────────────────────────────

describe('DELETE /api/posts/[id]', () => {
  describe('authentication', () => {
    it('returns 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/posts/post-123',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, { params })
      expect(response.status).toBe(401)
    })
  })

  describe('authorization', () => {
    it('returns 403 if user is not the post owner', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: anotherUser },
        error: null,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: () =>
            Promise.resolve({
              data: mockPost,
              error: null,
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/posts/post-123',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, { params })
      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data.error).toContain('own posts')
    })

    it('returns 404 if post does not exist', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: () =>
            Promise.resolve({
              data: null,
              error: new Error('Not found'),
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/posts/nonexistent',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, { params: { id: 'nonexistent' } })
      expect(response.status).toBe(404)
    })
  })

  describe('success', () => {
    it('deletes post successfully', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: () =>
            Promise.resolve({
              data: mockPost,
              error: null,
            }),
        }),
      })

      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: null,
        }),
      })

      const fromSpy = vi.fn()
      fromSpy.mockReturnValueOnce({
        select: mockSelect,
      })
      fromSpy.mockReturnValueOnce({
        delete: mockDelete,
      })

      mockSupabaseClient.from.mockImplementation(fromSpy)

      const request = new NextRequest(
        'http://localhost:3000/api/posts/post-123',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toContain('deleted')
    })
  })

  describe('error handling', () => {
    it('returns 500 if delete fails', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: () =>
            Promise.resolve({
              data: mockPost,
              error: null,
            }),
        }),
      })

      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          error: new Error('Database error'),
        }),
      })

      const fromSpy = vi.fn()
      fromSpy.mockReturnValueOnce({
        select: mockSelect,
      })
      fromSpy.mockReturnValueOnce({
        delete: mockDelete,
      })

      mockSupabaseClient.from.mockImplementation(fromSpy)

      const request = new NextRequest(
        'http://localhost:3000/api/posts/post-123',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, { params })
      expect(response.status).toBe(500)
    })
  })
})

// ─── Tests: GET /api/posts/[id] ────────────────────────────────────────────────

describe('GET /api/posts/[id]', () => {
  it('fetches a single post successfully', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: () =>
          Promise.resolve({
            data: mockPost,
            error: null,
          }),
      }),
    })

    mockSupabaseClient.from.mockReturnValue({
      select: mockSelect,
    })

    const request = new NextRequest('http://localhost:3000/api/posts/post-123')

    const response = await GET(request, { params })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.post).toEqual(mockPost)
  })

  it('returns 404 if post does not exist', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: () =>
          Promise.resolve({
            data: null,
            error: new Error('Not found'),
          }),
      }),
    })

    mockSupabaseClient.from.mockReturnValue({
      select: mockSelect,
    })

    const request = new NextRequest(
      'http://localhost:3000/api/posts/nonexistent'
    )

    const response = await GET(request, { params: { id: 'nonexistent' } })
    expect(response.status).toBe(404)
  })

  it('returns 500 on database error', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: () =>
          Promise.reject(new Error('Database error')),
      }),
    })

    mockSupabaseClient.from.mockReturnValue({
      select: mockSelect,
    })

    const request = new NextRequest('http://localhost:3000/api/posts/post-123')

    const response = await GET(request, { params })
    expect(response.status).toBe(500)
  })
})
