import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ok, badRequest, unauthorized, notFound, serverError } from '@/lib/api-response'

export async function POST(req: NextRequest, { params }: { params: Promise<{ quizId: string }> }) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { quizId } = await params
    const { answers, timeTaken } = await req.json()

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    })
    if (!quiz) return notFound('Quiz')

    let correct = 0
    for (const question of quiz.questions) {
      const userAnswer = (answers as Record<string, number>)[question.id]
      if (userAnswer === question.correctAnswer) correct++
    }
    const score = (correct / quiz.questions.length) * 100

    // Use transaction to prevent race condition on retake limit
    const result = await prisma.$transaction(async (tx) => {
      const submissionCount = await tx.submission.count({
        where: { userId: session.user.id, quizId },
      })
      if (submissionCount >= quiz.retakeLimit) {
        throw new Error(`RETAKE_LIMIT:${quiz.retakeLimit}`)
      }

      return tx.submission.create({
        data: {
          userId: session.user.id,
          quizId,
          answers,
          score,
          timeTaken: timeTaken || null,
        },
      })
    })

    return ok({
      score,
      correctAnswers: correct,
      totalQuestions: quiz.questions.length,
      submissionId: result.id,
    })
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('RETAKE_LIMIT:')) {
      const limit = error.message.split(':')[1]
      return badRequest(`Retake limit of ${limit} reached`)
    }
    return serverError(error)
  }
}
