import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, Bell, CheckCheck, Droplets, Pill, Dumbbell } from 'lucide-react'
import { useApp } from '../../hooks/useApp'
import useLocalStorage from '../../hooks/useLocalStorage'
import { NAV_ITEMS } from '../../utils/constants'
import { logout } from '../../utils/session'

const NOTIFICATIONS = [
  { id: 1, icon: Droplets, textKey: 'notif.1' },
  { id: 2, icon: Pill, textKey: 'notif.2' },
  { id: 3, icon: Dumbbell, textKey: 'notif.3' },
]

function Dropdown({ open, onClose, children, align = 'right' }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-line bg-white shadow-soft dark:border-night-line dark:bg-night-soft ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Navbar({ onMenu }) {
  const { profile, t, meds, workouts } = useApp()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [readIds, setReadIds] = useLocalStorage('lp-notif-read', [])

  const unreadCount = NOTIFICATIONS.filter((n) => !readIds.includes(n.id)).length
  const markAllRead = () => setReadIds(NOTIFICATIONS.map((n) => n.id))
  const markRead = (id) => setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]))

  const fullName = `${profile.name ?? ''} ${profile.surname ?? ''}`.trim()
  const initials = (fullName || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const items = [
      ...NAV_ITEMS.map((i) => ({
        key: `nav-${i.path}`,
        label: t(i.labelKey),
        to: i.path,
        icon: i.icon,
      })),
      ...meds.map((m) => ({
        key: `med-${m.id}`,
        label: m.name,
        to: '/medicine',
        icon: Pill,
      })),
      ...workouts.map((w) => ({
        key: `wk-${w.id}`,
        label: t(w.nameKey),
        to: '/workout',
        icon: Dumbbell,
      })),
    ]
    return items.filter((i) => i.label.toLowerCase().includes(q)).slice(0, 8)
  }, [query, t, meds, workouts])

  const closeSearch = () => {
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <header className="glass sticky top-0 z-30">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-xl p-2 text-mute transition-colors hover:bg-slate-100 dark:hover:bg-night-line lg:hidden"
          aria-label={t('common.menu')}
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden max-w-md flex-1 sm:block">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute"
          />
          <input
            type="search"
            placeholder={t('common.search')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeSearch()
            }}
            className="w-full rounded-xl border border-line bg-white/70 py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-mute focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-night-line dark:bg-night/60"
          />

          <AnimatePresence>
            {searchOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={closeSearch} />
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full z-40 mt-2 w-full overflow-hidden rounded-2xl border border-line bg-white shadow-soft dark:border-night-line dark:bg-night-soft"
                >
                  {results.length > 0 ? (
                    <ul className="max-h-80 overflow-y-auto p-1.5">
                      {results.map((r) => (
                        <li key={r.key}>
                          <Link
                            to={r.to}
                            onClick={closeSearch}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-night-line"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-deep dark:bg-primary/15 dark:text-primary">
                              <r.icon size={14} strokeWidth={1.8} />
                            </span>
                            <span className="truncate text-ink dark:text-slate-200">
                              {r.label}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-4 text-center text-sm text-mute dark:text-slate-400">
                      {t('common.noResults')}
                    </p>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v)
                setUserOpen(false)
              }}
              className="relative rounded-xl p-2.5 text-mute transition-colors hover:bg-slate-100 hover:text-ink dark:hover:bg-night-line dark:hover:text-slate-100"
              aria-label={t('common.notifications')}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-night-soft" />
              )}
            </button>
            <Dropdown open={notifOpen} onClose={() => setNotifOpen(false)}>
              <div className="flex items-center justify-between border-b border-line px-4 py-3 dark:border-night-line">
                <p className="text-sm font-semibold">{t('common.notifications')}</p>
                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-primary-deep dark:text-primary"
                >
                  <CheckCheck size={13} /> {t('common.markAllRead')}
                </button>
              </div>
              {NOTIFICATIONS.map((n) => {
                const isRead = readIds.includes(n.id)
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markRead(n.id)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-night-line/50 ${
                      isRead ? 'opacity-55' : ''
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-deep dark:bg-primary/15 dark:text-primary">
                      <n.icon size={14} strokeWidth={1.8} />
                    </span>
                    <span className="text-xs leading-relaxed text-ink dark:text-slate-200">
                      {t(n.textKey)}
                    </span>
                    {!isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </Dropdown>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setUserOpen((v) => !v)
                setNotifOpen(false)
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-deep text-xs font-bold text-white shadow-lift"
              aria-label={t('common.profile')}
            >
              {initials}
            </button>
            <Dropdown open={userOpen} onClose={() => setUserOpen(false)}>
              <div className="flex items-center gap-3 border-b border-line px-4 py-3 dark:border-night-line">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-deep text-xs font-bold text-white">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{fullName}</p>
                  <p className="text-xs text-mute dark:text-slate-400">
                    {profile.login ? `@${profile.login}` : profile.email}
                  </p>
                </div>
              </div>
              <div className="p-2">
                {[
                  { to: '/profile', label: t('common.profile') },
                  { to: '/settings', label: t('common.settings') },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setUserOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-mute transition-colors hover:bg-slate-100 hover:text-ink dark:hover:bg-night-line dark:hover:text-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={logout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  {t('common.logout')}
                </button>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  )
}
