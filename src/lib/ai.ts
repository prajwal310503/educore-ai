import { createGroq } from '@ai-sdk/groq'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
})

// Fast model for chat, summaries, thumbnails
export const groqFlash = groq('llama-3.3-70b-versatile')

// More capable model for complex generation (quiz, chapter content)
export const groqPro = groq('llama-3.3-70b-versatile')
