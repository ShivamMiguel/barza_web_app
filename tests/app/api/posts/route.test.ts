import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST, GET } from '@/app/api/posts/route'
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

const mockPost = {
  id: 'post-123',
  user_id: 'user-123',
  content: 'Test post content',
  image_url: null,
  likes_count: 0,
  comments_count: 0,
  created_at: '2026-05-06T14:31:22.873Z',
  updated_at: '2026-05-06T14:31:22.873Z',
}

const mockPosts = [
  mockPost,
  {
    ...mockPost,
    id: 'post-456',
    content: 'Second post',
    created_at: '2026-05-06T13:31:22.873Z',
  },
]

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── Tests: POST /api/posts ────────────────────────────────────────────────────

describe('POST /api/posts', () => {
  describe('authentication', () => {
    it('returns 401 if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test post' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(401)
    })

    it('returns 401 if auth returns error', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Auth error'),
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test post' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(401)
    })
  })

  describe('validation', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('returns 400 if content is empty', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: '' }),
      })

      const response = await POST(request)
      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.error).toContain('required')
    })

    it('returns 400 if content is whitespace only', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: '   ' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })

    it('returns 400 if content exceeds 1000 characters', async () => {
      const longContent = 'a'.repeat(1001)
      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: longContent }),
      })

      const response = await POST(request)
      const data = await response.json()
      expect(response.status).toBe(400)
      expect(data.error).toContain('1000')
    })

    it('accepts content with exactly 1000 characters', async () => {
      const content = 'a'.repeat(1000)
      const mockInsert = vi.fn().mockReturnValue({
        select: () => ({
          single: () => Promise.resolve({ data: mockPost, error: null }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })

    it('returns 400 if content is not a string', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: 12345 }),
      })

      const response = await POST(request)
      expect(response.status).toBe(400)
    })
  })

  describe('success', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('creates a post successfully', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: () => ({
          single: () => Promise.resolve({ data: mockPost, error: null }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test post' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.post).toEqual(mockPost)
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockUser.id,
          content: 'Test post',
        })
      )
    })

    it('trims content whitespace', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: () => ({
          single: () => Promise.resolve({ data: mockPost, error: null }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: '  Test post  ' }),
      })

      await POST(request)

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test post',
        })
      )
    })

    it('accepts optional image_url', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: { ...mockPost, image_url: 'https://example.com/img.jpg' },
              error: null,
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({
          content: 'Test post',
          image_url: 'https://example.com/img.jpg',
        }),
      })

      const response = await POST(request)
      expect(response.status).toBe(201)
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('returns 500 if database insert fails', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: null,
              error: new Error('Database error'),
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      })

      const request = new NextRequest('http://localhost:3000/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content: 'Test post' }),
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
    })
  })
})

// ─── Tests: GET /api/posts ────────────────────────────────────────────────────

describe('GET /api/posts', () => {
  describe('pagination', () => {
    it('fetches posts with default pagination', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: () => ({
          range: () =>
            Promise.resolve({
              data: mockPosts,
              count: 100,
              error: null,
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      const request = new NextRequest('http://localhost:3000/api/posts')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toEqual(mockPosts)
      expect(data.pagination).toEqual({
        limit: 20,
        offset: 0,
        total: 100,
      })
    })

    it('respects custom limit parameter', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: () => ({
          range: () =>
            Promise.resolve({
              data: mockPosts,
              count: 100,
              error: null,
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/posts?limit=50'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination.limit).toBe(50)
    })

    it('caps limit at 100', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: () => ({
          range: () =>
            Promise.resolve({
              data: [],
              count: 0,
              error: null,
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/posts?limit=500'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination.limit).toBe(100)
    })

    it('respects offset parameter', async () => {
      const mockRange = vi.fn().mockResolvedValue({
        data: [],
        count: 100,
        error: null,
      })
      const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/posts?offset=40'
      )

      await GET(request)

      expect(mockRange).toHaveBeenCalledWith(40, 59)
    })
  })

  describe('filtering', () => {
    it('filters by user_id when provided', async () => {
      const mockEq = vi.fn().mockResolvedValue({
        data: [mockPost],
        count: 1,
        error: null,
      })
      const mockRange = vi.fn().mockReturnValue({ eq: mockEq })
      const mockOrder = vi.fn().mockReturnValue({ range: mockRange })
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/posts?user_id=user-123'
      )

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(mockEq).toHaveBeenCalledWith('user_id', 'user-123')
    })
  })

  describe('error handling', () => {
    it('returns 500 on database error', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        order: () => ({
          range: () =>
            Promise.resolve({
              data: null,
              count: null,
              error: new Error('Database error'),
            }),
        }),
      })

      mockSupabaseClient.from.mockReturnValue({
        select: mockSelect,
      })

      const request = new NextRequest('http://localhost:3000/api/posts')

      const response = await GET(request)
      expect(response.status).toBe(500)
    })
  })
})
