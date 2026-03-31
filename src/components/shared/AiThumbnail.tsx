'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Sparkles, Code2, BarChart2, Palette, TrendingUp, Briefcase, Server, MoreHorizontal } from 'lucide-react'

// In-memory cache so we don't regenerate on every render
const cache = new Map<string, string | 'failed'>()

const CATEGORY_FALLBACK: Record<string, { gradient: string; icon: React.ElementType; pattern: string }> = {
  'Web Development': {
    gradient: 'from-blue-600 via-indigo-600 to-violet-700',
    icon: Code2,
    pattern: 'M10 10 L30 10 L30 30 M20 10 L20 0 M10 20 L0 20',
  },
  'Data Science': {
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-700',
    icon: BarChart2,
    pattern: 'M4 20 L4 12 M10 20 L10 6 M16 20 L16 14 M22 20 L22 4',
  },
  'Design': {
    gradient: 'from-pink-600 via-rose-500 to-orange-500',
    icon: Palette,
    pattern: 'M12 2 C6 2 2 6 2 12 C2 18 6 22 12 22',
  },
  'Marketing': {
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    icon: TrendingUp,
    pattern: 'M2 18 L8 12 L14 16 L22 6',
  },
  'Business': {
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    icon: Briefcase,
    pattern: 'M6 4 L18 4 L18 20 L6 20 Z M10 4 L10 2 L14 2 L14 4',
  },
  'DevOps': {
    gradient: 'from-slate-600 via-gray-600 to-zinc-700',
    icon: Server,
    pattern: 'M2 6 L22 6 M2 12 L22 12 M2 18 L22 18 M6 4 L6 8 M6 10 L6 14',
  },
}

function CategoryFallback({ category, title }: { category: string; title: string }) {
  const config = CATEGORY_FALLBACK[category] ?? {
    gradient: 'from-indigo-600 via-blue-600 to-sky-600',
    icon: MoreHorizontal,
    pattern: 'M5 12 L19 12 M12 5 L12 19',
  }
  const Icon = config.icon

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} flex flex-col items-center justify-center`}>
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Glow */}
      <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-black/20 blur-2xl" />

      {/* Icon */}
      <div className="relative p-4 rounded-2xl bg-black/25 border border-white/30 mb-3 shadow-lg">
        <Icon className="h-8 w-8 text-white" />
      </div>

      {/* Category label */}
      <span className="relative text-[11px] font-bold text-white tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-black/40 border border-white/30">
        {category}
      </span>
    </div>
  )
}

interface Props {
  courseId: string
  title: string
  category: string
  description: string
}

export function AiThumbnail({ courseId, title, category, description }: Props) {
  const cached = cache.get(courseId)
  const [dataUrl, setDataUrl] = useState<string | null>(
    cached && cached !== 'failed' ? cached : null
  )
  const [status, setStatus] = useState<'loading' | 'done' | 'failed'>(
    cached === 'failed' ? 'failed' : cached ? 'done' : 'loading'
  )

  useEffect(() => {
    if (cache.has(courseId)) return
    let cancelled = false

    async function generate() {
      try {
        const res = await fetch('/api/ai/thumbnail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, category, description }),
        })
        const data = await res.json()
        if (cancelled) return
        if (data.success && data.dataUrl) {
          cache.set(courseId, data.dataUrl)
          setDataUrl(data.dataUrl)
          setStatus('done')
        } else {
          cache.set(courseId, 'failed')
          setStatus('failed')
        }
      } catch {
        if (!cancelled) {
          cache.set(courseId, 'failed')
          setStatus('failed')
        }
      }
    }

    generate()
    return () => { cancelled = true }
  }, [courseId, title, category, description])

  // While loading — show category fallback with a subtle shimmer
  if (status === 'loading') {
    return (
      <>
        <CategoryFallback category={category} title={title} />
        <div className="absolute inset-0 flex items-end justify-end p-2">
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/15 animate-pulse">
            <Sparkles className="h-2.5 w-2.5 text-violet-300" />
            <span className="text-[9px] text-white/70 font-medium">Generating...</span>
          </div>
        </div>
      </>
    )
  }

  // AI failed — show category fallback permanently
  if (status === 'failed' || !dataUrl) {
    return <CategoryFallback category={category} title={title} />
  }

  // AI succeeded
  return (
    <>
      <Image src={dataUrl} alt={title} fill className="object-cover" unoptimized />
      <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/15">
        <Sparkles className="h-2.5 w-2.5 text-violet-300" />
        <span className="text-[9px] text-white/70 font-medium">AI</span>
      </div>
    </>
  )
}
