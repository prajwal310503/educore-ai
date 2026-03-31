'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Sparkles, BookOpen, ArrowRight } from 'lucide-react'
import { BackButton } from '@/components/shared/BackButton'
import { ThumbnailUpload } from '@/components/shared/ThumbnailUpload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { courseSchema } from '@/lib/validations/course'

type CourseForm = z.infer<typeof courseSchema>

const CATEGORIES = ['Web Development', 'Data Science', 'Design', 'Marketing', 'Business', 'DevOps', 'Other']

export default function NewCoursePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CourseForm>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(courseSchema) as any,
    defaultValues: { price: 0, level: 'BEGINNER', language: 'English', tags: [] },
  })

  async function onSubmit(data: CourseForm) {
    setIsLoading(true)
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (result.success) {
        toast.success('Course created!')
        router.push(`/instructor/courses/${result.data.id}/edit`)
      } else {
        toast.error(result.error || 'Failed to create course')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <BackButton label="My Courses" href="/instructor/courses" className="mb-4" />
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/25">
            <BookOpen className="h-5 w-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold">Create New Course</h1>
        </div>
        <p className="text-muted-foreground text-sm ml-11">Fill in the details below to launch your course</p>
      </div>

      <div className="glass-card rounded-2xl border border-indigo-500/15 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">Course Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="e.g. Complete React Development Bootcamp"
              {...register('title')}
              className={`h-10 ${errors.title ? 'border-destructive' : ''}`}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe what students will learn in this course..."
              {...register('description')}
              className={`resize-none ${errors.description ? 'border-destructive' : ''}`}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          {/* Category + Level */}
          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <Label className="text-sm font-medium">Category <span className="text-destructive">*</span></Label>
              <Select onValueChange={val => setValue('category', val as CourseForm['category'])}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
            <div className="space-y-1.5 flex-1">
              <Label className="text-sm font-medium">Level</Label>
              <Select defaultValue="BEGINNER" onValueChange={val => setValue('level', val as CourseForm['level'])}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price + Language */}
          <div className="flex gap-4">
            <div className="space-y-1.5 flex-1">
              <Label className="text-sm font-medium">Price</Label>
              <div className="flex h-10 items-center rounded-md border border-border bg-background px-3 focus-within:ring-1 focus-within:ring-ring">
                <span className="text-muted-foreground mr-1.5 text-sm shrink-0">$</span>
                <input
                  type="number" min={0} step={0.01}
                  {...register('price', { valueAsNumber: true })}
                  className="flex-1 bg-transparent outline-none text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
              </div>
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="language" className="text-sm font-medium">Language</Label>
              <Input id="language" defaultValue="English" {...register('language')} className="h-10" />
            </div>
          </div>

          {/* Thumbnail */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">
              Thumbnail <span className="text-muted-foreground font-normal text-xs">(optional)</span>
            </Label>
            <ThumbnailUpload
              value={watch('thumbnail')}
              onChange={val => setValue('thumbnail', val)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/25 rounded-xl font-semibold"
            >
              {isLoading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                : <><Sparkles className="mr-2 h-4 w-4" /> Create Course <ArrowRight className="ml-2 h-4 w-4" /></>
              }
            </Button>
            <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
