import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import {
  Sparkles, MessageCircle, FileText, TrendingUp, Shield, BarChart,
  GraduationCap, Star, ArrowRight, CheckCircle,
  Play, Zap, Brain, Trophy, Users, Globe, Code2
} from 'lucide-react'

const features = [
  { icon: Sparkles,     title: 'AI-Powered Learning',  description: 'Personalized learning paths powered by Groq AI that adapt to your unique style and pace.',          from: 'from-violet-500', to: 'to-indigo-600',  ring: 'ring-violet-500/20', bar: 'from-violet-500 to-indigo-600' },
  { icon: MessageCircle,title: 'AI Tutor Chat',         description: 'Get instant answers from your AI tutor anytime, with full course context and memory.',                from: 'from-cyan-500',   to: 'to-blue-600',    ring: 'ring-cyan-500/20',   bar: 'from-cyan-500 to-blue-600'    },
  { icon: FileText,     title: 'Smart Quizzes',         description: 'AI-generated quizzes with instant feedback, detailed explanations and retake tracking.',              from: 'from-pink-500',   to: 'to-rose-600',    ring: 'ring-pink-500/20',   bar: 'from-pink-500 to-rose-600'    },
  { icon: TrendingUp,   title: 'Progress Tracking',     description: 'Detailed analytics and visual progress tracking to keep you on track every single day.',              from: 'from-emerald-500',to: 'to-teal-600',    ring: 'ring-emerald-500/20',bar: 'from-emerald-500 to-teal-600' },
  { icon: Shield,       title: 'Secure Platform',       description: 'Enterprise-grade security with OAuth, JWT authentication, and Upstash rate limiting.',                from: 'from-orange-500', to: 'to-amber-500',   ring: 'ring-orange-500/20', bar: 'from-orange-500 to-amber-500' },
  { icon: BarChart,     title: 'Rich Analytics',        description: 'Deep insights for instructors and admins with interactive Recharts dashboards.',                       from: 'from-purple-500', to: 'to-fuchsia-600', ring: 'ring-purple-500/20', bar: 'from-purple-500 to-fuchsia-600'},
]

const steps = [
  { step: '01', title: 'Sign Up & Set Your Goal',       description: 'Create your account in seconds and tell us what you want to learn.',                        icon: Users,        color: 'from-violet-500 to-indigo-600', shadow: 'shadow-violet-500/30', cardBg: 'bg-violet-50/70 dark:bg-violet-500/8',  accentBorder: 'border-violet-200 dark:border-violet-500/30' },
  { step: '02', title: 'Enroll in AI-Curated Courses',  description: 'Browse courses curated and enhanced with AI-powered summaries and quizzes.',                icon: GraduationCap,color: 'from-cyan-500 to-blue-600',     shadow: 'shadow-cyan-500/30',   cardBg: 'bg-cyan-50/70 dark:bg-cyan-500/8',      accentBorder: 'border-cyan-200 dark:border-cyan-500/30'    },
  { step: '03', title: 'Learn with Your AI Tutor',      description: 'Chat with Groq AI while you study, get summaries, and test your knowledge.',                 icon: Brain,        color: 'from-pink-500 to-rose-600',     shadow: 'shadow-pink-500/30',   cardBg: 'bg-pink-50/70 dark:bg-pink-500/8',      accentBorder: 'border-pink-200 dark:border-pink-500/30'    },
]

const testimonials = [
  { name: 'Sarah Chen',     role: 'Software Engineer', quote: 'EduCore AI completely transformed how I learn. The AI tutor is like having a personal mentor available 24/7.',                       initial: 'S', gradient: 'from-violet-500 to-indigo-500', border: 'border-violet-300 dark:border-violet-500/40', quoteColor: 'text-violet-200 dark:text-violet-500/50', bar: 'from-violet-500 to-indigo-500', cardBg: 'bg-violet-50/50 dark:bg-violet-500/5' },
  { name: 'Marcus Johnson', role: 'Data Scientist',    quote: 'The AI-generated quizzes are incredibly effective. I retained information so much better than traditional studying.',                 initial: 'M', gradient: 'from-cyan-500 to-blue-500',    border: 'border-cyan-300 dark:border-cyan-500/40',    quoteColor: 'text-cyan-200 dark:text-cyan-500/50',   bar: 'from-cyan-500 to-blue-500',    cardBg: 'bg-cyan-50/50 dark:bg-cyan-500/5'    },
  { name: 'Priya Patel',    role: 'UX Designer',       quote: 'The course quality is outstanding, and the AI summary feature saves me so much time reviewing complex chapters.',                    initial: 'P', gradient: 'from-pink-500 to-rose-500',    border: 'border-pink-300 dark:border-pink-500/40',    quoteColor: 'text-pink-200 dark:text-pink-500/50',   bar: 'from-pink-500 to-rose-500',    cardBg: 'bg-pink-50/50 dark:bg-pink-500/5'    },
]

