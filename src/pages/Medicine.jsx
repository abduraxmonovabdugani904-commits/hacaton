import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pill, Clock, Plus, Sunrise, Sun, MoonStar } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import SectionHeader from '../components/ui/SectionHeader'
import Badge from '../components/ui/Badge'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { useApp } from '../hooks/useApp'

const TIME_ICONS = [
  { time: '08:00', icon: Sunrise, labelKey: 'med.morning' },
  { time: '12:30', icon: Sun, labelKey: 'med.noon' },
  { time: '21:00', icon: MoonStar, labelKey: 'med.evening' },
]

function timeInfo(time) {
  return TIME_ICONS.find((t) => t.time === time) || { icon: Pill, labelKey: 'med.reminder' }
}

export default function Medicine() {
  const { loading, meds, toggleMed, addMed, t } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', dose: '', time: '08:00' })

  const nextMed = meds.find((m) => !m.taken)
  const nextInfo = nextMed ? timeInfo(nextMed.time) : null

  const saveMed = () => {
    if (!form.name.trim()) return
    addMed({ name: form.name, dose: form.dose || '—', time: form.time })
    setForm({ name: '', dose: '', time: '08:00' })
    setModalOpen(false)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="card" className="w-full" />
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('med.title')}
        subtitle={t('med.sub')}
        right={
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={14} /> {t('med.new')}
          </Button>
        }
      />

      {nextMed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary-mist px-5 py-4 dark:border-primary/20 dark:bg-primary/10"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-deep dark:bg-primary/15 dark:text-primary">
            <nextInfo.icon size={18} strokeWidth={1.8} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold">
              {t('med.next', { name: nextMed.name, time: nextMed.time })}
            </p>
            <p className="text-xs text-mute dark:text-slate-400">
              {t('med.intake', { label: t(timeInfo(nextMed.time).labelKey) })}
            </p>
          </div>
          <Button size="sm" onClick={() => toggleMed(nextMed.id)}>
            {t('med.taken')}
          </Button>
        </motion.div>
      )}

      <div className="space-y-3">
        {meds.map((m, i) => {
          const info = timeInfo(m.time)
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card hover={false} className={`flex items-center gap-4 p-4 ${m.taken ? 'opacity-60' : ''}`}>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-mist text-primary-deep dark:bg-night-line dark:text-primary">
                  <info.icon size={18} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold">{m.name}</h3>
                    <Badge color={m.taken ? 'green' : 'gray'}>{m.dose}</Badge>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-mute dark:text-slate-400">
                    <Clock size={12} /> {m.time} · {t(info.labelKey)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMed(m.id)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                    m.taken ? 'bg-primary' : 'bg-slate-300 dark:bg-night-line'
                  }`}
                  aria-label={t('med.markAria', { name: m.name })}
                >
                  <motion.span
                    className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
                    animate={{ left: m.taken ? 26 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t('med.addTitle')}>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-mute dark:text-slate-400">
              {t('med.name')}
            </span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('med.namePh')}
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-mute dark:text-slate-400">
              {t('med.dose')}
            </span>
            <input
              value={form.dose}
              onChange={(e) => setForm({ ...form, dose: e.target.value })}
              placeholder={t('med.dosePh')}
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-mute dark:text-slate-400">
              {t('med.time')}
            </span>
            <select
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night"
            >
              {TIME_ICONS.map((opt) => (
                <option key={opt.time} value={opt.time}>
                  {opt.time} — {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-3 pt-1">
            <Button className="flex-1" onClick={saveMed}>
              <Pill size={15} /> {t('common.add')}
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
