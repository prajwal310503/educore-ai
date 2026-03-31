import { Skeleton } from '@/components/ui/skeleton'

export default function LeaderboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-44 rounded-xl" />
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>
      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-4 py-6">
        <Skeleton className="h-28 w-24 rounded-2xl" />
        <Skeleton className="h-36 w-24 rounded-2xl" />
        <Skeleton className="h-24 w-24 rounded-2xl" />
      </div>
      {/* List */}
      <div className="glass-card rounded-2xl border border-indigo-500/10 divide-y divide-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-6 w-6 rounded shrink-0" />
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