const stats = [
  { value: '10,000+', label: 'Students',     icon: Users,        bar: 'from-violet-500 to-indigo-500', valuColor: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-500/30', cardBg: 'bg-violet-50/60 dark:bg-violet-500/8',  shadow: 'shadow-violet-500/15' },
  { value: '500+',    label: 'Courses',      icon: GraduationCap,bar: 'from-cyan-500 to-blue-500',     valuColor: 'text-cyan-600 dark:text-cyan-400',     border: 'border-cyan-200 dark:border-cyan-500/30',    cardBg: 'bg-cyan-50/60 dark:bg-cyan-500/8',      shadow: 'shadow-cyan-500/15'    },
  { value: '95%',     label: 'Success Rate', icon: Trophy,        bar: 'from-amber-400 to-orange-500',  valuColor: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-200 dark:border-amber-500/30',  cardBg: 'bg-amber-50/60 dark:bg-amber-500/8',    shadow: 'shadow-amber-500/15'   },
  { value: '24/7',    label: 'AI Support',   icon: Zap,           bar: 'from-emerald-500 to-teal-500',  valuColor: 'text-emerald-600 dark:text-emerald-400',border: 'border-emerald-200 dark:border-emerald-500/30',cardBg: 'bg-emerald-50/60 dark:bg-emerald-500/8',shadow: 'shadow-emerald-500/15' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Background ───────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-violet-950/40 to-cyan-950/20 hidden dark:block" />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-violet-50/70 to-cyan-50/50 dark:hidden" />
        <div className="absolute -top-40 -left-20  w-[700px] h-[700px] bg-violet-400/10 dark:bg-violet-600/8  rounded-full blur-[140px] animate-blob" />
        <div className="absolute top-1/3  -right-20 w-[600px] h-[600px] bg-cyan-400/10  dark:bg-cyan-500/8    rounded-full blur-[120px] animate-blob delay-200" />
        <div className="absolute bottom-0  left-1/3  w-[500px] h-[500px] bg-pink-400/8   dark:bg-pink-500/8   rounded-full blur-[100px] animate-blob delay-400" />
        <div className="grid-overlay absolute inset-0" />
      </div>

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full">
        <div className="glass border-b border-violet-200/60 dark:border-white/5 backdrop-blur-xl">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-300 dark:border-violet-500/30 group-hover:border-violet-400 transition-all duration-300">
                <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <span className="text-base sm:text-lg font-bold text-violet-700 dark:text-violet-300 whitespace-nowrap">EduCore AI</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {(['#features', '/courses', '#pricing'] as const).map((href, i) => (
                <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group font-medium">
                  {['Features', 'Courses', 'Pricing'][i]}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground font-medium" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" className="btn-shimmer bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-violet-500/25 font-semibold rounded-xl text-xs sm:text-sm px-3 sm:px-4" asChild>
                <Link href="/register"><span className="hidden xs:inline">Get Started</span><span className="xs:hidden">Start</span> <ArrowRight className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-14 sm:pt-20 md:pt-24 pb-20 sm:pb-28 md:pb-36 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 text-center">

          {/* Badge */}
          <div className="animate-fade-up flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border border-violet-300 dark:border-violet-500/40 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 shadow-sm max-w-xs sm:max-w-none text-center">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-violet-500 dark:text-violet-400 shrink-0" />
              <span>Now powered by Groq Llama 3.3 70B</span>
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shrink-0">NEW</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-4 sm:mb-6 animate-fade-up delay-100 leading-[1.05]">
            <span className="gradient-text">Learn Smarter.</span>
            <br />
            <span className="text-foreground">Teach </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">Better.</span>
              <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" height="6" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5 C40 1 80 7 120 3 C160 -1 190 5 199 5.5" stroke="url(#ug)" strokeWidth="3" strokeLinecap="round"/>
                <defs><linearGradient id="ug" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0891b2"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-10 animate-fade-up delay-200 leading-relaxed px-2 sm:px-0">
            The AI-powered LMS that adapts to you.
            Personalized tutoring, smart quizzes, and deep analytics —{' '}
            <span className="font-semibold text-violet-700 dark:text-violet-300">all in one place.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 animate-fade-up delay-300 px-4 sm:px-0">
            <Button size="lg" className="btn-shimmer bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white text-sm sm:text-base px-6 sm:px-10 h-12 sm:h-14 rounded-2xl shadow-2xl shadow-violet-500/30 border-0 font-bold group w-full sm:w-auto" asChild>
              <Link href="/register">
                Start Free Today <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-violet-200 dark:border-white/15 hover:border-violet-400 dark:hover:border-white/30 hover:bg-violet-50 dark:hover:bg-white/5 text-sm sm:text-base px-6 sm:px-10 h-12 sm:h-14 rounded-2xl font-semibold group transition-all w-full sm:w-auto" asChild>
              <Link href="/courses">
                <Play className="mr-2 h-4 w-4 fill-current group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" /> Browse Courses
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto animate-fade-up delay-400">
            {stats.map((s) => (
              <div key={s.label} className={`relative ${s.cardBg} rounded-2xl p-3 sm:p-5 border-2 ${s.border} hover:-translate-y-2 transition-all duration-300 shadow-lg ${s.shadow} overflow-hidden group`}>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.bar}`} />
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.bar} flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${s.valuColor}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating cards */}
        <div className="hidden lg:block absolute left-6 top-1/3 animate-float">
          <div className="glass-card rounded-2xl p-4 border border-violet-200 dark:border-violet-500/30 w-48 shadow-xl">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Brain className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-foreground">AI Tutor</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">&quot;Can you explain useState hooks?&quot;</p>
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 w-full" />
              <div className="h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 w-3/4 opacity-60 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute right-6 top-1/4 animate-float delay-200">
          <div className="glass-card rounded-2xl p-4 border border-cyan-200 dark:border-cyan-500/30 w-48 shadow-xl">
            <div className="flex items-center gap-2 mb-2.5">
              <Trophy className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              <span className="text-xs font-semibold text-foreground">Quiz Score</span>
              <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 font-bold">+12%</span>
            </div>
            <div className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">92%</div>
            <div className="flex gap-1 mt-2.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i < 4 ? 'bg-gradient-to-r from-cyan-400 to-indigo-500' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block absolute right-16 bottom-16 animate-float delay-300">
          <div className="glass-card rounded-2xl p-3 border border-emerald-200 dark:border-emerald-500/30 w-44 shadow-xl">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Live Learning</span>
            </div>
            <p className="text-xs text-muted-foreground">1,234 students online now</p>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.03] to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/15 border border-violet-300 dark:border-violet-500/30 text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-semibold mb-5">
              <Sparkles className="h-3.5 w-3.5" /> Features
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Everything you need to{' '}
              <span className="gradient-text">excel</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">
              Powerful features designed for modern learners and educators, powered by cutting-edge AI
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f) => (
              <div key={f.title} className="relative glass-card rounded-2xl p-6 border-2 border-border hover:border-transparent hover:-translate-y-1.5 transition-all duration-300 hover:shadow-2xl group glow-card overflow-hidden">
                {/* top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${f.bar}`} />
                {/* hover colored glow overlay */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${f.from} ${f.to}`} style={{ opacity: 0 }} />
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${f.from} ${f.to} flex items-center justify-center mb-5 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                <div className={`mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${f.bar} rounded-full transition-all duration-500`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-300 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs sm:text-sm font-semibold mb-5">
              <Zap className="h-3.5 w-3.5" /> How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Start learning in{' '}
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">minutes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 relative">
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-violet-400/50 via-cyan-400/50 to-pink-400/50 dark:from-violet-500/40 dark:via-cyan-500/40 dark:to-pink-500/40" />
            {steps.map((step, i) => (
              <div key={i} className={`text-center relative ${step.cardBg} rounded-2xl p-5 sm:p-8 border-2 ${step.accentBorder} hover:-translate-y-2 transition-all duration-300 group shadow-lg hover:shadow-2xl overflow-hidden`}>
                {/* corner number watermark */}
                <span className="absolute top-3 right-4 text-6xl font-black opacity-[0.06] text-foreground leading-none select-none">{step.step}</span>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 shadow-xl ${step.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  {step.step}
                </div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-md`}>
                  <step.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/[0.03] to-transparent pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-500/15 border border-pink-300 dark:border-pink-500/30 text-pink-700 dark:text-pink-300 text-xs sm:text-sm font-semibold mb-5">
              <Star className="h-3.5 w-3.5 fill-current" /> Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Loved by{' '}
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent">learners worldwide</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className={`relative ${t.cardBg} rounded-2xl p-6 border-2 ${t.border} hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 overflow-hidden group`}>
                {/* bottom gradient bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${t.bar}`} />
                {/* big decorative quote mark */}
                <span className={`absolute top-3 right-4 text-8xl font-black leading-none select-none ${t.quoteColor}`}>&ldquo;</span>
                {/* stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 text-amber-500 fill-amber-500" />)}
                </div>
                <p className="text-foreground/80 mb-6 text-sm leading-relaxed font-medium relative z-10">&ldquo;{t.quote}&rdquo;</p>
                <div className={`flex items-center gap-3 pt-4 border-t ${t.border}`}>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-extrabold text-base shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground font-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-500/15 border border-violet-300 dark:border-violet-500/30 text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-semibold mb-5">
              <Sparkles className="h-3.5 w-3.5" /> Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              Simple,{' '}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">transparent pricing</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-lg font-medium">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto items-start">

            {/* ── Free ── */}
            <div className="glass-card rounded-2xl p-5 sm:p-7 border-2 border-violet-300 dark:border-violet-500/50 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-violet-500/10">
              {/* Top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-violet-300 to-indigo-300 dark:from-violet-500 dark:to-indigo-500 rounded-full mb-6" />
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center mb-4 shadow-md">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold mb-1 text-foreground">Free</h3>
              <p className="text-muted-foreground text-sm mb-5">Perfect to get started</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl sm:text-5xl font-extrabold text-foreground">$0</span>
                <span className="text-sm text-muted-foreground mb-2">/month</span>
              </div>
              <ul className="space-y-2.5 mb-7">
                {['5 courses access', 'AI chat 20 msgs/day', 'Basic analytics', 'Quiz access', 'Progress tracking'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center h-11 rounded-xl border-2 border-violet-300 dark:border-violet-500/40 text-violet-700 dark:text-violet-300 font-semibold text-sm hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all duration-200"
              >
                Get Started Free
              </Link>
            </div>

            {/* ── Pro — Most Popular ── */}
            <div className="relative glass-card rounded-2xl border-2 border-violet-500 dark:border-violet-400 md:-mt-5 transition-all duration-300 shadow-2xl shadow-violet-500/20 overflow-hidden">
              {/* Most Popular full-width header strip */}
              <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 px-4 py-2.5 flex items-center justify-center gap-2">
                <Zap className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
                <span className="text-white text-xs font-bold tracking-wide uppercase">Most Popular</span>
                <Zap className="h-3.5 w-3.5 text-yellow-300 fill-yellow-300" />
              </div>

              <div className="p-5 sm:p-7 pt-5 sm:pt-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold mb-1 text-foreground">Pro</h3>
                <p className="text-muted-foreground text-sm mb-5">For serious learners</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl sm:text-5xl font-extrabold gradient-text">$19</span>
                  <span className="text-sm text-muted-foreground mb-2">/month</span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {['Unlimited courses', 'Priority AI tutor', 'Completion certificates', 'Advanced analytics', 'Priority support', 'Offline access'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                      <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-sm transition-all duration-200 shadow-xl shadow-violet-500/30 hover:-translate-y-0.5"
                >
                  Start Pro Trial <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* ── Enterprise ── */}
            <div className="glass-card rounded-2xl p-5 sm:p-7 border-2 border-violet-300 dark:border-violet-500/50 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-violet-500/10">
              {/* Top bar */}
              <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mb-6" />
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4 shadow-md">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-2xl font-extrabold mb-1 text-foreground">Enterprise</h3>
              <p className="text-muted-foreground text-sm mb-5">For teams &amp; organizations</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">$49</span>
                <span className="text-sm text-muted-foreground mb-2">/month</span>
              </div>
              <ul className="space-y-2.5 mb-7">
                {['Everything in Pro', 'Up to 50 team seats', 'Admin dashboard', 'Custom branding', 'Dedicated support', 'SSO & API access'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                    <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center h-11 rounded-xl border-2 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 font-semibold text-sm hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-200"
              >
                Contact Sales
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700" />
        <div className="absolute top-0   left-1/4  w-96 h-96 bg-cyan-400/25  rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400/20  rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs sm:text-sm font-semibold mb-5 sm:mb-6">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" /> Join 10,000+ learners today
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 sm:mb-5 leading-tight">
            Start your AI learning<br />journey <span className="text-yellow-300">today</span>
          </h2>
          <p className="text-white/75 text-base sm:text-xl mb-7 sm:mb-10 max-w-xl mx-auto leading-relaxed px-2 sm:px-0">
            Join thousands of learners mastering new skills with AI-powered education. Free forever, upgrade anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-violet-700 hover:bg-white/90 text-sm sm:text-base px-6 sm:px-10 h-12 sm:h-14 rounded-2xl shadow-2xl font-bold transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Get Started for Free <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/40 text-white hover:bg-white/25 hover:border-white/60 text-sm sm:text-base px-6 sm:px-10 h-12 sm:h-14 rounded-2xl font-semibold backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              <Play className="h-4 w-4 fill-current" /> Explore Courses
            </Link>
          </div>
        </div>
      </section>

      {/* ── Developer Card ────────────────────────────────────────── */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-3xl overflow-hidden border border-violet-200 dark:border-violet-500/20 shadow-xl">
              {/* Top accent */}
              <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />
              <div className="p-5 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl shadow-violet-500/30">
                      P
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <Code2 className="h-3 w-3 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/15 border border-violet-200 dark:border-violet-500/25 text-violet-600 dark:text-violet-400 text-xs font-semibold mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Developer
                    </div>
                    <h3 className="text-2xl font-extrabold mb-1 text-violet-700 dark:text-violet-300">
                      Prajwal Mulik
                    </h3>
                    <p className="text-muted-foreground text-sm mb-5">Full-Stack Developer · Built EduCore AI</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {/* GitHub */}
                      <a
                        href="https://github.com/prajwal310503"
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-500/50 hover:border-slate-400 dark:hover:border-slate-400/70 hover:bg-slate-200 dark:hover:bg-slate-700/90 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                      >
                        <svg className="h-4 w-4 text-slate-700 dark:text-slate-200 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold truncate">prajwal310503</span>
                      </a>
                      {/* LinkedIn */}
                      <a
                        href="https://www.linkedin.com/in/prajwal-mulik-22a6182b1/"
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/50 hover:bg-blue-200 dark:hover:bg-blue-500/30 hover:border-blue-400 dark:hover:border-blue-400/70 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                      >
                        <svg className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">LinkedIn</span>
                      </a>
                      {/* Portfolio */}
                      <a
                        href="https://prajwal-mulik.netlify.app/"
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-100 dark:bg-violet-500/20 border border-violet-300 dark:border-violet-400/50 hover:bg-violet-200 dark:hover:bg-violet-500/30 hover:border-violet-400 dark:hover:border-violet-400/70 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                      >
                        <Globe className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                        <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold">Portfolio</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="relative border-t border-border">
        <div className="glass border-t border-violet-100 dark:border-white/5">
          <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-300 dark:border-violet-500/25">
                    <GraduationCap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <span className="text-lg font-extrabold text-violet-700 dark:text-violet-300">EduCore AI</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  An advanced AI-powered LMS built with Next.js 15, MongoDB, TypeScript, and Groq AI. Designed for the modern learner.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-bold text-sm mb-4 text-foreground">Platform</h4>
                <ul className="space-y-2.5">
                  {[['Courses', '/courses'], ['Login', '/login'], ['Register', '/register']].map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center gap-1.5 group">
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Developer */}
              <div>
                <h4 className="font-bold text-sm mb-4 text-foreground">Developer</h4>
                <p className="text-sm font-semibold text-foreground mb-3">Prajwal Mulik</p>
                <div className="space-y-2">
                  <a href="https://github.com/prajwal310503" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    github.com/prajwal310503
                  </a>
                  <a href="https://www.linkedin.com/in/prajwal-mulik-22a6182b1/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    prajwal-mulik-22a6182b1
                  </a>
                  <a href="https://prajwal-mulik.netlify.app/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    prajwal-mulik.netlify.app
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
              <p className="text-xs text-muted-foreground">
                © 2026 EduCore AI · Built by <span className="text-violet-600 dark:text-violet-400 font-semibold">Prajwal Mulik</span> · Next.js 15, MongoDB Atlas &amp; Groq AI
              </p>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/15 border border-violet-200 dark:border-violet-500/25 text-violet-600 dark:text-violet-400 text-xs font-medium">
                  <Sparkles className="h-3 w-3" /> Groq AI
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-200 dark:border-cyan-500/25 text-cyan-600 dark:text-cyan-400 text-xs font-medium">
                  Next.js 15
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  MongoDB
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
