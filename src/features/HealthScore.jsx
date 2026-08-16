import { motion, animate, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export default function HealthScore({ score = 86, size = 132, light = false }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.4, ease: 'easeOut' })
    return () => controls.stop()
  }, [count, score])

  const text = light ? 'text-white' : 'text-ink dark:text-slate-100'
  const sub = light ? 'text-white/70' : 'text-mute dark:text-slate-400'

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="opacity-15 text-white"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#fff"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.15 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className={`text-3xl font-bold ${text}`}>{rounded}</motion.span>
        <span className={`text-[11px] font-medium ${sub}`}>Health Score</span>
      </div>
    </div>
  )
}
