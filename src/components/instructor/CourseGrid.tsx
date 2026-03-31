'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AiThumbnail } from '@/components/shared/AiThumbnail'
import { PenLine, Trash2, Loader2, AlertTriangle, BookOpen, Users, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

type Course = {
  id: string
  title: string
  description: string
  category: string
  level: string
  price: number
  thumbnail: string | null
  isPublished: boolean
  createdAt: Date
  _count: { enrollments: number; chapters: number }
}

export function CourseGrid({ courses }: { courses: Course[] }) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/courses/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Course deleted')
        setDeleteTarget(null)
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={open => { if (!open) setDeleteTarget(null) }}>
        <DialogContent className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Delete Course
            </DialogTitle>
          </DialogHeader>
          <div className="py-1 space-y-3">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">{deleteTarget?.title}</span>?
            </p>
            <div className="p-3 rounded-xl bg-destructive/8 border border-destructive/20 text-xs text-destructive font-medium">
              ⚠ All chapters, quizzes and student progress will be permanently lost.
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90 text-white border-0"
            >
              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Trash2 className="h-3.5 w-3.5 mr-1.5" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course, i) => {
          const revenue = course.price * course._count.enrollments
          return (
            <div
              key={course.id}
              className="rounded-2xl border border-white/10 bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Thumbnail */}
              <div className="relative h-44 overflow-hidden">
                {course.thumbnail ? (
                  <Image src={course.thumbnail} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <AiThumbnail courseId={course.id} title={course.title} category={course.category} description={course.description} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Status badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${
                    course.isPublished
                      ? 'bg-emerald-500 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/30'
                      : 'bg-zinc-800/80 text-zinc-300 border-white/15'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Level badge */}
                <span className="absolute top-3 right-3 text-[10px] font-semibold bg-black/60 backdrop-blur-sm text-white/90 px-2.5 py-1 rounded-full border border-white/20">
                  {course.level}
                </span>

                {/* Price */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-white font-bold text-lg drop-shadow-lg">${course.price}</span>
                </div>

                {/* Delete button — visible on hover */}
                <button
                  onClick={e => { e.preventDefault(); setDeleteTarget(course) }}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/15 text-white/70 hover:bg-red-500/80 hover:text-white hover:border-red-400/50 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                  title="Delete course"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{course.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <BookOpen className="h-3 w-3 text-indigo-400" />
                      <p className="text-sm font-bold text-indigo-400">{course._count.chapters}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Chapters</p>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <Users className="h-3 w-3 text-emerald-400" />
                      <p className="text-sm font-bold text-emerald-400">{course._count.enrollments}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Students</p>
                  </div>
                  <div className="text-center p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <DollarSign className="h-3 w-3 text-amber-400" />
                      <p className="text-sm font-bold text-amber-400">${revenue.toFixed(0)}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Revenue</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
                    {course.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/instructor/courses/${course.id}/edit`} className="flex-1">
                    <button className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40">
                      <PenLine className="h-3.5 w-3.5" /> Edit Course
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(course)}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold border border-destructive/25 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all"
                    title="Delete course"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
