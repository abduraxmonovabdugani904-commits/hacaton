/**
 * Savolni tahlil qilib, foydalanuvchining haqiqiy ma'lumotlari asosida oddiy javob qaytaradi.
 * @param {string} question
 * @param {object} data  — userData (tayyor label'lar bilan)
 * @param {function} t   — tarjima funksiyasi
 */
export function smartReply(question, data, t) {
  const norm = String(question || '').toLowerCase()
  const has = (...words) => words.some((w) => norm.includes(w))

  if (has('salom', 'assalom', 'hayrli tong', 'hello', 'hi ', 'привет', 'здравств', 'добрый')) {
    return t('coach.r.greeting', { name: data.name })
  }
  if (has('rahmat', 'tashakkur', 'thanks', 'thank', 'спасибо', 'благодар')) {
    return t('coach.r.thanks')
  }
  if (has('suv', 'water', 'вода', 'ichimlik', 'hidrat', 'drink water', 'попил')) {
    const goal = data.waterGoal || 2500
    const consumed = data.water || 0
    if (consumed >= goal) return t('coach.r.waterDone', { goal })
    return t('coach.r.waterLeft', { consumed, goal, left: goal - consumed })
  }
  if (has('uyqu', 'sleep', 'сон', 'uxla', 'uxlab', 'спал', 'спать', 'bedtime')) {
    if (!data.lastSleep) return t('coach.r.sleepNone')
    if (data.lastSleep >= 7) {
      return t('coach.r.sleepGood', {
        hours: data.lastSleep,
        quality: data.sleepQuality,
        avg: data.sleepAvg,
      })
    }
    return t('coach.r.sleepLow', {
      hours: data.lastSleep,
      quality: data.sleepQuality,
      avg: data.sleepAvg,
    })
  }
  if (has('dori', 'med', 'лекарств', 'таблет', 'vitamin', 'pill', 'medicine', 'принимал', 'принять', 'preparat')) {
    if (data.medsPending > 0) {
      return t('coach.r.medsPending', { n: data.medsPending, names: data.medsNames.join(', ') })
    }
    if (data.medsTotal > 0) return t('coach.r.medsDone')
    return t('coach.r.medsNone')
  }
  if (has('sport', 'mashg', 'тренир', 'workout', 'yugur', 'бег', 'exercis', 'gym', 'зал', 'velo', 'bike')) {
    const left = data.workoutsTotal - data.workoutsDone
    if (left <= 0) return t('coach.r.workoutDone')
    return t('coach.r.workoutLeft', { done: data.workoutsDone, total: data.workoutsTotal, left })
  }
  if (has('kayfiyat', 'mood', 'настроени', 'hiss', 'чувств', 'feel', 'emotion')) {
    if (!data.moodLabel) return t('coach.r.moodNone')
    const tipKey =
      ['great', 'good'].includes(data.moodKey)
        ? 'coach.r.moodGreat'
        : ['bad', 'awful'].includes(data.moodKey)
          ? 'coach.r.moodBad'
          : 'coach.r.moodOk'
    return t('coach.r.moodSet', { mood: data.moodLabel, tip: t(tipKey) })
  }
  if (has('health', 'score', 'ball', "ko'rsatk", 'показател', 'salomatlik', 'здоров')) {
    if (data.healthScore === null || data.healthScore === undefined) return t('coach.r.scoreNone')
    return t('coach.r.score', {
      score: data.healthScore,
      ws: data.waterScore,
      ss: data.sleepScore,
      ms: data.medicineScore,
      ks: data.workoutScore,
    })
  }
  if (has('streak', 'seria', 'сери', 'zanjir', 'chain')) {
    return t('coach.r.streak', { streak: data.streak })
  }
  if (has('maqsad', 'goal', 'цель', 'vazn', 'weight', 'kilo', 'вес', 'похуд', "og'irlik")) {
    return t('coach.r.goal', { goal: data.goalLabel })
  }
  if (has('yordam', 'help', 'помощ', 'sos', 'favqulodda', 'emergenc')) {
    return t('coach.r.help')
  }
  return t('coach.r.fallback')
}
