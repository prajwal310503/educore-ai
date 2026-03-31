import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { z } from 'zod'
import { groqFlash } from '@/lib/ai'

const themeSchema = z.object({
  gradient: z.object({
    from: z.string().describe('hex color e.g. #6366f1'),
    via: z.string().describe('hex color'),
    to: z.string().describe('hex color'),
  }),
  emoji: z.string().describe('a single relevant emoji for the course topic'),
  accentColor: z.string().describe('hex color for accent elements'),
  pattern: z.enum(['dots', 'grid', 'waves', 'circuit', 'hexagon']),
  tagline: z.string().describe('a 3-5 word catchy tagline for the course'),
})

export async function POST(req: NextRequest) {
  try {
    const { title, category, description } = await req.json()

    const { object: theme } = await generateObject({
      model: groqFlash,
      schema: themeSchema,
      prompt: `You are a creative UI designer. Generate a beautiful thumbnail theme for an online course.
Course Title: "${title}"
Category: "${category}"
Description: "${description?.slice(0, 200) ?? ''}"

Choose vibrant, professional colors that fit the course topic. The gradient should be eye-catching and relevant to the subject matter. Pick an emoji that best represents the topic. Create a short punchy tagline.`,
    })

    // Build SVG thumbnail
    const svg = buildThumbnailSVG(theme, title, category)
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

    return NextResponse.json({ success: true, dataUrl, theme })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

function buildThumbnailSVG(
  theme: z.infer<typeof themeSchema>,
  title: string,
  category: string
) {
  const { gradient, emoji, accentColor, pattern, tagline } = theme
  const truncTitle = title.length > 40 ? title.slice(0, 37) + '…' : title

  const patternDef = {
    dots: `<pattern id="pat" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.12)"/>
    </pattern>`,
    grid: `<pattern id="pat" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.8"/>
    </pattern>`,
    waves: `<pattern id="pat" width="40" height="20" patternUnits="userSpaceOnUse">
      <path d="M0 10 Q10 0 20 10 Q30 20 40 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    </pattern>`,
    circuit: `<pattern id="pat" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M10 10 L30 10 L30 30 M20 10 L20 0 M10 20 L0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.15)"/>
      <circle cx="30" cy="10" r="2" fill="rgba(255,255,255,0.15)"/>
      <circle cx="30" cy="30" r="2" fill="rgba(255,255,255,0.15)"/>
    </pattern>`,
    hexagon: `<pattern id="pat" width="30" height="26" patternUnits="userSpaceOnUse">
      <polygon points="15,1 28,8 28,22 15,29 2,22 2,8" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.8"/>
    </pattern>`,
  }[pattern]

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradient.from}"/>
      <stop offset="50%" stop-color="${gradient.via}"/>
      <stop offset="100%" stop-color="${gradient.to}"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.2)"/>
    </linearGradient>
    <filter id="blur1">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
    ${patternDef}
  </defs>

  <!-- Background -->
  <rect width="640" height="360" fill="url(#bg)"/>
  <rect width="640" height="360" fill="url(#shine)"/>
  <rect width="640" height="360" fill="url(#pat)"/>

  <!-- Glow blobs -->
  <circle cx="100" cy="80" r="120" fill="${accentColor}" opacity="0.18" filter="url(#blur1)"/>
  <circle cx="540" cy="280" r="140" fill="${gradient.from}" opacity="0.22" filter="url(#blur1)"/>

  <!-- Emoji circle -->
  <circle cx="320" cy="130" r="52" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
  <text x="320" y="148" font-size="42" text-anchor="middle" dominant-baseline="middle">${emoji}</text>

  <!-- Category badge -->
  <rect x="246" y="197" width="${category.length * 8 + 24}" height="24" rx="12" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  <text x="320" y="213" font-size="11" font-family="system-ui,sans-serif" font-weight="600" fill="rgba(255,255,255,0.9)" text-anchor="middle" letter-spacing="1.5">${category.toUpperCase()}</text>

  <!-- Title -->
  <text x="320" y="254" font-size="18" font-family="system-ui,sans-serif" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">${truncTitle}</text>

  <!-- Tagline -->
  <text x="320" y="290" font-size="12" font-family="system-ui,sans-serif" font-weight="400" fill="rgba(255,255,255,0.65)" text-anchor="middle">${tagline}</text>

  <!-- Bottom bar -->
  <rect x="0" y="340" width="640" height="20" fill="rgba(0,0,0,0.25)"/>
  <circle cx="18" cy="350" r="5" fill="${accentColor}" opacity="0.8"/>
  <text x="30" y="354" font-size="9" font-family="system-ui,sans-serif" fill="rgba(255,255,255,0.5)" dominant-baseline="middle">AI Generated · EduCore AI</text>
</svg>`
}
