import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MoonStar, AlarmClock, Moon, Plus } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ProgressRing from '../components/ui/ProgressRing'
import SectionHeader from '../components/ui/SectionHeader'
import Badge from '../components/ui/Badge'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { useApp } from '../hooks/useApp'
import { formatHours } from '../utils/format'
import { buildWeeklySleep, avgHours, avgQuality } from '../utils/sleep'

const TIMES = ['21:00', '21:30', '22:00', '22:30', '23:00', '23:30', '00:00']

export default function SleepTracker() {
  const { loading, t, language, sleepLogs, logSleep } = useApp()
  const [reminderOn, setReminderOn] = useState(true)
  const [bedTime, setBedTime] = useState('22:30')
  const [showForm, setShowForm] = useState(false)
  const [hours, setHours] = useState('')
  const [quality, setQuality] = useState('')

  const sortedLogs = useMemo(
    () => [...sleepLogs].sort((a, b) => b.date.localeCompare(a.date)),
    [sleepLogs],
  )
  const weekly = useMemo(() => buildWeeklySleep(sleepLogs, language), [sleepLogs, language])
  const hasData = sortedLogs.length > 0
  const lastLog = sortedLogs[0]
  const avg = avgHours(sortedLogs)
  const avgQ = avgQuality(sortedLogs)

  const saveLog = () => {
    const h = Number(hours)
    const q = Number(quality)
    if (!h || h <= 0) return
    logSleep({ hours: h, quality: Number.isFinite(q) && q > 0 ? q : 80 })
    setHours('')
    setQuality('')
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="chart" className="lg:col-span-2" />
      </div>
    )
  }

  const form = (
    <div className="w-full space-y-3">
      <p className="text-sm font-semibold">{t('sleep.formTitle')}</p>
      <input
        type="number"
        min="0.5"
        max="16"
        step="0.5"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        placeholder={t('sleep.hoursLabel')}
        className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night"
      />
      <input
        type="number"
        min="0"
        max="100"
        value={quality}
        onChange={(e) => setQuality(e.target.value)}
        placeholder={t('sleep.qualityLabel')}
        className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night"
      />
      <div className="flex gap-3">
        <Button className="flex-1" size="sm" onClick={saveLog}>
          {t('common.save')}
        </Button>
        <Button variant="secondary" className="flex-1" size="sm" onClick={() => setShowForm(false)}>
          {t('common.cancel')}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('sleep.title')}
        subtitle={t('sleep.sub')}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center gap-5">
          {hasData ? (
            <>
              <ProgressRing value={avgQ} size={150} stroke={11} color="#8b5cf6">
                <MoonStar size={22} className="text-violet-500 dark:text-violet-400" />
              </ProgressRing>
              <div className="text-center">
                <p className="text-3xl font-bold tracking-tight">
                  {formatHours(lastLog.hours, language)}
                </p>
                <p className="text-xs text-mute dark:text-slate-400">
                  {t('sleep.lastNight')}
                </p>
              </div>
              {showForm ? (
                form
              ) : (
                <>
                  <div className="flex gap-2">
                    <Badge color="violet" className="dark:text-violet-400">
                      {t('sleep.qualityBadge', { q: avgQ })}
                    </Badge>
                    <Badge color="green">
                      {t('sleep.nightsBadge', { n: sortedLogs.length })}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(true)}>
                    <Plus size={14} /> {t('sleep.logAnother')}
                  </Button>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-500 dark:bg-violet-500/15 dark:text-violet-400">
                <MoonStar size={28} />
              </div>
              <div>
                <p className="text-base font-semibold">{t('sleep.emptyTitle')}</p>
                <p className="mt-1 max-w-xs text-xs text-mute dark:text-slate-400">
                  {t('sleep.emptySub')}
                </p>
              </div>
              {showForm ? (
                form
              ) : (
                <Button size="sm" onClick={() => setShowForm(true)}>
                  {t('sleep.logSleep')}
                </Button>
              )}
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <SectionHeader
            title={t('sleep.weekly')}
            subtitle={t('sleep.weeklySub')}
            right={
              hasData ? (
                <Badge color="gray">{t('sleep.avgBadge', { avg: formatHours(avg, language) })}</Badge>
              ) : undefined
            }
          />
          {!hasData ? (
            <div className="flex h-56 flex-col items-center justify-center gap-3 text-center">
              <Moon size={24} className="text-mute opacity-40" />
              <p className="max-w-xs text-xs text-mute dark:text-slate-400">
                {t('sleep.emptySub')}
              </p>
            </div>
          ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#c4b5fd" />
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
                  domain={[0, 10]}
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
                  formatter={(v) => [`${v} ${t('sleep.hoursUnit')}`, t('dash.sleep')]}
                />
                <Bar
                  dataKey="uyqu"
                  fill="url(#sleepFill)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
              <AlarmClock size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{t('sleep.reminder')}</h3>
              <p className="text-xs text-mute dark:text-slate-400">
                {t('sleep.reminderSub')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={bedTime}
              onChange={(e) => setBedTime(e.target.value)}
              disabled={!reminderOn}
              className="rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night-soft disabled:opacity-50"
            >
              {TIMES.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setReminderOn((v) => !v)}
              className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
                reminderOn ? 'bg-violet-500' : 'bg-slate-300 dark:bg-night-line'
              }`}
              aria-label={t('sleep.reminderAria')}
            >
              <motion.span
                className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
                animate={{ left: reminderOn ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: reminderOn ? 1 : 0, height: reminderOn ? 'auto' : 0 }}
          className="overflow-hidden"
        >
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            <Moon size={16} />
            {t('sleep.nextReminder', { time: bedTime })}
          </div>
        </motion.div>
      </Card>
    </div>
  )
}
