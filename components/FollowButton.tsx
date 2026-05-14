'use client'

import { useEffect, useState } from 'react'

interface FollowButtonProps {
  /** profile id of the user being followed */
  userId: string
  /**
   * If known up-front (e.g. SSR'd profile page), pass it in to avoid the
   * initial GET round-trip. Otherwise the button fetches it on mount.
   */
  initialIsFollowing?: boolean
  /**
   * Called after every successful follow/unfollow with the fresh
   * { followers, following, is_following } summary from the server.
   */
  onChange?: (summary: {
    followers: number
    following: number
    is_following: boolean | null
  }) => void
  /** Hide entirely when the viewer is unauthenticated. */
  hiddenWhenAnonymous?: boolean
  /** Tighter pill — for inline use (post cards, headers, etc.). */
  compact?: boolean
  className?: string
}

type Stage = 'idle' | 'loading' | 'unknown'

export function FollowButton({
  userId,
  initialIsFollowing,
  onChange,
  hiddenWhenAnonymous = false,
  compact = false,
  className = '',
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(
    initialIsFollowing ?? null,
  )
  const [stage, setStage] = useState<Stage>(
    initialIsFollowing === undefined ? 'unknown' : 'idle',
  )
  const [error, setError] = useState<string | null>(null)
  const [hovered, setHovered] = useState(false)

  // Bootstrap follow state if we don't have it
  useEffect(() => {
    if (initialIsFollowing !== undefined) return
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/users/${userId}/follow`)
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        setIsFollowing(data.is_following)
        setStage('idle')
      } catch {
        if (!cancelled) setStage('idle')
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userId, initialIsFollowing])

  // is_following === null means: anonymous OR viewing self → hide
  if (isFollowing === null) {
    if (stage === 'unknown') return null
    if (hiddenWhenAnonymous) return null
    return null
  }

  async function toggle() {
    if (stage === 'loading') return
    const willFollow = !isFollowing
    // Optimistic flip
    setIsFollowing(willFollow)
    setStage('loading')
    setError(null)
    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: willFollow ? 'POST' : 'DELETE',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setIsFollowing(!willFollow) // rollback
        setError(data.error ?? 'Erro. Tenta novamente.')
        return
      }
      setIsFollowing(data.is_following ?? willFollow)
      onChange?.({
        followers: data.followers ?? 0,
        following: data.following ?? 0,
        is_following: data.is_following ?? willFollow,
      })
    } catch {
      setIsFollowing(!willFollow) // rollback
      setError('Erro de conexão.')
    } finally {
      setStage('idle')
    }
  }

  const isLoading = stage === 'loading'
  const label = isFollowing
    ? hovered && !isLoading
      ? 'Deixar de seguir'
      : 'A seguir'
    : 'Seguir'

  // Two visual modes — same dimensions, different surface
  const sizing = compact
    ? 'gap-1.5 px-3 py-1 text-[10px]'
    : 'gap-2 px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm min-w-[120px]'
  const base = `inline-flex items-center justify-center rounded-lg font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${sizing}`
  const followingClass = `${base} bg-surface-container border border-outline-variant/30 text-on-surface hover:border-error/40 hover:text-error`
  const notFollowingClass = `${base} bg-primary-container text-on-primary-container shadow-md shadow-primary-container/20 hover:brightness-110`

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        disabled={isLoading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-pressed={isFollowing}
        className={isFollowing ? followingClass : notFollowingClass}
      >
        {isLoading && (
          <span
            className={`material-symbols-outlined animate-spin ${compact ? 'text-xs' : 'text-sm'}`}
          >
            progress_activity
          </span>
        )}
        {!isLoading && isFollowing && (
          <span
            className={`material-symbols-outlined ${compact ? 'text-xs' : 'text-sm'}`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {hovered ? 'person_remove' : 'check'}
          </span>
        )}
        {!isLoading && !isFollowing && (
          <span
            className={`material-symbols-outlined ${compact ? 'text-xs' : 'text-sm'}`}
          >
            person_add
          </span>
        )}
        <span>{label}</span>
      </button>
      {error && (
        <p className="text-error text-[10px] uppercase tracking-widest font-bold">
          {error}
        </p>
      )}
    </div>
  )
}
