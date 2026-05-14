'use client'

import { useState } from 'react'
import { CreateSpaceModal } from '@/components/CreateSpaceModal'

type Variant = 'link' | 'pill'

export function CreateSpaceButton({ variant = 'link', className }: { variant?: Variant; className?: string }) {
  const [open, setOpen] = useState(false)

  const base = variant === 'pill'
    ? 'inline-flex items-center gap-2 px-5 py-2.5 rounded-full volcanic-gradient text-on-primary text-xs font-bold uppercase tracking-widest active:scale-95 transition-transform'
    : 'flex items-center gap-1 text-[10px] font-label uppercase tracking-widest text-primary-container hover:underline'

  return (
    <>
      <button onClick={() => setOpen(true)} className={className ?? base}>
        <span className="material-symbols-outlined text-sm">add_business</span>
        {variant === 'pill' ? 'Criar Espaço' : 'Criar Espaço'}
      </button>
      <CreateSpaceModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
