import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Lock, Flame, Zap, Dumbbell, Trophy } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import SectionHeader from '../components/ui/SectionHeader'
import Badge from '../components/ui/Badge'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import WeeklyStory from '../features/WeeklyStory'
import { useApp } from '../hooks/useApp'
import { BADGES } from '../utils/constants'
import { GOAL_LABEL_KEYS } from '../utils/plan'

export default function Profile() {
  const { loading, profile, setProfile, xp, streak, level, unlockedBadges, workouts, t } = useApp()
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState(profile)

  const save = () => {
    setProfile({ ...profile, ...form })
    setEditOpen(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" className="w-full" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    )
  }

  const fullName = `${profile.name ?? ''} ${profile.surname ?? ''}`.trim()
  const initials = (fullName || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const stats = [
    { icon: <Zap size={18} />, label: 'XP', value: xp, color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400' },
    { icon: <Trophy size={18} />, label: t('prof.level'), value: `Lv. ${level}`, color: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400' },
    { icon: <Flame size={18} />, label: 'Streak', value: `${streak} ${t('common.days')}`, color: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400' },
    { icon: <Dumbbell size={18} />, label: t('prof.workouts'), value: workouts.filter((w) => w.done).length, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-deep text-2xl font-bold text-white shadow-lift">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold tracking-tight">{fullName}</h2>
              <Badge color="primary">
                {t(GOAL_LABEL_KEYS[profile.goal] ?? 'goal.maintain')}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-mute dark:text-slate-400">
              {profile.login ? `@${profile.login}` : profile.email}
            </p>
            <p className="mt-1 text-xs text-mute dark:text-slate-400">
              {profile.age
                ? `${t('prof.age', { age: profile.age })}${profile.weight ? ` · ${profile.weight} kg` : ''}`
                : profile.username}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil size={14} /> {t('prof.edit')}
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 rounded-2xl border border-line bg-white p-5 shadow-soft dark:border-night-line dark:bg-night-soft"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-base font-bold leading-tight">{s.value}</p>
              <p className="text-xs text-mute dark:text-slate-400">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionHeader
            title={t('prof.achievements')}
            subtitle={t('prof.badgesUnlocked', { n: unlockedBadges.length, m: BADGES.length })}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BADGES.map((b, i) => {
              const unlocked = unlockedBadges.some((ub) => ub.id === b.id)
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 260 }}
                  whileHover={unlocked ? { y: -3 } : undefined}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center ${
                    unlocked
                      ? 'border-primary/30 bg-primary-mist dark:border-primary/20 dark:bg-primary/10'
                      : 'border-line opacity-50 dark:border-night-line'
                  }`}
                >
                  <b.icon
                    size={22}
                    strokeWidth={1.8}
                    className={
                      unlocked
                        ? 'text-primary-deep dark:text-primary'
                        : 'text-mute'
                    }
                  />
                  <div>
                    <p className="text-xs font-semibold">{b.name}</p>
                    <p className="text-[10px] text-mute dark:text-slate-400">{t(b.descKey)}</p>
                  </div>
                  {!unlocked && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-mute">
                      <Lock size={10} /> {b.xp} XP
                    </span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </Card>

        <div className="space-y-6">
          <WeeklyStory />
          <Card>
            <h3 className="text-sm font-semibold">{t('prof.levelProgress')}</h3>
            <p className="mt-1 text-xs text-mute dark:text-slate-400">
              Lv. {level} · {xp} XP
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-night-line">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-deep"
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ duration: 0.9 }}
              />
            </div>
          </Card>
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={t('prof.edit')}>
        <div className="space-y-4">
          {[
            { key: 'login', label: t('onb.login') },
            { key: 'name', label: t('onb.name') },
            { key: 'surname', label: t('onb.surname') },
            { key: 'age', label: t('onb.age'), type: 'number' },
            { key: 'weight', label: t('prof.weight'), type: 'number' },
            { key: 'height', label: t('prof.height'), type: 'number' },
          ].map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1.5 block text-xs font-medium text-mute dark:text-slate-400">
                {f.label}
              </span>
              <input
                type={f.type || 'text'}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night"
              />
            </label>
          ))}
          <div className="flex gap-3 pt-1">
            <Button className="flex-1" onClick={save}>
              {t('common.save')}
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setEditOpen(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
