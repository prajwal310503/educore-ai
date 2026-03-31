import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { quizSchema } from '@/lib/validations/course'
import { created, badRequest, unauthorized, forbidden, notFound, serverError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()
    if (!['INSTRUCTOR', 'ADMIN'].includes(session.user.role)) return forbidden()

    const body = await req.json()
    const parsed = quizSchema.safeParse(body)
    if (!parsed.success) return badRequest(parsed.error.issues[0].message)

    const course = await prisma.course.findUnique({ where: { id: parsed.data.courseId } })
    if (!course) return notFound('Course')
    if (course.instructorId !== session.user.id && session.user.role !== 'ADMIN') return forbidden()

    const { questions, ...quizData } = parsed.data

    const quiz = await prisma.quiz.create({
      data: {
        ...quizData,
        aiGenerated: true,
        questions: {
          create: questions,
        },
      },
      include: { questions: true },
    })

    return created(quiz)
  } catch (error) {
    return serverError(error)
  }
}
