import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppContext } from './context'
import useLocalStorage from '../hooks/useLocalStorage'
import { BADGES, MOCK_MEDS, MOCK_WORKOUTS } from '../utils/constants'
import { levelFromXp, levelProgress } from '../utils/format'
import { generatePlan } from '../utils/plan'
import { translate } from '../utils/i18n'
import { localDateKey, parseQuality } from '../utils/sleep'
import {
  getWater,
  getSleep,
  getMeds,
  getHealthScore,
  addWater as apiAddWater,
  addSleep as apiAddSleep,
  addMed as apiAddMed,
  updateMed as apiUpdateMed,
} from '../services/api'

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('lp-theme', 'light')
  const [token, setToken] = useLocalStorage('lp-token', null)
  const [water, setWater] = useLocalStorage('lp-water', {
    consumed: 1750,
    goal: 2500,
  })
  const [meds, setMeds] = useLocalStorage('lp-meds', MOCK_MEDS)
  const [workouts, setWorkouts] = useLocalStorage('lp-workouts', MOCK_WORKOUTS)
  const [sleepLogs, setSleepLogs] = useLocalStorage('lp-sleep-logs', [])
  const [stepsLogs, setStepsLogs] = useLocalStorage('lp-steps-logs', [])
  const [stepsGoal, setStepsGoal] = useLocalStorage('lp-steps-goal', 7000)
  const [healthScore, setHealthScore] = useLocalStorage('lp-health-score', null)
  const [xp, setXp] = useLocalStorage('lp-xp', 0)
  const [streak] = useLocalStorage('lp-streak', 12)
  const [mood, setMood] = useLocalStorage('lp-mood', null)
  const [profile, setProfile] = useLocalStorage('lp-profile', null)
  const [plan, setPlan] = useLocalStorage('lp-plan', null)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useLocalStorage('lp-lang', 'uz')
  const [privacy, setPrivacy] = useState(true)
  const [loading, setLoading] = useState(true)
  const [celebrate, setCelebrate] = useState(0)
  const [recentBadge, setRecentBadge] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Eski localStorage formatidagi mashg'ulotlarga tarjima kalitini qo'shish
  useEffect(() => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.nameKey
          ? w
          : { ...w, nameKey: (MOCK_WORKOUTS.find((m) => m.id === w.id) ?? {}).nameKey ?? 'wk.title' },
      ),
    )
  }, [setWorkouts])

  // Backenddan ma'lumotlarni yuklash (token mavjud bo'lganda, bir marta)
  const fetchedToken = useRef(null)
  useEffect(() => {
    if (!token) return
    if (fetchedToken.current === token) return
    fetchedToken.current = token
    let active = true

    ;(async () => {
      const [waterRes, sleepRes, medsRes, healthRes] = await Promise.allSettled([
        getWater(),
        getSleep(),
        getMeds(),
        getHealthScore(),
      ])

      if (!active) return

      if (waterRes.status === 'fulfilled' && Array.isArray(waterRes.value)) {
        const records = waterRes.value
        const today = localDateKey(new Date())
        const consumed = records
          .filter((r) => r && localDateKey(r.timestamp) === today)
          .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)
        setWater((prev) => ({ ...prev, consumed }))
      }

      if (sleepRes.status === 'fulfilled' && Array.isArray(sleepRes.value)) {
        setSleepLogs(
          sleepRes.value.map((s) => ({
            id: s.id,
            date: localDateKey(s.timestamp),
            hours: Number(s.duration) || 0,
            quality: parseQuality(s.quality),
          })),
        )
      }

      if (medsRes.status === 'fulfilled' && Array.isArray(medsRes.value)) {
        setMeds(
          medsRes.value.map((m) => ({
            id: m.id,
            name: m.name,
            dose: m.dose,
            time: m.time,
            taken: m.status === 'taken',
          })),
        )
      }

      if (healthRes.status === 'fulfilled' && healthRes.value) {
        setHealthScore(healthRes.value)
      }
    })()

    return () => {
      active = false
    }
  }, [token, setWater, setSleepLogs, setMeds, setHealthScore])

  const fireCelebration = useCallback(() => {
    setCelebrate(Date.now())
  }, [])

  const awardXp = useCallback(
    (amount) => {
      setXp((prev) => {
        const next = prev + amount
        const unlocked = BADGES.filter((b) => next >= b.xp && prev < b.xp)
        if (unlocked.length > 0) {
          setRecentBadge(unlocked[unlocked.length - 1])
          fireCelebration()
        }
        return next
      })
    },
    [setXp, fireCelebration],
  )

  const addWater = useCallback(
    (ml) => {
      setWater((prev) => {
        const consumed = Math.min(prev.goal, prev.consumed + ml)
        if (consumed >= prev.goal && prev.consumed < prev.goal) {
          fireCelebration()
        }
        return { ...prev, consumed }
      })
      apiAddWater({ amount: ml }).catch(() => {})
      awardXp(10)
    },
    [setWater, awardXp, fireCelebration],
  )

  const resetWater = useCallback(() => {
    setWater((prev) => ({ ...prev, consumed: 0 }))
  }, [setWater])

  const logSleep = useCallback(
    ({ hours, quality }) => {
      const entry = {
        id: Date.now(),
        date: localDateKey(new Date()),
        hours,
        quality,
      }
      setSleepLogs((prev) => {
        const rest = prev.filter((l) => l.date !== entry.date)
        return [...rest, entry]
      })
      apiAddSleep({ duration: hours, quality }).catch(() => {})
      awardXp(10)
    },
    [setSleepLogs, awardXp],
  )

  const toggleMed = useCallback(
    (id) => {
      const med = meds.find((m) => m.id === id)
      const nextTaken = !med?.taken
      setMeds((prev) =>
        prev.map((m) => (m.id === id ? { ...m, taken: nextTaken } : m)),
      )
      apiUpdateMed(id, { status: nextTaken ? 'taken' : 'pending' }).catch(() => {})
      awardXp(5)
    },
    [meds, setMeds, awardXp],
  )

  const addMed = useCallback(
    (data) => {
      setMeds((prev) => [
        ...prev,
        { id: Date.now(), name: data.name, dose: data.dose, time: data.time, taken: false },
      ])
      apiAddMed(data).catch(() => {})
    },
    [setMeds],
  )

  const completeWorkout = useCallback(
    (id) => {
      setWorkouts((prev) =>
        prev.map((w) => (w.id === id ? { ...w, done: true } : w)),
      )
      awardXp(50)
      fireCelebration()
    },
    [setWorkouts, awardXp, fireCelebration],
  )

  const addSteps = useCallback(
    (n) => {
      const today = localDateKey(new Date())
      setStepsLogs((prev) => {
        const rest = prev.filter((l) => l.date !== today)
        const cur = prev.find((l) => l.date === today)?.count ?? 0
        return [...rest, { date: today, count: cur + n }]
      })
      awardXp(5)
    },
    [setStepsLogs, awardXp],
  )

  const resetSteps = useCallback(() => {
    const today = localDateKey(new Date())
    setStepsLogs((prev) => [
      ...prev.filter((l) => l.date !== today),
      { date: today, count: 0 },
    ])
  }, [setStepsLogs])

  const stepsToday = useMemo(() => {
    const today = localDateKey(new Date())
    return stepsLogs.find((l) => l.date === today)?.count ?? 0
  }, [stepsLogs])

  const completeOnboarding = useCallback(
    (data) => {
      const newPlan = generatePlan(data)
      setProfile(data)
      setPlan(newPlan)
      // Suv maqsadini shaxsiy rejaga moslash (litr -> ml)
      setWater((prev) => ({
        ...prev,
        consumed: 0,
        goal: Math.round(newPlan.water * 1000),
      }))
      setStepsGoal(newPlan.steps)
      setXp((prev) => prev + 50)
      setRecentBadge(BADGES.find((b) => b.id === 'starter'))
      fireCelebration()
    },
    [setProfile, setPlan, setWater, setStepsGoal, setXp, fireCelebration],
  )

  const t = useCallback(
    (key, vars) => translate(language, key, vars),
    [language],
  )

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      token,
      setToken,
      water,
      addWater,
      resetWater,
      meds,
      toggleMed,
      addMed,
      workouts,
      completeWorkout,
      sleepLogs,
      logSleep,
      stepsLogs,
      stepsGoal,
      setStepsGoal,
      stepsToday,
      addSteps,
      resetSteps,
      healthScore,
      completeOnboarding,
      xp,
      streak,
      mood,
      setMood,
      profile,
      setProfile,
      plan,
      notifications,
      setNotifications,
      language,
      setLanguage,
      privacy,
      setPrivacy,
      loading,
      celebrate,
      setCelebrate,
      fireCelebration,
      recentBadge,
      setRecentBadge,
      t,
      level: levelFromXp(xp),
      levelProgress: levelProgress(xp),
      unlockedBadges: BADGES.filter((b) => xp >= b.xp),
    }),
    [
      theme,
      token,
      water,
      addWater,
      resetWater,
      meds,
      toggleMed,
      addMed,
      workouts,
      completeWorkout,
      sleepLogs,
      logSleep,
      stepsLogs,
      stepsGoal,
      setStepsGoal,
      stepsToday,
      addSteps,
      resetSteps,
      healthScore,
      completeOnboarding,
      xp,
      streak,
      mood,
      profile,
      plan,
      notifications,
      language,
      privacy,
      loading,
      celebrate,
      fireCelebration,
      recentBadge,
      t,
      setTheme,
      setToken,
      setMood,
      setProfile,
      setLanguage,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
