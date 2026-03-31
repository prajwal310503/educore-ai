'use client'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { ThemeToggle } from './ThemeToggle'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { LayoutDashboard, LogOut, User } from 'lucide-react'

interface Props {
  name: string
  email: string
  role: string
  initials: string
}

export function HeaderMenu({ name, email, role, initials }: Props) {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/15 hover:border-indigo-500/40 transition-all duration-200 group outline-none">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
              <User className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-xs font-semibold text-foreground">{name.split(' ')[0]}</span>
              <span className="text-[10px] text-muted-foreground capitalize">{role.toLowerCase()}</span>
            </div>
            <svg className="h-3 w-3 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 shadow-xl rounded-xl p-1 z-50 border border-border bg-popover text-popover-foreground"
        >
          {/* User info card */}
          <div className="px-3 py-3 rounded-lg bg-muted mb-1 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-foreground">{name}</p>
              <p className="text-[11px] truncate text-muted-foreground mt-0.5">{email}</p>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-border my-1" />

          <DropdownMenuItem asChild className="cursor-pointer rounded-lg focus:bg-accent">
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground">
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer rounded-lg focus:bg-accent">
            <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground">
              <User className="h-4 w-4 text-muted-foreground" />
              Profile & Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border my-1" />

          <DropdownMenuItem
            className="cursor-pointer rounded-lg focus:bg-red-50 dark:focus:bg-red-500/10 text-destructive focus:text-destructive px-3 py-2 text-sm"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
