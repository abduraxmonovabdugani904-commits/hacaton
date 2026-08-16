import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useApp } from '../hooks/useApp'

export default function WeeklyStory() {
  const { t } = useApp()
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-deep p-6 text-white shadow-lift"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 right-16 h-24 w-24 rounded-full bg-white/10" />
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
        <Sparkles size={18} />
      </div>
      <p className="text-sm font-semibold">{t('story.title')}</p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">
        {t('story.s1', { days: 5 })}{' '}
        <strong>{t('story.s2', { hours: 7.5 })}</strong>{' '}
        {t('story.s3', { times: 3 })}
      </p>
    </motion.div>
  )
}
