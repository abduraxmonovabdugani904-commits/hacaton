const COLORS = {
  primary:
    'bg-primary-soft text-primary-deep dark:bg-primary/15 dark:text-primary',
  gray: 'bg-slate-100 text-slate-500 dark:bg-night-line dark:text-slate-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400',
  blue: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
}

export default function Badge({ children, color = 'primary', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${COLORS[color]} ${className}`}
    >
      {children}
    </span>
  )
}
