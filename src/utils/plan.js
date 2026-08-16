import { Scale, Dumbbell, HeartPulse } from 'lucide-react'

export const GOAL_OPTIONS = [
  {
    key: 'lose',
    labelKey: 'goal.lose',
    descKey: 'goal.desc.lose',
    icon: Scale,
  },
  {
    key: 'gain',
    labelKey: 'goal.gain',
    descKey: 'goal.desc.gain',
    icon: Dumbbell,
  },
  {
    key: 'maintain',
    labelKey: 'goal.maintain',
    descKey: 'goal.desc.maintain',
    icon: HeartPulse,
  },
]

export const GOAL_LABEL_KEYS = {
  lose: 'goal.lose',
  gain: 'goal.gain',
  maintain: 'goal.maintain',
}

/**
 * Foydalanuvchi vazni va maqsadiga qarab shaxsiy kunlik reja yaratadi.
 * @param {{ weight: number, goal: 'lose'|'gain'|'maintain' }} input
 */
export function generatePlan({ weight, goal }) {
  const w = Number(weight) || 70
  // Suv: 33 ml / kg, kamida 1.5 litr
  const water = Math.max(1.5, Math.round(w * 0.033 * 10) / 10)
  const steps = { lose: 10000, gain: 8000, maintain: 7000 }[goal] ?? 7000
  const km = Math.round(steps * 0.00075 * 10) / 10
  const calories = { lose: 1800, gain: 2500, maintain: 2100 }[goal] ?? 2100
  const workout = { lose: 45, gain: 30, maintain: 30 }[goal] ?? 30
  return { water, steps, km, calories, workout, sleep: 8, goal }
}
