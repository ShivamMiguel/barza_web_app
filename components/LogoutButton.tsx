'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  children: React.ReactNode
  className?: string
  redirectTo?: string
  confirm?: boolean
  onLogout?: () => void
}

export function LogoutButton({
  children,
  className,
  redirectTo = '/',
  confirm: showConfirm = true,
  onLogout,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (loading) return
    if (showConfirm && !confirm('Tem a certeza que queres sair?')) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (!res.ok) {
        setLoading(false)
        alert('Erro ao sair. Tenta novamente.')
        return
      }
      onLogout?.()
      router.push(redirectTo)
      router.refresh()
    } catch {
      setLoading(false)
      alert('Erro de conexão. Tenta novamente.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-busy={loading}
      className={className}
    >
      {children}
    </button>
  )
}
