const COLORS = [
  '#ff9156', '#e67e22', '#9b59b6',
  '#3498db', '#1abc9c', '#e74c3c',
  '#f39c12', '#16a085', '#8e44ad',
]

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function getBgColor(name: string): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return COLORS[hash % COLORS.length]
}

interface AvatarProps {
  name: string
  avatarUrl?: string | null
  /** Tailwind text-size class applied to the initials. Default: "text-sm" */
  textSize?: string
}

export function Avatar({ name, avatarUrl, textSize = 'text-sm' }: AvatarProps) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
  }

  return (
    <div
      className={`w-full h-full flex items-center justify-center font-headline font-bold text-white select-none ${textSize}`}
      style={{ backgroundColor: getBgColor(name) }}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
