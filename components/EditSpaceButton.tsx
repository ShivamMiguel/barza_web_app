'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EditSpaceModal } from '@/components/EditSpaceModal'
import type { ProfessionalSpace } from '@/lib/supabase/professional-spaces'

export function EditSpaceButton({ space }: { space: ProfessionalSpace }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary-container/30 text-primary-container text-[10px] font-label uppercase tracking-widest hover:bg-primary-container/10 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">edit</span>
        Editar Perfil
      </button>

      <EditSpaceModal
        isOpen={open}
        onClose={() => setOpen(false)}
        space={space}
        onSaved={() => router.refresh()}
      />
    </>
  )
}
