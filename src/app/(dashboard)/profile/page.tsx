import React from 'react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import {
  User, Mail, Shield, BookOpen, Trophy, Target, ClipboardList,
  Star, TrendingUp, Calendar, Award, Zap, CheckCircle2, Users
} from 'lucide-react'
import ProfileEditForm from './ProfileEditForm'
import ChangePasswordForm from './ChangePasswordForm'
import { BackButton } from '@/components/shared/BackButton'

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, image: true, createdAt: true },
  })
  if (!user) redirect('/login')

  const role = user.role
  const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase() ?? 'U'

  let stats: { label: string; value: string | number; icon: React.ElementType; color: string }[] = []
  let recentActivity: { label: string; date: Date; type: string }[] = []

  if (role === 'STUDENT') {
    const [enrollments, submissions] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: user.id },
        include: { progress: true, course: { select: { title: true, category: true } } },
        orderBy: { enrolledAt: 'desc' },
      }),
      prisma.submission.findMany({
        where: { userId: user.id },
        include: { quiz: { select: { title: true } } },
        orderBy: { submittedAt: 'desc' },
        take: 10,
      }),
    ])

    const completedCourses = enrollments.filter(e => {
      const total = e.progress.length
      const done = e.progress.filter(p => p.isCompleted).length
      return total > 0 && done === total
    }).length

    const avgScore = submissions.length
      ? Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length)
      : 0

    stats = [
      { label: 'Enrolled Courses', value: enrollments.length, icon: BookOpen, color: 'text-indigo-400' },
      { label: 'Completed', value: completedCourses, icon: Trophy, color: 'text-emerald-400' },
      { label: 'Avg Quiz Score', value: `${avgScore}%`, icon: Target, color: 'text-violet-400' },
      { label: 'Quizzes Taken', value: submissions.length, icon: ClipboardList, color: 'text-amber-400' },
    ]

    recentActivity = [
      ...enrollments.slice(0, 3).map(e => ({
        label: `Enrolled in ${e.course.title}`,
        date: e.enrolledAt,
        type: 'enroll',
      })),
      ...submissions.slice(0, 3).map(s => ({
        label: `Completed quiz: ${s.quiz.title} — ${Math.round(s.score)}%`,
        date: s.submittedAt,
        type: 'quiz',
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  } else if (role === 'INSTRUCTOR') {
    const courses = await prisma.course.findMany({
      where: { instructorId: user.id, isDeleted: false },
      include: { _count: { select: { enrollments: true } } },
      orderBy: { createdAt: 'desc' },
    })
    const totalStudents = courses.reduce((sum, c) => sum + c._count.enrollments, 0)
    stats = [
      { label: 'Total Courses', value: courses.length, icon: BookOpen, color: 'text-indigo-400' },
      { label: 'Total Students', value: totalStudents, icon: Users, color: 'text-emerald-400' },
      { label: 'Published', value: courses.filter(c => c.isPublished).length, icon: Star, color: 'text-amber-400' },
      { label: 'Avg Enrollments', value: courses.length ? Math.round(totalStudents / courses.length) : 0, icon: TrendingUp, color: 'text-violet-400' },
    ]
    recentActivity = courses.slice(0, 5).map(c => ({
      label: `Created course: ${c.title}`,
      date: c.createdAt,
      type: 'course',
    }))
  } else {
    const [totalUsers, totalCourses] = await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { isDeleted: false } }),
    ])
    stats = [
      { label: 'Total Users', value: totalUsers, icon: User, color: 'text-indigo-400' },
      { label: 'Total Courses', value: totalCourses, icon: BookOpen, color: 'text-violet-400' },
      { label: 'Role', value: 'Admin', icon: Shield, color: 'text-rose-400' },
      { label: 'Member Since', value: new Date(user.createdAt).getFullYear().toString(), icon: Calendar, color: 'text-amber-400' },
    ]
  }

  const roleConfig = {
    ADMIN: { label: 'Administrator', classes: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: Shield },
    INSTRUCTOR: { label: 'Instructor', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Award },
    STUDENT: { label: 'Student', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Zap },
  }[role] ?? { label: role, classes: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: User }

  const activityTypeConfig: Record<string, { color: string; icon: React.ElementType }> = {
    enroll: { color: 'bg-indigo-500/15 text-indigo-400', icon: BookOpen },
    quiz: { color: 'bg-violet-500/15 text-violet-400', icon: Target },
    course: { color: 'bg-amber-500/15 text-amber-400', icon: Star },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <BackButton label="Dashboard" href="/dashboard" className="mb-3" />
        <h1 className="text-3xl font-bold">
          Profile & <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Settings</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account and view your progress</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Profile Card */}
        <div className="space-y-5">
          {/* Avatar & Identity */}
          <div className="glass-card rounded-2xl p-6 border border-indigo-500/15 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/30">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-background flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            <div className="flex justify-center mt-3">
              <Badge className={`border text-xs px-3 py-1 ${roleConfig.classes}`}>
                <roleConfig.icon className="h-3 w-3 mr-1.5" />
                {roleConfig.label}
              </Badge>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-500/10 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Calendar className="h-3 w-3" />
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="glass-card rounded-2xl p-4 border border-indigo-500/15 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your Stats</h3>
            {stats.map(stat => (
              <div key={stat.label} className="flex items-center justify-between py-2 border-b border-indigo-500/8 last:border-0">
                <div className="flex items-center gap-2.5">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <span className="font-semibold text-sm">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Edit Form + Activity */}
        <div className="xl:col-span-2 space-y-5">
          {/* Edit Profile */}
          <div className="glass-card rounded-2xl p-6 border border-indigo-500/15">
            <h3 className="font-semibold mb-5 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10">
                <User className="h-4 w-4 text-indigo-400" />
              </div>
              Edit Profile
            </h3>
            <ProfileEditForm
              initialName={user.name ?? ''}
              email={user.email ?? ''}
            />
          </div>

          {/* Change Password */}
          <div className="glass-card rounded-2xl p-6 border border-indigo-500/15">
            <h3 className="font-semibold mb-5 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10">
                <Shield className="h-4 w-4 text-rose-400" />
              </div>
              Change Password
            </h3>
            <ChangePasswordForm />
          </div>

          {/* Account Info */}
          <div className="glass-card rounded-2xl p-6 border border-indigo-500/15">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-violet-500/10">
                <Shield className="h-4 w-4 text-violet-400" />
              </div>
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                <Badge className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 border">Verified</Badge>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <Shield className="h-4 w-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Account Role</p>
                  <p className="text-sm font-medium capitalize">{role.toLowerCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Account Created</p>
                  <p className="text-sm font-medium">{new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-indigo-500/15">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10">
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((act, i) => {
                  const config = activityTypeConfig[act.type] ?? activityTypeConfig.course
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-lg ${config.color} shrink-0`}>
                        <config.icon className="h-3 w-3" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-snug">{act.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(act.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
