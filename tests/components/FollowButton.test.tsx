import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FollowButton } from '@/components/FollowButton'

const mockFetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  global.fetch = mockFetch
})

function summary(opts: {
  followers?: number
  following?: number
  is_following?: boolean | null
}) {
  return {
    followers: opts.followers ?? 0,
    following: opts.following ?? 0,
    is_following: opts.is_following ?? false,
  }
}

// ─── Initial state ───────────────────────────────────────────────────────────

describe('FollowButton — bootstrap', () => {
  it('hydrates from GET /api/users/[id]/follow when initialIsFollowing is absent', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => summary({ is_following: true, followers: 12 }),
    })
    render(<FollowButton userId="user-1" />)
    expect(await screen.findByRole('button', { name: /A seguir/i })).toBeInTheDocument()
    expect(mockFetch).toHaveBeenCalledWith('/api/users/user-1/follow')
  })

  it('hides itself when summary returns is_following=null (anonymous / self)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => summary({ is_following: null }),
    })
    const { container } = render(<FollowButton userId="user-1" />)
    await waitFor(() => {
      expect(container.querySelector('button')).toBeNull()
    })
  })

  it('renders "Seguir" immediately when initialIsFollowing=false (skips bootstrap)', () => {
    render(<FollowButton userId="user-1" initialIsFollowing={false} />)
    expect(screen.getByRole('button', { name: /Seguir/i })).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })
})

// ─── Toggling ────────────────────────────────────────────────────────────────

describe('FollowButton — follow', () => {
  it('POSTs to follow, flips state, and emits onChange', async () => {
    const onChange = vi.fn()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () =>
        summary({ is_following: true, followers: 5, following: 1 }),
    })
    render(
      <FollowButton
        userId="user-1"
        initialIsFollowing={false}
        onChange={onChange}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Seguir/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/users/user-1/follow', {
        method: 'POST',
      })
    })

    expect(await screen.findByRole('button', { name: /A seguir/i })).toBeInTheDocument()
    expect(onChange).toHaveBeenCalledWith({
      followers: 5,
      following: 1,
      is_following: true,
    })
  })

  it('rolls back when the POST fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Falha do servidor' }),
    })
    render(<FollowButton userId="user-1" initialIsFollowing={false} />)
    fireEvent.click(screen.getByRole('button', { name: /Seguir/i }))

    // After the rejection, we're back to "Seguir" + show error
    expect(await screen.findByText('Falha do servidor')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Seguir/i })).toBeInTheDocument()
  })
})

describe('FollowButton — unfollow', () => {
  it('DELETEs to unfollow and flips state back', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () =>
        summary({ is_following: false, followers: 4, following: 1 }),
    })
    render(<FollowButton userId="user-1" initialIsFollowing={true} />)

    const btn = screen.getByRole('button', { name: /A seguir/i })
    fireEvent.click(btn)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/users/user-1/follow', {
        method: 'DELETE',
      })
    })
    expect(await screen.findByRole('button', { name: /Seguir/i })).toBeInTheDocument()
  })

  it('shows "Deixar de seguir" on hover when currently following', () => {
    render(<FollowButton userId="user-1" initialIsFollowing={true} />)
    const btn = screen.getByRole('button', { name: /A seguir/i })
    fireEvent.mouseEnter(btn)
    expect(screen.getByRole('button', { name: /Deixar de seguir/i })).toBeInTheDocument()
    fireEvent.mouseLeave(btn)
    expect(screen.getByRole('button', { name: /A seguir/i })).toBeInTheDocument()
  })
})
