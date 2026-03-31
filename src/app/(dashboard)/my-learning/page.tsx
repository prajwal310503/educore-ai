import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen, Trophy, Target, Clock, Play, CheckCircle2,
  GraduationCap, Sparkles, TrendingUp, Award, RotateCcw
} from 'lucide-react'
import { AiThumbnail } from '@/components/shared/AiThumbnail'

export default async function MyLearningPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role !== 'STUDENT') redirect('/dashboard')

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          _count: { select: { chapters: true } },
        },
      },
      progress: true,
    },
    orderBy: { enrolledAt: 'desc' },
  })

  const inProgress = enrollments.filter(e => {
    const done = e.progress.filter(p => p.isCompleted).length
    return done > 0 && done < e.progress.length
  })
  const completed = enrollments.filter(e => {
    const total = e.progress.length
    const done = e.progress.filter(p => p.isCompleted).length
    return total > 0 && done === total
  })
  const notStarted = enrollments.filter(e => {
    const done = e.progress.filter(p => p.isCompleted).length
    return done === 0
  })

  const totalChaptersCompleted = enrollments.reduce((sum, e) => sum + e.progress.filter(p => p.isCompleted).length, 0)
  const overallProgress = enrollments.length
    ? Math.round(
        enrollments.reduce((sum, e) => {
          const total = e.progress.length
          const done = e.progress.filter(p => p.isCompleted).length
          return sum + (total > 0 ? done / total : 0)
        }, 0) / enrollments.length * 100
      )
    : 0

  const stats = [
    { label: 'Enrolled',     value: enrollments.length,       icon: BookOpen,   bg: 'from-indigo-500 to-blue-600',  shadow: 'shadow-indigo-500/30' },
    { label: 'In Progress',  value: inProgress.length,         icon: TrendingUp, bg: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/30' },
    { label: 'Completed',    value: completed.length,           icon: Trophy,     bg: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/30' },
    { label: 'Chapters Done',value: totalChaptersCompleted,     icon: Target,     bg: 'from-violet-500 to-purple-600',shadow: 'shadow-violet-500/30' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Student</p>
          <h1 className="text-3xl font-bold">
            My <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Learning</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your progress across all enrolled courses</p>
        </div>
        <Link href="/courses">
          <button className="btn-shimmer bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> Browse More
          </button>
        </Link>
      </div>

      {/* Stats — vivid colored cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`relative rounded-2xl p-5 overflow-hidden bg-gradient-to-br ${stat.bg} shadow-lg ${stat.shadow} animate-fade-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-black/20 blur-2xl" />
            <div className="relative">
              <div className="p-2 rounded-xl bg-white/20 w-fit mb-3">
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/70 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      {enrollments.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-indigo-500/15">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="font-semibold text-sm">Overall Learning Progress</span>
            </div>
            <span className="text-2xl font-bold gradient-text">{overallProgress}%</span>
          </div>
          <div className="h-3 rounded-full bg-indigo-500/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 relative"
              style={{ width: `${overallProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full" />
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{totalChaptersCompleted} chapters completed</span>
            <span>{completed.length} of {enrollments.length} courses finished</span>
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgress.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/25">
              <Clock className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-bold text-amber-400">Continue Learning</h2>
              <span className="ml-1 text-xs bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-full font-bold">{inProgress.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgress.map((e, i) => {
              const total = e.progress.length
              const done = e.progress.filter(p => p.isCompleted).length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <div
                  key={e.id}
                  className="glass-card rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 group animate-fade-up overflow-hidden"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="relative h-36 overflow-hidden">
                    {e.course.thumbnail ? (
                      <Image src={e.course.thumbnail} alt={e.course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <AiThumbnail courseId={e.course.id} title={e.course.title} category={e.course.category} description={e.course.title} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <Badge className="absolute top-3 left-3 bg-black/65 border-white/20 text-white text-xs font-semibold">
                      {e.course.category}
                    </Badge>
                    <div className="absolute bottom-3 right-3 p-2 rounded-full bg-amber-500/90 backdrop-blur-sm group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="h-3.5 w-3.5 text-white fill-white" />
                    </div>
                    <div className="absolute bottom-3 left-3 text-xs text-white/80 font-medium bg-black/65 px-2 py-0.5 rounded-full">
                      {done}/{total} chapters
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-0.5 line-clamp-2 group-hover:text-amber-400 transition-colors leading-snug">{e.course.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">by {e.course.instructor.name}</p>
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-amber-400">{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-amber-500/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <Link href={`/courses/${e.course.id}/learn`}>
                      <button className="w-full py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-1.5">
                        <Play className="h-3 w-3 fill-white" /> Continue Learning
                      </button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Not Started */}
      {notStarted.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-blue-500/20 border border-indigo-500/25">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-indigo-400">Not Started Yet</h2>
              <span className="ml-1 text-xs bg-indigo-400/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-bold">{notStarted.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notStarted.map((e, i) => (
              <div
                key={e.id}
                className="glass-card rounded-2xl border border-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 group animate-fade-up overflow-hidden"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative h-36 overflow-hidden">
                  {e.course.thumbnail ? (
                    <Image src={e.course.thumbnail} alt={e.course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <AiThumbnail courseId={e.course.id} title={e.course.title} category={e.course.category} description={e.course.title} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-black/65 border-white/20 text-white text-xs font-semibold">
                    {e.course.category}
                  </Badge>
                  <div className="absolute bottom-3 left-3 text-xs text-white/80 font-medium bg-black/65 px-2 py-0.5 rounded-full">
                    {e.course._count.chapters} chapters
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-0.5 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug">{e.course.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">by {e.course.instructor.name}</p>
                  <Link href={`/courses/${e.course.id}/learn`}>
                    <button className="w-full py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-1.5">
                      <Play className="h-3 w-3 fill-white" /> Start Course
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/25">
              <Trophy className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-emerald-400">Completed Courses</h2>
              <span className="ml-1 text-xs bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">{completed.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((e, i) => (
              <div
                key={e.id}
                className="glass-card rounded-2xl border border-emerald-500/25 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 group animate-fade-up overflow-hidden"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative h-36 overflow-hidden">
                  {e.course.thumbnail ? (
                    <Image src={e.course.thumbnail} alt={e.course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <AiThumbnail courseId={e.course.id} title={e.course.title} category={e.course.category} description={e.course.title} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-black/65 border-white/20 text-white text-xs font-semibold">
                    {e.course.category}
                  </Badge>
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm shadow-lg">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-emerald-300 font-medium bg-black/65 px-2 py-0.5 rounded-full">
                    <Award className="h-3 w-3" /> Completed
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-0.5 line-clamp-2 group-hover:text-emerald-400 transition-colors leading-snug">{e.course.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">by {e.course.instructor.name}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-1.5 flex-1 rounded-full bg-emerald-500/20 overflow-hidden">
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
                    </div>
                    <span className="text-xs font-bold text-emerald-400">100%</span>
                  </div>
                  <Link href={`/courses/${e.course.id}/learn`}>
                    <button className="w-full py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all flex items-center justify-center gap-1.5">
                      <RotateCcw className="h-3 w-3" /> Review Course
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {enrollments.length === 0 && (
        <div className="glass-card rounded-2xl p-16 text-center border border-indigo-500/15">
          <div className="p-4 rounded-2xl bg-indigo-500/10 w-fit mx-auto mb-4">
            <GraduationCap className="h-12 w-12 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-6 text-sm">Start your learning journey by enrolling in a course</p>
          <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-4 w-4" /> Browse Courses
          </Link>
        </div>
      )}
    </div>
  )
}
