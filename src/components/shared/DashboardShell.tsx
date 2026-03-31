'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavLink, type NavIconName } from './NavLink'
import { HeaderMenu } from './HeaderMenu'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, ShieldCheck, Sparkles, Menu, X } from 'lucide-react'

interface NavLinkDef {
  href: string
  label: string
  iconName: NavIconName
}

interface UserInfo {
  name: string
  email: string
  role: string
  initials: string
}

interface Props {
  navLinks: NavLinkDef[]
  user: UserInfo
  children: React.ReactNode
}

const roleColors: Record<string, string> = {
  ADMIN: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
  INSTRUCTOR: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  STUDENT: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
}

function SidebarContent({ user, navLinks, onClose }: { user: UserInfo; navLinks: NavLinkDef[]; onClose?: () => void }) {
  return (
    <>
      {/* Rainbow top stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

      {/* Logo */}
      <div className="h-16 flex items-center px-5 pt-0.5">
        <Link href="/" className="flex items-center gap-3 group w-full" onClick={onClose}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/45 group-hover:scale-105 transition-all duration-200 shrink-0">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent block leading-tight tracking-tight">
              EduCore AI
            </span>
            <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 tracking-[0.18em] uppercase">
              Learning Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-slate-100 dark:bg-white/8" />

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto scrollbar-none">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-600 px-3 mb-3 mt-1">
          Navigation
        </p>
        {navLinks.map(link => (
          <NavLink key={link.href} href={link.href} label={link.label} iconName={link.iconName} />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-5 h-px bg-slate-100 dark:bg-white/8" />

      {/* User card */}
      <div className="p-4">
        <div className="rounded-2xl p-3.5 bg-gradient-to-br from-slate-50 to-indigo-50/60 border border-slate-200/80 dark:from-white/5 dark:to-indigo-500/8 dark:border-white/8 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-100 dark:hover:shadow-none transition-all duration-200 group cursor-default">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20">
                {user.initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-950 shadow-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate text-slate-700 dark:text-foreground/90">{user.name}</p>
              <Badge className={`text-[9px] border px-1.5 py-0 mt-0.5 ${roleColors[user.role] ?? roleColors.STUDENT}`}>
                {user.role === 'ADMIN' && <ShieldCheck className="h-2 w-2 mr-0.5" />}
                {user.role.toLowerCase()}
              </Badge>
            </div>
            <Sparkles className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </>
  )
}

export function DashboardShell({ navLinks, user, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Animated BG blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-transparent dark:to-transparent" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-400/12 dark:bg-indigo-500/5 rounded-full blur-[100px] animate-blob" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-400/10 dark:bg-violet-500/5 rounded-full blur-[80px] animate-blob delay-300" />
      </div>

      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-64 flex-col fixed h-full z-20 bg-white border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.06)] dark:bg-zinc-950 dark:border-white/5 dark:shadow-none">
        <SidebarContent user={user} navLinks={navLinks} />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-40 flex flex-col bg-white dark:bg-zinc-950 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-3 z-10 p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent user={user} navLinks={navLinks} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-4 md:px-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 z-10 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Badge className="glass border border-indigo-500/20 text-indigo-400 text-xs hidden md:flex">
              <Sparkles className="h-3 w-3 mr-1" /> AI-Powered LMS
            </Badge>
          </div>
          <HeaderMenu
            name={user.name}
            email={user.email}
            role={user.role}
            initials={user.initials}
          />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
