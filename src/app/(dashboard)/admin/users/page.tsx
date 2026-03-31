'use client'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Search, MoreHorizontal, ShieldCheck, UserX, UserCheck,
  Download, Users, GraduationCap, BookOpen, Shield
} from 'lucide-react'
import { BackButton } from '@/components/shared/BackButton'

type User = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT'
  isSuspended: boolean
  createdAt: string
  image: string | null
  _count?: { enrollments: number }
}

const ROLE_CONFIG = {
  ADMIN: {
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
    avatar: 'from-rose-500 to-pink-600',
    row: 'hover:bg-rose-500/5',
    dot: 'bg-rose-400',
    icon: Shield,
  },
  INSTRUCTOR: {
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    avatar: 'from-amber-500 to-orange-500',
    row: 'hover:bg-amber-500/5',
    dot: 'bg-amber-400',
    icon: BookOpen,
  },
  STUDENT: {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    avatar: 'from-emerald-500 to-teal-500',
    row: 'hover:bg-emerald-500/5',
    dot: 'bg-emerald-400',
    icon: GraduationCap,
  },
}

const TAB_CONFIG = {
  all:        { label: 'All',        color: 'text-indigo-400',  activeBg: 'bg-indigo-500/15 border-indigo-500/30' },
  ADMIN:      { label: 'Admins',     color: 'text-rose-400',    activeBg: 'bg-rose-500/15 border-rose-500/30' },
  INSTRUCTOR: { label: 'Instructors',color: 'text-amber-400',   activeBg: 'bg-amber-500/15 border-amber-500/30' },
  STUDENT:    { label: 'Students',   color: 'text-emerald-400', activeBg: 'bg-emerald-500/15 border-emerald-500/30' },
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [counts, setCounts] = useState({ total: 0, ADMIN: 0, INSTRUCTOR: 0, STUDENT: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) params.set('search', search)
    if (roleFilter !== 'all') params.set('role', roleFilter)

    const [usersRes, allRes] = await Promise.all([
      fetch(`/api/admin/users?${params}`),
      fetch(`/api/admin/users?limit=1000`),
    ])
    const data = await usersRes.json()
    const allData = await allRes.json()

    if (data.success) {
      setUsers(data.data.users)
      setTotal(data.data.total)
    }
    if (allData.success) {
      const all: User[] = allData.data.users
      setCounts({
        total: all.length,
        ADMIN: all.filter(u => u.role === 'ADMIN').length,
        INSTRUCTOR: all.filter(u => u.role === 'INSTRUCTOR').length,
        STUDENT: all.filter(u => u.role === 'STUDENT').length,
      })
    }
    setLoading(false)
  }, [page, search, roleFilter])

  useEffect(() => {
    const t = setTimeout(fetchUsers, 300)
    return () => clearTimeout(t)
  }, [fetchUsers])

  async function updateUser(userId: string, update: { role?: string; isSuspended?: boolean }) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    })
    const data = await res.json()
    if (data.success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data.data } : u))
      toast.success('User updated')
    } else {
      toast.error(data.error)
    }
  }

  function exportCSV() {
    const rows = [
      ['Name', 'Email', 'Role', 'Status', 'Joined'].join(','),
      ...users.map(u => [u.name, u.email, u.role, u.isSuspended ? 'Suspended' : 'Active', new Date(u.createdAt).toLocaleDateString()].join(','))
    ]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'users.csv'; a.click()
  }

  const totalPages = Math.ceil(total / limit)

  const statCards = [
    { label: 'Total Users',   value: counts.total,       bg: 'from-indigo-500 to-blue-600',   shadow: 'shadow-indigo-500/30',  icon: Users },
    { label: 'Admins',        value: counts.ADMIN,       bg: 'from-rose-500 to-pink-600',     shadow: 'shadow-rose-500/30',    icon: Shield },
    { label: 'Instructors',   value: counts.INSTRUCTOR,  bg: 'from-amber-500 to-orange-500',  shadow: 'shadow-amber-500/30',   icon: BookOpen },
    { label: 'Students',      value: counts.STUDENT,     bg: 'from-emerald-500 to-teal-600',  shadow: 'shadow-emerald-500/30', icon: GraduationCap },
  ]

  return (
    <div className="space-y-6">
      <BackButton label="Dashboard" href="/dashboard" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">User</span> Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage all platform users, roles, and access</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/40 rounded-xl"
          onClick={exportCSV}
        >
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Vivid stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div
            key={s.label}
            className={`relative rounded-2xl p-5 overflow-hidden bg-gradient-to-br ${s.bg} shadow-lg ${s.shadow} animate-fade-up`}
            style={{ animationDelay: `${i * 70}ms` }}
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

      {/* Main table card */}
      <div className="glass-card rounded-2xl border border-indigo-500/15 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-white/8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9 glass border-white/15 focus:border-indigo-500/40 rounded-xl h-9 text-sm"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <div className="flex gap-1.5">
            {Object.entries(TAB_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => { setRoleFilter(key); setPage(1) }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  roleFilter === key
                    ? `${cfg.activeBg} ${cfg.color}`
                    : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground'
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="divide-y divide-white/5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-36 rounded" />
                  <Skeleton className="h-3 w-52 rounded" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-lg" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Email</th>
                  <th className="text-center px-5 py-3">Role</th>
                  <th className="text-center px-5 py-3 hidden sm:table-cell">Enrollments</th>
                  <th className="text-center px-5 py-3">Status</th>
                  <th className="text-right px-5 py-3 hidden lg:table-cell">Joined</th>
                  <th className="px-5 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user, idx) => {
                  const cfg = ROLE_CONFIG[user.role]
                  const RoleIcon = cfg.icon
                  return (
                    <tr
                      key={user.id}
                      className={`transition-colors ${cfg.row} animate-fade-up`}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      {/* User */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cfg.avatar} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${user.isSuspended ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate max-w-[140px]">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground md:hidden truncate max-w-[140px]">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 text-muted-foreground text-xs hidden md:table-cell max-w-[200px]">
                        <span className="truncate block">{user.email}</span>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.badge}`}>
                          <RoleIcon className="h-3 w-3" />
                          {user.role === 'INSTRUCTOR' ? 'Instructor' : user.role === 'ADMIN' ? 'Admin' : 'Student'}
                        </span>
                      </td>

                      {/* Enrollments */}
                      <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                        <span className="text-sm font-bold text-indigo-400">{user._count?.enrollments ?? 0}</span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                          user.isSuspended
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/25'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.isSuspended ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                          {user.isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-3.5 text-right text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-white/10">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border border-border">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="rounded-lg text-sm">
                                <ShieldCheck className="mr-2 h-4 w-4 text-indigo-400" /> Change Role
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="rounded-xl">
                                {(['ADMIN', 'INSTRUCTOR', 'STUDENT'] as const).map(r => (
                                  <DropdownMenuItem
                                    key={r}
                                    onClick={() => updateUser(user.id, { role: r })}
                                    className={`rounded-lg text-sm ${user.role === r ? 'bg-accent' : ''}`}
                                  >
                                    <span className={`w-2 h-2 rounded-full mr-2 ${ROLE_CONFIG[r].dot}`} />
                                    {r}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => updateUser(user.id, { isSuspended: !user.isSuspended })}
                              className={`rounded-lg text-sm ${user.isSuspended ? 'text-emerald-500' : 'text-destructive'}`}
                            >
                              {user.isSuspended
                                ? <><UserCheck className="mr-2 h-4 w-4" />Unsuspend</>
                                : <><UserX className="mr-2 h-4 w-4" />Suspend</>}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-white/8">
            <span className="text-xs text-muted-foreground">
              Page <span className="font-semibold text-foreground">{page}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="rounded-xl border-white/15 hover:border-indigo-500/30 h-8"
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="rounded-xl border-white/15 hover:border-indigo-500/30 h-8"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
