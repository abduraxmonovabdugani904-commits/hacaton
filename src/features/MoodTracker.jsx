import { motion } from 'framer-motion'
import { MOODS } from '../utils/constants'
import { useApp } from '../hooks/useApp'

export default function MoodTracker() {
  const { mood, setMood, t } = useApp()

  return (
    <div className="flex items-center justify-between gap-2">
      {MOODS.map((m, i) => {
        const active = mood === m.key
        return (
          <motion.button
            key={m.key}
            type="button"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setMood(m.key)}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 transition-colors ${
              active
                ? 'bg-primary-soft dark:bg-primary/15'
                : 'hover:bg-slate-100 dark:hover:bg-night-line'
            }`}
          >
            <m.icon
              size={22}
              strokeWidth={1.8}
              className={
                active
                  ? 'text-primary-deep dark:text-primary'
                  : 'text-mute opacity-60'
              }
            />
            <span className="text-[10px] text-mute dark:text-slate-400">{t(m.labelKey)}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
