'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, BookOpen, Plus, Users, BarChart, User, BookMarked, Trophy, Bell } from 'lucide-react'

const ICONS = {
  LayoutDashboard,
  BookOpen,
  Plus,
  Users,
  BarChart,
  User,
  BookMarked,
  Trophy,
  Bell,
}

export type NavIconName = keyof typeof ICONS

// Per-route color tokens — light and dark variants
const ROUTE_CONFIG: Record<string, {
  // light active
  activeBg: string
  activeBorder: string
  activeText: string
  activeIcon: string
  activeIconBg: string
  activeDot: string
  // dark active (appended via dark: prefix handled inline)
  darkActiveBg: string
  darkActiveBorder: string
  darkActiveText: string
  darkActiveIconBg: string
}> = {
  '/dashboard':   { activeBg: 'bg-indigo-50',  activeBorder: 'border-indigo-200',  activeText: 'text-indigo-700',  activeIcon: 'text-indigo-600',  activeIconBg: 'bg-indigo-100',  activeDot: 'bg-indigo-500',  darkActiveBg: 'dark:bg-indigo-500/15',  darkActiveBorder: 'dark:border-indigo-500/25',  darkActiveText: 'dark:text-indigo-300',  darkActiveIconBg: 'dark:bg-indigo-500/20' },
  '/courses':     { activeBg: 'bg-sky-50',     activeBorder: 'border-sky-200',     activeText: 'text-sky-700',     activeIcon: 'text-sky-600',     activeIconBg: 'bg-sky-100',     activeDot: 'bg-sky-500',     darkActiveBg: 'dark:bg-sky-500/15',     darkActiveBorder: 'dark:border-sky-500/25',     darkActiveText: 'dark:text-sky-300',     darkActiveIconBg: 'dark:bg-sky-500/20' },
  '/my-learning': { activeBg: 'bg-violet-50',  activeBorder: 'border-violet-200',  activeText: 'text-violet-700', activeIcon: 'text-violet-600',  activeIconBg: 'bg-violet-100',  activeDot: 'bg-violet-500',  darkActiveBg: 'dark:bg-violet-500/15',  darkActiveBorder: 'dark:border-violet-500/25',  darkActiveText: 'dark:text-violet-300',  darkActiveIconBg: 'dark:bg-violet-500/20' },
  '/leaderboard': { activeBg: 'bg-amber-50',   activeBorder: 'border-amber-200',   activeText: 'text-amber-700',  activeIcon: 'text-amber-600',   activeIconBg: 'bg-amber-100',   activeDot: 'bg-amber-500',   darkActiveBg: 'dark:bg-amber-500/15',   darkActiveBorder: 'dark:border-amber-500/25',   darkActiveText: 'dark:text-amber-300',   darkActiveIconBg: 'dark:bg-amber-500/20' },
  '/instructor':  { activeBg: 'bg-rose-50',    activeBorder: 'border-rose-200',    activeText: 'text-rose-700',   activeIcon: 'text-rose-600',    activeIconBg: 'bg-rose-100',    activeDot: 'bg-rose-500',    darkActiveBg: 'dark:bg-rose-500/15',    darkActiveBorder: 'dark:border-rose-500/25',    darkActiveText: 'dark:text-rose-300',    darkActiveIconBg: 'dark:bg-rose-500/20' },
  '/admin':       { activeBg: 'bg-rose-50',    activeBorder: 'border-rose-200',    activeText: 'text-rose-700',   activeIcon: 'text-rose-600',    activeIconBg: 'bg-rose-100',    activeDot: 'bg-rose-500',    darkActiveBg: 'dark:bg-rose-500/15',    darkActiveBorder: 'dark:border-rose-500/25',    darkActiveText: 'dark:text-rose-300',    darkActiveIconBg: 'dark:bg-rose-500/20' },
  '/profile':     { activeBg: 'bg-emerald-50', activeBorder: 'border-emerald-200', activeText: 'text-emerald-700',activeIcon: 'text-emerald-600', activeIconBg: 'bg-emerald-100', activeDot: 'bg-emerald-500', darkActiveBg: 'dark:bg-emerald-500/15', darkActiveBorder: 'dark:border-emerald-500/25', darkActiveText: 'dark:text-emerald-300', darkActiveIconBg: 'dark:bg-emerald-500/20' },
}

function getConfig(href: string) {
  if (ROUTE_CONFIG[href]) return ROUTE_CONFIG[href]
  for (const key of Object.keys(ROUTE_CONFIG)) {
    if (href.startsWith(key) && key !== '/dashboard') return ROUTE_CONFIG[key]
  }
  return ROUTE_CONFIG['/dashboard']
}

interface NavLinkProps {
  href: string
  label: string
  iconName: NavIconName
}

export function NavLink({ href, label, iconName }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  const IconComponent = ICONS[iconName]
  const c = getConfig(href)

  if (isActive) {
    return (
      <Link
        href={href}
        prefetch={false}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200
          ${c.activeBg} ${c.activeBorder} ${c.activeText}
          ${c.darkActiveBg} ${c.darkActiveBorder} ${c.darkActiveText}
          shadow-sm
        `}
      >
        {/* Colored left accent bar */}
        <div className={`w-0.5 h-5 rounded-full ${c.activeDot} shrink-0 -ml-0.5`} />

        {/* Icon */}
        <div className={`p-1.5 rounded-lg ${c.activeIconBg} ${c.darkActiveIconBg} shrink-0`}>
          {IconComponent && <IconComponent className={`h-3.5 w-3.5 ${c.activeIcon} ${c.darkActiveText}`} />}
        </div>

        <span className="flex-1">{label}</span>

        {/* Active dot */}
        <span className={`w-1.5 h-1.5 rounded-full ${c.activeDot}`} />
      </Link>
    )
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm border border-transparent transition-all duration-200
        text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm
        dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-white/5 dark:hover:border-white/10
        group"
    >
      {/* Spacer matching the accent bar width */}
      <div className="w-0.5 shrink-0 -ml-0.5" />

      {/* Icon */}
      <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-white/8 transition-all shrink-0">
        {IconComponent && <IconComponent className="h-3.5 w-3.5" />}
      </div>

      <span className="flex-1">{label}</span>
    </Link>
  )
}
