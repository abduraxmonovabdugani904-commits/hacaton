import axios from 'axios'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

export function getAiKey() {
  try {
    return (
      import.meta.env?.VITE_GROQ_API_KEY ||
      window.localStorage.getItem('lp-ai-key') ||
      ''
    ).trim()
  } catch {
    return ''
  }
}

function fill(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '—')
}

const PROMPTS = {
  uz: `Sen LifePulse ilovasining AI sog'liq murabbiyisan. Foydalanuvchi bilan o'zbek tilida gaplash.
Foydalanuvchining sog'liq ma'lumotlari:
- Suv: {water} / {waterGoal} ml
- Oxirgi uyqu: {lastSleep} soat, sifat: {sleepQuality}%
- Uyqu yozuvlari soni: {sleepCount}
- Qabul qilinmagan dorilar: {medsPending} ta
- Mashg'ulotlar: {workoutsDone}/{workoutsTotal} bajarildi
- Health Score: {healthScore}
- Streak: {streak} kun
- Maqsad: {goal}
- Kayfiyat: {mood}

Qisqa, samimiy va amaliy javob bering. Berilgan ma'lumotlarga asoslanib shaxsiy maslahat bering; tegishli ma'lumot yo'q bo'lsa, umumiy sog'lom turmush maslahati bering. Javob 2-4 jumladan oshmasin.`,

  en: `You are the AI health coach of the LifePulse app. Talk to the user in English.
User health data:
- Water: {water} / {waterGoal} ml
- Last sleep: {lastSleep} hours, quality: {sleepQuality}%
- Sleep records: {sleepCount}
- Medicines not taken: {medsPending}
- Workouts: {workoutsDone}/{workoutsTotal} done
- Health Score: {healthScore}
- Streak: {streak} days
- Goal: {goal}
- Mood: {mood}

Give short, friendly, practical advice. Personalize using the provided data; if the relevant data is missing, give general healthy-living advice. Keep the answer to 2-4 sentences.`,

  ru: `Ты — ИИ-тренер здоровья приложения LifePulse. Общайся с пользователем на русском языке.
Данные о здоровье пользователя:
- Вода: {water} / {waterGoal} мл
- Последний сон: {lastSleep} часов, качество: {sleepQuality}%
- Записей о сне: {sleepCount}
- Не принято лекарств: {medsPending}
- Тренировки: {workoutsDone}/{workoutsTotal} выполнено
- Health Score: {healthScore}
- Серия: {streak} дней
- Цель: {goal}
- Настроение: {mood}

Давай короткие, дружелюбные и практичные советы. Опирайся на предоставленные данные; если нужных данных нет, дай общий совет по здоровому образу жизни. Ответ — не более 2–4 предложений.`,
}

export function buildSystemPrompt(lang, data) {
  const template = PROMPTS[lang] ?? PROMPTS.uz
  return fill(template, {
    water: data.water ?? '—',
    waterGoal: data.waterGoal ?? '—',
    lastSleep: data.lastSleep ?? '—',
    sleepQuality: data.sleepQuality ?? '—',
    sleepCount: data.sleepCount ?? 0,
    medsPending: data.medsPending ?? 0,
    workoutsDone: data.workoutsDone ?? 0,
    workoutsTotal: data.workoutsTotal ?? 0,
    healthScore: data.healthScore ?? '—',
    streak: data.streak ?? 0,
    goal: data.goal ?? '—',
    mood: data.mood ?? '—',
  })
}

/**
 * @param {Array<{role: 'user'|'assistant', content: string}>} history
 * @param {object} userData
 * @param {string} lang
 */
export async function askCoach(history, userData, lang) {
  const key = getAiKey()
  if (!key) throw new Error('NO_AI_KEY')

  const { data } = await axios.post(
    GROQ_URL,
    {
      model: MODEL,
      messages: [
        { role: 'system', content: buildSystemPrompt(lang, userData) },
        ...history.slice(-8),
      ],
      max_tokens: 300,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      timeout: 25000,
    },
  )

  return data?.choices?.[0]?.message?.content?.trim() || ''
}
