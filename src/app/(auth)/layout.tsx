export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated mesh background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/60 to-violet-950/40 hidden dark:block" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-violet-50/50 to-slate-50 dark:hidden" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-400/18 dark:bg-violet-500/10 rounded-full blur-[100px] animate-blob delay-300" />
        <div className="absolute top-3/4 left-1/2 w-[300px] h-[300px] bg-purple-400/15 dark:bg-purple-500/8 rounded-full blur-[80px] animate-blob delay-500" />
        <div className="grid-overlay absolute inset-0" />
      </div>

      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
