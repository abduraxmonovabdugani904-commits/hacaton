const LOCALES = { uz: 'uz-UZ', en: 'en-US', ru: 'ru-RU' }

/**
 * Oxirgi 7 kun uchun uyqu soatlarini [ { day, uyqu }, ... ] qilib qaytaradi.
 * @param {Array<{ date: string, hours: number }>} logs
 * @param {string} lang
 */
export function buildWeeklySleep(logs, lang = 'uz') {
  const byDate = {}
  for (const l of logs) byDate[l.date] = l.hours

  const days = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({
      day: new Intl.DateTimeFormat(LOCALES[lang] ?? 'uz-UZ', { weekday: 'short' })
        .format(d)
        .slice(0, 2),
      uyqu: byDate[key] ?? 0,
    })
  }
  return days
}

export function avgHours(logs) {
  if (!logs.length) return 0
  return logs.reduce((s, l) => s + l.hours, 0) / logs.length
}

/**
 * Oxirgi 7 kun uchun qadamlar sonini [ { day, qadam }, ... ] qilib qaytaradi.
 * @param {Array<{ date: string, count: number }>} logs
 * @param {string} lang
 */
export function buildWeeklySteps(logs, lang = 'uz') {
  const byDate = {}
  for (const l of logs) byDate[l.date] = l.count

  const days = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({
      day: new Intl.DateTimeFormat(LOCALES[lang] ?? 'uz-UZ', { weekday: 'short' })
        .format(d)
        .slice(0, 2),
      qadam: byDate[key] ?? 0,
    })
  }
  return days
}

export function avgQuality(logs) {
  if (!logs.length) return 0
  return Math.round(logs.reduce((s, l) => s + (parseQuality(l.quality) ?? 0), 0) / logs.length)
}

/** ISO timestamp'dan mahalliy sana kalitini qaytaradi: 'YYYY-MM-DD' */
export function localDateKey(date) {
  const d = new Date(date)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/** Serverdagi quality qiymatini foizga aylantiradi (raqam yoki so'z bo'lishi mumkin) */
export function parseQuality(q) {
  if (q === null || q === undefined || q === '') return 80
  const n = Number(q)
  if (Number.isFinite(n) && String(q).trim() !== '') return Math.max(0, Math.min(100, n))
  const map = { great: 90, good: 80, normal: 60, bad: 40, awful: 20 }
  return map[String(q).toLowerCase()] ?? 80
}
