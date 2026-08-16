import { motion } from 'framer-motion'
import { Trophy, Crown, Medal, Flame } from 'lucide-react'
import Card from '../components/ui/Card'
import SectionHeader from '../components/ui/SectionHeader'
import Badge from '../components/ui/Badge'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { useApp } from '../hooks/useApp'
import { MOCK_LEADERBOARD, LEVEL_XP } from '../utils/constants'
import { levelFromXp } from '../utils/format'

const PODIUM_ORDER = [1, 0, 2]
const PODIUM_COLORS = ['from-amber-400 to-yellow-500', 'from-slate-300 to-slate-400', 'from-orange-400 to-amber-600']

export default function Leaderboard() {
  const { loading, profile, xp, t } = useApp()
  const board = MOCK_LEADERBOARD.map((u) =>
    u.you
      ? {
          ...u,
          name: `${profile.name || profile.username} ${profile.surname ? `${profile.surname[0]}.` : ''}`.trim(),
          xp,
        }
      : u,
  )
  const top3 = PODIUM_ORDER.map((i) => board[i])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-end justify-center gap-4">
          {[1, 0, 2].map((i) => (
            <LoadingSkeleton key={i} variant="card" className={`${i === 0 ? 'h-48' : 'h-36'} w-32`} />
          ))}
        </div>
        <LoadingSkeleton variant="card" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('lb.title')}
        subtitle={t('lb.sub')}
        right={
          <Badge color="amber">
            <Trophy size={12} /> {t('lb.challenge')}
          </Badge>
        }
      />

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 sm:gap-5">
        {top3.map((u, idx) => {
          const isFirst = idx === 1
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex w-28 flex-col items-center sm:w-32 ${isFirst ? '-mt-8' : ''}`}
            >
              <div className="relative mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-deep text-sm font-bold text-white shadow-lift">
                {u.name.split(' ')[0][0]}
                {isFirst && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Crown size={18} className="text-amber-400" />
                  </span>
                )}
              </div>
              <p className="w-full truncate text-center text-xs font-semibold">{u.name}</p>
              <p className="text-[10px] text-mute dark:text-slate-400">{u.xp} XP</p>
              <div
                className={`mt-2 w-full rounded-t-2xl bg-gradient-to-b ${PODIUM_COLORS[idx]} p-2 text-center text-white`}
                style={{ height: isFirst ? 80 : 56 }}
              >
                <Medal size={13} className="mx-auto opacity-80" />
                <p className="text-base font-bold">{idx + 1}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Table */}
      <Card hover={false} className="p-0">
        <div className="divide-y divide-line dark:divide-night-line">
          {board.map((u, i) => {
            const isYou = u.you
            const progress = (u.xp % LEVEL_XP) / LEVEL_XP
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 px-5 py-3 ${isYou ? 'bg-primary-mist dark:bg-primary/10' : ''}`}
              >
                <span className={`w-6 text-center text-sm font-bold ${i < 3 ? 'text-amber-500' : 'text-mute dark:text-slate-500'}`}>
                  {i + 1}
                </span>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${
                    isYou
                      ? 'bg-gradient-to-br from-primary to-primary-deep'
                      : 'bg-slate-200 dark:bg-night-line'
                  } ${isYou ? '' : 'text-mute dark:text-slate-400'}`}
                >
                  {u.name.split(' ')[0][0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold">
                      {u.name} {isYou && <span className="text-primary-deep dark:text-primary">{t('lb.you')}</span>}
                    </p>
                    <u.icon size={14} strokeWidth={1.8} className="text-primary-deep dark:text-primary" />
                  </div>
                  <div className="mt-1.5 h-1.5 w-36 overflow-hidden rounded-full bg-slate-100 dark:bg-night-line">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-deep"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    />
                  </div>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <Badge color={isYou ? 'primary' : 'gray'}>Lv. {levelFromXp(u.xp)}</Badge>
                  <Badge color="amber">
                    <Flame size={12} /> {u.streak}
                  </Badge>
                </div>
                <p className="w-20 text-right text-sm font-bold">{u.xp} XP</p>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
