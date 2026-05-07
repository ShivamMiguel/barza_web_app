'use client'

import { useEffect, useRef, useState } from 'react'

const EMOJI_GROUPS: { name: string; emojis: string[] }[] = [
  {
    name: 'Smileys',
    emojis: ['😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','😉','😌','😍','🥰','😘','😋','😎','🤩','🥳','🤔','😏','😴','😪','😢','😭','😱','😡','🤯','😤','🥺','🙃'],
  },
  {
    name: 'Reactions',
    emojis: ['👍','👎','👏','🙌','🤝','🙏','✨','🔥','💯','❤️','🧡','💛','💚','💙','💜','🖤','💕','💖','💗','💔','💪','✌️','👌','🤙','🫶','👀','💭','🎉'],
  },
  {
    name: 'Beauty & Style',
    emojis: ['💄','💋','👄','💇','💇‍♀️','💇‍♂️','💈','✂️','💆','💆‍♀️','💆‍♂️','🧴','🛁','🧼','🪞','🧖','🧖‍♀️','🧖‍♂️','💅','💎','👑','👗','👠','👜','💍','🌸','🌺','🌹','🌷','💐'],
  },
]

interface Props {
  onSelect: (emoji: string) => void
  disabled?: boolean
  size?: 'sm' | 'md'
}

export function EmojiPicker({ onSelect, disabled, size = 'md' }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const triggerSize = size === 'sm' ? 'p-1.5 text-base' : 'p-2 text-xl'
  const iconSize = size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        disabled={disabled}
        className={`${triggerSize} rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-primary-container disabled:opacity-50`}
        aria-label="Adicionar emoji"
        aria-expanded={open}
        title="Adicionar emoji"
      >
        <span className={`material-symbols-outlined ${iconSize}`}>mood</span>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 z-50 w-80 max-w-[90vw] bg-surface-container-high rounded-2xl shadow-2xl border border-[rgba(86,67,58,0.2)] overflow-hidden">
          <div className="max-h-72 overflow-y-auto p-2">
            {EMOJI_GROUPS.map(group => (
              <div key={group.name} className="mb-2 last:mb-0">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 font-bold px-2 py-1.5">{group.name}</p>
                <div className="grid grid-cols-8 gap-1">
                  {group.emojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => onSelect(emoji)}
                      className="aspect-square flex items-center justify-center rounded-lg hover:bg-surface-container-highest transition-colors text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
