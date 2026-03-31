'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, GraduationCap, Check, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { registerSchema } from '@/lib/validations/user'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

type RegisterForm = z.infer<typeof registerSchema>

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
    { label: 'Special character', ok: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const barColors = ['bg-destructive', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-400']

  return (
    <div className="space-y-2 mt-1">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < score ? barColors[score] : 'bg-white/10'}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map(c => (
          <div key={c.label} className={`flex items-center gap-1.5 text-xs transition-colors ${c.ok ? 'text-emerald-400' : 'text-muted-foreground'}`}>
            <Check className={`h-3 w-3 transition-opacity ${c.ok ? 'opacity-100' : 'opacity-30'}`} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(registerSchema) as any,
    defaultValues: { role: 'STUDENT' },
  })

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'Registration failed')
      } else {
        toast.success('Account created! Please sign in.')
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-liquid rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl shadow-indigo-500/10 p-8 animate-scale-in relative">
      {/* Theme toggle */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      {/* Header */}
      <div className="text-center mb-7">
        <div className="flex items-center justify-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20">
            <GraduationCap className="h-7 w-7 text-indigo-400" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            EduCore AI
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Create an account</h1>
        <p className="text-sm text-muted-foreground">Start your AI learning journey today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register('name')}
            className={`glass border-white/20 focus:border-indigo-500/50 rounded-xl h-11 ${errors.name ? 'border-destructive' : ''}`}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className={`glass border-white/20 focus:border-indigo-500/50 rounded-xl h-11 ${errors.email ? 'border-destructive' : ''}`}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password', {
              onChange: (e) => setPassword(e.target.value)
            })}
            className={`glass border-white/20 focus:border-indigo-500/50 rounded-xl h-11 ${errors.password ? 'border-destructive' : ''}`}
          />
          {password && <PasswordStrength password={password} />}
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">I am a</Label>
          <Select defaultValue="STUDENT" onValueChange={(v) => setValue('role', v as 'STUDENT' | 'INSTRUCTOR')}>
            <SelectTrigger className="glass border-white/20 rounded-xl h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border border-white/10">
              <SelectItem value="STUDENT">Student — I want to learn</SelectItem>
              <SelectItem value="INSTRUCTOR">Instructor — I want to teach</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full btn-shimmer h-11 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 rounded-xl shadow-lg shadow-indigo-500/25 mt-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Create Account
          {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
