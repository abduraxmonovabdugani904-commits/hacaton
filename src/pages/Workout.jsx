import { motion } from 'framer-motion'
import { Timer, Flame, Check, Dumbbell } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import Badge from '../components/ui/Badge'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { useApp } from '../hooks/useApp'

function CompletionCheck({ done }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke={done ? '#10b981' : '#cbd5e1'}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
      {done && (
        <motion.path
          d="M7 12.5l3.2 3.2L17 9"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        />
      )}
    </svg>
  )
}

export default function Workout() {
  const { loading, workouts, completeWorkout, t } = useApp()
  const doneCount = workouts.filter((w) => w.done).length

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('wk.title')}
        subtitle={t('wk.sub', { done: doneCount, total: workouts.length })}
        right={
          <div className="flex gap-2">
            <Badge color="green">
              <Timer size={12} /> 220 {t('dash.unit.min')}
            </Badge>
            <Badge color="amber">
              <Flame size={12} /> 1230 {t('dash.unit.kcal')}
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {workouts.map((w, i) => (
          <Card key={w.id} delay={i * 0.06}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-mist text-primary-deep dark:bg-night-line dark:text-primary">
                  <w.icon size={22} strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t(w.nameKey)}</h3>
                  <p className="mt-0.5 flex items-center gap-3 text-xs text-mute dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Timer size={12} /> {w.duration} {t('dash.unit.min')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame size={12} /> {w.calories} {t('dash.unit.kcal')}
                    </span>
                  </p>
                </div>
              </div>
              <CompletionCheck done={w.done} />
            </div>

            {w.done ? (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Check size={14} /> {t('wk.doneXp')}
              </div>
            ) : (
              <Button className="mt-4 w-full" size="sm" onClick={() => completeWorkout(w.id)}>
                <Dumbbell size={14} /> {t('wk.finish')}
              </Button>
            )}
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-night-soft dark:to-night-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">{t('wk.weeklyGoal')}</h3>
            <p className="mt-1 text-xs text-mute dark:text-slate-400">
              {t('wk.remaining', { n: Math.max(0, 5 - doneCount) })}
            </p>
          </div>
          <div className="h-2.5 w-40 overflow-hidden rounded-full bg-white/70 dark:bg-night-line">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / 5) * 100}%` }}
              transition={{ duration: 0.9 }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
