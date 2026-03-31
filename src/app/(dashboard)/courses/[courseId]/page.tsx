'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BookOpen, Clock, Users, GraduationCap, Globe, Tag,
  Play, CheckCircle, Loader2
} from 'lucide-react'
import { AiThumbnail } from '@/components/shared/AiThumbnail'
import { BackButton } from '@/components/shared/BackButton'

type Chapter = {
  id: string
  title: string
  order: number
  isPublished: boolean
}

type Course = {
  id: string
  title: string
  description: string
  thumbnail: string | null
  price: number
  category: string
  level: string
  language: string
  tags: string[]
  chapters: Chapter[]
  instructor: { id: string; name: string; image: string | null }
  _count: { enrollments: number }
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [checkingEnrollment, setCheckingEnrollment] = useState(true)

  useEffect(() => {
    async function fetchCourse() {
      const res = await fetch(`/api/courses/${courseId}`)
      const data = await res.json()
      if (data.success) setCourse(data.data)
      setLoading(false)
    }
    fetchCourse()
  }, [courseId])

  useEffect(() => {
    async function checkEnrollment() {
      const res = await fetch(`/api/enrollments?courseId=${courseId}`)
      const data = await res.json()
      if (data.success && data.data) setIsEnrolled(true)
      setCheckingEnrollment(false)
    }
    checkEnrollment()
  }, [courseId])

  async function handleEnroll() {
    setEnrolling(true)
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Successfully enrolled!')
        setIsEnrolled(true)
        router.push(`/courses/${courseId}/learn`)
      } else {
        toast.error(data.error || 'Enrollment failed')
      }
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-24">
        <h2 className="text-xl font-bold mb-2">Course not found</h2>
        <Link href="/courses" className="text-primary hover:underline">Back to courses</Link>
      </div>
    )
  }

  const levelColor = {
    BEGINNER: 'bg-[hsl(var(--badge-green-bg))] text-[hsl(var(--badge-green-text))]',
    INTERMEDIATE: 'bg-[hsl(var(--badge-yellow-bg))] text-[hsl(var(--badge-yellow-text))]',
    ADVANCED: 'bg-[hsl(var(--badge-red-bg))] text-[hsl(var(--badge-red-text))]',
  }[course.level] ?? ''

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <BackButton label="Back to Courses" href="/courses" />
      {/* Hero */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
        {course.thumbnail ? (
          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
        ) : (
          <AiThumbnail
            courseId={course.id}
            title={course.title}
            category={course.category}
            description={course.description}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-muted text-muted-foreground border-0">{course.category}</Badge>
              <Badge className={`border-0 ${levelColor}`}>{course.level}</Badge>
            </div>
            <h1 className="text-2xl font-bold mb-3">{course.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{course.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{course._count.enrollments} students</span>
            <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{course.chapters.length} chapters</span>
            <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" />{course.language}</span>
          </div>

          {course.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {course.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />{tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* Chapters */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Course Content</h2>
            <div className="space-y-2">
              {course.chapters.map((chapter, i) => (
                <div key={chapter.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm flex-1">{chapter.title}</span>
                  {isEnrolled ? (
                    <Play className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <span className="text-xs text-muted-foreground">Locked</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="border-border sticky top-6">
            <CardContent className="p-6 space-y-4">
              <div className="text-3xl font-extrabold">
                {course.price === 0 ? (
                  <span className="text-[hsl(var(--success))]">Free</span>
                ) : (
                  `$${course.price}`
                )}
              </div>

              {checkingEnrollment ? (
                <Button className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />Checking...
                </Button>
              ) : isEnrolled ? (
                <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                  <Link href={`/courses/${courseId}/learn`}>
                    <Play className="mr-2 h-4 w-4" />Continue Learning
                  </Link>
                </Button>
              ) : (
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleEnroll} disabled={enrolling}>
                  {enrolling ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enrolling...</>
                  ) : (
                    <><CheckCircle className="mr-2 h-4 w-4" />Enroll Now</>
                  )}
                </Button>
              )}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>Instructor: <strong>{course.instructor.name}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{course.chapters.length} chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{course._count.enrollments} enrolled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
