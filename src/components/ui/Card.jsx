import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = true,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay }}
      whileHover={hover ? { y: -3 } : undefined}
      className={`rounded-2xl border border-line bg-white p-5 shadow-soft dark:border-night-line dark:bg-night-soft ${className}`}
    >
      {children}
    </motion.div>
  )
}
