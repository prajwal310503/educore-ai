'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

interface Props {
  label?: string
  href?: string   // optional: go to a specific route instead of history.back()
  className?: string
}

export function BackButton({ label = 'Back', href, className = '' }: Props) {
  const router = useRouter()

  const handleClick = () => {
    if (href) router.push(href)
    else router.back()
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group ${className}`}
    >
      <span className="p-1 rounded-lg border border-white/10 bg-white/5 group-hover:bg-white/10 group-hover:border-indigo-500/30 transition-all">
        <ChevronLeft className="h-3.5 w-3.5" />
      </span>
      {label}
    </button>
  )
}
