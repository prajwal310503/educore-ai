import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ok, unauthorized, forbidden, serverError } from '@/lib/api-response'

export async function GET() {
  try {
    const session = await auth()
    if (!session) return unauthorized()
    if (session.user.role !== 'ADMIN') return forbidden()

    const [totalUsers, totalCourses, totalEnrollments, totalSubmissions] = await Promise.all([
      prisma.user.count(),
      prisma.course.count({ where: { isDeleted: false } }),
      prisma.enrollment.count(),
      prisma.submission.count(),
    ])

    const topCourses = await prisma.course.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        title: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { enrollments: { _count: 'desc' } },
      take: 5,
    })

    const recentUsers = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, image: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return ok({
      stats: { totalUsers, totalCourses, totalEnrollments, totalSubmissions },
      topCourses,
      recentUsers,
    })
  } catch (error) {
    return serverError(error)
  }
}
