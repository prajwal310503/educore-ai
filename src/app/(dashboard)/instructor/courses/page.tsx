import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Users, BookOpen, TrendingUp, Star, GraduationCap, Sparkles } from 'lucide-react'
import { BackButton } from '@/components/shared/BackButton'
import { CourseGrid } from '@/components/instructor/CourseGrid'

export default async function InstructorCoursesPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (!['INSTRUCTOR', 'ADMIN'].includes(session.user.role)) redirect('/dashboard')

  const courses = await prisma.course.findMany({
    where: { instructorId: session.user.id, isDeleted: false },
    include: { _count: { select: { enrollments: true, chapters: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const totalStudents = courses.reduce((sum, c) => sum + c._count.enrollments, 0)
  const totalRevenue = courses.reduce((sum, c) => sum + c.price * c._count.enrollments, 0)
  const publishedCount = courses.filter(c => c.isPublished).length

  const summaryStats = [
    { label: 'Total Courses',  value: courses.length,                icon: BookOpen,   bg: 'from-indigo-500 to-blue-600',    shadow: 'shadow-indigo-500/30' },
    { label: 'Total Students', value: totalStudents,                 icon: Users,      bg: 'from-emerald-500 to-teal-600',   shadow: 'shadow-emerald-500/30' },
    { label: 'Published',      value: publishedCount,                icon: Star,       bg: 'from-amber-500 to-orange-600',   shadow: 'shadow-amber-500/30' },
    { label: 'Total Revenue',  value: `$${totalRevenue.toFixed(0)}`, icon: TrendingUp, bg: 'from-violet-500 to-purple-600',  shadow: 'shadow-violet-500/30' },
  ]

  return (
    <div className="space-y-6">
      <BackButton label="Dashboard" href="/dashboard" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-muted-foreground text-sm">Manage and create your courses</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/25 rounded-xl h-10 px-5">
          <Link href="/instructor/courses/new">
            <Plus className="h-4 w-4 mr-1.5" /> New Course
          </Link>
        </Button>
      </div>

      {/* Vivid stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryStats.map((s, i) => (
          <div
            key={s.label}
            className={`relative rounded-2xl p-5 overflow-hidden bg-gradient-to-br ${s.bg} shadow-lg ${s.shadow}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-black/20 blur-2xl" />
            <div className="relative">
              <div className="p-2 rounded-xl bg-white/20 w-fit mb-3">
                <s.icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/70 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Course grid (client component for delete) */}
      {courses.length > 0 ? (
        <CourseGrid courses={courses} />
      ) : (
        <div className="rounded-2xl p-16 text-center border border-dashed border-indigo-500/25 bg-indigo-500/3">
          <div className="p-5 rounded-3xl bg-indigo-500/10 w-fit mx-auto mb-5">
            <GraduationCap className="h-12 w-12 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Create your first course to start teaching and earning</p>
          <Button asChild className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/25 rounded-xl">
            <Link href="/instructor/courses/new">
              <Sparkles className="h-4 w-4 mr-2" /> Create First Course
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
