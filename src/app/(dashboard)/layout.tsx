import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/shared/DashboardShell'
import type { NavIconName } from '@/components/shared/NavLink'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role
  const initials = session.user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() ?? 'U'

  const navLinks: { href: string; label: string; iconName: NavIconName }[] = [
    { href: '/dashboard', label: 'Dashboard', iconName: 'LayoutDashboard' },
    { href: '/courses', label: 'Courses', iconName: 'BookOpen' },
    ...(role === 'STUDENT' ? [
      { href: '/my-learning', label: 'My Learning', iconName: 'BookMarked' as NavIconName },
    ] : []),
    { href: '/leaderboard', label: 'Leaderboard', iconName: 'Trophy' as NavIconName },
    ...(role === 'INSTRUCTOR' || role === 'ADMIN' ? [
      { href: '/instructor/courses', label: 'My Courses', iconName: 'Plus' as NavIconName },
    ] : []),
    ...(role === 'ADMIN' ? [
      { href: '/admin/users', label: 'Users', iconName: 'Users' as NavIconName },
    ] : []),
    { href: '/profile', label: 'Profile', iconName: 'User' as NavIconName },
  ]

  return (
    <DashboardShell
      navLinks={navLinks}
      user={{
        name: session.user.name ?? 'User',
        email: session.user.email ?? '',
        role,
        initials,
      }}
    >
      {children}
    </DashboardShell>
  )
}
