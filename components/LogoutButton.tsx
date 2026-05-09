'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConfirmDialog } from '@/components/ConfirmDialog'

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function performLogout() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (!res.ok) {
        setError('Erro ao sair. Tenta novamente.')
        return
      }
      onLogout?.()
      setDialogOpen(false)
      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Erro de conexão. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleClick() {
    if (loading) return
    if (showConfirm) {
      setError(null)
      setDialogOpen(true)
      return
    }
    performLogout()
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading}
        className={className}
      >
        {children}
      </button>

      <ConfirmDialog
        isOpen={dialogOpen}
        onClose={() => !loading && setDialogOpen(false)}
        onConfirm={performLogout}
        title="Terminar sessão?"
        message="Vais ter de iniciar sessão novamente para aceder à tua conta."
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        variant="danger"
        icon="logout"
        isLoading={loading}
        error={error}
      />
    </>
  )
}
