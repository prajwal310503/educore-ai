import { NextRequest } from 'next/server'
import { generateText } from 'ai'
import { groqFlash } from '@/lib/ai'
import { auth } from '@/lib/auth'
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return unauthorized()

    const { title, category, courseTitle } = await req.json()
    if (!title?.trim()) return badRequest('title is required')

    const topicContext = category ? `in the domain of "${category}"` : ''

    const { text } = await generateText({
      model: groqFlash,
      prompt: `You are an expert course content writer and educator ${topicContext}.

Write detailed, well-structured educational Markdown content for this chapter:

Chapter Title: "${title}"
${courseTitle ? `Course: "${courseTitle}"` : ''}
${category ? `Domain/Category: "${category}"` : ''}

The content MUST be highly specific to this exact topic — do NOT write generic educational content.
Every concept, code example, real-world scenario, and exercise must be directly relevant to "${title}" ${topicContext}.

Structure the chapter as follows:

## Learning Objectives
3-4 specific, measurable things the reader will be able to do after this chapter.

## Key Concepts

For each concept (provide 4-5 concepts):
- Give the concept a clear heading
- Explain it in 2-3 sentences specific to ${category || 'this topic'}
- Provide a concrete real-world example OR a code snippet (use triple backticks with the language name)
- Explain WHY this concept matters in practice

## Summary
2-3 sentences summarizing the most important takeaways, tailored to someone studying ${category || 'this subject'}.

## Practice Exercise
One hands-on, practical exercise that requires the student to apply the concepts from this chapter. Be specific about what to build or analyze.

Use proper Markdown: use \`\`\`language\`\`\` blocks for code, **bold** for key terms, and bullet lists where appropriate.
Return ONLY the markdown content, no preamble or trailing commentary.`,
      maxOutputTokens: 2000,
    })

    return ok({ content: text.trim() })
  } catch (error) {
    return serverError(error)
  }
}

