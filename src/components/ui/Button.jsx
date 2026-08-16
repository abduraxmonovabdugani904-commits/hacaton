import { motion } from 'framer-motion'

const VARIANTS = {
  primary:
    'bg-primary text-white shadow-lift hover:bg-primary-deep dark:bg-primary dark:hover:bg-primary-deep',
  secondary:
    'border border-line bg-white text-ink hover:border-primary/50 dark:border-night-line dark:bg-night-soft dark:text-slate-100',
  ghost:
    'text-mute hover:bg-slate-100 hover:text-ink dark:hover:bg-night-line dark:hover:text-slate-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
