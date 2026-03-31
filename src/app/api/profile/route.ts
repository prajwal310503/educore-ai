import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response'
import bcrypt from 'bcryptjs'

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { name } = await req.json()
    if (!name || typeof name !== 'string' || !name.trim()) {
      return badRequest('Invalid name')
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true, role: true },
    })

    return ok(updated)
  } catch (error) {
    return serverError(error)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { oldPassword, newPassword } = await req.json()

    if (!oldPassword || !newPassword) {
      return badRequest('Both old and new password are required.')
    }
    if (newPassword.length < 8) {
      return badRequest('New password must be at least 8 characters.')
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return badRequest('No password set on this account.')
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return badRequest('Current password is incorrect.')
    }

    const hashed = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    })

    return ok({ message: 'Password updated successfully.' })
  } catch (error) {
    return serverError(error)
  }
}
