import { NextRequest } from 'next/server'
import { generateText } from 'ai'
import { groqFlash } from '@/lib/ai'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ok, badRequest, unauthorized, notFound, serverError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { chapterId } = await req.json()
    if (!chapterId) return badRequest('chapterId is required')

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: { aiSummary: true, content: true, title: true },
    })

    if (!chapter) return notFound('Chapter')

    if (chapter.aiSummary) {
      return ok({ summary: JSON.parse(chapter.aiSummary), isNew: false })
    }

    const { text } = await generateText({
      model: groqFlash,
      prompt: `Summarize "${chapter.title}" into 5-7 bullet points.
Return ONLY a JSON array of strings:
["Key point 1", "Key point 2", ...]

Content: ${chapter.content.slice(0, 4000)}`,
      maxOutputTokens: 512,
    })

    const cleaned = text.replace(/```json\n?|\n?```|```/g, '').trim()
    const summary = JSON.parse(cleaned)
    await prisma.chapter.update({
      where: { id: chapterId },
      data: { aiSummary: JSON.stringify(summary) },
    })

    return ok({ summary, isNew: true })
  } catch (error) {
    return serverError(error)
  }
}
