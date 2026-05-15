'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ServiceModal } from '@/components/ServiceModal'
import type { ProfessionalSpace, ProfessionalService } from '@/lib/supabase/professional-spaces'

interface Props {
  space: ProfessionalSpace
  variant?: 'link' | 'pill'
}

export function AddServiceButton({ space, variant = 'link' }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const base = variant === 'pill'
    ? 'inline-flex items-center gap-2 px-5 py-2.5 rounded-full volcanic-gradient text-on-primary text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform'
    : 'flex items-center gap-1 text-[10px] font-label uppercase tracking-widest text-primary-container hover:underline'

  return (
    <>
      <button onClick={() => setOpen(true)} className={base}>
        <span className="material-symbols-outlined text-sm">add</span>
        Criar Serviço
      </button>

      <ServiceModal
        isOpen={open}
        onClose={() => setOpen(false)}
        spaces={[space]}
        service={null}
        onSaved={(_: ProfessionalService) => { router.refresh() }}
      />
    </>
  )
}
