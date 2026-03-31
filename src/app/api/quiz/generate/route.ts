import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { groqFlash } from '@/lib/ai'
import { auth } from '@/lib/auth'
import { aiRatelimit } from '@/lib/rate-limit'
import { ok, unauthorized, serverError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { success } = await aiRatelimit.limit(session.user.id)
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })

    const { topic, difficulty, count, category } = await req.json()

    const { text } = await generateText({
      model: groqFlash,
      prompt: `Generate ${count} multiple choice quiz questions about "${topic}" for a ${category} course.
Difficulty level: ${difficulty} (${difficulty === 'easy' ? 'basic recall' : difficulty === 'medium' ? 'understanding and application' : 'analysis and synthesis'})

CRITICAL: Return ONLY a valid JSON array. No markdown, no explanation, no code blocks.
[
  {
    "text": "Clear, specific question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this answer is correct and others are wrong"
  }
]`,
      maxOutputTokens: 3000,
    })

    const cleaned = text.replace(/```json\n?|\n?```|```/g, '').trim()
    const questions = JSON.parse(cleaned)
    return ok({ questions })
  } catch (error) {
    return serverError(error)
  }
}
