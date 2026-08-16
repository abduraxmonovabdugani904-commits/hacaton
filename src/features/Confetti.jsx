import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'

const COLORS = ['#14b8a6', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e']

export default function Confetti({ onDone }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 720,
        y: 380 + Math.random() * 420,
        rotate: (Math.random() - 0.5) * 760,
        color: COLORS[i % COLORS.length],
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        duration: 1.8 + Math.random() * 1.3,
        delay: Math.random() * 0.2,
      })),
    [],
  )

  useEffect(() => {
    const t = setTimeout(onDone, 3400)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, y: -30, x: 0, rotate: 0, scale: 1 }}
          animate={{ opacity: [1, 1, 0], y: p.y, x: p.x, rotate: p.rotate, scale: 0.8 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/3 rounded-[2px]"
          style={{ width: p.w, height: p.h, background: p.color }}
        />
      ))}
    </div>
  )
}
