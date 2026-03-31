'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import {
  GripVertical, Plus, Trash2, Eye, EyeOff, Save,
  Sparkles, X, CheckCircle, Loader2, Brain, Clock,
  Settings2, BookOpen, ChevronRight, AlertTriangle
} from 'lucide-react'
import { BackButton } from '@/components/shared/BackButton'
import { ThumbnailUpload } from '@/components/shared/ThumbnailUpload'

const courseSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(5000),
  category: z.enum(['Web Development', 'Data Science', 'Design', 'Marketing', 'Business', 'DevOps', 'Other']),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  price: z.number().min(0).max(9999),
  language: z.string().min(1),
})

type CourseForm = z.infer<typeof courseSchema>

type Chapter = {
  id: string
  title: string
  content: string
  videoUrl: string | null
  order: number
  isPublished: boolean
  aiSummary: string | null
}

type Course = {
  id: string
  title: string
  description: string
  category: string
  level: string
  price: number
  language: string
  isPublished: boolean
  tags: string[]
  thumbnail: string | null
  chapters: Chapter[]
}

type Quiz = {
  id: string
  title: string
  timeLimit: number | null
  retakeLimit: number
  aiGenerated: boolean
  _count: { questions: number }
}

function SortableChapterItem({
  chapter, index, isSelected, onSelect, onTogglePublish, onDelete
}: {
  chapter: Chapter
  index: number
  isSelected: boolean
  onSelect: () => void
  onTogglePublish: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: chapter.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all group ${
        isSelected
          ? 'border-indigo-500/40 bg-indigo-500/10'
          : 'border-border hover:border-indigo-500/30 hover:bg-accent'
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground p-0.5 shrink-0" onClick={e => e.stopPropagation()}>
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <span className={`text-xs w-5 h-5 rounded-md flex items-center justify-center font-bold shrink-0 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>{index + 1}</span>
      <span className="flex-1 text-xs truncate font-medium">{chapter.title || 'Untitled'}</span>
      <button onClick={e => { e.stopPropagation(); onTogglePublish() }} className="p-1 text-muted-foreground/50 hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {chapter.isPublished ? <Eye className="h-3 w-3 text-emerald-400" /> : <EyeOff className="h-3 w-3" />}
      </button>
      <button onClick={e => { e.stopPropagation(); onDelete() }} className="p-1 text-muted-foreground/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

export default function CourseEditorPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)
  const [chapterDraft, setChapterDraft] = useState<Partial<Chapter>>({})
  const [savingChapter, setSavingChapter] = useState(false)
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [thumbnail, setThumbnail] = useState<string>('')
  const [showSavedBanner, setShowSavedBanner] = useState(false)

  // Dialog state
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [addChapterOpen, setAddChapterOpen] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingCourse, setDeletingCourse] = useState(false)
  const [generatingContent, setGeneratingContent] = useState(false)

  // Quiz state
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [showQuizForm, setShowQuizForm] = useState(false)
  const [quizTopic, setQuizTopic] = useState('')
  const [quizDifficulty, setQuizDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [quizCount, setQuizCount] = useState(5)
  const [quizTitle, setQuizTitle] = useState('')
  const [quizTimeLimit, setQuizTimeLimit] = useState<number | ''>('')
  const [generatingQuiz, setGeneratingQuiz] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<{ text: string; options: string[]; correctAnswer: number; explanation?: string }[]>([])
  const [savingQuiz, setSavingQuiz] = useState(false)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
  })

  const watchedCategory = watch('category')
  const watchedLevel = watch('level')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchQuizzes = useCallback(async () => {
    const res = await fetch(`/api/courses/${courseId}/quizzes`)
    const data = await res.json()
    if (data.success) setQuizzes(data.data)
  }, [courseId])

  useEffect(() => {
    fetch(`/api/courses/${courseId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const c = data.data
          setCourse(c)
          setChapters(c.chapters.sort((a: Chapter, b: Chapter) => a.order - b.order))
          setTags(c.tags ?? [])
          setThumbnail(c.thumbnail ?? '')
          reset({
            title: c.title, description: c.description, category: c.category,
            level: c.level, price: c.price, language: c.language,
          })
          if (c.chapters.length > 0) {
            setSelectedChapterId(c.chapters[0].id)
            setChapterDraft(c.chapters[0])
          }
        }
      })
      .finally(() => setLoading(false))
    fetchQuizzes()
  }, [courseId, reset, fetchQuizzes])

  const selectedChapter = chapters.find(c => c.id === selectedChapterId)

  async function saveCourse(data: CourseForm) {
    setSaving(true)
    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, tags, thumbnail: thumbnail || null }),
      })
      const result = await res.json()
      if (result.success) {
        setSaveStatus('saved')
        toast.success('Course saved!')
        setCourse(result.data)
        setSettingsOpen(false)
      } else {
        toast.error(result.error)
        setSaveStatus('unsaved')
      }
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish() {
    if (!course) return
    const res = await fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !course.isPublished }),
    })
    const data = await res.json()
    if (data.success) {
      setCourse(data.data)
      toast.success(data.data.isPublished ? 'Course published!' : 'Course unpublished')
    }
  }

  async function addChapter() {
    const title = newChapterTitle.trim() || `Chapter ${chapters.length + 1}`
    const newChapter = {
      title,
      content: `# ${title}\n\nStart writing your chapter content here...`,
      order: chapters.length,
      isPublished: false,
    }
    const res = await fetch(`/api/courses/${courseId}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newChapter),
    })
    const data = await res.json()
    if (data.success) {
      const created = data.data
      setChapters(prev => [...prev, created])
      setSelectedChapterId(created.id)
      setChapterDraft(created)
      setAddChapterOpen(false)
      setNewChapterTitle('')
      toast.success('Chapter added!')
    } else {
      toast.error(data.error || 'Failed to add chapter')
    }
  }

  async function saveChapter() {
    if (!selectedChapterId || !chapterDraft) return
    setSavingChapter(true)
    try {
      const { title, content, videoUrl, order, isPublished } = chapterDraft
      const res = await fetch(`/api/courses/${courseId}/chapters/${selectedChapterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, videoUrl: videoUrl ?? null, order, isPublished }),
      })
      const data = await res.json()
      if (data.success) {
        setChapters(prev => prev.map(c => c.id === selectedChapterId ? data.data : c))
        setSaveStatus('saved')
        setShowSavedBanner(true)
        setTimeout(() => setShowSavedBanner(false), 3000)
      } else {
        toast.error(data.error || 'Failed to save chapter')
        setSaveStatus('unsaved')
      }
    } finally {
      setSavingChapter(false)
    }
  }

  async function deleteCourse() {
    setDeletingCourse(true)
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast.success('Course deleted')
        router.push('/instructor/courses')
      } else {
        toast.error(data.error || 'Failed to delete course')
      }
    } finally {
      setDeletingCourse(false)
      setDeleteOpen(false)
    }
  }

  async function generateChapterContent() {
    const title = chapterDraft.title?.trim()
    if (!title) { toast.error('Enter a chapter title first'); return }
    setGeneratingContent(true)
    try {
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category: course?.category, courseTitle: course?.title }),
      })
      const data = await res.json()
      if (data.success) {
        setChapterDraft(d => ({ ...d, content: data.data.content }))
        setSaveStatus('unsaved')
        toast.success('Content generated!')
      } else {
        toast.error(data.error || 'Generation failed')
      }
    } finally {
      setGeneratingContent(false)
    }
  }

  async function deleteChapter(chapterId: string) {
    const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}`, { method: 'DELETE' })
    if (res.ok) {
      setChapters(prev => prev.filter(c => c.id !== chapterId))
      if (selectedChapterId === chapterId) {
        const remaining = chapters.filter(c => c.id !== chapterId)
        setSelectedChapterId(remaining[0]?.id ?? null)
        setChapterDraft(remaining[0] ?? {})
      }
    }
  }

  async function toggleChapterPublish(chapterId: string) {
    const ch = chapters.find(c => c.id === chapterId)
    if (!ch) return
    const res = await fetch(`/api/courses/${courseId}/chapters/${chapterId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !ch.isPublished }),
    })
    const data = await res.json()
    if (data.success) setChapters(prev => prev.map(c => c.id === chapterId ? data.data : c))
  }

  async function generateSummary() {
    if (!selectedChapterId) return
    setGeneratingSummary(true)
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId: selectedChapterId }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('AI summary generated!')
        setChapters(prev => prev.map(c =>
          c.id === selectedChapterId ? { ...c, aiSummary: JSON.stringify(data.data.summary) } : c
        ))
      }
    } finally {
      setGeneratingSummary(false)
    }
  }

  async function generateQuiz() {
    if (!quizTopic.trim()) { toast.error('Enter a topic'); return }
    setGeneratingQuiz(true)
    setGeneratedQuestions([])
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: quizTopic, difficulty: quizDifficulty, count: quizCount, category: course?.category ?? 'General' }),
      })
      const data = await res.json()
      if (data.success) {
        setGeneratedQuestions(data.data.questions)
        if (!quizTitle) setQuizTitle(`${quizTopic} Quiz`)
        toast.success(`Generated ${data.data.questions.length} questions!`)
      } else {
        toast.error(data.error || 'Generation failed')
      }
    } finally {
      setGeneratingQuiz(false)
    }
  }

  async function saveQuiz() {
    if (!quizTitle.trim() || generatedQuestions.length === 0) {
      toast.error('Quiz title and questions are required')
      return
    }
    setSavingQuiz(true)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: quizTitle, courseId,
          timeLimit: quizTimeLimit || undefined,
          retakeLimit: 3,
          questions: generatedQuestions,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Quiz saved!')
        setShowQuizForm(false)
        setGeneratedQuestions([])
        setQuizTitle('')
        setQuizTopic('')
        setQuizTimeLimit('')
        fetchQuizzes()
      } else {
        toast.error(data.error || 'Failed to save quiz')
      }
    } finally {
      setSavingQuiz(false)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = chapters.findIndex(c => c.id === active.id)
    const newIndex = chapters.findIndex(c => c.id === over.id)
    const reordered = arrayMove(chapters, oldIndex, newIndex).map((c, i) => ({ ...c, order: i }))
    setChapters(reordered)
    reordered.forEach(ch => {
      fetch(`/api/courses/${courseId}/chapters/${ch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: ch.order }),
      })
    })
  }

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />
      <div className="flex gap-4">
        <Skeleton className="w-64 h-96" />
        <Skeleton className="flex-1 h-96" />
      </div>
    </div>
  )

  if (!course) return <p className="text-muted-foreground">Course not found</p>

  return (
    <>
      {/* ── Course Settings Dialog ── */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl border-border bg-background">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-indigo-400" /> Course Settings
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(saveCourse)} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input {...register('title')} className="h-9 text-sm" />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Textarea {...register('description')} className="text-sm min-h-[80px] resize-none" />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select value={watchedCategory} onValueChange={v => setValue('category', v as CourseForm['category'], { shouldValidate: true })}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Web Development','Data Science','Design','Marketing','Business','DevOps','Other'].map(c => (
                    <SelectItem key={c} value={c} className="text-sm">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <div className="space-y-1.5 flex-1">
                <Label className="text-xs text-muted-foreground">Level</Label>
                <Select value={watchedLevel} onValueChange={v => setValue('level', v as CourseForm['level'], { shouldValidate: true })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER" className="text-sm">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE" className="text-sm">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED" className="text-sm">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 flex-1">
                <Label className="text-xs text-muted-foreground">Price</Label>
                <div className="flex h-9 items-center rounded-md border border-border bg-background px-2.5 focus-within:ring-1 focus-within:ring-ring">
                  <span className="text-muted-foreground mr-1 text-sm shrink-0">$</span>
                  <input
                    type="number" min={0} step={0.01}
                    {...register('price', { valueAsNumber: true })}
                    className="flex-1 bg-transparent outline-none text-sm w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Tags (max 5)</Label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {tags.map(t => (
                  <Badge key={t} variant="secondary" className="text-xs gap-1 pl-2.5 pr-1.5 py-0.5">
                    {t}
                    <button type="button" onClick={() => setTags(prev => prev.filter(x => x !== t))}>
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
              </div>
              {tags.length < 5 && (
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="Type a tag and press Enter"
                  className="h-8 text-xs"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (newTag.trim() && !tags.includes(newTag.trim())) {
                        setTags(prev => [...prev, newTag.trim()])
                        setNewTag('')
                      }
                    }
                  }}
                />
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Thumbnail <span className="text-muted-foreground/60">(optional)</span></Label>
              <ThumbnailUpload value={thumbnail} onChange={setThumbnail} />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSettingsOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={saving} className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-md shadow-indigo-500/20">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Course Dialog ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl border-border bg-background">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Delete Course
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">{course?.title}</span>? This will remove all chapters, quizzes, and enrollments. This action cannot be undone.
            </p>
            <div className="p-3 rounded-xl bg-destructive/8 border border-destructive/20">
              <p className="text-xs text-destructive font-medium">⚠ All student progress will be lost</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              size="sm"
              onClick={deleteCourse}
              disabled={deletingCourse}
              className="bg-destructive hover:bg-destructive/90 text-white border-0"
            >
              {deletingCourse ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Trash2 className="h-3.5 w-3.5 mr-1.5" />}
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Add Chapter Dialog ── */}
      <Dialog open={addChapterOpen} onOpenChange={setAddChapterOpen}>
        <DialogContent className="sm:max-w-sm rounded-2xl border-border bg-background">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-indigo-400" /> Add New Chapter
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Chapter Title</Label>
              <Input
                value={newChapterTitle}
                onChange={e => setNewChapterTitle(e.target.value)}
                placeholder={`Chapter ${chapters.length + 1}`}
                className="h-9 text-sm"
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addChapter() } }}
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">You can edit the content after creating the chapter.</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setAddChapterOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={addChapter} className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-md shadow-indigo-500/20">
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Chapter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Saved Banner ── */}
      {showSavedBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 animate-fade-up">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-semibold">Chapter saved successfully!</span>
        </div>
      )}

      {/* ── Main Layout ── */}
      <div className="flex flex-col gap-4 md:h-[calc(100vh-7rem)]">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-2">
          <BackButton label="My Courses" href="/instructor/courses" />
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold truncate">{course.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <Badge className={`text-xs border ${course.isPublished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-muted text-muted-foreground border-border'}`}>
              {course.isPublished ? 'Published' : 'Draft'}
            </Badge>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => setSettingsOpen(true)}>
              <Settings2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={togglePublish}>
              {course.isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{course.isPublished ? 'Unpublish' : 'Publish'}</span>
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>

        {/* Editor area */}
        <div className="flex flex-col md:flex-row gap-4 md:flex-1 md:min-h-0">
          {/* Left: Chapter list + Quizzes */}
          <aside className="w-full md:w-60 md:flex-shrink-0 flex flex-col gap-3 md:overflow-y-auto">
            {/* Chapters */}
            <div className="glass-card rounded-2xl border border-indigo-500/15 p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Chapters</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-indigo-500/10" onClick={() => setAddChapterOpen(true)}>
                  <Plus className="h-3.5 w-3.5 text-indigo-400" />
                </Button>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={chapters.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-1">
                    {chapters.map((ch, i) => (
                      <SortableChapterItem
                        key={ch.id}
                        chapter={ch}
                        index={i}
                        isSelected={selectedChapterId === ch.id}
                        onSelect={() => { setSelectedChapterId(ch.id); setChapterDraft(ch) }}
                        onTogglePublish={() => toggleChapterPublish(ch.id)}
                        onDelete={() => deleteChapter(ch.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              {chapters.length === 0 && (
                <button
                  onClick={() => setAddChapterOpen(true)}
                  className="w-full py-4 rounded-xl border-2 border-dashed border-indigo-500/25 text-xs text-muted-foreground hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all flex flex-col items-center gap-1.5"
                >
                  <Plus className="h-5 w-5" />
                  Add First Chapter
                </button>
              )}
            </div>

            {/* Quizzes */}
            <div className="glass-card rounded-2xl border border-indigo-500/15 p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Quizzes</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-indigo-500/10" onClick={() => setShowQuizForm(v => !v)}>
                  {showQuizForm ? <X className="h-3.5 w-3.5 text-muted-foreground" /> : <Plus className="h-3.5 w-3.5 text-indigo-400" />}
                </Button>
              </div>

              {quizzes.map(q => (
                <div key={q.id} className="flex items-center gap-2 p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/15 text-xs">
                  <Brain className="h-3 w-3 text-indigo-400 shrink-0" />
                  <span className="flex-1 truncate">{q.title}</span>
                  <span className="text-muted-foreground">{q._count.questions}Q</span>
                  {q.timeLimit && <span className="flex items-center gap-0.5 text-muted-foreground"><Clock className="h-2.5 w-2.5" />{q.timeLimit}m</span>}
                </div>
              ))}

              {showQuizForm && (
                <div className="space-y-2 pt-1 border-t border-border">
                  <p className="text-xs font-semibold flex items-center gap-1 text-indigo-400"><Sparkles className="h-3 w-3" /> AI Quiz Generator</p>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Quiz Title</Label>
                    <Input value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="React Hooks Quiz" className="h-7 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Topic</Label>
                    <Input value={quizTopic} onChange={e => setQuizTopic(e.target.value)} placeholder="useState and useEffect" className="h-7 text-xs" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Difficulty</Label>
                      <Select value={quizDifficulty} onValueChange={v => setQuizDifficulty(v as 'easy' | 'medium' | 'hard')}>
                        <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy" className="text-xs">Easy</SelectItem>
                          <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                          <SelectItem value="hard" className="text-xs">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Count</Label>
                      <Input type="number" min={3} max={15} value={quizCount} onChange={e => setQuizCount(Number(e.target.value))} className="h-7 text-xs" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Time Limit (min, optional)</Label>
                    <Input type="number" min={1} max={60} value={quizTimeLimit} onChange={e => setQuizTimeLimit(e.target.value ? Number(e.target.value) : '')} placeholder="No limit" className="h-7 text-xs" />
                  </div>
                  <Button size="sm" className="w-full text-xs h-7 bg-indigo-500 hover:bg-indigo-600 text-white border-0" onClick={generateQuiz} disabled={generatingQuiz}>
                    {generatingQuiz ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Sparkles className="h-3 w-3 mr-1" />}
                    {generatingQuiz ? 'Generating...' : 'Generate'}
                  </Button>
                  {generatedQuestions.length > 0 && (
                    <>
                      <div className="p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/15">
                        <p className="text-[10px] text-muted-foreground mb-1">Preview ({generatedQuestions.length} Qs):</p>
                        {generatedQuestions.slice(0, 2).map((q, i) => (
                          <p key={i} className="text-[10px] truncate">Q{i+1}: {q.text}</p>
                        ))}
                        {generatedQuestions.length > 2 && <p className="text-[10px] text-muted-foreground">+{generatedQuestions.length - 2} more</p>}
                      </div>
                      <Button size="sm" className="w-full text-xs h-7 bg-emerald-500 hover:bg-emerald-600 text-white border-0" onClick={saveQuiz} disabled={savingQuiz}>
                        {savingQuiz ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                        Save Quiz
                      </Button>
                    </>
                  )}
                </div>
              )}

              {quizzes.length === 0 && !showQuizForm && (
                <p className="text-[10px] text-muted-foreground text-center py-1">No quizzes yet</p>
              )}
            </div>
          </aside>

          {/* Right: Chapter Editor */}
          <div className="flex-1 min-w-0 md:overflow-y-auto">
            {selectedChapter ? (
              <div className="glass-card rounded-2xl border border-indigo-500/15 p-4 md:p-5 space-y-4 md:h-full">
                {/* Chapter header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Chapter {selectedChapter.order + 1}</span>
                    <Badge className={`text-[10px] border ${selectedChapter.isPublished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                      {selectedChapter.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {saveStatus === 'saved' && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="h-3 w-3" />Saved</span>}
                    {saveStatus === 'saving' && <span className="text-xs text-muted-foreground">Saving...</span>}
                    {saveStatus === 'unsaved' && <span className="text-xs text-amber-400">Unsaved</span>}
                    <Button size="sm" onClick={saveChapter} disabled={savingChapter} className="h-8 text-xs bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-md shadow-indigo-500/20">
                      {savingChapter ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                      Save Chapter
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Chapter Title</Label>
                    {chapterDraft.title?.trim() && (
                      <button
                        type="button"
                        onClick={generateChapterContent}
                        disabled={generatingContent}
                        className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/25 px-2.5 py-1 rounded-lg transition-all disabled:opacity-50"
                      >
                        {generatingContent
                          ? <><Loader2 className="h-2.5 w-2.5 animate-spin" /> Generating...</>
                          : <><Sparkles className="h-2.5 w-2.5" /> AI Generate Content</>
                        }
                      </button>
                    )}
                  </div>
                  <Input
                    value={chapterDraft.title ?? ''}
                    onChange={e => { setChapterDraft(d => ({ ...d, title: e.target.value })); setSaveStatus('unsaved') }}
                    className="text-base font-semibold h-10"
                    placeholder="Chapter title..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Content (Markdown)</Label>
                  <Textarea
                    value={chapterDraft.content ?? ''}
                    onChange={e => { setChapterDraft(d => ({ ...d, content: e.target.value })); setSaveStatus('unsaved') }}
                    className="min-h-[280px] font-mono text-sm resize-y"
                    placeholder="Write chapter content in Markdown..."
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Video URL (optional)</Label>
                  <Input
                    value={chapterDraft.videoUrl ?? ''}
                    onChange={e => { setChapterDraft(d => ({ ...d, videoUrl: e.target.value || null })); setSaveStatus('unsaved') }}
                    placeholder="https://youtube.com/..."
                    className="text-sm h-9"
                  />
                  {chapterDraft.videoUrl && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-muted mt-2">
                      <iframe src={chapterDraft.videoUrl.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={generateSummary} disabled={generatingSummary} className="text-xs h-8">
                    {generatingSummary ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Sparkles className="h-3 w-3 mr-1.5 text-indigo-400" />}
                    AI Summary
                  </Button>
                  <label className="flex items-center gap-2 text-xs cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                    <input
                      type="checkbox"
                      checked={chapterDraft.isPublished ?? false}
                      onChange={e => { setChapterDraft(d => ({ ...d, isPublished: e.target.checked })); setSaveStatus('unsaved') }}
                      className="rounded"
                    />
                    Mark as Published
                  </label>
                </div>

                {selectedChapter.aiSummary && (
                  <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                    <p className="text-xs font-semibold text-indigo-400 mb-2 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" /> AI Summary
                    </p>
                    <ul className="space-y-1">
                      {JSON.parse(selectedChapter.aiSummary).map((point: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-indigo-400 mt-0.5 shrink-0">•</span> {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-2xl border border-dashed border-indigo-500/20 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 w-fit mx-auto mb-4">
                    <BookOpen className="h-10 w-10 text-indigo-400" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">No chapter selected</p>
                  <p className="text-xs text-muted-foreground mb-4">Create your first chapter to start building your course</p>
                  <Button onClick={() => setAddChapterOpen(true)} className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/20 text-sm">
                    <Plus className="h-4 w-4 mr-1.5" /> Add First Chapter
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
