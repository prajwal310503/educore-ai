import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ok, badRequest, unauthorized, forbidden, notFound, serverError } from '@/lib/api-response'

const chapterUpdateSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  content: z.string().min(1).optional(),
  videoUrl: z.string().url().optional().or(z.literal('')).nullable(),
  order: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
})

type Params = { params: Promise<{ courseId: string; chapterId: string }> }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session) return unauthorized()
    const { courseId, chapterId } = await params

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return notFound('Course')
    if (course.instructorId !== session.user.id && session.user.role !== 'ADMIN') return forbidden()

    const body = await req.json()
    const parsed = chapterUpdateSchema.safeParse(body)
    if (!parsed.success) return badRequest(parsed.error.issues[0].message)

    const chapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: parsed.data,
    })

    return ok(chapter)
  } catch (error) {
    return serverError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth()
    if (!session) return unauthorized()
    const { courseId, chapterId } = await params

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return notFound('Course')
    if (course.instructorId !== session.user.id && session.user.role !== 'ADMIN') return forbidden()

    await prisma.chapter.delete({ where: { id: chapterId } })
    return ok({ deleted: true })
  } catch (error) {
    return serverError(error)
  }
}
