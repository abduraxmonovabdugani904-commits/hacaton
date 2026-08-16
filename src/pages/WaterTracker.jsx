import { motion } from 'framer-motion'
import { Droplets, Plus } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProgressRing from '../components/ui/ProgressRing'
import SectionHeader from '../components/ui/SectionHeader'
import ChartCard from '../components/ui/ChartCard'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import GrowingTree from '../features/GrowingTree'
import { useApp } from '../hooks/useApp'
import { WEEKLY_STATS } from '../utils/constants'
import { pct } from '../utils/format'

export default function WaterTracker() {
  const { loading, water, addWater, t } = useApp()
  const progress = pct(water.consumed, water.goal)
  const remaining = Math.max(0, water.goal - water.consumed)

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <LoadingSkeleton variant="card" className="lg:col-span-2" />
        <LoadingSkeleton variant="card" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('water.title')}
        subtitle={t('water.sub')}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center gap-6 lg:col-span-2">
          <ProgressRing value={progress} size={160} stroke={12} color="#0ea5e9">
            <motion.span
              key={water.consumed}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold tracking-tight"
            >
              {water.consumed}
            </motion.span>
            <span className="text-xs text-mute dark:text-slate-400">
              / {water.goal} ml
            </span>
          </ProgressRing>

          <div className="w-full max-w-xs">
            <div className="mb-1.5 flex justify-between text-xs text-mute dark:text-slate-400">
              <span>{t('water.dailyGoal', { goal: water.goal })}</span>
              <span className="font-semibold text-sky-600 dark:text-sky-400">
                {progress}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-night-line">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={() => addWater(250)}>
              <Plus size={16} /> +250 ml
            </Button>
            <Button variant="secondary" onClick={() => addWater(500)}>
              <Droplets size={16} /> +500 ml
            </Button>
          </div>

          <p className="text-xs text-mute dark:text-slate-400">
            {remaining > 0
              ? t('water.remaining', { ml: remaining })
              : t('water.goalDone')}
          </p>
        </Card>

        <Card>
          <SectionHeader title={t('water.tree')} subtitle={t('water.treeSub')} />
          <GrowingTree progress={progress} />
        </Card>
      </div>

      <ChartCard title={t('water.weekly')} subtitle={t('water.weeklySub')}>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_STATS} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--axis)', fontSize: 12 }}
                dy={6}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--axis)', fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="suv"
                name={t('water.series')}
                stroke="#0ea5e9"
                strokeWidth={2.5}
                fill="url(#waterFill)"
                dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  )
}
