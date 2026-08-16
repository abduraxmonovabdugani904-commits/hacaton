import Card from './Card'

export default function ChartCard({ title, subtitle, right, children, className = '' }) {
  return (
    <Card className={className}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-mute dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
      {children}
    </Card>
  )
}
