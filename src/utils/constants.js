import {
  LayoutDashboard,
  Droplets,
  MoonStar,
  Dumbbell,
  Pill,
  Sparkles,
  Siren,
  Trophy,
  User,
  Settings,
  Flame,
  HeartPulse,
  Sprout,
  Footprints,
  PersonStanding,
  Bike,
  Smile,
  Laugh,
  Meh,
  Frown,
  Angry,
} from 'lucide-react'

export const NAV_ITEMS = [
  { labelKey: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard },
  { labelKey: 'nav.water', path: '/water', icon: Droplets },
  { labelKey: 'nav.steps', path: '/steps', icon: Footprints },
  { labelKey: 'nav.sleep', path: '/sleep', icon: MoonStar },
  { labelKey: 'nav.workout', path: '/workout', icon: Dumbbell },
  { labelKey: 'nav.medicine', path: '/medicine', icon: Pill },
  { labelKey: 'nav.coach', path: '/coach', icon: Sparkles },
  { labelKey: 'nav.sos', path: '/sos', icon: Siren },
  { labelKey: 'nav.leaderboard', path: '/leaderboard', icon: Trophy },
  { labelKey: 'nav.profile', path: '/profile', icon: User },
  { labelKey: 'nav.settings', path: '/settings', icon: Settings },
]

export const LEVEL_XP = 500

export const BADGES = [
  { id: 'starter', name: 'Starter', icon: Sprout, xp: 0, descKey: 'prof.badge.starter' },
  { id: 'healthy', name: 'Healthy', icon: HeartPulse, xp: 250, descKey: 'prof.badge.healthy' },
  { id: 'water-king', name: 'Water King', icon: Droplets, xp: 500, descKey: 'prof.badge.waterKing' },
  { id: 'athlete', name: 'Athlete', icon: Dumbbell, xp: 1000, descKey: 'prof.badge.athlete' },
  { id: 'consistent-hero', name: 'Consistent Hero', icon: Flame, xp: 2000, descKey: 'prof.badge.consistentHero' },
]

export const WEEKLY_STATS = [
  { day: 'Du', suv: 1.9, uyqu: 7.2, sport: 45, score: 78 },
  { day: 'Se', suv: 2.3, uyqu: 6.8, sport: 60, score: 84 },
  { day: 'Ch', suv: 1.6, uyqu: 7.5, sport: 30, score: 71 },
  { day: 'Pa', suv: 2.5, uyqu: 8.1, sport: 55, score: 92 },
  { day: 'Ju', suv: 2.1, uyqu: 6.4, sport: 75, score: 80 },
  { day: 'Sh', suv: 1.4, uyqu: 9.0, sport: 20, score: 74 },
  { day: 'Ya', suv: 2.0, uyqu: 7.9, sport: 40, score: 85 },
]

export const CHART_TABS = [
  { key: 'score', label: 'Health', color: '#14b8a6' },
  { key: 'suv', labelKey: 'dash.tabWater', color: '#0ea5e9' },
  { key: 'uyqu', labelKey: 'dash.tabSleep', color: '#8b5cf6' },
  { key: 'sport', label: 'Sport', color: '#f59e0b' },
]

export const MOCK_MEDS = [
  { id: 1, name: 'Vitamin D3', dose: '2000 IU', time: '08:00', taken: true },
  { id: 2, name: 'Omega-3', dose: '1000 mg', time: '12:30', taken: false },
  { id: 3, name: 'Magniy', dose: '400 mg', time: '21:00', taken: false },
]

export const MOCK_WORKOUTS = [
  { id: 1, nameKey: 'wk.morningRun', icon: Footprints, duration: 30, calories: 320, done: true },
  { id: 2, nameKey: 'wk.strength', icon: Dumbbell, duration: 45, calories: 410, done: false },
  { id: 3, nameKey: 'wk.yoga', icon: PersonStanding, duration: 20, calories: 120, done: false },
  { id: 4, nameKey: 'wk.cycling', icon: Bike, duration: 40, calories: 380, done: false },
]

export const MOCK_ACTIVITIES = [
  { id: 1, icon: Droplets, textKey: 'dash.act1', time: '10:24' },
  { id: 2, icon: Footprints, textKey: 'dash.act2', time: '08:10' },
  { id: 3, icon: Pill, textKey: 'dash.act3', time: '08:00' },
  { id: 4, icon: Smile, textKey: 'dash.act4', time: '07:45' },
  { id: 5, icon: MoonStar, textKey: 'dash.act5', timeKey: 'dash.act5Time' },
]

export const MOCK_LEADERBOARD = [
  { id: 1, name: 'Jasur T.', xp: 3240, streak: 21, icon: Flame, you: false },
  { id: 2, name: 'Nilufar A.', xp: 2980, streak: 18, icon: HeartPulse, you: false },
  { id: 3, name: 'Aziz K.', xp: 1240, streak: 12, icon: Dumbbell, you: true },
  { id: 4, name: 'Bekzod M.', xp: 1120, streak: 9, icon: Droplets, you: false },
  { id: 5, name: 'Madina K.', xp: 980, streak: 7, icon: Sprout, you: false },
  { id: 6, name: 'Umid R.', xp: 760, streak: 5, icon: Sprout, you: false },
]

export const CONTACTS = [
  { id: 1, nameKey: 'sos.contact.ambulance', phone: '112', color: '#ef4444' },
  { id: 2, nameKey: 'sos.contact.fire', phone: '101', color: '#f97316' },
  { id: 3, nameKey: 'sos.contact.guard', phone: '102', color: '#3b82f6' },
  { id: 4, nameKey: 'sos.contact.mom', phone: '+998 90 123 45 67', color: '#14b8a6' },
]

export const MOODS = [
  { key: 'great', icon: Laugh, labelKey: 'mood.great' },
  { key: 'good', icon: Smile, labelKey: 'mood.good' },
  { key: 'ok', icon: Meh, labelKey: 'mood.ok' },
  { key: 'bad', icon: Frown, labelKey: 'mood.bad' },
  { key: 'awful', icon: Angry, labelKey: 'mood.awful' },
]

export const SUGGESTIONS = ['coach.sugg1', 'coach.sugg2', 'coach.sugg3', 'coach.sugg4']

export const COACH_REPLIES = ['coach.reply1', 'coach.reply2', 'coach.reply3', 'coach.reply4', 'coach.reply5']
