import Card from './Card'

export default function StatCard({
  icon,
  label,
  value,
  unit,
  sub,
  color = 'bg-primary-soft text-primary-deep dark:bg-primary/15 dark:text-primary',
  delay = 0,
}) {
  return (
    <Card delay={delay} className="flex items-center gap-3 p-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-mute dark:text-slate-400">{label}</p>
        <p className="truncate text-lg font-bold tracking-tight">
          {value}
          {unit && (
            <span className="ml-1 text-xs font-medium text-mute dark:text-slate-400">
              {unit}
            </span>
          )}
        </p>
        {sub && (
          <p className="truncate text-xs text-mute dark:text-slate-400">{sub}</p>
        )}
      </div>
    </Card>
  )
}
