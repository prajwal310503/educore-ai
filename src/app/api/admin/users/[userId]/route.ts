import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { ok, badRequest, unauthorized, forbidden, notFound, serverError } from '@/lib/api-response'

const updateUserSchema = z.object({
  role: z.enum(['ADMIN', 'INSTRUCTOR', 'STUDENT']).optional(),
  isSuspended: z.boolean().optional(),
  name: z.string().min(1).max(100).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return unauthorized()
    if (session.user.role !== 'ADMIN') return forbidden()

    const { userId } = await params
    const body = await req.json()

    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) return badRequest(parsed.error.issues[0].message)

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return notFound('User')

    const updated = await prisma.user.update({
      where: { id: userId },
      data: parsed.data,
      select: {
        id: true, name: true, email: true, role: true,
        isSuspended: true, createdAt: true, image: true,
      },
    })

    return ok(updated)
  } catch (error) {
    return serverError(error)
  }
}
