import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { courseSchema } from '@/lib/validations/course'
import { ok, created, badRequest, unauthorized, forbidden, serverError } from '@/lib/api-response'
import type { Level } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = req.nextUrl
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '12')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const level = searchParams.get('level') as Level | null
    const skip = (page - 1) * limit

    // Visibility: admins see all, instructors see published + own drafts, others see published only
    const visibilityFilter =
      session?.user.role === 'ADMIN'
        ? {}
        : session?.user.role === 'INSTRUCTOR'
          ? { OR: [{ isPublished: true }, { instructorId: session.user.id }] }
          : { isPublished: true }

    const searchFilter = search
      ? {
          AND: [
            { OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } },
            ]},
          ],
        }
      : {}

    const where = {
      isDeleted: false,
      ...visibilityFilter,
      ...(category && { category }),
      ...(level && { level }),
      ...searchFilter,
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          price: true,
          category: true,
          level: true,
          language: true,
          tags: true,
          createdAt: true,
          instructor: { select: { id: true, name: true, image: true } },
          _count: { select: { enrollments: true, chapters: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.course.count({ where }),
    ])

    return ok({ courses, total, page, totalPages: Math.ceil(total / limit), hasMore: skip + limit < total })
  } catch (error) {
    return serverError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()
    if (!['INSTRUCTOR', 'ADMIN'].includes(session.user.role)) return forbidden()

    const body = await req.json()
    const parsed = courseSchema.safeParse(body)
    if (!parsed.success) return badRequest(parsed.error.issues[0].message)

    const course = await prisma.course.create({
      data: { ...parsed.data, instructorId: session.user.id },
    })

    return created(course)
  } catch (error) {
    return serverError(error)
  }
}
