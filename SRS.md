# Software Requirements Specification (SRS)
## EduCore AI — AI-Powered Learning Management System

**Version**: 1.0  
**Author**: Prajwal Mulik  
**Live URL**: https://educore-ai.vercel.app  
**Repository**: https://github.com/prajwal310503/educore-ai

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Schema](#4-database-schema)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Role-Based Access Control](#6-role-based-access-control)
7. [Features & Functional Requirements](#7-features--functional-requirements)
8. [AI Features](#8-ai-features)
9. [API Endpoints](#9-api-endpoints)
10. [User Journeys](#10-user-journeys)
11. [Rate Limiting & Security](#11-rate-limiting--security)
12. [Project Structure](#12-project-structure)

---

## 1. Project Overview

EduCore AI is a full-stack, AI-powered Learning Management System (LMS) built with Next.js 16. It enables students to learn through structured courses, instructors to create and manage course content, and admins to manage the platform. The system integrates Groq's Llama 3.3 70B AI model to provide intelligent tutoring, quiz generation, content creation, chapter summarization, and thumbnail generation.

### Key Highlights
- Three-role system: Admin, Instructor, Student
- AI-powered features for both learners and content creators
- Full CRUD for courses, chapters, quizzes
- Real-time progress tracking and leaderboard
- Rate-limited AI endpoints via Upstash Redis
- JWT-based authentication with Google OAuth support
- Fully deployed on Vercel with MongoDB Atlas

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.1 (App Router, Turbopack) |
| Language | TypeScript |
| Database | MongoDB via Prisma ORM v5 |
| Authentication | NextAuth.js v5 (JWT strategy) |
| AI Provider | Groq (llama-3.3-70b-versatile) via Vercel AI SDK v6 |
| Styling | Tailwind CSS v4 + shadcn/ui + Radix UI |
| Form Handling | React Hook Form + Zod |
| State Management | Zustand (client) + React Query (server) |
| Rate Limiting | Upstash Redis (sliding window) |
| File Upload | UploadThing |
| Deployment | Vercel |
| Testing | Jest + React Testing Library + Playwright (E2E) |
| CI/CD | GitHub Actions |

---

## 3. System Architecture

```
Browser (Next.js Client)
        │
        ▼
   Vercel Edge (Middleware)
        │  JWT token validation
        │  Role-based route protection
        ▼
   Next.js App Router
   ├── (auth)/          → Public auth pages
   ├── (dashboard)/     → Protected pages
   └── api/             → API Route Handlers
        │
        ├── NextAuth.js  ──► MongoDB (User, Account, Session)
        ├── Prisma ORM   ──► MongoDB Atlas
        ├── Groq AI SDK  ──► Groq API (llama-3.3-70b-versatile)
        └── Upstash      ──► Redis (Rate Limiting)
```

### Request Flow
1. Browser sends request to Vercel
2. Middleware checks JWT token
3. If protected route and no token → redirect to `/login`
4. If admin/instructor route and wrong role → redirect to `/dashboard`
5. Page/API handler runs
6. API routes call Prisma (MongoDB) or Groq AI
7. Response returned to browser

---

## 4. Database Schema

### User
```
id            ObjectId (primary key)
name          String
email         String (unique)
password      String? (nullable — null for OAuth users)
role          Enum: ADMIN | INSTRUCTOR | STUDENT (default: STUDENT)
image         String? (profile picture URL)
emailVerified DateTime?
isSuspended   Boolean (default: false)
createdAt     DateTime
updatedAt     DateTime

Relations:
  accounts[]      → Account (OAuth)
  sessions[]      → Session
  enrollments[]   → Enrollment
  courses[]       → Course (as instructor)
  submissions[]   → Submission
  chatMessages[]  → ChatMessage
  chatSessions[]  → ChatSession

Indexes: role
```

### Course
```
id           ObjectId
title        String
description  String
thumbnail    String? (image URL or base64 SVG)
price        Float (default: 0)
isPublished  Boolean (default: false)
isDeleted    Boolean (default: false) — soft delete
instructorId ObjectId (foreign key → User)
category     String
tags         String[]
level        Enum: BEGINNER | INTERMEDIATE | ADVANCED
language     String (default: "English")
createdAt    DateTime
updatedAt    DateTime

Relations:
  instructor   → User
  chapters[]   → Chapter
  enrollments[]→ Enrollment
  quizzes[]    → Quiz

Indexes: instructorId, isPublished, isDeleted, category
```

### Chapter
```
id          ObjectId
title       String
content     String (markdown text)
videoUrl    String? (optional video link)
aiSummary   String? (cached JSON array of bullet points)
order       Int (sequence number for ordering)
isPublished Boolean (default: false)
courseId    ObjectId (foreign key → Course)
createdAt   DateTime
updatedAt   DateTime

Relations:
  course    → Course
  progress[]→ Progress

Indexes: courseId, order
```

### Enrollment
```
id          ObjectId
userId      ObjectId (foreign key → User)
courseId    ObjectId (foreign key → Course)
enrolledAt  DateTime
completedAt DateTime? (null until 100% complete)

Unique constraint: [userId, courseId]

Relations:
  user      → User
  course    → Course
  progress[]→ Progress

Indexes: userId, courseId
```

### Progress
```
id           ObjectId
userId       ObjectId
chapterId    ObjectId (foreign key → Chapter)
enrollmentId ObjectId (foreign key → Enrollment)
isCompleted  Boolean (default: false)
completedAt  DateTime?

Unique constraint: [userId, chapterId]

Relations:
  chapter    → Chapter
  enrollment → Enrollment

Indexes: enrollmentId
```

### Quiz
```
id          ObjectId
title       String
courseId    ObjectId (foreign key → Course)
timeLimit   Int? (minutes, optional)
retakeLimit Int (default: 3)
aiGenerated Boolean (default: false)
createdAt   DateTime

Relations:
  course      → Course
  questions[] → Question
  submissions[]→ Submission

Indexes: courseId
```

### Question
```
id            ObjectId
text          String
options       String[] (exactly 4 options)
correctAnswer Int (index 0-3)
explanation   String? (optional explanation)
quizId        ObjectId (foreign key → Quiz)

Relations:
  quiz → Quiz

Indexes: quizId
```

### Submission
```
id          ObjectId
userId      ObjectId (foreign key → User)
quizId      ObjectId (foreign key → Quiz)
answers     JSON (array of selected option indexes)
score       Float (0-100 percentage)
aiFeedback  String? (reserved for future use)
timeTaken   Int? (seconds)
submittedAt DateTime

Relations:
  user → User
  quiz → Quiz

Indexes: userId, quizId
```

### ChatSession
```
id        ObjectId
userId    ObjectId (foreign key → User)
courseId  ObjectId (foreign key → Course)
name      String (default: "New Chat")
createdAt DateTime

Relations:
  user     → User
  messages[]→ ChatMessage

Indexes: [userId, courseId]
```

### ChatMessage
```
id        ObjectId
userId    ObjectId (foreign key → User)
courseId  ObjectId? (nullable)
sessionId ObjectId? (nullable, foreign key → ChatSession)
role      String ("user" | "assistant")
content   String (message text)
createdAt DateTime

Relations:
  user    → User
  session → ChatSession (nullable)

Indexes: userId, courseId, sessionId
```

### Authentication Models
- **Account** — Stores OAuth provider credentials (Google)
- **Session** — Active JWT sessions
- **VerificationToken** — Email verification tokens

---

## 5. Authentication & Authorization

### Login Flow (Credentials)
```
1. User submits email + password at /login
2. NextAuth CredentialsProvider receives credentials
3. loginSchema (Zod) validates input format
4. prisma.user.findUnique({ where: { email } })
5. If user.isSuspended → throw "Account suspended" error
6. bcrypt.compare(password, user.password)
7. If match → return { id, email, name, role, image }
8. JWT created: { id, email, role, ... }
9. Redirects to callbackUrl or /dashboard
```

### Login Flow (Google OAuth)
```
1. User clicks "Continue with Google"
2. NextAuth GoogleProvider initiates OAuth flow
3. Google redirects back with authorization code
4. NextAuth exchanges code for tokens
5. PrismaAdapter links Account to User (or creates new User)
6. Role defaults to STUDENT for new Google users
7. JWT created with user data
8. Redirects to /dashboard
```

### JWT Callbacks
```typescript
jwt({ token, user }) {
  if (user) {
    token.id = user.id
    token.role = user.role
  }
  return token
}

session({ session, token }) {
  session.user.id = token.id
  session.user.role = token.role
  return session
}
```

### Middleware Protection
```
Route                          Condition
/login, /register          →   Redirect to /dashboard if logged in
/dashboard, /courses, etc  →   Redirect to /login if not logged in
/admin/*                   →   Redirect to /dashboard if role ≠ ADMIN
/instructor/*              →   Redirect to /dashboard if role ∉ [ADMIN, INSTRUCTOR]
```

---

## 6. Role-Based Access Control

### Role Definitions

| Permission | STUDENT | INSTRUCTOR | ADMIN |
|---|:---:|:---:|:---:|
| Browse published courses | ✓ | ✓ | ✓ |
| Enroll in courses | ✓ | ✓ | ✓ |
| Take quizzes | ✓ | ✓ | ✓ |
| Use AI chat tutor | ✓ | ✓ | ✓ |
| View leaderboard | ✓ | ✓ | ✓ |
| Create courses | ✗ | ✓ | ✓ |
| Edit own courses | ✗ | ✓ | ✓ |
| Edit any course | ✗ | ✗ | ✓ |
| Delete any course | ✗ | ✗ | ✓ |
| Generate AI content | ✗ | ✓ | ✓ |
| View all users | ✗ | ✗ | ✓ |
| Change user roles | ✗ | ✗ | ✓ |
| Suspend users | ✗ | ✗ | ✓ |
| View analytics | ✗ | ✗ | ✓ |
| See draft courses | own only | own only | all |

---

## 7. Features & Functional Requirements

### 7.1 Student Features

#### Course Discovery
- Browse all published courses at `/courses`
- Search by keyword (matches title, description, category)
- Filter by category: Web Development, Data Science, Design, Marketing, Business, DevOps, Other
- Filter by level: BEGINNER, INTERMEDIATE, ADVANCED
- Paginated results (12 per page)
- Filters reset to page 1 automatically on change

#### Course Enrollment
- View full course details (chapters list, instructor, price)
- One-click enrollment
- Creates enrollment record + progress entry for every chapter
- Cannot enroll twice in same course
- Free and paid courses (pricing display only — no payment gateway)

#### Learning Interface (`/courses/[courseId]/learn`)
- Chapter navigation sidebar (left panel)
- Completion status icons per chapter (checkmark / circle)
- Markdown-rendered chapter content (center panel)
- Resizable AI chat sidebar (right panel)
- "Mark Complete" button per chapter
- Chapter completion triggers progress percentage update
- Optional video URL display per chapter
- AI summary button per chapter (cached after first generation)
- Chapter progress bar showing overall completion

#### Quiz Taking (`/courses/[courseId]/quiz/[quizId]`)
- Multiple choice questions (4 options each)
- Optional countdown timer
- Submit all answers at once
- Immediate feedback: score, correct answers, explanations
- Retake limit enforcement (default: 3 attempts)
- Score recorded and counted in leaderboard

#### My Learning (`/my-learning`)
- All enrolled courses categorized:
  - In Progress (started, not 100%)
  - Completed (100% chapters done)
  - Not Started (enrolled, no chapters done)
- Overall progress across all courses
- Quick link back to learning page

#### Leaderboard (`/leaderboard`)
- Top 20 students ranked
- Composite score formula:
  - 50% × average quiz score
  - 30% × (completed courses / enrolled courses)
  - 20% × (completed chapters / total enrolled chapters)
- Shows rank, name, courses completed, avg quiz score

#### Profile (`/profile`)
- Edit display name
- Change password (requires current password verification)
- View email and role

### 7.2 Instructor Features

#### Course Management (`/instructor/courses`)
- List all own courses with status (draft/published)
- Enrollment count per course
- Create, edit, delete (soft delete) courses

#### Course Creation & Editing (`/instructor/courses/new` + `/edit`)
**Course Info Form**:
- Title (5-100 chars)
- Description (20-5000 chars)
- Category (dropdown from enum)
- Level (BEGINNER / INTERMEDIATE / ADVANCED)
- Price (0-9999, 0 = free)
- Language (default: English)
- Tags (up to 5)
- Thumbnail (upload or AI-generated)
- Publish toggle

**Chapter Management**:
- Add chapters with title and markdown content
- Drag-and-drop reorder (dnd-kit)
- Edit chapter title, content, video URL
- Toggle chapter publish status
- Delete chapters
- AI content generation per chapter
- View cached AI summary

**Quiz Management**:
- Create quizzes with title, time limit, retake limit
- Add questions manually: text, 4 options, correct answer index, explanation
- AI quiz generation from topic, category, difficulty, count
- Edit and delete questions
- Delete quizzes

#### AI Tools for Instructors
- **Content Generator**: Enter chapter title → AI writes full structured lesson
- **Quiz Generator**: Enter topic, difficulty, count → AI generates MCQs with answers
- **Thumbnail Generator**: Course title + category → AI designs SVG thumbnail

### 7.3 Admin Features

#### User Management (`/admin/users`)
- Paginated user table (20 per page)
- Search by name or email
- Filter by role (All / STUDENT / INSTRUCTOR / ADMIN)
- Actions per user:
  - Change role (dropdown)
  - Suspend / unsuspend account
- Export all users as CSV
- View: name, email, role, join date, enrolled courses count

#### Platform Analytics (`/admin/analytics`)
**Overview Metrics**:
- Total users (with student count)
- Total courses (with published count)
- Total enrollments (with avg per course)
- Average quiz score (with total submissions)

**Data Tables**:
- Users breakdown by role (count + percentage)
- Top 10 courses by enrollment count
- Recent 10 enrollments (user name, course, date)

**Full Access**:
- Edit or delete any course
- Create courses as instructor

---

## 8. AI Features

### 8.1 AI Chat Tutor

| Property | Detail |
|---|---|
| Model | Groq llama-3.3-70b-versatile |
| Endpoint | `POST /api/ai/chat` |
| Max Tokens | 1024 per response |
| Rate Limit | 10 requests/minute/user |
| Context | Chapter title + first 2000 chars of content |

**System Prompt Behavior**:
- Addresses student by first name
- Encourages step-by-step explanations
- Uses analogies and practical examples
- Context-aware based on current chapter

**Persistence**:
- All messages saved to ChatMessage model
- Sessions named and manageable (create, rename, delete)
- History loaded per session on page load

### 8.2 Quiz Generation

| Property | Detail |
|---|---|
| Model | Groq llama-3.3-70b-versatile |
| Endpoint | `POST /api/quiz/generate` |
| Max Tokens | 3000 per response |
| Rate Limit | 10 requests/minute/user |
| Input | topic, difficulty (easy/medium/hard), count (1-50), category |

**Output Format**:
```json
[
  {
    "text": "Question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct"
  }
]
```

### 8.3 Thumbnail Generation

| Property | Detail |
|---|---|
| Model | Groq with structured output (Zod schema) |
| Endpoint | `POST /api/ai/thumbnail` |
| Input | course title, category, description |

**AI Output Schema** (Zod-validated):
```typescript
{
  gradient: { from: hex, via: hex, to: hex }
  emoji: string (single emoji)
  accentColor: hex
  pattern: 'dots' | 'grid' | 'waves' | 'circuit' | 'hexagon'
  tagline: string (3-5 words)
}
```

**SVG Generation**:
- 640×360px SVG thumbnail
- 3-stop gradient background
- Pattern overlay (dots/grid/waves/circuit/hexagon)
- Gaussian blur glow blobs
- Centered emoji in circle
- Category badge
- Course title text
- AI-generated tagline
- Returns base64-encoded data URL

### 8.4 Content Generation

| Property | Detail |
|---|---|
| Model | Groq llama-3.3-70b-versatile |
| Endpoint | `POST /api/ai/generate-content` |
| Max Tokens | 2000 per response |
| Input | chapter title, category, course title |

**Generated Structure** (Markdown):
```
## Learning Objectives
3-4 specific, measurable objectives

## Key Concepts
4-5 concepts with:
- Clear heading
- 2-3 sentence explanation
- Code example OR real-world example
- Why it matters

## Summary
2-3 sentence takeaway

## Practice Exercise
One specific hands-on exercise
```

### 8.5 Chapter Summarization

| Property | Detail |
|---|---|
| Model | Groq llama-3.3-70b-versatile |
| Endpoint | `POST /api/ai/summarize` |
| Max Tokens | 512 per response |
| Caching | Stored in chapter.aiSummary (JSON) |
| Input | chapterId (fetches content from DB) |

**Output**: JSON array of 5-7 bullet point strings
```json
["Key point 1", "Key point 2", "Key point 3", ...]
```
- Cached after first generation — reused on subsequent requests
- Uses first 4000 characters of chapter content

---

## 9. API Endpoints

### Authentication
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Create new user account |
| GET/POST | /api/auth/[...nextauth] | Public | NextAuth.js handler |

### Courses
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/courses | Any | List courses with pagination, search, filters |
| POST | /api/courses | INSTRUCTOR+ | Create new course |
| GET | /api/courses/[courseId] | Any | Get course details + chapters |
| PUT | /api/courses/[courseId] | INSTRUCTOR+ | Update course |
| DELETE | /api/courses/[courseId] | INSTRUCTOR+ | Soft delete course |

### Chapters
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/courses/[courseId]/chapters | INSTRUCTOR+ | Create chapter |
| PATCH | /api/courses/[courseId]/chapters/[chapterId] | INSTRUCTOR+ | Update chapter |

### Quizzes
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/courses/[courseId]/quizzes | Auth | Get quizzes for course |
| POST | /api/quiz | INSTRUCTOR+ | Create quiz |
| GET | /api/quiz/[quizId] | Auth | Get quiz + questions |
| POST | /api/quiz/generate | Auth | AI-generate quiz questions |
| POST | /api/quiz/[quizId]/submit | STUDENT | Submit quiz answers |

### AI
| Method | Path | Auth | Rate Limit | Description |
|---|---|---|---|---|
| POST | /api/ai/chat | Auth | 10/min | Send message to AI tutor |
| GET | /api/ai/chat | Auth | — | Get chat history for session |
| POST | /api/ai/thumbnail | Auth | — | Generate SVG thumbnail |
| POST | /api/ai/generate-content | Auth | — | Generate chapter markdown |
| POST | /api/ai/summarize | Auth | — | Summarize chapter content |
| GET | /api/ai/sessions | Auth | — | List chat sessions |
| POST | /api/ai/sessions | Auth | — | Create chat session |
| PATCH | /api/ai/sessions | Auth | — | Rename chat session |
| DELETE | /api/ai/sessions | Auth | — | Delete chat session |

### Enrollments & Progress
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/enrollments | Auth | Enroll in course |
| GET | /api/enrollments | Auth | Get user's enrollments |
| PATCH | /api/progress | Auth | Mark chapter complete/incomplete |

### Admin
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /api/admin/users | ADMIN | List all users |
| PATCH | /api/admin/users/[userId] | ADMIN | Update user role/suspension |
| GET | /api/admin/analytics | ADMIN | Platform analytics |

### Profile
| Method | Path | Auth | Description |
|---|---|---|---|
| PATCH | /api/profile | Auth | Update name |
| PUT | /api/profile | Auth | Change password |

### API Response Format
All endpoints return consistent JSON:
```json
{ "success": true, "data": {...} }
{ "success": false, "error": "message" }
```
HTTP Status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests, 500 Server Error

---

## 10. User Journeys

### Student Journey

```
Register (/register)
    │ Select STUDENT role, set password
    ▼
Login (/login)
    │ Credentials or Google OAuth
    ▼
Dashboard (/dashboard)
    │ Shows enrolled courses, quick stats
    ▼
Browse Courses (/courses)
    │ Search/filter by category, level
    ▼
Course Detail (/courses/[courseId])
    │ View description, chapters, instructor
    ▼
Enroll
    │ Creates enrollment + progress records
    ▼
Learn (/courses/[courseId]/learn)
    │ Read chapters → Mark complete
    │ Use AI chat for questions
    │ View AI summaries
    ▼
Take Quiz (/courses/[courseId]/quiz/[quizId])
    │ Answer questions → Submit → See score
    ▼
Track Progress (/my-learning)
    │ In Progress / Completed / Not Started
    ▼
Leaderboard (/leaderboard)
    │ See ranking among students
```

### Instructor Journey

```
Register (/register)
    │ Select INSTRUCTOR role
    ▼
Login (/login)
    ▼
Dashboard (/dashboard)
    │ Quick access to course management
    ▼
My Courses (/instructor/courses)
    │ View all own courses
    ▼
Create Course (/instructor/courses/new)
    │ Fill course details + AI thumbnail
    ▼
Edit Course (/instructor/courses/[id]/edit)
    │
    ├── Add Chapters
    │     └── Write content OR click "Generate AI Content"
    │
    ├── Reorder Chapters (drag-and-drop)
    │
    ├── Create Quiz
    │     └── Add questions manually OR click "Generate AI Quiz"
    │
    └── Publish Course
          └── Visible to students immediately
```

### Admin Journey

```
Login (/login)
    │ With ADMIN role
    ▼
Dashboard (/dashboard)
    │ Admin-specific quick actions
    ▼
User Management (/admin/users)
    │ Search, filter users
    │ Change roles, suspend users
    │ Export CSV
    ▼
Analytics (/admin/analytics)
    │ Platform metrics
    │ Top courses, recent enrollments
    │ User role breakdown
    ▼
Course Management (via /instructor/courses)
    │ Edit or delete any course
```

---

## 11. Rate Limiting & Security

### Rate Limiting (Upstash Redis)

```typescript
// AI Endpoints — 10 requests per minute per user
aiRatelimit = Ratelimit.slidingWindow(10, '1 m')
// Applied to: /api/ai/chat, /api/quiz/generate

// Auth Endpoints — 5 requests per minute
authRatelimit = Ratelimit.slidingWindow(5, '1 m')
// Applied to: /api/auth/register, login attempts
```

Response on limit exceeded: `HTTP 429 { error: "Rate limit exceeded" }`

### Security Measures

| Measure | Implementation |
|---|---|
| Password hashing | bcryptjs with salt rounds 12 |
| JWT secret | AUTH_SECRET env variable |
| Input validation | Zod schemas on all endpoints |
| SQL injection | Not applicable (MongoDB + Prisma ORM) |
| XSS prevention | React auto-escapes, markdown sanitized |
| CSRF protection | NextAuth built-in CSRF tokens |
| Route protection | Middleware JWT validation on every request |
| Suspended accounts | Auth check: isSuspended → throw error |
| Soft deletes | isDeleted flag prevents permanent data loss |
| Role verification | Server-side role checks on every sensitive API |
| API response | Never exposes passwords or internal errors |

### Environment Variables (Required)
```
DATABASE_URL            MongoDB Atlas connection string
AUTH_SECRET             NextAuth JWT secret (32+ char random)
NEXTAUTH_SECRET         Same as AUTH_SECRET (v4 compatibility)
NEXTAUTH_URL            Production URL
AUTH_URL                Production URL (NextAuth v5)
GOOGLE_CLIENT_ID        Google OAuth app client ID
GOOGLE_CLIENT_SECRET    Google OAuth app client secret
GROQ_API_KEY            Groq API key for AI features
UPSTASH_REDIS_REST_URL  Upstash Redis endpoint
UPSTASH_REDIS_REST_TOKEN Upstash Redis auth token
```

---

## 12. Project Structure

```
educore-ai/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions: lint → test → build
│
├── prisma/
│   ├── schema.prisma           # MongoDB schema + all models
│   └── seed.ts                 # Demo data: 1 admin, 10 instructors, 11 students, 10 courses
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/          # Login page (credentials + Google)
│   │   │   └── register/       # Register page (with role selection)
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/      # Role-specific home
│   │   │   ├── courses/        # Browse + course detail + learn + quiz
│   │   │   ├── my-learning/    # Student progress tracker
│   │   │   ├── leaderboard/    # Student rankings
│   │   │   ├── profile/        # Edit profile + change password
│   │   │   ├── instructor/     # Course/chapter/quiz management
│   │   │   └── admin/          # User management + analytics
│   │   │
│   │   ├── api/
│   │   │   ├── auth/           # NextAuth + register
│   │   │   ├── courses/        # Course CRUD + chapters
│   │   │   ├── quiz/           # Quiz CRUD + submit + AI generate
│   │   │   ├── ai/             # chat + summarize + thumbnail + generate-content + sessions
│   │   │   ├── admin/          # users list + user update + analytics
│   │   │   ├── enrollments/    # Enroll/get enrollments
│   │   │   ├── progress/       # Chapter completion
│   │   │   └── profile/        # Update name + change password
│   │   │
│   │   ├── globals.css         # Tailwind + custom animations
│   │   ├── layout.tsx          # Root layout (Providers wrapper)
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/
│   │   ├── shared/             # DashboardShell, NavLink, HeaderMenu, ThemeToggle, AiThumbnail
│   │   └── ui/                 # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── auth.ts             # NextAuth config (providers, callbacks, adapter)
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── ai.ts               # Groq client + model exports
│   │   ├── rate-limit.ts       # Upstash Redis rate limiters
│   │   ├── api-response.ts     # ok, created, badRequest, unauthorized, etc.
│   │   ├── utils.ts            # cn() helper
│   │   ├── actions.ts          # Server actions
│   │   └── validations/
│   │       ├── user.ts         # loginSchema, registerSchema
│   │       ├── course.ts       # courseSchema, chapterSchema, quizSchema
│   │       └── index.ts        # Re-exports
│   │
│   └── middleware.ts           # Route protection (NextAuth v5 auth())
│
├── tests/
│   ├── unit/
│   │   └── validations.test.ts # Zod schema unit tests
│   └── e2e/
│       └── enrollment.spec.ts  # Playwright E2E tests
│
├── .env.local                  # Local environment variables (gitignored)
├── .env.local.example          # Template for env setup
├── next.config.ts              # Next.js config (image domains)
├── vercel.json                 # Vercel: prisma generate + next build
├── jest.config.ts              # Jest test config
├── tailwind.config.ts          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
├── README.md                   # Setup and deployment guide
└── SRS.md                      # This document
```

---

## Seeded Demo Data

### Accounts (Password: `Password123!`)

| Role | Name | Email |
|---|---|---|
| ADMIN | Admin User | admin@educore.ai |
| INSTRUCTOR | Jane Smith | jane.smith@educore.ai |
| INSTRUCTOR | Michael Chen | michael.chen@educore.ai |
| INSTRUCTOR | Sarah Johnson | sarah.johnson@educore.ai |
| INSTRUCTOR | David Kumar | david.kumar@educore.ai |
| INSTRUCTOR | Emily Davis | emily.davis@educore.ai |
| INSTRUCTOR | Carlos Rivera | carlos.rivera@educore.ai |
| INSTRUCTOR | Priya Patel | priya.patel@educore.ai |
| INSTRUCTOR | Alex Thompson | alex.thompson@educore.ai |
| INSTRUCTOR | Yuki Tanaka | yuki.tanaka@educore.ai |
| INSTRUCTOR | Fatima Al-Hassan | fatima.hassan@educore.ai |
| STUDENT | Prajwal Mulik | prajwalmulik3106@gmail.com |
| STUDENT | Arjun Mehta | arjun.mehta@student.ai |
| STUDENT | Sophie Laurent | sophie.laurent@student.ai |
| STUDENT | James Wilson | james.wilson@student.ai |
| STUDENT | Ananya Reddy | ananya.reddy@student.ai |
| STUDENT | Lucas Oliveira | lucas.oliveira@student.ai |
| STUDENT | Nina Petrov | nina.petrov@student.ai |
| STUDENT | Omar Khalil | omar.khalil@student.ai |
| STUDENT | Emma Zhang | emma.zhang@student.ai |
| STUDENT | Ravi Shankar | ravi.shankar@student.ai |
| STUDENT | Isabella Costa | isabella.costa@student.ai |

### Seeded Courses (10 Courses)

| Title | Category | Level | Price |
|---|---|---|---|
| Full-Stack Web Development with React & Node | Web Development | Intermediate | $49.99 |
| Python for Data Science & Machine Learning | Data Science | Beginner | $39.99 |
| UI/UX Design Mastery | Design | Beginner | Free |
| Digital Marketing & SEO Strategy | Marketing | Intermediate | $44.99 |
| Cloud Architecture with AWS | DevOps | Advanced | $59.99 |
| Business Strategy & Entrepreneurship | Business | Intermediate | $34.99 |
| Advanced TypeScript & System Design | Web Development | Advanced | $54.99 |
| Deep Learning & Neural Networks | Data Science | Advanced | $64.99 |
| Mobile App Development with React Native | Web Development | Intermediate | $44.99 |
| Graphic Design & Brand Identity | Design | Beginner | $29.99 |

Each course has 5-6 chapters with full markdown content, a 4-question quiz, and pre-seeded enrollments with varied progress across all 11 students (93 total enrollments).
