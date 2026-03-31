import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Star, Target, BookOpen, TrendingUp, Crown, Sparkles, Flame } from 'lucide-react'
import { BackButton } from '@/components/shared/BackButton'

type LeaderboardEntry = {
  id: string
  name: string
  image: string | null
  avgScore: number
  quizzesTaken: number
  coursesCompleted: number
  totalChapters: number
  score: number
}

export default async function LeaderboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  // Fetch all students with their stats
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: {
      id: true,
      name: true,
      image: true,
      submissions: { select: { score: true } },
      enrollments: {
        include: { progress: true },
      },
    },
  })

  const leaderboard: LeaderboardEntry[] = students
    .map(user => {
      const avgScore = user.submissions.length
        ? user.submissions.reduce((sum, s) => sum + s.score, 0) / user.submissions.length
        : 0

      const coursesCompleted = user.enrollments.filter(e => {
        const total = e.progress.length
        const done = e.progress.filter(p => p.isCompleted).length
        return total > 0 && done === total
      }).length

      const totalChapters = user.enrollments.reduce((sum, e) =>
        sum + e.progress.filter(p => p.isCompleted).length, 0)

      // Composite score: 50% quiz avg, 30% courses completed, 20% chapters done
      const score = avgScore * 0.5 + coursesCompleted * 10 + Math.min(totalChapters * 2, 20)

      return {
        id: user.id,
        name: user.name ?? 'Anonymous',
        image: user.image,
        avgScore: Math.round(avgScore),
        quizzesTaken: user.submissions.length,
        coursesCompleted,
        totalChapters,
        score: Math.round(score),
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  const currentUserRank = leaderboard.findIndex(u => u.id === session.user.id) + 1
  const currentUserEntry = leaderboard.find(u => u.id === session.user.id)

  const rankConfig = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', label: '1st' }
    if (rank === 2) return { icon: Medal, color: 'text-slate-300', bg: 'bg-slate-500/15', border: 'border-slate-500/30', label: '2nd' }
    if (rank === 3) return { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-700/15', border: 'border-amber-700/30', label: '3rd' }
    return { icon: Star, color: 'text-muted-foreground', bg: 'bg-white/5', border: 'border-transparent', label: `${rank}th` }
  }

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="space-y-7 max-w-4xl mx-auto">
      <BackButton label="Dashboard" href="/dashboard" />
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
          <Flame className="h-3.5 w-3.5" /> Live Leaderboard
        </div>
        <h1 className="text-3xl font-bold">
          Top <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Learners</span>
        </h1>
        <p className="text-muted-foreground mt-1">Ranked by quiz scores, course completions, and chapter progress</p>
      </div>

      {/* Your Rank (if in leaderboard) */}
      {currentUserEntry && (
        <div className="glass-card rounded-2xl p-4 border border-indigo-500/20 bg-indigo-500/5 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-indigo-500/10">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Your Ranking</p>
              <p className="font-bold text-lg">
                #{currentUserRank} <span className="text-sm font-normal text-muted-foreground">out of {leaderboard.length} students</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Composite Score</p>
              <p className="text-2xl font-bold gradient-text">{currentUserEntry.score}</p>
            </div>
          </div>
        </div>
      )}

      {/* Podium — Top 3 */}
      {top3.length > 0 && (
        <div className="relative">
          <div className="flex items-end justify-center gap-4">
            {/* 2nd place */}
            {top3[1] && (
              <div className="flex flex-col items-center gap-3 animate-fade-up" style={{ animationDelay: '100ms' }}>
                <div className="glass-card rounded-2xl p-4 border border-slate-500/20 text-center w-40">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-2 shadow-lg">
                    {top3[1].name[0].toUpperCase()}
                  </div>
                  <p className="font-semibold text-sm truncate">{top3[1].name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{top3[1].avgScore}% avg</p>
                  <p className="text-xl font-bold text-slate-300 mt-1">{top3[1].score}</p>
                </div>
                <div className="h-16 w-40 rounded-t-xl bg-gradient-to-t from-slate-500/20 to-slate-500/10 border border-slate-500/20 flex items-center justify-center">
                  <span className="text-slate-300 font-bold text-lg">2nd</span>
                </div>
              </div>
            )}
            {/* 1st place */}
            {top3[0] && (
              <div className="flex flex-col items-center gap-3 animate-fade-up">
                <div className="relative">
                  <Crown className="absolute -top-4 left-1/2 -translate-x-1/2 h-7 w-7 text-amber-400 drop-shadow-lg" />
                  <div className="glass-card rounded-2xl p-5 border border-amber-500/30 text-center w-44 bg-amber-500/5 shadow-xl shadow-amber-500/10">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 shadow-lg shadow-amber-500/30">
                      {top3[0].name[0].toUpperCase()}
                    </div>
                    <p className="font-bold text-sm truncate">{top3[0].name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{top3[0].avgScore}% avg</p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">{top3[0].score}</p>
                    <Badge className="mt-2 text-[10px] bg-amber-500/15 text-amber-400 border-amber-500/30 border">
                      <Sparkles className="h-2.5 w-2.5 mr-1" /> Champion
                    </Badge>
                  </div>
                </div>
                <div className="h-24 w-44 rounded-t-xl bg-gradient-to-t from-amber-500/20 to-amber-500/5 border border-amber-500/30 flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-xl">1st</span>
                </div>
              </div>
            )}
            {/* 3rd place */}
            {top3[2] && (
              <div className="flex flex-col items-center gap-3 animate-fade-up" style={{ animationDelay: '200ms' }}>
                <div className="glass-card rounded-2xl p-4 border border-amber-700/20 text-center w-40">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-lg mx-auto mb-2 shadow-lg">
                    {top3[2].name[0].toUpperCase()}
                  </div>
                  <p className="font-semibold text-sm truncate">{top3[2].name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{top3[2].avgScore}% avg</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-500 mt-1">{top3[2].score}</p>
                </div>
                <div className="h-10 w-40 rounded-t-xl bg-gradient-to-t from-amber-700/20 to-amber-700/5 border border-amber-700/20 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-500 font-bold text-lg">3rd</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rest of leaderboard */}
      {rest.length > 0 && (
        <div className="glass-card rounded-2xl border border-indigo-500/15 overflow-hidden">
          <div className="px-4 py-3 border-b border-indigo-500/10 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-sm">Full Rankings</span>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-indigo-500/10">
              <tr className="text-xs text-muted-foreground">
                <th className="text-left p-3 font-medium">Rank</th>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-center p-3 font-medium hidden md:table-cell">
                  <div className="flex items-center justify-center gap-1"><Target className="h-3 w-3" /> Avg Score</div>
                </th>
                <th className="text-center p-3 font-medium hidden md:table-cell">
                  <div className="flex items-center justify-center gap-1"><BookOpen className="h-3 w-3" /> Completed</div>
                </th>
                <th className="text-right p-3 font-medium">Points</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((entry, i) => {
                const rank = i + 4
                const isCurrentUser = entry.id === session.user.id
                const config = rankConfig(rank)
                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-indigo-500/8 last:border-0 transition-colors ${
                      isCurrentUser ? 'bg-indigo-500/8' : 'hover:bg-indigo-500/4'
                    }`}
                  >
                    <td className="p-3">
                      <div className={`w-7 h-7 rounded-lg ${config.bg} ${config.border} border flex items-center justify-center`}>
                        <span className={`text-xs font-bold ${config.color}`}>{rank}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {entry.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-xs leading-snug">
                            {entry.name}
                            {isCurrentUser && <span className="ml-2 text-[10px] text-indigo-400">(You)</span>}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{entry.quizzesTaken} quizzes</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center hidden md:table-cell">
                      <Badge className={`text-xs border-0 ${
                        entry.avgScore >= 70 ? 'bg-emerald-500/10 text-emerald-400'
                        : entry.avgScore >= 40 ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {entry.avgScore}%
                      </Badge>
                    </td>
                    <td className="p-3 text-center hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{entry.coursesCompleted}</span>
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-bold text-sm gradient-text">{entry.score}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {leaderboard.length === 0 && (
        <div className="glass-card rounded-2xl p-16 text-center border border-indigo-500/15">
          <div className="p-4 rounded-2xl bg-amber-500/10 w-fit mx-auto mb-4">
            <Trophy className="h-12 w-12 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No rankings yet</h3>
          <p className="text-muted-foreground text-sm">Be the first to complete a quiz and claim the top spot!</p>
        </div>
      )}

      {/* Legend */}
      <div className="glass-card rounded-2xl p-4 border border-indigo-500/15">
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">How points are calculated</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-violet-500/10"><Target className="h-3 w-3 text-violet-400" /></div>
            Quiz avg × 0.5
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-emerald-500/10"><Trophy className="h-3 w-3 text-emerald-400" /></div>
            Completions × 10
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="p-1.5 rounded-lg bg-indigo-500/10"><BookOpen className="h-3 w-3 text-indigo-400" /></div>
            Chapters × 2 (max 20)
          </div>
        </div>
      </div>
    </div>
  )
}
