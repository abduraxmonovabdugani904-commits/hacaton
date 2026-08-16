const SHAPES = {
  row: 'h-4 w-full',
  line: 'h-3 w-2/3',
  card: 'h-40 w-full',
  chart: 'h-64 w-full',
  avatar: 'h-12 w-12 rounded-full',
  circle: 'h-36 w-36 rounded-full',
}

export default function LoadingSkeleton({
  variant = 'row',
  count = 1,
  className = '',
}) {
  return (
    <div className={`animate-pulse rounded-xl bg-slate-200/70 dark:bg-night-line ${SHAPES[variant]} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="sr-only">
          Yuklanmoqda
        </span>
      ))}
    </div>
  )
}

export function SkeletonGrid({ cards = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: cards }).map((_, i) => (
        <LoadingSkeleton key={i} variant="card" />
      ))}
    </div>
  )
}
