import { z } from 'zod'

export const courseSchema = z.object({
  title: z.string().min(5, 'Min 5 characters').max(100),
  description: z.string().min(20, 'Min 20 characters').max(5000),
  category: z.enum(['Web Development', 'Data Science', 'Design', 'Marketing', 'Business', 'DevOps', 'Other']),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  tags: z.array(z.string().min(1).max(30)).max(5).default([]),
  price: z.number().min(0).max(9999).default(0),
  thumbnail: z.string().optional().or(z.literal('')),
  language: z.string().min(1).default('English'),
  isPublished: z.boolean().optional(),
})

export const chapterSchema = z.object({
  title: z.string().min(3).max(150),
  content: z.string().min(10),
  videoUrl: z.string().url().optional().or(z.literal('')),
  order: z.number().int().min(0),
  isPublished: z.boolean().default(false),
})

export const quizSchema = z.object({
  title: z.string().min(3).max(150),
  courseId: z.string().min(1),
  timeLimit: z.number().int().min(1).max(180).optional(),
  retakeLimit: z.number().int().min(1).max(10).default(3),
  questions: z.array(z.object({
    text: z.string().min(10, 'Question too short'),
    options: z.array(z.string().min(1)).length(4, 'Exactly 4 options required'),
    correctAnswer: z.number().int().min(0).max(3),
    explanation: z.string().optional(),
  })).min(1).max(50),
})
