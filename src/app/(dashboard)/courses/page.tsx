'use client'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AiThumbnail } from '@/components/shared/AiThumbnail'
import {
  Search, Users, BookOpen, GraduationCap, Sparkles, SlidersHorizontal,
  ChevronLeft, ChevronRight, Filter, X
} from 'lucide-react'

const CATEGORIES = ['Web Development', 'Data Science', 'Design', 'Marketing', 'Business', 'DevOps', 'Other']
const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
const PAGE_SIZE = 3

type Course = {
  id: string
  title: string
  description: string
  thumbnail: string | null
  price: number
  category: string
  level: string
  instructor: { name: string; image: string | null }
  _count: { enrollments: number; chapters: number }
}

function CourseThumbnail({ course }: { course: Course }) {
  if (course.thumbnail) {
    return (
      <Image
        src={course.thumbnail}
        alt={course.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
    )
  }

  return (
    <AiThumbnail
      courseId={course.id}
      title={course.title}
      category={course.category}
      description={course.description}
    />
  )
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const levelConfig = {
    BEGINNER: {
      classes: 'bg-emerald-500 text-white border-transparent font-semibold',
      label: 'Beginner',
    },
    INTERMEDIATE: {
      classes: 'bg-amber-500 text-white border-transparent font-semibold',
      label: 'Intermediate',
    },
    ADVANCED: {
      classes: 'bg-rose-500 text-white border-transparent font-semibold',
      label: 'Advanced',
    },
  }[course.level] ?? { classes: 'bg-indigo-500 text-white border-transparent font-semibold', label: course.level }

  return (
    <Link href={`/courses/${course.id}`} data-testid="course-card">
      <div
        className="glass-card rounded-2xl border border-indigo-500/15 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer group h-full flex flex-col animate-fade-up"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-indigo-500/10">
          <CourseThumbnail course={course} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <Badge className="absolute top-3 left-3 bg-black/65 border-white/20 text-white text-xs font-semibold">
            {course.category}
          </Badge>
          <Badge className={`absolute top-3 right-3 border-0 text-xs font-semibold ${levelConfig.classes}`}>
            {levelConfig.label}
          </Badge>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors text-sm leading-relaxed">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1 leading-relaxed">{course.description}</p>

          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-xs text-white font-bold shrink-0">
              {course.instructor.name[0]}
            </div>
            <span className="text-xs text-muted-foreground truncate">{course.instructor.name}</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-indigo-500/10 mb-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-3 w-3" />{course._count.enrollments}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3 w-3" />{course._count.chapters} chapters
              </span>
            </div>
            <span className={`font-bold text-sm ${course.price === 0 ? 'text-emerald-500 dark:text-emerald-400' : 'gradient-text'}`}>
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all text-center">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function CourseSkeleton() {
  return (
    <div className="glass-card rounded-2xl border border-indigo-500/10 overflow-hidden">
      <Skeleton className="aspect-video rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-4 w-16 rounded-lg" />
        <Skeleton className="h-5 w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
      </div>
    </div>
  )
}

function CoursesContent() {
  const searchParams = useSearchParams()
  const [courses, setCourses] = useState<Course[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? '')
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get('level') ?? '')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const fetchCourses = useCallback(async (currentPage: number) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedLevel) params.set('level', selectedLevel)
    params.set('page', String(currentPage))
    params.set('limit', String(PAGE_SIZE))

    const res = await fetch(`/api/courses?${params}`)
    const data = await res.json()
    if (data.success) {
      setCourses(data.data.courses)
      setTotal(data.data.total)
      setTotalPages(data.data.totalPages)
    }
    setLoading(false)
  }, [search, selectedCategory, selectedLevel])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1)
  }, [search, selectedCategory, selectedLevel])

  useEffect(() => {
    const timer = setTimeout(() => fetchCourses(page), 300)
    return () => clearTimeout(timer)
  }, [fetchCourses, page])

  function clearFilters() {
    setSearch('')
    setSelectedCategory('')
    setSelectedLevel('')
    setPage(1)
  }

  function goToPage(p: number) {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  const startItem = (page - 1) * PAGE_SIZE + 1
  const endItem = Math.min(page * PAGE_SIZE, total)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Explore <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Courses</span>
        </h1>
        <p className="text-muted-foreground mt-1">Discover AI-powered courses tailored for you</p>
      </div>

      {/* Mobile filter toggle */}
      <div className="flex md:hidden">
        <button
          onClick={() => setShowMobileFilters(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-500/25 text-sm font-medium text-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors"
        >
          {showMobileFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          {showMobileFilters ? 'Hide Filters' : 'Filters'}
          {(search || selectedCategory || selectedLevel) && (
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters — hidden on mobile unless toggled */}
        <aside className={`w-full md:w-60 md:flex-shrink-0 space-y-5 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="glass-card rounded-2xl p-4 border border-indigo-500/15 space-y-5">
            {/* Search */}
            <div>
              <h3 className="font-semibold text-sm mb-2.5 flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-indigo-400" /> Search
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-9 glass border-white/20 focus:border-indigo-500/40 rounded-xl h-9 text-sm"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="font-semibold text-sm mb-2.5 flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" /> Category
              </h3>
              <div className="space-y-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                    className="flex items-center gap-2.5 cursor-pointer group w-full text-left"
                  >
                    <div className={`w-4 h-4 rounded-md border transition-all flex items-center justify-center flex-shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-br from-indigo-500 to-violet-500 border-indigo-500'
                        : 'border-indigo-500/30 group-hover:border-indigo-500/60 bg-indigo-500/5'
                    }`}>
                      {selectedCategory === cat && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs transition-colors ${selectedCategory === cat ? 'text-indigo-400 font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {cat}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <h3 className="font-semibold text-sm mb-2.5">Level</h3>
              <div className="flex flex-col gap-1.5">
                {LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(selectedLevel === level ? '' : level)}
                    className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all ${
                      selectedLevel === level
                        ? 'bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border-indigo-500/30'
                        : 'border-indigo-500/20 text-muted-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5'
                    }`}
                  >
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {(search || selectedCategory || selectedLevel) && (
              <Button
                variant="outline"
                size="sm"
                className="w-full glass border-white/20 hover:border-indigo-500/40 rounded-xl text-xs"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </aside>

        {/* Course Grid */}
        <div className="flex-1 min-w-0">
          {/* Results bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" /> Loading courses...
                </span>
              ) : total > 0 ? (
                <span>
                  Showing <span className="text-foreground font-medium">{startItem}–{endItem}</span> of{' '}
                  <span className="text-foreground font-medium">{total}</span> courses
                </span>
              ) : (
                <span><span className="text-foreground font-medium">0</span> courses found</span>
              )}
            </p>
            {!loading && totalPages > 1 && (
              <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <CourseSkeleton key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center border border-indigo-500/15">
              <div className="p-4 rounded-2xl bg-indigo-500/10 w-fit mx-auto mb-4">
                <GraduationCap className="h-12 w-12 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-6 text-sm">Try adjusting your filters or search term</p>
              <Button
                onClick={clearFilters}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-0 rounded-xl shadow-lg shadow-indigo-500/20"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {courses.map((course, i) => <CourseCard key={course.id} course={course} index={i} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/20 text-sm text-muted-foreground hover:text-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" /> Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                      const isActive = p === page
                      const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1
                      const showDots = !show && (p === 2 || p === totalPages - 1)
                      if (showDots) return <span key={p} className="w-8 text-center text-muted-foreground text-sm">…</span>
                      if (!show) return null
                      return (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25'
                              : 'border border-indigo-500/20 text-muted-foreground hover:text-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/20 text-sm text-muted-foreground hover:text-foreground hover:border-indigo-500/40 hover:bg-indigo-500/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => <CourseSkeleton key={i} />)}
      </div>
    }>
      <CoursesContent />
    </Suspense>
  )
}
