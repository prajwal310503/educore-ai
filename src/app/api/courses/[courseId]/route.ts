import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { courseSchema } from '@/lib/validations/course'
import { ok, badRequest, unauthorized, forbidden, notFound, serverError } from '@/lib/api-response'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params
    const course = await prisma.course.findFirst({
      where: { id: courseId, isDeleted: false },
      include: {
        chapters: { orderBy: { order: 'asc' } },
        instructor: { select: { id: true, name: true, image: true } },
        _count: { select: { enrollments: true } },
      },
    })
    if (!course) return notFound('Course')
    return ok(course)
  } catch (error) {
    return serverError(error)
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const session = await auth()
    if (!session) return unauthorized()
    const { courseId } = await params

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return notFound('Course')
    if (course.instructorId !== session.user.id && session.user.role !== 'ADMIN') return forbidden()

    const body = await req.json()
    const parsed = courseSchema.partial().safeParse(body)
    if (!parsed.success) return badRequest(parsed.error.issues[0].message)

    const updated = await prisma.course.update({ where: { id: courseId }, data: parsed.data })
    return ok(updated)
  } catch (error) {
    return serverError(error)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const session = await auth()
    if (!session) return unauthorized()
    const { courseId } = await params

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return notFound('Course')
    if (course.instructorId !== session.user.id && session.user.role !== 'ADMIN') return forbidden()

    await prisma.course.update({ where: { id: courseId }, data: { isDeleted: true } })
    return ok({ deleted: true })
  } catch (error) {
    return serverError(error)
  }
}
