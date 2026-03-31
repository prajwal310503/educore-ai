'use client'
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, User } from 'lucide-react'

interface Props {
  initialName: string
  email: string
}

export default function ProfileEditForm({ initialName, email }: Props) {
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => {
      if (mountedRef.current) setSuccess(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [success])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || name.trim() === initialName) return
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      const data = await res.json()
      if (!mountedRef.current) return
      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error ?? 'Failed to update profile')
      }
    } catch {
      if (mountedRef.current) setError('Network error. Please try again.')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Display Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your full name"
            className="pl-10 glass border-white/20 focus:border-indigo-500/40 rounded-xl h-10"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email Address</label>
        <Input
          value={email}
          disabled
          className="glass border-white/20 rounded-xl h-10 opacity-60 cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
      </div>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading || !name.trim() || name.trim() === initialName}
        className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
        ) : success ? (
          <><CheckCircle2 className="h-4 w-4 mr-2" /> Saved!</>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  )
}
