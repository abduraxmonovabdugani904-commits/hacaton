import { motion } from 'framer-motion'
import {
  Moon,
  Bell,
  Languages,
  ShieldCheck,
  Download,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import { useApp } from '../hooks/useApp'
import { logout } from '../utils/session'

function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
        on ? 'bg-primary' : 'bg-slate-300 dark:bg-night-line'
      }`}
      aria-label="Tugma"
    >
      <motion.span
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
        animate={{ left: on ? 26 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}

function SettingRow({ icon, title, desc, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4 px-5 py-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-mist text-primary-deep dark:bg-primary/15 dark:text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-mute dark:text-slate-400">{desc}</p>
      </div>
      {children}
    </motion.div>
  )
}

export default function Settings() {
  const {
    theme,
    setTheme,
    notifications,
    setNotifications,
    language,
    setLanguage,
    privacy,
    setPrivacy,
    profile,
    t,
  } = useApp()

  const exportData = () => {
    const data = {
      user: `${profile.name} ${profile.surname}`.trim(),
      exportedAt: new Date().toISOString(),
      stats: { xp: 1240, streak: 12 },
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'lifepulse-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <SectionHeader title={t('set.title')} subtitle={t('set.sub')} />

      <Card hover={false} className="divide-y divide-line p-0 dark:divide-night-line">
        <SettingRow
          icon={<Moon size={18} />}
          title="Dark Mode"
          desc={t('set.darkDesc')}
          delay={0.05}
        >
          <Toggle on={theme === 'dark'} onChange={(v) => setTheme(v ? 'dark' : 'light')} />
        </SettingRow>

        <SettingRow
          icon={<Bell size={18} />}
          title={t('common.notifications')}
          desc={t('set.notifDesc')}
          delay={0.1}
        >
          <Toggle on={notifications} onChange={setNotifications} />
        </SettingRow>

        <SettingRow
          icon={<Languages size={18} />}
          title={t('set.lang')}
          desc={t('set.langDesc')}
          delay={0.15}
        >
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night"
          >
            <option value="uz">{t('set.langUz')}</option>
            <option value="en">{t('set.langEn')}</option>
            <option value="ru">{t('set.langRu')}</option>
          </select>
        </SettingRow>

        <SettingRow
          icon={<ShieldCheck size={18} />}
          title={t('set.privacy')}
          desc={t('set.privacyDesc')}
          delay={0.2}
        >
          <Toggle on={privacy} onChange={setPrivacy} />
        </SettingRow>
      </Card>

      <Card hover={false} className="divide-y divide-line p-0 dark:divide-night-line">
        <SettingRow
          icon={<Download size={18} />}
          title={t('set.exportData')}
          desc={t('set.exportDesc')}
          delay={0.25}
        >
          <Button size="sm" variant="secondary" onClick={exportData}>
            {t('set.export')}
          </Button>
        </SettingRow>

        <SettingRow
          icon={<LogOut size={18} />}
          title={t('common.logout')}
          desc={t('set.logoutDesc')}
          delay={0.3}
        >
          <Button size="sm" variant="danger" onClick={logout}>
            {t('common.logout')} <ChevronRight size={14} />
          </Button>
        </SettingRow>
      </Card>

      <p className="text-center text-xs text-mute dark:text-slate-500">
        {t('set.version')}
      </p>
    </div>
  )
}
