import { LEVEL_XP } from './constants'
import { translate } from './i18n'

const LOCALES = { uz: 'uz-UZ', en: 'en-US', ru: 'ru-RU' }

export function greeting(lang = 'uz') {
  const h = new Date().getHours()
  if (h < 5) return translate(lang, 'greet.night')
  if (h < 12) return translate(lang, 'greet.morning')
  if (h < 18) return translate(lang, 'greet.day')
  return translate(lang, 'greet.evening')
}

export function todayLabel(lang = 'uz') {
  return new Intl.DateTimeFormat(LOCALES[lang] ?? 'uz-UZ', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  }).format(new Date())
}

const HOUR_SYM = { uz: 's', en: 'h', ru: 'ч' }
const MIN_SYM = { uz: 'd', en: 'm', ru: 'м' }
const HOUR_WORD = { uz: 'soat', en: 'h', ru: 'ч' }
const MIN_WORD = { uz: 'daq', en: 'min', ru: 'мин' }

export function formatHours(hours, lang = 'uz') {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m} ${MIN_WORD[lang] ?? MIN_WORD.uz}`
  if (m === 0) return `${h} ${HOUR_WORD[lang] ?? HOUR_WORD.uz}`
  return `${h}${HOUR_SYM[lang] ?? HOUR_SYM.uz} ${m}${MIN_SYM[lang] ?? MIN_SYM.uz}`
}

export function pct(value, max) {
  if (!max) return 0
  return Math.min(100, Math.round((value / max) * 100))
}

export function levelFromXp(xp) {
  return Math.floor(xp / LEVEL_XP) + 1
}

export function levelProgress(xp) {
  return (xp % LEVEL_XP) / LEVEL_XP
}

export function xpToNext(xp) {
  return LEVEL_XP - (xp % LEVEL_XP)
}
