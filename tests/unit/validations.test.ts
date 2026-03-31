import { courseSchema, registerSchema } from '@/lib/validations'

describe('courseSchema', () => {
  it('rejects title under 5 chars', () => {
    expect(courseSchema.safeParse({ title: 'Hi' }).success).toBe(false)
  })
  it('accepts valid course', () => {
    expect(courseSchema.safeParse({
      title: 'Complete React Course',
      description: 'A comprehensive course about React development for beginners',
      category: 'Web Development',
      level: 'BEGINNER',
      price: 0,
    }).success).toBe(true)
  })
})

describe('registerSchema', () => {
  it('requires special character in password', () => {
    const result = registerSchema.safeParse({
      name: 'Test User', email: 'test@test.com', password: 'Password1'
    })
    expect(result.success).toBe(false)
  })
  it('accepts valid registration', () => {
    const result = registerSchema.safeParse({
      name: 'Test User', email: 'test@test.com', password: 'Password1!', role: 'STUDENT'
    })
    expect(result.success).toBe(true)
  })
})
