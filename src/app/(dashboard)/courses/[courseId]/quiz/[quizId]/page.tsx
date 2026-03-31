'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, RotateCcw, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { BackButton } from '@/components/shared/BackButton'

type Question = {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

type Quiz = {
  id: string
  title: string
  timeLimit: number | null
  retakeLimit: number
  questions: Question[]
  courseId: string
}

type QuizResult = {
  score: number
  correctAnswers: number
  totalQuestions: number
  submissionId: string
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 70 ? 'text-[hsl(var(--success))]' : score >= 40 ? 'text-[hsl(var(--warning))]' : 'text-destructive'
  const strokeColor = score >= 70 ? 'stroke-[hsl(var(--success))]' : score >= 40 ? 'stroke-[hsl(var(--warning))]' : 'stroke-destructive'
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="40" fill="none"
          className={`${strokeColor} transition-all duration-1000`}
          strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${color}`}>
        {Math.round(score)}%
      </div>
    </div>
  )
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.quizId as string
  const courseId = params.courseId as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    fetch(`/api/quiz/${quizId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setQuiz(data.data)
          if (data.data.timeLimit) setTimeLeft(data.data.timeLimit * 60)
        } else {
          toast.error('Quiz not found')
          router.back()
        }
      })
      .finally(() => setLoading(false))
  }, [quizId, router])

  const submitQuiz = useCallback(async () => {
    if (!quiz || submitting) return
    setSubmitting(true)
    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    try {
      const res = await fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, timeTaken }),
      })
      const data = await res.json()
      if (data.success) {
        setResult(data.data)
        setSubmitted(true)
      } else {
        toast.error(data.error || 'Failed to submit quiz')
      }
    } finally {
      setSubmitting(false)
    }
  }, [quiz, submitting, quizId, answers, startTime])

  useEffect(() => {
    if (timeLeft === null || submitted) return
    if (timeLeft <= 0) {
      submitQuiz()
      return
    }
    const timer = setTimeout(() => setTimeLeft(t => (t ?? 0) - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, submitted, submitQuiz])

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )

  if (!quiz) return null

  const question = quiz.questions[currentQ]
  const totalQ = quiz.questions.length
  const answeredCount = Object.keys(answers).length

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">Quiz Complete!</h1>
          <p className="text-muted-foreground">{quiz.title}</p>
        </div>

        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <ScoreCircle score={result.score} />
            <p className="mt-4 text-lg font-semibold">
              {result.correctAnswers}/{result.totalQuestions} correct
            </p>
            <p className={`text-sm mt-1 ${result.score >= 70 ? 'text-[hsl(var(--success))]' : result.score >= 40 ? 'text-[hsl(var(--warning))]' : 'text-destructive'}`}>
              {result.score >= 70 ? 'Excellent work!' : result.score >= 40 ? 'Good effort!' : 'Keep practicing!'}
            </p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-semibold mb-3">Question Review</h2>
          <Accordion type="multiple" className="space-y-2">
            {quiz.questions.map((q, i) => {
              const userAns = answers[q.id]
              const isCorrect = userAns === q.correctAnswer
              return (
                <AccordionItem key={q.id} value={q.id} className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      {isCorrect
                        ? <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] shrink-0" />
                        : <XCircle className="h-5 w-5 text-destructive shrink-0" />}
                      <span className="text-sm">Q{i + 1}: {q.text}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Your answer: </span>
                        <span className={isCorrect ? 'text-[hsl(var(--success))]' : 'text-destructive'}>
                          {userAns !== undefined ? q.options[userAns] : 'Not answered'}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p><span className="text-muted-foreground">Correct: </span>
                          <span className="text-[hsl(var(--success))]">{q.options[q.correctAnswer]}</span>
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-muted-foreground mt-2 p-2 bg-muted rounded text-xs">{q.explanation}</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => {
            setAnswers({})
            setCurrentQ(0)
            setSubmitted(false)
            setResult(null)
            if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60)
          }}>
            <RotateCcw className="mr-2 h-4 w-4" /> Retake Quiz
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90" asChild>
            <Link href={`/courses/${courseId}/learn`}>
              <BookOpen className="mr-2 h-4 w-4" /> Back to Course
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <BackButton label="Back to Course" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">Question {currentQ + 1} of {totalQ}</p>
        </div>
        {timeLeft !== null && (
          <div className={`flex items-center gap-2 font-mono text-lg font-bold px-3 py-1.5 rounded-lg border ${timeLeft < 60 ? 'text-destructive border-destructive/30 bg-destructive/5' : timeLeft < 120 ? 'text-[hsl(var(--warning))] border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5' : 'text-foreground border-border'}`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <Progress value={((currentQ + 1) / totalQ) * 100} className="h-2" />

      {/* Question */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <Badge className="bg-primary/10 text-primary border-0 shrink-0">Q{currentQ + 1}</Badge>
            <p className="text-lg leading-relaxed">{question.text}</p>
          </div>

          <div className="space-y-3">
            {question.options.map((option, i) => {
              const selected = answers[question.id] === i
              return (
                <button
                  key={i}
                  onClick={() => setAnswers(prev => ({ ...prev, [question.id]: i }))}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 text-sm ${
                    selected
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border hover:border-primary/40 hover:bg-accent'
                  }`}
                >
                  <span className="font-semibold mr-3 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQ(q => q - 1)}
          disabled={currentQ === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>

        {/* Dot navigation */}
        <div className="flex gap-1.5">
          {quiz.questions.map((q, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentQ
                  ? 'bg-primary scale-125'
                  : answers[q.id] !== undefined
                    ? 'bg-primary/40'
                    : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {currentQ < totalQ - 1 ? (
          <Button onClick={() => setCurrentQ(q => q + 1)} className="bg-primary hover:bg-primary/90">
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={submitQuiz}
            disabled={submitting || answeredCount < totalQ}
            className="bg-primary hover:bg-primary/90"
          >
            {submitting ? 'Submitting...' : `Submit (${answeredCount}/${totalQ})`}
          </Button>
        )}
      </div>
    </div>
  )
}
