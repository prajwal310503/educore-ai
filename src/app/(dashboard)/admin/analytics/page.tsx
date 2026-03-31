import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, BookOpen, TrendingUp, Target, GraduationCap } from 'lucide-react'
import { BackButton } from '@/components/shared/BackButton'

export default async function AdminAnalyticsPage() {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') redirect('/dashboard')

  const [totalUsers, totalCourses, totalEnrollments, totalSubmissions] = await Promise.all([
    prisma.user.count(),
    prisma.course.count({ where: { isDeleted: false } }),
    prisma.enrollment.count(),
    prisma.submission.count(),
  ])

  const usersByRole = await prisma.user.groupBy({
    by: ['role'],
    _count: { _all: true },
  })

  const topCourses = await prisma.course.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      title: true,
      category: true,
      isPublished: true,
      _count: { select: { enrollments: true, chapters: true } },
    },
    orderBy: { enrollments: { _count: 'desc' } },
    take: 10,
  })

  const recentEnrollments = await prisma.enrollment.findMany({
    orderBy: { enrolledAt: 'desc' },
    take: 10,
    select: {
      id: true,
      enrolledAt: true,
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  })

  const avgScore = await prisma.submission.aggregate({ _avg: { score: true } })

  return (
    <div className="space-y-6">
      <BackButton label="Dashboard" href="/dashboard" />
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm">Platform-wide metrics and insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, icon: Users, sub: `${usersByRole.find(r => r.role === 'STUDENT')?._count._all ?? 0} students` },
          { label: 'Total Courses', value: totalCourses, icon: BookOpen, sub: `${topCourses.filter(c => c.isPublished).length} published` },
          { label: 'Total Enrollments', value: totalEnrollments, icon: TrendingUp, sub: `${(totalEnrollments / (totalCourses || 1)).toFixed(1)} avg/course` },
          { label: 'Quiz Avg Score', value: `${Math.round(avgScore._avg.score ?? 0)}%`, icon: Target, sub: `${totalSubmissions} submissions` },
        ].map(stat => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {usersByRole.map(r => {
              const pct = Math.round((r._count._all / totalUsers) * 100)
              return (
                <div key={r.role}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{r.role.toLowerCase()}</span>
                    <span className="text-muted-foreground">{r._count._all} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentEnrollments.map(e => (
                <div key={e.id} className="flex items-start justify-between p-4 text-sm">
                  <div>
                    <p className="font-medium">{e.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{e.course.title}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {new Date(e.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Courses */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Top Courses by Enrollment</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-muted-foreground text-xs">
                <th className="text-left p-4 font-medium">#</th>
                <th className="text-left p-4 font-medium">Course</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Category</th>
                <th className="text-center p-4 font-medium">Chapters</th>
                <th className="text-center p-4 font-medium">Enrollments</th>
                <th className="text-center p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {topCourses.map((course, i) => (
                <tr key={course.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="p-4 text-muted-foreground">{i + 1}</td>
                  <td className="p-4 font-medium max-w-[200px]">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{course.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground hidden sm:table-cell">{course.category}</td>
                  <td className="p-4 text-center text-muted-foreground">{course._count.chapters}</td>
                  <td className="p-4 text-center font-semibold">{course._count.enrollments}</td>
                  <td className="p-4 text-center">
                    <Badge className={`text-xs border-0 ${course.isPublished ? 'bg-[hsl(var(--badge-green-bg))] text-[hsl(var(--badge-green-text))]' : 'bg-muted text-muted-foreground'}`}>
                      {course.isPublished ? 'Live' : 'Draft'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
