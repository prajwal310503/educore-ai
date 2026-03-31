'use client'
import { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff, Lock, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword]   = useState('')
  const [newPassword, setNewPassword]   = useState('')
  const [confirmPw,   setConfirmPw]     = useState('')
  const [showOld,     setShowOld]       = useState(false)
  const [showNew,     setShowNew]       = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loading,     setLoading]       = useState(false)
  const [success,     setSuccess]       = useState(false)
  const [error,       setError]         = useState('')
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => { if (mountedRef.current) setSuccess(false) }, 4000)
    return () => clearTimeout(t)
  }, [success])

  // Password strength
  const strength = (() => {
    if (!newPassword) return 0
    let s = 0
    if (newPassword.length >= 8)  s++
    if (/[A-Z]/.test(newPassword)) s++
    if (/[0-9]/.test(newPassword)) s++
    if (/[^A-Za-z0-9]/.test(newPassword)) s++
    return s
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][strength]
  const strengthText  = ['', 'text-rose-500', 'text-amber-500', 'text-blue-500', 'text-emerald-500'][strength]

  const mismatch = confirmPw.length > 0 && confirmPw !== newPassword

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPw) { setError('New passwords do not match.'); return }
    if (newPassword.length < 8)   { setError('New password must be at least 8 characters.'); return }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      })
      const data = await res.json()
      if (!mountedRef.current) return
      if (data.success && !data.data?.error) {
        setSuccess(true)
        setOldPassword('')
        setNewPassword('')
        setConfirmPw('')
      } else {
        setError(data.data?.error ?? data.error ?? 'Failed to update password.')
      }
    } catch {
      if (mountedRef.current) setError('Network error. Please try again.')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Current Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Current Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showOld ? 'text' : 'password'}
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            placeholder="Enter your current password"
            className="pl-10 pr-10 rounded-xl h-10 border-slate-200 dark:border-white/10 focus:border-indigo-400 dark:focus:border-indigo-500/50"
            required
          />
          <button
            type="button"
            onClick={() => setShowOld(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-slate-100 dark:bg-white/8" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">New Password</span>
        <div className="flex-1 h-px bg-slate-100 dark:bg-white/8" />
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="pl-10 pr-10 rounded-xl h-10 border-slate-200 dark:border-white/10 focus:border-indigo-400 dark:focus:border-indigo-500/50"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Strength meter */}
        {newPassword.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-slate-200 dark:bg-white/10'}`}
                />
              ))}
            </div>
            <p className={`text-[11px] font-medium ${strengthText}`}>{strengthLabel} password</p>
          </div>
        )}
      </div>

      {/* Confirm New Password */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Confirm New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            placeholder="Repeat new password"
            className={`pl-10 pr-10 rounded-xl h-10 border-slate-200 dark:border-white/10 focus:border-indigo-400 dark:focus:border-indigo-500/50 transition-colors ${mismatch ? 'border-rose-400 dark:border-rose-500/50 focus:border-rose-400' : confirmPw && confirmPw === newPassword ? 'border-emerald-400 dark:border-emerald-500/50' : ''}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {mismatch && (
          <p className="text-[11px] text-rose-500 font-medium">Passwords do not match</p>
        )}
        {confirmPw && confirmPw === newPassword && (
          <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Passwords match
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl px-3 py-2.5">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-3 py-2.5">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          Password updated successfully!
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || !oldPassword || !newPassword || !confirmPw || mismatch}
        className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</>
        ) : (
          <><ShieldCheck className="h-4 w-4 mr-2" /> Update Password</>
        )}
      </Button>
    </form>
  )
}
