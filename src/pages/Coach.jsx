import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send } from 'lucide-react'
import Card from '../components/ui/Card'
import { SUGGESTIONS } from '../utils/constants'
import { useApp } from '../hooks/useApp'
import { GOAL_LABEL_KEYS } from '../utils/plan'
import { smartReply } from '../utils/coachReply'
import { askCoach, getAiKey } from '../services/ai'

const REPLY_DELAY = 700

export default function Coach() {
  const {
    profile,
    t,
    language,
    water,
    sleepLogs,
    meds,
    workouts,
    mood,
    healthScore,
    streak,
    plan,
  } = useApp()
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'ai',
      text: t('coach.welcome', { name: profile.name || profile.username }),
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const apiKey = getAiKey()

  const smartData = useMemo(() => {
    const sorted = [...sleepLogs].sort((a, b) => b.date.localeCompare(a.date))
    const last = sorted[0]
    const sleepAvg = sleepLogs.length
      ? (sleepLogs.reduce((s, l) => s + l.hours, 0) / sleepLogs.length).toFixed(1)
      : 0
    const pendingMeds = meds.filter((m) => !m.taken)
    const details = healthScore?.details ?? {}
    return {
      name: profile.name || profile.username,
      water: water.consumed,
      waterGoal: water.goal,
      lastSleep: last ? last.hours : null,
      sleepQuality: last ? last.quality : null,
      sleepAvg,
      medsPending: pendingMeds.length,
      medsNames: pendingMeds.map((m) => m.name),
      medsTotal: meds.length,
      workoutsDone: workouts.filter((w) => w.done).length,
      workoutsTotal: workouts.length,
      healthScore: healthScore?.health_score ?? null,
      waterScore: details.waterScore ?? 0,
      sleepScore: details.sleepScore ?? 0,
      medicineScore: details.medicineScore ?? 0,
      workoutScore: details.workoutScore ?? 0,
      streak,
      goalLabel: t(GOAL_LABEL_KEYS[plan?.goal ?? profile?.goal ?? 'maintain'] ?? 'goal.maintain'),
      moodKey: mood,
      moodLabel: mood ? t(`mood.${mood}`) : null,
    }
  }, [water, sleepLogs, meds, workouts, healthScore, streak, plan, profile, mood, t])

  const send = async (text) => {
    const value = (text ?? input).trim()
    if (!value || typing) return
    const id = Date.now()
    const history = [...messages, { id, from: 'user', text: value }]
    setMessages(history)
    setInput('')
    setTyping(true)

    let reply
    if (apiKey) {
      try {
        reply = await askCoach(
          history.map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
          smartData,
          language,
        )
      } catch {
        reply = smartReply(value, smartData, t)
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, REPLY_DELAY))
      reply = smartReply(value, smartData, t)
    }

    setMessages((prev) => [...prev, { id: id + 1, from: 'ai', text: reply }])
    setTyping(false)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] max-w-2xl flex-col">
      <Card hover={false} className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4 dark:border-night-line">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-deep text-white shadow-lift">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">{t('coach.title')}</p>
            <p className="flex items-center gap-1.5 text-xs text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {t('coach.online')}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.from === 'user'
                      ? 'rounded-br-md bg-primary text-white shadow-lift'
                      : 'rounded-bl-md bg-slate-100 text-ink dark:bg-night-line dark:text-slate-100'
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 dark:bg-night-line">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-2 w-2 rounded-full bg-mute"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-line p-4 dark:border-night-line">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(t(s))}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-xs text-mute transition-all hover:border-primary hover:text-primary-deep dark:border-night-line dark:bg-night-soft dark:hover:text-primary"
              >
                {t(s)}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('coach.inputPh')}
              className="flex-1 rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lift transition-all hover:bg-primary-deep disabled:opacity-40"
              aria-label={t('coach.sendAria')}
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  )
}
