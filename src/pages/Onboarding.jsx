import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { GOAL_OPTIONS, generatePlan } from '../utils/plan'
import { register, login, errMsg } from '../services/api'

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-mute dark:text-slate-400">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-line bg-white px-3.5 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-night-line dark:bg-night"
      />
    </label>
  )
}

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
        active
          ? 'bg-white text-ink shadow-soft dark:bg-night-soft dark:text-slate-100'
          : 'text-mute hover:text-ink dark:hover:text-slate-300'
      }`}
    >
      {children}
    </button>
  )
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { completeOnboarding, setProfile, setPlan, setToken, theme, setTheme, t } = useApp()
  const [mode, setMode] = useState('register')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    surname: '',
    age: '',
    weight: '',
    goal: 'maintain',
  })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })
  const setLogin = (key) => (e) => setLoginForm({ ...loginForm, [key]: e.target.value })

  const submitRegister = async (ev) => {
    ev.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
        surname: form.surname.trim(),
        age: Number(form.age),
        weight: Number(form.weight),
      })
      const profileData = {
        id: res.id,
        username: res.username,
        email: res.email,
        name: form.name.trim(),
        surname: form.surname.trim(),
        age: Number(form.age),
        weight: Number(form.weight),
        goal: form.goal,
      }
      setToken(res.token)
      completeOnboarding(profileData)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(errMsg(err, t('onb.error')))
    } finally {
      setBusy(false)
    }
  }

  const submitLogin = async (ev) => {
    ev.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await login({
        email: loginForm.email.trim(),
        password: loginForm.password,
      })
      const profileData = {
        id: res.id,
        username: res.username,
        email: res.email,
        name: '',
        surname: '',
        age: null,
        weight: null,
        goal: 'maintain',
      }
      setToken(res.token)
      setProfile(profileData)
      setPlan(generatePlan({ weight: 70, goal: 'maintain' }))
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(errMsg(err, t('onb.error')))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas p-5 dark:bg-night">
      {/* Dark mode toggle */}
      <button
        type="button"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white text-mute shadow-soft transition-all hover:text-ink dark:border-night-line dark:bg-night-soft dark:text-slate-300 dark:hover:text-white"
        aria-label={t('onb.darkAria')}
      >
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-5 flex flex-col items-center gap-1.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-lift">
            <Heart size={22} fill="currentColor" />
          </div>
          <p className="text-lg font-bold tracking-tight">{t('common.brand')}</p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-soft dark:border-night-line dark:bg-night-soft">
          <div className="mb-4 flex rounded-xl bg-slate-100 p-1 dark:bg-night-line">
            <Tab active={mode === 'register'} onClick={() => { setMode('register'); setError('') }}>
              {t('onb.registerTitle')}
            </Tab>
            <Tab active={mode === 'login'} onClick={() => { setMode('login'); setError('') }}>
              {t('onb.loginTitle')}
            </Tab>
          </div>

          <h2 className="text-lg font-bold tracking-tight">
            {mode === 'register' ? t('onb.welcome') : t('onb.loginTitle')}
          </h2>
          <p className="mt-1 text-xs text-mute dark:text-slate-400">
            {mode === 'register' ? t('onb.sub') : t('onb.loginSub')}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={submitRegister} className="mt-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3.5">
                <Field
                  label={t('onb.login')}
                  placeholder="login"
                  required
                  minLength={3}
                  value={form.username}
                  onChange={set('username')}
                />
                <Field
                  label={t('onb.email')}
                  type="email"
                  placeholder={t('onb.emailPh')}
                  required
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
              <Field
                label={t('onb.password')}
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={set('password')}
              />
              <div className="grid grid-cols-2 gap-3.5">
                <Field
                  label={t('onb.name')}
                  placeholder={t('onb.namePh')}
                  required
                  value={form.name}
                  onChange={set('name')}
                />
                <Field
                  label={t('onb.surname')}
                  placeholder={t('onb.surnamePh')}
                  required
                  value={form.surname}
                  onChange={set('surname')}
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <Field
                  label={t('onb.age')}
                  type="number"
                  min="10"
                  max="100"
                  placeholder={t('onb.agePh')}
                  required
                  value={form.age}
                  onChange={set('age')}
                />
                <Field
                  label={t('onb.weight')}
                  type="number"
                  min="20"
                  max="300"
                  placeholder={t('onb.weightPh')}
                  required
                  value={form.weight}
                  onChange={set('weight')}
                />
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium text-mute dark:text-slate-400">
                  {t('onb.goal')}
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {GOAL_OPTIONS.map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => setForm({ ...form, goal: g.key })}
                      className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 transition-all ${
                        form.goal === g.key
                          ? 'border-primary bg-primary-mist dark:border-primary/40 dark:bg-primary/10'
                          : 'border-line hover:border-primary/40 dark:border-night-line'
                      }`}
                    >
                      <g.icon
                        size={18}
                        strokeWidth={1.8}
                        className={
                          form.goal === g.key
                            ? 'text-primary-deep dark:text-primary'
                            : 'text-mute'
                        }
                      />
                      <span className="text-center text-[11px] font-semibold leading-tight">
                        {t(g.labelKey)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-primary-deep disabled:opacity-50"
              >
                {t('onb.start')} <ArrowRight size={15} />
              </motion.button>
            </form>
          ) : (
            <form onSubmit={submitLogin} className="mt-5 space-y-3.5">
              <Field
                label={t('onb.email')}
                type="email"
                placeholder={t('onb.emailPh')}
                required
                value={loginForm.email}
                onChange={setLogin('email')}
              />
              <Field
                label={t('onb.password')}
                type="password"
                required
                value={loginForm.password}
                onChange={setLogin('password')}
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-lift transition-colors hover:bg-primary-deep disabled:opacity-50"
              >
                {t('onb.loginBtn')} <ArrowRight size={15} />
              </motion.button>
            </form>
          )}
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-mute dark:text-slate-400">
          <ShieldCheck size={13} />
          {t('onb.local')}
        </p>
      </motion.div>
    </div>
  )
}
