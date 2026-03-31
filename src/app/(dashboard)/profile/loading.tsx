import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-1">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-4 w-52 rounded-lg" />
      </div>

      {/* Profile card */}
      <div className="glass-card rounded-2xl border border-indigo-500/10 p-6 flex gap-6 items-start">
        <Skeleton className="h-24 w-24 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 border border-indigo-500/10 space-y-2 text-center">
            <Skeleton className="h-7 w-10 rounded mx-auto" />
            <Skeleton className="h-3 w-16 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Form area */}
      <div className="glass-card rounded-2xl border border-indigo-500/10 p-6 space-y-4">
        <Skeleton className="h-6 w-32 rounded-lg" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  )
}
