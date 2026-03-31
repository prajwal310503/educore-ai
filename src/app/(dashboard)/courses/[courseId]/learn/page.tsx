'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CheckCircle, Circle, Send, Loader2, Sparkles,
  ChevronLeft, ChevronRight, BookOpen, Brain, Trophy,
  Plus, Pencil, Trash2, Check, X, MessageSquare, List, MessageCircle
} from 'lucide-react'
import { BackButton } from '@/components/shared/BackButton'

type Chapter = {
  id: string
  title: string
  content: string
  order: number
  isPublished: boolean
}

type ProgressItem = { chapterId: string; isCompleted: boolean }

type Enrollment = {
  id: string
  progress: ProgressItem[]
}

type Course = {
  id: string
  title: string
  chapters: Chapter[]
}

type Quiz = {
  id: string
  title: string
  timeLimit: number | null
  retakeLimit: number
  _count: { questions: number }
}

export default function LearnPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<string[] | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [showMobileChapters, setShowMobileChapters] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string }
  type ChatSession = { id: string; name: string; messages: ChatMessage[] }

  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Resizable chat panel
  const [chatWidth, setChatWidth] = useState(380)
  const isResizing = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function startResize(e: React.MouseEvent) {
    isResizing.current = true
    e.preventDefault()
    const onMove = (ev: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return
      const containerRight = containerRef.current.getBoundingClientRect().right
      const newWidth = Math.max(240, Math.min(600, containerRight - ev.clientX))
      setChatWidth(newWidth)
    }
    const onUp = () => {
      isResizing.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const currentChapter = course?.chapters[currentChapterIndex]
  const currentProgress = enrollment?.progress.find(p => p.chapterId === currentChapter?.id)
  const completedCount = enrollment?.progress.filter(p => p.isCompleted).length ?? 0
  const totalChapters = course?.chapters.length ?? 0
  const progressPct = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0

  useEffect(() => {
    async function fetchData() {
      const [courseRes, enrollmentRes, quizzesRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/enrollments?courseId=${courseId}`),
        fetch(`/api/courses/${courseId}/quizzes`),
      ])
      const courseData = await courseRes.json()
      const enrollmentData = await enrollmentRes.json()
      const quizzesData = await quizzesRes.json()

      if (courseData.success) setCourse(courseData.data)
      if (enrollmentData.success && enrollmentData.data) setEnrollment(enrollmentData.data)
      else router.push(`/courses/${courseId}`)
      if (quizzesData.success) setQuizzes(quizzesData.data)

      // Load chat sessions for this course
      try {
        const sessionsRes = await fetch(`/api/ai/sessions?courseId=${courseId}`)
        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json()
          if (sessionsData.success) {
            const loadedSessions: ChatSession[] = sessionsData.data.sessions
            setSessions(loadedSessions)
            if (loadedSessions.length > 0) {
              setActiveSessionId(loadedSessions[0].id)
              setMessages(loadedSessions[0].messages)
            }
          }
        }
      } catch {
        // Sessions unavailable - continue without history
      }

      setLoading(false)
    }
    fetchData()
  }, [courseId, router])

  useEffect(() => {
    setSummary(null)
  }, [currentChapterIndex])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleMarkComplete() {
    if (!currentChapter) return
    setMarkingComplete(true)
    try {
      const res = await fetch('/api/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: currentChapter.id, isCompleted: !currentProgress?.isCompleted }),
      })
      const data = await res.json()
      if (data.success) {
        setEnrollment(prev => {
          if (!prev) return prev
          return {
            ...prev,
            progress: prev.progress.map(p =>
              p.chapterId === currentChapter.id
                ? { ...p, isCompleted: !p.isCompleted }
                : p
            ),
          }
        })
        toast.success(currentProgress?.isCompleted ? 'Marked incomplete' : 'Chapter completed!')
      }
    } finally {
      setMarkingComplete(false)
    }
  }

  async function createNewSession() {
    const res = await fetch('/api/ai/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, name: 'New Chat' }),
    })
    const data = await res.json()
    if (data.success) {
      const newSession: ChatSession = { ...data.data.session, messages: [] }
      setSessions(prev => [newSession, ...prev])
      setActiveSessionId(newSession.id)
      setMessages([])
    }
  }

  function switchSession(s: ChatSession) {
    setActiveSessionId(s.id)
    setMessages(s.messages)
  }

  async function handleRename(sessionId: string, name: string) {
    if (!name.trim()) return
    await fetch('/api/ai/sessions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, name }),
    })
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, name } : s))
    setRenamingId(null)
  }

  async function deleteSession(sessionId: string) {
    await fetch('/api/ai/sessions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    const remaining = sessions.filter(s => s.id !== sessionId)
    setSessions(remaining)
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0]?.id ?? null)
      setMessages(remaining[0]?.messages ?? [])
    }
  }

  async function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || chatLoading) return

    // Auto-create session if none exists
    let sessionId = activeSessionId
    if (!sessionId) {
      const res = await fetch('/api/ai/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, name: text.slice(0, 40) }),
      })
      const data = await res.json()
      if (data.success) {
        const newSession: ChatSession = { ...data.data.session, messages: [] }
        setSessions(prev => [newSession, ...prev])
        sessionId = newSession.id
        setActiveSessionId(newSession.id)
      }
    }

    // Auto-name session from first message
    const activeSession = sessions.find(s => s.id === sessionId)
    if (activeSession?.name === 'New Chat' && activeSession.messages.length === 0) {
      const autoName = text.slice(0, 40)
      handleRename(sessionId!, autoName)
    }

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, userMsg] } : s))
    setInput('')
    setChatLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, courseId, sessionId, chapterTitle: currentChapter?.title, chapterContent: currentChapter?.content }),
      })
      const data = await res.json()
      if (data.success) {
        const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.data.reply }
        setMessages(prev => [...prev, aiMsg])
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, aiMsg] } : s))
      } else {
        toast.error(data.error || 'AI Tutor failed to respond')
      }
    } catch {
      toast.error('Failed to connect to AI Tutor')
    } finally {
      setChatLoading(false)
    }
  }

  async function handleGetSummary() {
    if (!currentChapter) return
    setLoadingSummary(true)
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: currentChapter.id }),
      })
      const data = await res.json()
      if (data.success) setSummary(data.data.summary)
    } catch {
      toast.error('Failed to generate summary')
    } finally {
      setLoadingSummary(false)
    }
  }

  if (loading) {
    return (
      <div className="hidden md:grid grid-cols-4 gap-6 h-full">
        <Skeleton className="col-span-1 h-96" />
        <Skeleton className="col-span-2 h-96" />
        <Skeleton className="col-span-1 h-96" />
      </div>
    )
  }

  if (!course) return <div className="text-center py-12">Course not found</div>

  return (
    <div className="space-y-0">
      {/* Mobile toolbar */}
      <div className="flex items-center gap-2 mb-3 md:hidden">
        <button
          onClick={() => setShowMobileChapters(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors"
        >
          <List className="h-3.5 w-3.5" /> Chapters
        </button>
        <button
          onClick={() => setShowMobileChat(v => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/25 bg-indigo-500/5 text-xs font-medium text-indigo-500 hover:bg-indigo-500/10 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" /> AI Tutor
        </button>
      </div>
    <div ref={containerRef} className="flex h-[calc(100vh-8rem)] gap-0 overflow-hidden">
      {/* Chapter List */}
      <aside className={`w-full md:w-52 shrink-0 overflow-y-auto border-r border-border pr-4 ${showMobileChapters ? 'block absolute inset-0 z-20 bg-background p-4 md:static md:block' : 'hidden md:block'}`}>
        <div className="mb-4">
          <BackButton label="Course" className="mb-3 text-xs" />
          <h2 className="font-semibold text-sm mb-1 truncate">{course.title}</h2>
          <div className="flex items-center gap-2">
            <Progress value={progressPct} className="h-1.5 flex-1" />
            <span className="text-xs text-muted-foreground">{progressPct}%</span>
          </div>
        </div>
        <div className="space-y-1">
          {course.chapters.map((ch, i) => {
            const done = enrollment?.progress.find(p => p.chapterId === ch.id)?.isCompleted
            return (
              <button
                key={ch.id}
                onClick={() => { setCurrentChapterIndex(i); setShowMobileChapters(false) }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                  i === currentChapterIndex
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <div className="flex items-start gap-2">
                  {done ? (
                    <CheckCircle className="h-3.5 w-3.5 text-[hsl(var(--success))] mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="line-clamp-2">{ch.title}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Quizzes section */}
        {quizzes.length > 0 && (
          <>
            <Separator className="my-3" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" /> Quizzes
              </p>
              <div className="space-y-1">
                {quizzes.map(q => (
                  <Link
                    key={q.id}
                    href={`/courses/${courseId}/quiz/${q.id}`}
                    className="block px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{q.title}</span>
                      <span className="text-muted-foreground ml-1 shrink-0">{q._count.questions}Q</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{currentChapter?.title}</h1>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleGetSummary}
                disabled={loadingSummary}
                className="text-xs"
              >
                {loadingSummary ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                )}
                AI Summary
              </Button>
              <Button
                size="sm"
                onClick={handleMarkComplete}
                disabled={markingComplete}
                className={`text-xs ${currentProgress?.isCompleted ? 'bg-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/90' : 'bg-primary hover:bg-primary/90'}`}
              >
                {markingComplete ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                ) : (
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                )}
                {currentProgress?.isCompleted ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>
          </div>

          {summary && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">AI Summary</span>
              </div>
              <ul className="space-y-2">
                {summary.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {currentChapter?.content}
            </pre>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentChapterIndex(i => Math.max(0, i - 1))}
              disabled={currentChapterIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentChapterIndex + 1} / {totalChapters}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentChapterIndex(i => Math.min(totalChapters - 1, i + 1))}
              disabled={currentChapterIndex === totalChapters - 1}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Show quizzes at bottom if course is fully complete */}
          {progressPct === 100 && quizzes.length > 0 && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="h-5 w-5 text-[hsl(var(--warning))]" />
                <h3 className="font-semibold">Course Complete! Test Your Knowledge</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {quizzes.map(q => (
                  <Button key={q.id} asChild size="sm" className="bg-primary hover:bg-primary/90">
                    <Link href={`/courses/${courseId}/quiz/${q.id}`}>
                      <BookOpen className="h-3.5 w-3.5 mr-1" /> {q.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Drag handle — desktop only */}
      <div
        onMouseDown={startResize}
        className="hidden md:flex w-1.5 shrink-0 cursor-col-resize group items-center justify-center hover:bg-primary/20 transition-colors"
        title="Drag to resize"
      >
        <div className="w-0.5 h-8 rounded-full bg-border group-hover:bg-primary transition-colors" />
      </div>

      {/* AI Chat — desktop fixed panel, mobile overlay */}
      <aside className={`flex-col border-l border-border shrink-0 overflow-hidden hidden md:flex`} style={{ width: chatWidth }}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-xs">AI Tutor</span>
            <Badge className="text-[10px] bg-primary/10 text-primary border-0 px-1.5 py-0">Groq</Badge>
          </div>
          <button
            onClick={createNewSession}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors px-1.5 py-1 rounded hover:bg-primary/10"
          >
            <Plus className="h-3 w-3" /> New Chat
          </button>
        </div>

        {/* Session list */}
        {sessions.length > 0 && (
          <div className="shrink-0 border-b border-border max-h-28 overflow-y-auto">
            {sessions.map(s => (
              <div
                key={s.id}
                onClick={() => switchSession(s)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 cursor-pointer transition-colors text-[11px] ${
                  activeSessionId === s.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <MessageSquare className="h-3 w-3 shrink-0" />
                {renamingId === s.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleRename(s.id, renameValue)
                      if (e.key === 'Escape') setRenamingId(null)
                    }}
                    onClick={e => e.stopPropagation()}
                    className="flex-1 bg-transparent outline-none border-b border-primary text-[11px] min-w-0"
                  />
                ) : (
                  <span className="flex-1 truncate">{s.name}</span>
                )}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  {renamingId === s.id ? (
                    <>
                      <button onClick={() => handleRename(s.id, renameValue)} className="p-0.5 hover:text-primary"><Check className="h-3 w-3" /></button>
                      <button onClick={() => setRenamingId(null)} className="p-0.5 hover:text-destructive"><X className="h-3 w-3" /></button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setRenamingId(s.id); setRenameValue(s.name) }} className="p-0.5 hover:text-primary"><Pencil className="h-3 w-3" /></button>
                      <button onClick={() => deleteSession(s.id)} className="p-0.5 hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 p-3">
          {messages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-xs">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Ask me anything about this chapter!</p>
              {sessions.length === 0 && <p className="mt-1 opacity-60">Your chats are saved automatically.</p>}
            </div>
          )}
          {messages.map((m: ChatMessage) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[92%] rounded-xl px-3 py-2 text-xs ${
                m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              }`}>
                {m.role === 'user' ? (
                  <span>{m.content}</span>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      code: ({ children }) => <code className="bg-black/20 dark:bg-white/10 rounded px-1 py-0.5 font-mono text-[10px]">{children}</code>,
                      h1: ({ children }) => <h1 className="font-bold text-sm mb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="font-semibold text-xs mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="font-semibold text-xs mb-1">{children}</h3>,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleChatSubmit} className="flex gap-2 p-3 border-t border-border shrink-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 text-xs border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button type="submit" size="sm" disabled={chatLoading || !input.trim()} className="bg-primary hover:bg-primary/90">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </aside>
    </div>

    {/* Mobile AI Chat overlay */}
    {showMobileChat && (
      <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowMobileChat(false)}>
        <div
          className="absolute bottom-0 left-0 right-0 h-[70vh] bg-background rounded-t-2xl flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">AI Tutor</span>
            </div>
            <button onClick={() => setShowMobileChat(false)} className="p-1 rounded-lg hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 p-4">
            {messages.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Ask me anything about this chapter!</p>
              </div>
            )}
            {messages.map((m: ChatMessage) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleChatSubmit} className="flex gap-2 p-4 border-t border-border">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 text-sm border border-border rounded-xl px-4 py-2.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button type="submit" size="sm" disabled={chatLoading || !input.trim()} className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    )}
  </div>
)
}
