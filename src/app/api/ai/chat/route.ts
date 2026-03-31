import { generateText } from 'ai'
import { groqFlash } from '@/lib/ai'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { ok, badRequest, unauthorized } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return unauthorized()

  const sessionId = req.nextUrl.searchParams.get('sessionId')
  if (!sessionId) return ok({ messages: [] })

  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, role: true, content: true },
  })

  return ok({ messages })
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { message, courseId, sessionId, chapterTitle, chapterContent } = await req.json()
    if (!message?.trim()) return badRequest('Message is required')

    const saveData = {
      userId: session.user.id,
      courseId: courseId || null,
      sessionId: sessionId || null,
      role: 'user',
      content: message,
    }

    try {
      await prisma.chatMessage.create({ data: saveData })
    } catch (dbErr) {
      console.warn('[AI_CHAT] Failed to save user message:', dbErr)
    }

    const { text } = await generateText({
      model: groqFlash,
      system: `You are EduCore AI, a knowledgeable and encouraging tutor.
The student's name is ${session.user.name || 'there'}. Address them by their first name naturally in conversation.
${chapterTitle ? `Current chapter: "${chapterTitle}"` : ''}
${chapterContent ? `Chapter context:\n${chapterContent.slice(0, 2000)}` : ''}

Guidelines:
- Greet the student by their first name on the first message
- Be clear, concise, and encouraging
- Use examples and analogies when helpful
- Break complex topics into digestible steps
- Keep responses focused and practical`,
      prompt: message,
      maxOutputTokens: 1024,
    })

    try {
      await prisma.chatMessage.create({
        data: { userId: session.user.id, courseId: courseId || null, sessionId: sessionId || null, role: 'assistant', content: text },
      })
    } catch (dbErr) {
      console.warn('[AI_CHAT] Failed to save assistant message:', dbErr)
    }

    return ok({ reply: text })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[AI_CHAT_ERROR]', msg)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
