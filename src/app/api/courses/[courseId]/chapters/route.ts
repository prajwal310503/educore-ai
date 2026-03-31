import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { chapterSchema } from '@/lib/validations/course'
import { created, badRequest, unauthorized, forbidden, notFound, serverError } from '@/lib/api-response'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return unauthorized()
    const { courseId } = await params

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) return notFound('Course')
    if (course.instructorId !== session.user.id && session.user.role !== 'ADMIN') return forbidden()

    const body = await req.json()
    const parsed = chapterSchema.safeParse(body)
    if (!parsed.success) return badRequest(parsed.error.issues[0].message)

    const chapter = await prisma.chapter.create({
      data: { ...parsed.data, courseId },
    })

    return created(chapter)
  } catch (error) {
    return serverError(error)
  }
}
