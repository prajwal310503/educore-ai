import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ok, unauthorized, notFound, serverError } from '@/lib/api-response'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ quizId: string }> }) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { quizId } = await params
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    })

    if (!quiz) return notFound('Quiz')
    return ok(quiz)
  } catch (error) {
    return serverError(error)
  }
}
