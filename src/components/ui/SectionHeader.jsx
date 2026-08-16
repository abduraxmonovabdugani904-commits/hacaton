export default function SectionHeader({ title, subtitle, right }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-mute dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {right && <div>{right}</div>}
    </div>
  )
}
