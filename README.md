# EduCore AI — Full-Stack LMS

An AI-powered Learning Management System built with Next.js, Prisma, MongoDB, and Groq AI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | MongoDB via Prisma ORM |
| Auth | NextAuth.js v5 — credentials + Google OAuth |
| AI | Groq (llama-3.3-70b-versatile) via Vercel AI SDK |
| Styling | Tailwind CSS v4, shadcn/ui |
| Rate Limiting | Upstash Redis |
| Language | TypeScript |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
# MongoDB — get connection string from https://cloud.mongodb.com
DATABASE_URL="mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/educore_ai?retryWrites=true&w=majority"

# NextAuth — generate secret with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth — get from https://console.cloud.google.com
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Groq AI — get from https://console.groq.com
GROQ_API_KEY="your-groq-api-key"

# Upstash Redis — get from https://upstash.com (used for rate limiting)
UPSTASH_REDIS_REST_URL="https://your-instance.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"
```

## Demo Accounts

All seeded accounts use the same password:

```
Password: Password123!
```

### Admin

| Name | Email | Role |
|---|---|---|
| Admin User | admin@educore.ai | ADMIN |

Admin can manage all users, view analytics, change roles, and access all features.

### Instructors

| Name | Email |
|---|---|
| Jane Smith | jane.smith@educore.ai |
| Michael Chen | michael.chen@educore.ai |
| Sarah Johnson | sarah.johnson@educore.ai |
| David Kumar | david.kumar@educore.ai |
| Emily Davis | emily.davis@educore.ai |
| Carlos Rivera | carlos.rivera@educore.ai |
| Priya Patel | priya.patel@educore.ai |
| Alex Thompson | alex.thompson@educore.ai |
| Yuki Tanaka | yuki.tanaka@educore.ai |
| Fatima Al-Hassan | fatima.hassan@educore.ai |

Instructors can create and manage their own courses, chapters, and quizzes.

### Students

| Name | Email |
|---|---|
| Prajwal Mulik | prajwalmulik3106@gmail.com |
| Arjun Mehta | arjun.mehta@student.ai |
| Sophie Laurent | sophie.laurent@student.ai |
| James Wilson | james.wilson@student.ai |
| Ananya Reddy | ananya.reddy@student.ai |
| Lucas Oliveira | lucas.oliveira@student.ai |
| Nina Petrov | nina.petrov@student.ai |
| Omar Khalil | omar.khalil@student.ai |
| Emma Zhang | emma.zhang@student.ai |
| Ravi Shankar | ravi.shankar@student.ai |
| Isabella Costa | isabella.costa@student.ai |

```
Password: Password123!
```

Students can browse courses, enroll, track progress, take quizzes, and appear on the leaderboard.

---

## Seeded Courses

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

Each course has 5–6 chapters and a 4-question quiz with pre-seeded student progress and quiz scores.

---

## Features

- **Role-based access** — Admin / Instructor / Student with protected routes
- **Course management** — Create, publish, and edit courses with chapters and quizzes
- **AI quiz generation** — Generate quiz questions from chapter content via Groq
- **AI thumbnails** — Auto-generated SVG thumbnails when no image is uploaded
- **AI chat tutor** — Per-course AI assistant with chat history
- **AI content generation** — Generate chapter content from a topic
- **Leaderboard** — Students ranked by quiz scores and course completion
- **My Learning** — Track enrolled courses and chapter progress
- **Dark / Light mode** — System default with toggle
- **Rate limiting** — AI and auth endpoints protected via Upstash Redis

---

## Project Structure

```
src/
  app/
    (auth)/               # Login & Register pages
    (dashboard)/          # Protected dashboard routes
      courses/            # Browse all courses
      my-learning/        # Student learning tracker
      leaderboard/        # Ranked student scores
      profile/            # Profile & settings
      instructor/         # Instructor course management
      admin/              # Admin user management & analytics
    api/
      auth/               # NextAuth + register
      courses/            # Course CRUD + chapters
      quiz/               # Quiz CRUD + submit + generate
      ai/                 # chat, summarize, thumbnail, generate-content, sessions
      admin/              # User management + analytics
      enrollments/        # Enroll/unenroll
      progress/           # Chapter progress tracking
      profile/            # Profile update
  components/
    shared/               # NavLink, HeaderMenu, ThemeToggle, AiThumbnail
    ui/                   # shadcn/ui components
  lib/                    # auth, prisma, ai, rate-limit, api-response
prisma/
  schema.prisma           # Database schema
  seed.ts                 # Demo data seed script
```

---

## Useful Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:push` | Push Prisma schema to MongoDB |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run type-check` | Run TypeScript type check |
| `npm test` | Run unit tests |

---

