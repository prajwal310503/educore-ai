import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ok, created, badRequest, unauthorized, notFound, serverError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { courseId } = await req.json()
    if (!courseId) return badRequest('courseId is required')

    const course = await prisma.course.findFirst({
      where: { id: courseId, isDeleted: false, isPublished: true },
      include: { chapters: true },
    })
    if (!course) return notFound('Course')

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    })
    if (existing) return badRequest('Already enrolled in this course')

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
        progress: {
          create: course.chapters.map(ch => ({
            userId: session.user.id,
            chapterId: ch.id,
            isCompleted: false,
          })),
        },
      },
      include: { course: true },
    })

    return created(enrollment)
  } catch (error) {
    return serverError(error)
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { searchParams } = req.nextUrl
    const courseId = searchParams.get('courseId')

    if (courseId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId } },
        include: { progress: true },
      })
      return ok(enrollment)
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: {
            id: true, title: true, thumbnail: true, category: true, level: true,
            _count: { select: { chapters: true } },
          },
        },
        progress: true,
      },
      orderBy: { enrolledAt: 'desc' },
    })

    return ok(enrollments)
  } catch (error) {
    return serverError(error)
  }
}
