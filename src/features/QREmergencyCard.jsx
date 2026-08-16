import { useApp } from '../hooks/useApp'

const SIZE = 21

function isFinder(x, y) {
  return (x < 7 && y < 7) || (x >= SIZE - 7 && y < 7) || (x < 7 && y >= SIZE - 7)
}

function isDark(x, y) {
  if (isFinder(x, y)) {
    const lx = x < 7 ? x : x >= SIZE - 7 ? x - (SIZE - 7) : x
    const ly = y < 7 ? y : y >= SIZE - 7 ? y - (SIZE - 7) : y
    return (
      lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4)
    )
  }
  return (x * 7 + y * 13 + Math.floor(x / 2) * 5) % 9 < 4
}

export default function QREmergencyCard() {
  const { t } = useApp()
  const cells = []
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (isDark(x, y)) cells.push({ x, y })
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white p-6 dark:border-night-line dark:bg-night-soft">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-36 w-36">
        {cells.map((c) => (
          <rect
            key={`${c.x}-${c.y}`}
            x={c.x}
            y={c.y}
            width={0.92}
            height={0.92}
            rx={0.12}
            fill="currentColor"
            className="text-ink dark:text-white"
          />
        ))}
      </svg>
      <p className="text-xs font-medium">{t('sos.qrCard')}</p>
      <p className="text-center text-[11px] leading-relaxed text-mute dark:text-slate-400">
        {t('sos.qrDesc')}
      </p>
    </div>
  )
}
