import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ok, unauthorized, serverError } from '@/lib/api-response'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { courseId } = await params
    const quizzes = await prisma.quiz.findMany({
      where: { courseId },
      select: {
        id: true,
        title: true,
        timeLimit: true,
        retakeLimit: true,
        aiGenerated: true,
        createdAt: true,
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'asc' },
    })

    return ok(quizzes)
  } catch (error) {
    return serverError(error)
  }
}
