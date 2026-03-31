import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Trophy, Target, ClipboardList, Users, TrendingUp, ArrowRight, Sparkles, Play, RotateCcw, GraduationCap, CheckCircle2, Star } from 'lucide-react'
import { AiThumbnail } from '@/components/shared/AiThumbnail'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role

  if (role === 'STUDENT') {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: { id: true, title: true, thumbnail: true, category: true, _count: { select: { chapters: true } } },
        },
        progress: true,
      },
      orderBy: { enrolledAt: 'desc' },
    })

    const submissions = await prisma.submission.findMany({
      where: { userId: session.user.id },
      include: { quiz: { select: { title: true } } },
      orderBy: { submittedAt: 'desc' },
      take: 5,
    })

    const avgScore = submissions.length
      ? submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length
      : 0

    const completedCourses = enrollments.filter(e => {
      const total = e.progress.length
      const done = e.progress.filter(p => p.isCompleted).length
      return total > 0 && done === total
    }).length

    const inProgressCount = enrollments.filter(e => {
      const done = e.progress.filter(p => p.isCompleted).length
      return done > 0 && done < e.progress.length
    }).length
    const overallPct = enrollments.length
      ? Math.round(enrollments.reduce((sum, e) => {
          const total = e.progress.length
          const done = e.progress.filter(p => p.isCompleted).length
          return sum + (total > 0 ? done / total : 0)
        }, 0) / enrollments.length * 100)
      : 0

    const stats = [
      { label: 'Enrolled',  value: enrollments.length,   icon: BookOpen,     bg: 'from-indigo-500 to-blue-600',    shadow: 'shadow-indigo-500/30' },
      { label: 'Completed', value: completedCourses,       icon: Trophy,       bg: 'from-emerald-500 to-teal-600',   shadow: 'shadow-emerald-500/30' },
      { label: 'Avg Score', value: `${Math.round(avgScore)}%`, icon: Target,  bg: 'from-violet-500 to-purple-600',  shadow: 'shadow-violet-500/30' },
      { label: 'Quizzes',   value: submissions.length,    icon: ClipboardList, bg: 'from-amber-500 to-orange-600',  shadow: 'shadow-amber-500/30' },
    ]

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Welcome back</p>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{session.user.name?.split(' ')[0]}!</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Ready to continue your learning journey?</p>
          </div>
          <Link href="/courses">
            <button className="btn-shimmer bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" /> Browse Courses
            </button>
          </Link>
        </div>

        {/* Stats — vivid colored cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative rounded-2xl p-5 overflow-hidden bg-gradient-to-br ${stat.bg} shadow-lg ${stat.shadow} animate-fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* bg glow */}
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

        {/* Progress Overview + Quick Actions row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overall Progress */}
          <div className="md:col-span-2 glass-card rounded-2xl p-5 border border-indigo-500/15">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/15">
                  <TrendingUp className="h-4 w-4 text-indigo-400" />
                </div>
                <span className="font-semibold text-sm">Overall Progress</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{overallPct}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/8 overflow-hidden mb-3">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 relative" style={{ width: `${overallPct}%` }}>
                <div className="absolute inset-0 bg-white/20 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: 'In Progress', value: inProgressCount, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                { label: 'Completed',   value: completedCourses,  color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { label: 'Not Started', value: enrollments.length - inProgressCount - completedCourses, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              ].map(item => (
                <div key={item.label} className={`rounded-xl p-3 ${item.bg} border ${item.border} text-center`}>
                  <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-2xl p-5 border border-indigo-500/15 flex flex-col gap-3">
            <p className="font-semibold text-sm mb-1">Quick Actions</p>
            <Link href="/courses" className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all group">
              <div className="p-1.5 rounded-lg bg-indigo-500/20"><BookOpen className="h-3.5 w-3.5 text-indigo-400" /></div>
              <span className="text-xs font-medium">Browse Courses</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto group-hover:text-indigo-400 transition-colors" />
            </Link>
            <Link href="/my-learning" className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-all group">
              <div className="p-1.5 rounded-lg bg-violet-500/20"><Target className="h-3.5 w-3.5 text-violet-400" /></div>
              <span className="text-xs font-medium">My Learning</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto group-hover:text-violet-400 transition-colors" />
            </Link>
            <Link href="/leaderboard" className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all group">
              <div className="p-1.5 rounded-lg bg-amber-500/20"><Trophy className="h-3.5 w-3.5 text-amber-400" /></div>
              <span className="text-xs font-medium">Leaderboard</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto group-hover:text-amber-400 transition-colors" />
            </Link>
          </div>
        </div>

        {/* My Courses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Courses</h2>
            <Link href="/my-learning" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrollments.slice(0, 3).map((e, i) => {
              const total = e.progress.length
              const done = e.progress.filter(p => p.isCompleted).length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              const isCompleted = pct === 100
              const isStarted = done > 0

              return (
                <div
                  key={e.id}
                  className="glass-card rounded-2xl border border-indigo-500/15 hover:border-indigo-500/35 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 group animate-fade-up overflow-hidden"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-36 overflow-hidden">
                    {e.course.thumbnail ? (
                      <Image src={e.course.thumbnail} alt={e.course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <AiThumbnail
                        courseId={e.course.id}
                        title={e.course.title}
                        category={e.course.category}
                        description={e.course.title}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <Badge className="absolute top-3 left-3 bg-black/65 border-white/20 text-white text-xs font-semibold">
                      {e.course.category}
                    </Badge>
                    {isCompleted && (
                      <div className="absolute top-3 right-3 p-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm">
                        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3">
                      <div className={`p-2 rounded-full backdrop-blur-sm shadow-lg transition-transform group-hover:scale-110 ${isCompleted ? 'bg-emerald-500/90' : 'bg-indigo-500/90'}`}>
                        {isCompleted ? <RotateCcw className="h-3.5 w-3.5 text-white" /> : <Play className="h-3.5 w-3.5 text-white fill-white" />}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">{e.course.title}</h3>
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{done}/{total} chapters</span>
                        <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-indigo-400'}`}>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={`/courses/${e.course.id}/learn`}>
                      <button className={`mt-4 w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        isCompleted
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'
                          : isStarted
                          ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-500/25'
                          : 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40'
                      }`}>
                        {isCompleted ? (
                          <><RotateCcw className="h-3 w-3" /> Review Course</>
                        ) : isStarted ? (
                          <><Play className="h-3 w-3 fill-current" /> Continue</>
                        ) : (
                          <><Play className="h-3 w-3 fill-white" /> Start Course</>
                        )}
                      </button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
          {enrollments.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center border border-indigo-100 dark:border-white/5">
              <div className="p-4 rounded-2xl bg-indigo-500/10 w-fit mx-auto mb-4">
                <GraduationCap className="h-10 w-10 text-indigo-400" />
              </div>
              <p className="text-muted-foreground mb-4">No courses enrolled yet.</p>
              <Link href="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20">
                <Sparkles className="h-4 w-4" /> Browse Courses
              </Link>
            </div>
          )}
        </div>

        {/* Quiz Results */}
        {submissions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-500/15">
                  <ClipboardList className="h-4 w-4 text-violet-400" />
                </div>
                <h2 className="text-lg font-semibold">Recent Quiz Results</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {submissions.map((s, i) => {
                const score = Math.round(s.score)
                const isGood = score >= 70
                const isMid = score >= 40 && score < 70
                return (
                  <div key={s.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all animate-fade-up ${
                    isGood ? 'bg-emerald-500/5 border-emerald-500/20' : isMid ? 'bg-amber-500/5 border-amber-500/20' : 'bg-rose-500/5 border-rose-500/20'
                  }`} style={{ animationDelay: `${i * 60}ms` }}>
                    {/* Score ring */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isGood ? 'bg-emerald-500/20 text-emerald-400' : isMid ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {score}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{s.quiz.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(s.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      isGood ? 'bg-emerald-500/15 text-emerald-400' : isMid ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {isGood ? 'Excellent' : isMid ? 'Good' : 'Needs Work'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (role === 'INSTRUCTOR') {
    const courses = await prisma.course.findMany({
      where: { instructorId: session.user.id, isDeleted: false },
      include: {
        _count: { select: { enrollments: true, chapters: true } },
        enrollments: {
          include: { progress: true },
          orderBy: { enrolledAt: 'desc' },
          take: 50,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const totalStudents = courses.reduce((sum, c) => sum + c._count.enrollments, 0)
    const totalRevenue = courses.reduce((sum, c) => sum + (c.price * c._count.enrollments), 0)
    const publishedCount = courses.filter(c => c.isPublished).length

    // Completion rate: avg % of chapters completed per enrollment
    let totalCompletionPct = 0
    let enrollmentCount = 0
    for (const course of courses) {
      const chapterCount = course._count.chapters
      for (const enr of course.enrollments) {
        if (chapterCount > 0) {
          const done = enr.progress.filter(p => p.isCompleted).length
          totalCompletionPct += (done / chapterCount) * 100
          enrollmentCount++
        }
      }
    }
    const avgCompletionRate = enrollmentCount > 0 ? Math.round(totalCompletionPct / enrollmentCount) : 0

    // Recent enrollments (last 5 across all courses)
    const recentEnrollments = await prisma.enrollment.findMany({
      where: { course: { instructorId: session.user.id } },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, category: true } },
      },
      orderBy: { enrolledAt: 'desc' },
      take: 5,
    })

    const instStats = [
      { label: 'My Courses',      value: courses.length,                  icon: BookOpen,    bg: 'from-indigo-500 to-blue-600',   shadow: 'shadow-indigo-500/30' },
      { label: 'Total Students',  value: totalStudents,                   icon: Users,       bg: 'from-emerald-500 to-teal-600',  shadow: 'shadow-emerald-500/30' },
      { label: 'Revenue',         value: `$${totalRevenue.toFixed(0)}`,   icon: TrendingUp,  bg: 'from-amber-500 to-orange-600',  shadow: 'shadow-amber-500/30' },
      { label: 'Avg Completion',  value: `${avgCompletionRate}%`,         icon: Target,      bg: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30' },
    ]

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Instructor</p>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">My</span> Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Welcome back, {session.user.name?.split(' ')[0]}! Here&apos;s your overview.</p>
          </div>
          <Link href="/instructor/courses/new">
            <button className="btn-shimmer bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center gap-2">
              <Star className="h-3.5 w-3.5" /> Create Course
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instStats.map((stat, i) => (
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

        {/* Analytics row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Course performance bars */}
          <div className="md:col-span-2 glass-card rounded-2xl p-5 border border-indigo-500/15">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/15"><TrendingUp className="h-4 w-4 text-indigo-400" /></div>
                <span className="font-semibold text-sm">Course Performance</span>
              </div>
              <span className="text-xs text-muted-foreground">{publishedCount}/{courses.length} published</span>
            </div>
            <div className="space-y-3">
              {courses.slice(0, 4).map(c => {
                const pct = totalStudents > 0 ? Math.round((c._count.enrollments / Math.max(...courses.map(x => x._count.enrollments), 1)) * 100) : 0
                return (
                  <div key={c.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground truncate max-w-[200px]">{c.title}</span>
                      <span className="font-medium text-foreground ml-2 shrink-0">{c._count.enrollments} students</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700" style={{ width: `${Math.max(pct, 4)}%` }} />
                    </div>
                  </div>
                )
              })}
              {courses.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No courses yet</p>}
            </div>
          </div>

          {/* Quick stats panel */}
          <div className="glass-card rounded-2xl p-5 border border-indigo-500/15 flex flex-col gap-3">
            <p className="font-semibold text-sm mb-1">Quick Stats</p>
            {[
              { label: 'Published Courses', value: publishedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              { label: 'Draft Courses',     value: courses.length - publishedCount, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
              { label: 'Avg Students/Course', value: courses.length ? Math.round(totalStudents / courses.length) : 0, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              { label: 'Avg Completion Rate', value: `${avgCompletionRate}%`, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
            ].map(item => (
              <div key={item.label} className={`flex items-center justify-between p-3 rounded-xl ${item.bg} border ${item.border}`}>
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* My Courses with thumbnails */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/15"><BookOpen className="h-4 w-4 text-indigo-400" /></div>
              <h2 className="text-lg font-semibold">My Courses</h2>
            </div>
            <Link href="/instructor/courses" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Manage all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {courses.slice(0, 6).map((c, i) => {
              const revenue = c.price * c._count.enrollments
              return (
                <Link key={c.id} href={`/instructor/courses/${c.id}/edit`}>
                  <div className="glass-card rounded-2xl border border-indigo-500/15 hover:border-indigo-500/35 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group animate-fade-up overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
                    {/* Thumbnail */}
                    <div className="relative h-36 overflow-hidden">
                      {c.thumbnail ? (
                        <Image src={c.thumbnail} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <AiThumbnail courseId={c.id} title={c.title} category={c.category} description={c.description ?? c.title} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <Badge className={`absolute top-3 left-3 text-[10px] border backdrop-blur-sm ${c.isPublished ? 'bg-emerald-500/80 text-white border-emerald-400/40' : 'bg-black/60 text-white/70 border-white/20'}`}>
                        {c.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <span className="absolute top-3 right-3 text-xs font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20">
                        {c.level}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold line-clamp-2 mb-3 group-hover:text-indigo-400 transition-colors leading-snug">{c.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{c._count.chapters} chapters</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{c._count.enrollments} students</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-white/8">
                        <span className="text-xs font-semibold text-emerald-400">${revenue.toFixed(0)} revenue</span>
                        <span className="text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors font-medium">Edit →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          {courses.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center border border-indigo-500/15">
              <div className="p-4 rounded-2xl bg-indigo-500/10 w-fit mx-auto mb-4"><GraduationCap className="h-10 w-10 text-indigo-400" /></div>
              <p className="text-muted-foreground mb-4 text-sm">No courses yet.</p>
              <Link href="/instructor/courses/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20">
                <Sparkles className="h-4 w-4" /> Create First Course
              </Link>
            </div>
          )}
        </div>

        {/* Recent Enrollments */}
        {recentEnrollments.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-emerald-500/15"><Users className="h-4 w-4 text-emerald-400" /></div>
              <h2 className="text-lg font-semibold">Recent Enrollments</h2>
            </div>
            <div className="glass-card rounded-2xl border border-indigo-500/15 overflow-hidden">
              {recentEnrollments.map((enr, i) => (
                <div key={enr.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < recentEnrollments.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/3 transition-colors`}>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-md shadow-indigo-500/25">
                    {enr.user.name?.[0] ?? '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{enr.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{enr.course.title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20 border">{enr.course.category}</Badge>
                    <p className="text-[10px] text-muted-foreground mt-1">{new Date(enr.enrolledAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Admin dashboard — full analytics embedded
  const [totalUsers, totalCourses, totalEnrollments, totalSubmissions] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { isDeleted: false } }),
    prisma.enrollment.count(),
    prisma.submission.count(),
  ])

  const [usersByRole, topCourses, recentEnrollments, avgScoreResult, recentUsers] = await Promise.all([
    prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    prisma.course.findMany({
      where: { isDeleted: false },
      select: {
        id: true, title: true, category: true, isPublished: true, price: true,
        instructor: { select: { name: true } },
        _count: { select: { enrollments: true, chapters: true } },
      },
      orderBy: { enrollments: { _count: 'desc' } },
      take: 8,
    }),
    prisma.enrollment.findMany({
      orderBy: { enrolledAt: 'desc' },
      take: 6,
      select: {
        id: true, enrolledAt: true,
        user: { select: { name: true, email: true } },
        course: { select: { title: true, category: true } },
      },
    }),
    prisma.submission.aggregate({ _avg: { score: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ])

  const avgScore = Math.round(avgScoreResult._avg.score ?? 0)
  const publishedCourses = topCourses.filter(c => c.isPublished).length
  const totalRevenue = topCourses.reduce((sum, c) => sum + (c.price * c._count.enrollments), 0)

  const adminKPIs = [
    { label: 'Total Users',       value: totalUsers,       icon: Users,      bg: 'from-indigo-500 to-blue-600',   shadow: 'shadow-indigo-500/30',  sub: `${usersByRole.find(r => r.role === 'STUDENT')?._count._all ?? 0} students` },
    { label: 'Total Courses',     value: totalCourses,     icon: BookOpen,   bg: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/30',  sub: `${publishedCourses} published` },
    { label: 'Total Enrollments', value: totalEnrollments, icon: TrendingUp, bg: 'from-emerald-500 to-teal-600',  shadow: 'shadow-emerald-500/30', sub: `${(totalEnrollments / (totalCourses || 1)).toFixed(1)} avg/course` },
    { label: 'Quiz Avg Score',    value: `${avgScore}%`,   icon: Target,     bg: 'from-amber-500 to-orange-600',  shadow: 'shadow-amber-500/30',   sub: `${totalSubmissions} submissions` },
  ]

  const roleConfig: Record<string, { bg: string; bar: string; text: string }> = {
    ADMIN:      { bg: 'bg-rose-500/15',    bar: 'from-rose-500 to-pink-500',      text: 'text-rose-400' },
    INSTRUCTOR: { bg: 'bg-amber-500/15',   bar: 'from-amber-500 to-orange-500',   text: 'text-amber-400' },
    STUDENT:    { bg: 'bg-emerald-500/15', bar: 'from-emerald-500 to-teal-500',   text: 'text-emerald-400' },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Platform</span> Analytics
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Complete overview of your learning platform</p>
        </div>
        <Link href="/admin/users">
          <button className="btn-shimmer bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all flex items-center gap-2">
            <Users className="h-3.5 w-3.5" /> Manage Users
          </button>
        </Link>
      </div>

      {/* KPI Cards — vivid gradients */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {adminKPIs.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`relative rounded-2xl p-5 overflow-hidden bg-gradient-to-br ${kpi.bg} shadow-lg ${kpi.shadow} animate-fade-up`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-black/20 blur-2xl" />
            <div className="relative">
              <div className="p-2 rounded-xl bg-white/20 w-fit mb-3">
                <kpi.icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-3xl font-bold text-white">{kpi.value}</p>
              <p className="text-xs text-white/70 mt-0.5">{kpi.label}</p>
              <p className="text-[10px] text-white/50 mt-0.5">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue highlight + Users by Role */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue card */}
        <div className="relative rounded-2xl p-6 overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-orange-500 shadow-lg shadow-rose-500/30 animate-fade-up">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-black/20 blur-2xl" />
          <div className="relative">
            <div className="p-2.5 rounded-xl bg-white/20 w-fit mb-4">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <p className="text-4xl font-extrabold text-white">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-white/80 mt-1 font-medium">Platform Revenue</p>
            <p className="text-[11px] text-white/55 mt-0.5">across {publishedCourses} published courses</p>
          </div>
        </div>

        {/* Users by role */}
        <div className="md:col-span-2 glass-card rounded-2xl p-5 border border-indigo-500/15">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-indigo-500/15"><Users className="h-4 w-4 text-indigo-400" /></div>
            <span className="font-semibold text-sm">Users by Role</span>
            <span className="ml-auto text-xs text-muted-foreground">{totalUsers} total</span>
          </div>
          <div className="space-y-3.5">
            {usersByRole.map(r => {
              const pct = Math.round((r._count._all / totalUsers) * 100)
              const cfg = roleConfig[r.role] ?? roleConfig.STUDENT
              return (
                <div key={r.role}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
                        {r.role}
                      </span>
                    </div>
                    <span className="text-muted-foreground font-medium">{r._count._all} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/8 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${cfg.bar} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Courses + Recent Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Courses */}
        <div className="glass-card rounded-2xl border border-indigo-500/15 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8">
            <div className="p-1.5 rounded-lg bg-violet-500/15"><BookOpen className="h-4 w-4 text-violet-400" /></div>
            <span className="font-semibold text-sm">Top Courses by Enrollment</span>
          </div>
          <div className="divide-y divide-white/5">
            {topCourses.slice(0, 6).map((course, i) => (
              <div key={course.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  i === 0 ? 'bg-amber-500/20 text-amber-400' :
                  i === 1 ? 'bg-slate-500/20 text-slate-400' :
                  i === 2 ? 'bg-orange-500/20 text-orange-400' :
                  'bg-white/8 text-muted-foreground'
                }`}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{course.title}</p>
                  <p className="text-[10px] text-muted-foreground">{course.category} · {course.instructor.name}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-indigo-400">{course._count.enrollments}</p>
                  <p className="text-[10px] text-muted-foreground">enrolled</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1 ${course.isPublished ? 'bg-emerald-500/15 text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                  {course.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="glass-card rounded-2xl border border-indigo-500/15 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8">
            <div className="p-1.5 rounded-lg bg-emerald-500/15"><GraduationCap className="h-4 w-4 text-emerald-400" /></div>
            <span className="font-semibold text-sm">Recent Enrollments</span>
          </div>
          <div className="divide-y divide-white/5">
            {recentEnrollments.map((e, i) => (
              <div key={e.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
                  {e.user.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{e.user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{e.course.title}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20 border">{e.course.category}</Badge>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(e.enrolledAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Users */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-indigo-500/15 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/15"><Users className="h-4 w-4 text-rose-400" /></div>
              <span className="font-semibold text-sm">Recently Joined Users</span>
            </div>
            <Link href="/admin/users" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Manage all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/3 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
                  {u.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{u.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate hidden sm:block">{u.email}</p>
                </div>
                <Badge className={`border text-[10px] shrink-0 ${
                  u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : u.role === 'INSTRUCTOR' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}>
                  {u.role}
                </Badge>
                <span className="text-[10px] text-muted-foreground shrink-0">{new Date(u.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl p-5 border border-indigo-500/15 flex flex-col gap-3">
          <p className="font-semibold text-sm mb-1">Quick Actions</p>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all group">
            <div className="p-1.5 rounded-lg bg-rose-500/20"><Users className="h-3.5 w-3.5 text-rose-400" /></div>
            <span className="text-xs font-medium">Manage Users</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto group-hover:text-rose-400 transition-colors" />
          </Link>
          <Link href="/courses" className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-all group">
            <div className="p-1.5 rounded-lg bg-violet-500/20"><BookOpen className="h-3.5 w-3.5 text-violet-400" /></div>
            <span className="text-xs font-medium">Browse Courses</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto group-hover:text-violet-400 transition-colors" />
          </Link>
          <Link href="/leaderboard" className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all group">
            <div className="p-1.5 rounded-lg bg-amber-500/20"><Trophy className="h-3.5 w-3.5 text-amber-400" /></div>
            <span className="text-xs font-medium">Leaderboard</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground ml-auto group-hover:text-amber-400 transition-colors" />
          </Link>
          {/* Platform health */}
          <div className="mt-2 p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Platform Health</p>
            {[
              { label: 'Publish rate', value: `${totalCourses ? Math.round((publishedCourses / totalCourses) * 100) : 0}%`, color: 'text-emerald-400' },
              { label: 'Avg submissions', value: totalSubmissions, color: 'text-indigo-400' },
              { label: 'Quiz avg score', value: `${avgScore}%`, color: 'text-violet-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className={`font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
