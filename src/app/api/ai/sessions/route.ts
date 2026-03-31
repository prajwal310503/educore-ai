import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ok, unauthorized, badRequest, serverError } from '@/lib/api-response'

// GET /api/ai/sessions?courseId=xxx  → list sessions for this course
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const courseId = req.nextUrl.searchParams.get('courseId')
    if (!courseId) return badRequest('courseId required')

    const sessions = await prisma.chatSession.findMany({
      where: { userId: session.user.id, courseId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        messages: { orderBy: { createdAt: 'asc' }, select: { id: true, role: true, content: true } },
      },
    })

    return ok({ sessions })
  } catch (error) {
    console.error('[SESSIONS_GET]', error)
    return serverError(error)
  }
}

// POST /api/ai/sessions  → create new session
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { courseId, name } = await req.json()
    if (!courseId) return badRequest('courseId required')

    const chatSession = await prisma.chatSession.create({
      data: { userId: session.user.id, courseId, name: name || 'New Chat' },
      select: { id: true, name: true, createdAt: true, messages: true },
    })

    return ok({ session: chatSession })
  } catch (error) {
    console.error('[SESSIONS_POST]', error)
    return serverError(error)
  }
}

// PATCH /api/ai/sessions  → rename session
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { sessionId, name } = await req.json()
    if (!sessionId || !name?.trim()) return badRequest('sessionId and name required')

    const chatSession = await prisma.chatSession.updateMany({
      where: { id: sessionId, userId: session.user.id },
      data: { name: name.trim() },
    })

    return ok({ updated: chatSession.count > 0 })
  } catch (error) {
    return serverError(error)
  }
}

// DELETE /api/ai/sessions  → delete session
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { sessionId } = await req.json()
    if (!sessionId) return badRequest('sessionId required')

    await prisma.chatSession.deleteMany({ where: { id: sessionId, userId: session.user.id } })

    return ok({ deleted: true })
  } catch (error) {
    return serverError(error)
  }
}
