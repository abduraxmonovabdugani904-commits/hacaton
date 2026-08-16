import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Flame } from 'lucide-react'
import { NAV_ITEMS } from '../../utils/constants'
import { useApp } from '../../hooks/useApp'
import { xpToNext } from '../../utils/format'

export default function Sidebar({ open, onClose }) {
  const { xp, streak, level, levelProgress, t } = useApp()

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-white transition-transform duration-300 dark:border-night-line dark:bg-night-soft ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lift">
              <Heart size={18} fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">{t('common.brand')}</p>
              <p className="text-[10px] text-mute dark:text-slate-400">{t('common.tagline')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-mute transition-colors hover:bg-slate-100 dark:hover:bg-night-line lg:hidden"
            aria-label={t('common.closeMenu')}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-soft text-primary-deep dark:bg-primary/15 dark:text-primary'
                    : 'text-mute hover:bg-slate-100 hover:text-ink dark:text-slate-400 dark:hover:bg-night-line dark:hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary"
                    />
                  )}
                  <item.icon size={18} strokeWidth={1.8} />
                  <span>{t(item.labelKey)}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-4 dark:border-night-line">
          <div className="rounded-2xl bg-primary-mist p-4 dark:bg-night-line/50">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-primary-deep dark:text-primary">Lv. {level}</span>
              <span className="flex items-center gap-1 text-mute dark:text-slate-400">
                <Flame size={13} className="text-amber-500" /> {streak} {t('common.days')}
              </span>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white dark:bg-night">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-2 text-[11px] text-mute dark:text-slate-400">
              {t('common.xpToNext', { xp: xpToNext(xp), jami: xp })}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
