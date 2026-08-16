import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Droplets,
  MoonStar,
  Dumbbell,
  Flame,
  Plus,
  Play,
  Pill,
  SmilePlus,
  Footprints,
  Route,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import ChartCard from '../components/ui/ChartCard'
import SectionHeader from '../components/ui/SectionHeader'
import Badge from '../components/ui/Badge'
import LoadingSkeleton, { SkeletonGrid } from '../components/ui/LoadingSkeleton'
import HealthScore from '../features/HealthScore'
import MoodTracker from '../features/MoodTracker'
import { useApp } from '../hooks/useApp'
import { WEEKLY_STATS, CHART_TABS, MOCK_ACTIVITIES } from '../utils/constants'
import { greeting, todayLabel, pct, formatHours } from '../utils/format'
import { buildWeeklySleep } from '../utils/sleep'
import { GOAL_LABEL_KEYS } from '../utils/plan'

export default function Dashboard() {
  const navigate = useNavigate()
  const { loading, water, streak, profile, plan, t, language, sleepLogs, healthScore, stepsToday, stepsGoal } = useApp()
  const [tab, setTab] = useState('score')
  const activeTab = CHART_TABS.find((tabs) => tabs.key === tab)

  const sleepWeekly = useMemo(
    () => buildWeeklySleep(sleepLogs, language),
    [sleepLogs, language],
  )
  const chartData = tab === 'uyqu' ? sleepWeekly : WEEKLY_STATS

  const sortedLogs = useMemo(
    () => [...sleepLogs].sort((a, b) => b.date.localeCompare(a.date)),
    [sleepLogs],
  )
  const lastSleep = sortedLogs[0]
  const lastQuality = lastSleep?.quality ?? 0

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" className="h-56 w-full" />
        <SkeletonGrid cards={4} />
        <LoadingSkeleton variant="chart" className="w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary-deep to-teal-700 p-6 text-white shadow-lift"
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 right-32 h-64 w-64 rounded-full bg-white/5" />
        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-md">
            <p className="text-sm text-white/80">{todayLabel(language)}</p>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {greeting(language)}, {profile.name || profile.username}!
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              {t('dash.hero', { suv: water.consumed / 1000, streak })}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {[
                { label: t('dash.quickWater'), icon: <Plus size={16} />, to: '/water' },
                { label: t('dash.quickWorkout'), icon: <Play size={16} fill="currentColor" />, to: '/workout' },
                { label: t('dash.quickMed'), icon: <Pill size={16} />, to: '/medicine' },
                { label: t('dash.quickMood'), icon: <SmilePlus size={16} />, to: '/profile' },
              ].map((qa) => (
                <button
                  key={qa.label}
                  type="button"
                  onClick={() => navigate(qa.to)}
                  className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur transition-all hover:bg-white/25 active:scale-95"
                >
                  {qa.icon}
                  {qa.label}
                </button>
              ))}
            </div>
          </div>
          <HealthScore score={healthScore?.health_score ?? 86} light />
        </div>
      </motion.section>

      {/* Stat cards */}
      <section>
        <SectionHeader
          title={t('dash.todayStats')}
          subtitle={t('dash.todayStatsSub')}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            delay={0.05}
            icon={<Droplets size={20} />}
            label={t('dash.waterDrunk')}
            value={water.consumed}
            unit="ml"
            sub={t('dash.goalSub', { goal: water.goal, pct: pct(water.consumed, water.goal) })}
            color="bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
          />
          <StatCard
            delay={0.1}
            icon={<MoonStar size={20} />}
            label={t('dash.sleep')}
            value={lastSleep ? formatHours(lastSleep.hours, language) : '—'}
            sub={
              lastSleep
                ? t('dash.sleepSub', { q: lastQuality })
                : t('dash.sleepNoData')
            }
            color="bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
          />
          <StatCard
            delay={0.15}
            icon={<Dumbbell size={20} />}
            label={t('dash.workout')}
            value="45"
            unit={t('dash.unit.min')}
            sub={t('dash.workoutSub', { done: 1, total: 3 })}
            color="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
          />
          <StatCard
            delay={0.2}
            icon={<Footprints size={20} />}
            label={t('dash.label.steps')}
            value={stepsToday.toLocaleString('en-US')}
            unit={t('dash.unit.steps')}
            sub={`${stepsGoal.toLocaleString('en-US')} ${t('dash.unit.steps')} · ${pct(stepsToday, stepsGoal)}%`}
            color="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
          />
          <StatCard
            delay={0.25}
            icon={<Flame size={20} />}
            label={t('dash.streak')}
            value={streak}
            unit={t('common.days')}
            sub={t('dash.recordDays', { n: 21 })}
            color="bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
          />
        </div>
      </section>

      {/* Daily plan */}
      {plan && (
        <Card>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{t('dash.dailyPlan')}</h3>
              <p className="mt-0.5 text-xs text-mute dark:text-slate-400">
                {t('dash.planSub', { goal: t(GOAL_LABEL_KEYS[plan.goal] ?? 'goal.maintain') })}
              </p>
            </div>
            <Badge color="primary">{t('dash.dailyGoals')}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              {
                icon: <Droplets size={17} />,
                value: plan.water,
                unit: t('dash.unit.liter'),
                label: t('dash.label.water'),
              },
              {
                icon: <Footprints size={17} />,
                value: plan.steps.toLocaleString('en-US'),
                unit: t('dash.unit.steps'),
                label: t('dash.label.steps'),
              },
              {
                icon: <Route size={17} />,
                value: plan.km,
                unit: 'km',
                label: t('dash.label.distance'),
              },
              {
                icon: <Flame size={17} />,
                value: plan.calories,
                unit: t('dash.unit.kcal'),
                label: t('dash.label.calories'),
              },
              {
                icon: <Dumbbell size={17} />,
                value: plan.workout,
                unit: t('dash.unit.min'),
                label: t('dash.label.workout'),
              },
              {
                icon: <MoonStar size={17} />,
                value: plan.sleep,
                unit: t('dash.unit.hours'),
                label: t('dash.label.sleep'),
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-slate-50 p-3 text-center dark:bg-night-line/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary-deep dark:bg-primary/15 dark:text-primary">
                  {item.icon}
                </span>
                <p className="text-base font-bold leading-none">
                  {item.value}
                  <span className="ml-1 text-[10px] font-medium text-mute dark:text-slate-400">
                    {item.unit}
                  </span>
                </p>
                <p className="text-[11px] text-mute dark:text-slate-400">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Chart + Timeline */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title={t('dash.weeklyStats')}
          subtitle={t('dash.weeklyStatsSub')}
          right={
            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-night-line">
              {CHART_TABS.map((tabs) => (
                <button
                  key={tabs.key}
                  type="button"
                  onClick={() => setTab(tabs.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    tab === tabs.key
                      ? 'bg-white text-ink shadow-soft dark:bg-night-soft dark:text-slate-100'
                      : 'text-mute hover:text-ink dark:hover:text-slate-300'
                  }`}
                >
                  {tabs.labelKey ? t(tabs.labelKey) : tabs.label}
                </button>
              ))}
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-56"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={activeTab.color} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={activeTab.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--grid)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--axis)', fontSize: 12 }}
                    dy={6}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ stroke: activeTab.color, strokeDasharray: '4 4' }}
                    contentStyle={{
                      background: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: 12,
                      fontSize: 12,
                      boxShadow: '0 12px 32px -16px rgba(15,23,42,.25)',
                    }}
                    labelStyle={{ color: 'var(--axis)', fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey={tab}
                    stroke={activeTab.color}
                    strokeWidth={2.5}
                    fill="url(#chartFill)"
                    dot={{ r: 3, fill: activeTab.color, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </ChartCard>

        <Card className="flex flex-col">
          <SectionHeader
            title={t('dash.activity')}
            subtitle={t('dash.activitySub')}
          />
          <ul className="flex-1 space-y-1">
            {MOCK_ACTIVITIES.map((a, i) => (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-night-line/50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-mute dark:bg-night-line dark:text-slate-400">
                  <a.icon size={16} strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t(a.textKey)}</p>
                  <p className="text-xs text-mute dark:text-slate-400">
                    {a.timeKey ? t(a.timeKey) : a.time}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Mood */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{t('dash.mood')}</h3>
            <p className="mt-0.5 text-xs text-mute dark:text-slate-400">
              {t('dash.moodSub')}
            </p>
          </div>
          <Badge color="primary">Mood Tracker</Badge>
        </div>
        <MoodTracker />
      </Card>
    </div>
  )
}
