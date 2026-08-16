import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Button from '../components/ui/Button'
import { useApp } from '../hooks/useApp'

export default function BadgeUnlock() {
  const { recentBadge, setRecentBadge, fireCelebration, t } = useApp()

  useEffect(() => {
    if (recentBadge) fireCelebration()
  }, [recentBadge, fireCelebration])

  return (
    <AnimatePresence>
      {recentBadge && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setRecentBadge(null)}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 text-center shadow-soft dark:border-night-line dark:bg-night-soft"
            initial={{ scale: 0.8, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: [0, -8, 8, 0] }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 14 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-soft text-primary-deep dark:bg-primary/15 dark:text-primary"
            >
              <recentBadge.icon size={34} strokeWidth={1.6} />
            </motion.div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-deep dark:text-primary">
              {t('badge.newBadge')}
            </p>
            <h3 className="mt-2 text-xl font-bold">{recentBadge.name}</h3>
            <p className="mt-1 text-sm text-mute dark:text-slate-400">
              {t(recentBadge.descKey)}
            </p>
            <Button className="mt-6 w-full" onClick={() => setRecentBadge(null)}>
              {t('badge.awesome')}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
