import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response'

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { chapterId, isCompleted } = await req.json()
    if (!chapterId) return badRequest('chapterId is required')

    const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } })
    if (!chapter) return badRequest('Chapter not found')

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: chapter.courseId } },
    })
    if (!enrollment) return badRequest('Not enrolled in this course')

    const progress = await prisma.progress.upsert({
      where: { userId_chapterId: { userId: session.user.id, chapterId } },
      update: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        chapterId,
        enrollmentId: enrollment.id,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    })

    const allProgress = await prisma.progress.findMany({
      where: { enrollmentId: enrollment.id },
    })
    const completed = allProgress.filter(p => p.isCompleted).length
    const completionPercentage = Math.round((completed / allProgress.length) * 100)

    return ok({ progress, completionPercentage })
  } catch (error) {
    return serverError(error)
  }
}
