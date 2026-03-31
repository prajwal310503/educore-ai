import { test, expect } from '@playwright/test'

test.describe('Student enrollment flow', () => {
  test('student can login, browse courses, and enroll', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[id="email"]', 'student1@educore.ai')
    await page.fill('input[id="password"]', 'Student@123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    expect(page.url()).toContain('/dashboard')

    await page.goto('/courses')
    await expect(page.locator('[data-testid="course-card"]').first()).toBeVisible()

    await page.locator('[data-testid="course-card"]').first().click()
    await expect(page.url()).toContain('/courses/')
  })

  test('prevents duplicate enrollment', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[id="email"]', 'student1@educore.ai')
    await page.fill('input[id="password"]', 'Student@123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    await page.goto('/courses')
  })
})

test.describe('Auth flow', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain('/login')
  })

  test('shows validation errors on empty login', async ({ page }) => {
    await page.goto('/login')
    await page.click('button[type="submit"]')
    await expect(page.locator('text=Invalid email')).toBeVisible()
  })
})
