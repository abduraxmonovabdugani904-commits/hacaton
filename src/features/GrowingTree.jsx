import { motion } from 'framer-motion'
import { Sprout, Leaf, TreeDeciduous } from 'lucide-react'
import { useApp } from '../hooks/useApp'

export default function GrowingTree({ progress }) {
  const { t } = useApp()
  const Stage = progress >= 66 ? TreeDeciduous : progress >= 33 ? Leaf : Sprout
  const stageKey = progress >= 66 ? 'tree' : progress >= 33 ? 'leaf' : 'sprout'

  return (
    <div className="flex flex-col items-center gap-3 py-2 text-center">
      <motion.div
        key={stageKey}
        initial={{ scale: 0.3, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 16 }}
        className="text-primary-deep dark:text-primary"
      >
        <Stage size={56} strokeWidth={1.5} />
      </motion.div>
      <p className="text-xs text-mute dark:text-slate-400">
        {t('water.treeHint')}
      </p>
      <div className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-night-line">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[11px] font-semibold text-primary-deep dark:text-primary">
        {progress}%
      </span>
    </div>
  )
}
