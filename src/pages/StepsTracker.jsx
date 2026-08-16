import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Footprints, Plus, RotateCcw } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProgressRing from '../components/ui/ProgressRing'
import SectionHeader from '../components/ui/SectionHeader'
import ChartCard from '../components/ui/ChartCard'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { useApp } from '../hooks/useApp'
import { pct } from '../utils/format'
import { buildWeeklySteps } from '../utils/sleep'

export default function StepsTracker() {
  const { loading, t, language, stepsToday, stepsGoal, addSteps, resetSteps, stepsLogs } = useApp()
  const progress = pct(stepsToday, stepsGoal)
  const remaining = Math.max(0, stepsGoal - stepsToday)
  const weekly = useMemo(() => buildWeeklySteps(stepsLogs, language), [stepsLogs, language])

  const weeklyAvg = Math.round(weekly.reduce((s, d) => s + d.qadam, 0) / 7)
  const bestDay = weekly.reduce((m, d) => Math.max(m, d.qadam), 0)

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <LoadingSkeleton variant="card" className="lg:col-span-2" />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="chart" className="lg:col-span-3" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader title={t('steps.title')} subtitle={t('steps.sub')} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center gap-6 lg:col-span-2">
          <ProgressRing value={progress} size={160} stroke={12} color="#10b981">
            <motion.span
              key={stepsToday}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold tracking-tight"
            >
              {stepsToday.toLocaleString('en-US')}
            </motion.span>
            <span className="text-xs text-mute dark:text-slate-400">
              / {stepsGoal.toLocaleString('en-US')}
            </span>
          </ProgressRing>

          <div className="w-full max-w-xs">
            <div className="mb-1.5 flex justify-between text-xs text-mute dark:text-slate-400">
              <span>{t('steps.goalSub', { goal: stepsGoal.toLocaleString('en-US') })}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {progress}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-night-line">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => addSteps(500)}>
              <Plus size={16} /> +500
            </Button>
            <Button variant="secondary" onClick={() => addSteps(1000)}>
              <Footprints size={16} /> +1000
            </Button>
            <Button variant="ghost" onClick={resetSteps}>
              <RotateCcw size={14} /> {t('water.reset')}
            </Button>
          </div>

          <p className="text-xs text-mute dark:text-slate-400">
            {remaining > 0 ? t('steps.remaining', { n: remaining }) : t('steps.done')}
          </p>
        </Card>

        <Card>
          <SectionHeader title={t('steps.summary')} />
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-night-line/50">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <Footprints size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold">{t('steps.avg', { avg: weeklyAvg.toLocaleString('en-US') })}</p>
                <p className="text-xs text-mute dark:text-slate-400">{t('steps.weeklySub')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 dark:bg-night-line/50">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
                <Footprints size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold">{t('steps.best', { best: bestDay.toLocaleString('en-US') })}</p>
                <p className="text-xs text-mute dark:text-slate-400">{t('steps.weeklySub')}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ChartCard title={t('steps.weekly')} subtitle={t('steps.weeklySub')}>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="stepsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6ee7b7" />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--axis)', fontSize: 12 }}
                dy={6}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--axis)', fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: 'var(--tooltip-border)', opacity: 0.4 }}
                contentStyle={{
                  background: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--axis)', fontWeight: 600 }}
                formatter={(v) => [Number(v).toLocaleString('en-US'), t('dash.label.steps')]}
              />
              <Bar
                dataKey="qadam"
                fill="url(#stepsFill)"
                radius={[8, 8, 0, 0]}
                maxBarSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  )
}
