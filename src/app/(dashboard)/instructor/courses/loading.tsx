import { Skeleton } from '@/components/ui/skeleton'

export default function InstructorCoursesLoading() {
  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <Skeleton className="h-8 w-28 rounded-xl" />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40 rounded-xl" />
          <Skeleton className="h-4 w-52 rounded-lg" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 border border-indigo-500/10 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-6 w-6 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl border border-indigo-500/10 overflow-hidden">
            <Skeleton className="h-44 rounded-none" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-14 rounded-xl" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
