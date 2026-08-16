import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, AlertTriangle, Siren, Plus, UserPlus } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import SectionHeader from '../components/ui/SectionHeader'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import QREmergencyCard from '../features/QREmergencyCard'
import { CONTACTS } from '../utils/constants'
import { useApp } from '../hooks/useApp'
import { getSosContacts, addSosContact, sendSos } from '../services/api'

const FALLBACK_COLORS = ['#ef4444', '#f97316', '#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b']

export default function SOS() {
  const { t } = useApp()
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState(() =>
    CONTACTS.map((c) => ({ id: c.id, name: t(c.nameKey), phone: c.phone, color: c.color })),
  )
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [sentMsg, setSentMsg] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    let active = true
    getSosContacts()
      .then((list) => {
        if (!active) return
        setContacts(
          list.map((c, i) => ({
            id: c.id,
            name: c.contactName,
            phone: c.contactPhone,
            color: FALLBACK_COLORS[i % FALLBACK_COLORS.length],
          })),
        )
      })
      .catch(() => {
        /* server yo'q bo'lsa, mahalliy kontaktlar qoladi */
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const doSend = async () => {
    setConfirmOpen(false)
    setSending(true)
    setSentMsg('')
    try {
      const res = await sendSos()
      setSentMsg(res?.contacts ? t('sos.sent', { n: res.contacts.length }) : res?.message || '')
    } catch {
      setSentMsg(t('onb.error'))
    } finally {
      setSending(false)
      setTimeout(() => setSentMsg(''), 5000)
    }
  }

  const doAdd = async () => {
    const n = name.trim()
    const p = phone.trim()
    if (!n || !p) return
    try {
      const res = await addSosContact({ contactName: n, contactPhone: p })
      setContacts((prev) => [
        ...prev,
        { id: res.id, name: res.contactName, phone: res.contactPhone, color: FALLBACK_COLORS[prev.length % FALLBACK_COLORS.length] },
      ])
      setName('')
      setPhone('')
      setShowAdd(false)
    } catch {
      setSentMsg(t('onb.error'))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" className="w-full" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="SOS"
        subtitle={t('sos.sub')}
      />

      <Card className="flex flex-col items-center gap-6 py-10">
        <div className="relative">
          <span className="animate-pulse-ring absolute inset-0 rounded-full bg-red-500/40" />
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            disabled={sending}
            onClick={() => setConfirmOpen(true)}
            className="relative flex h-36 w-36 flex-col items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_20px_60px_-15px_rgba(239,68,68,0.6)] disabled:opacity-60"
          >
            <Siren size={32} />
            <span className="text-base font-bold tracking-wide">SOS</span>
          </motion.button>
        </div>
        <p className="max-w-sm text-center text-sm text-mute dark:text-slate-400">
          {t('sos.text')}
        </p>
      </Card>

      <AnimatePresence>
        {(sentMsg || sending) && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-500/30 dark:bg-red-500/10"
          >
            <AlertTriangle size={20} className="shrink-0 text-red-500" />
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
              {sending ? t('common.loading') : sentMsg}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeader
            title={t('sos.contacts')}
            subtitle={t('sos.contactsSub')}
            right={
              <Button size="sm" variant="secondary" onClick={() => setShowAdd((v) => !v)}>
                <UserPlus size={14} /> {t('sos.addContact')}
              </Button>
            }
          />
          {showAdd && (
            <div className="mb-4 space-y-3 rounded-xl border border-line p-3.5 dark:border-night-line">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('sos.contactNamePh')}
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('sos.contactPhonePh')}
                className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-primary dark:border-night-line dark:bg-night"
              />
              <Button size="sm" className="w-full" onClick={doAdd}>
                <Plus size={14} /> {t('sos.addContact')}
              </Button>
            </div>
          )}
          {contacts.length === 0 ? (
            <p className="py-6 text-center text-sm text-mute dark:text-slate-400">
              {t('sos.emptyContacts')}
            </p>
          ) : (
            <div className="space-y-2.5">
              {contacts.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 dark:border-night-line"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                    style={{ background: c.color }}
                  >
                    <Phone size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-mute dark:text-slate-400">{c.phone}</p>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-primary/50 dark:border-night-line dark:bg-night-soft dark:text-slate-100"
                  >
                    {t('common.call')}
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionHeader title={t('sos.qr')} subtitle={t('sos.qrSub')} />
          <QREmergencyCard />
        </Card>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t('sos.emergencyCall')}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
            <Siren size={26} className="text-red-500" />
          </div>
          <p className="text-sm leading-relaxed text-mute dark:text-slate-400">
            {t('sos.confirmSend')}
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="danger" className="flex-1" onClick={doSend}>
              <Siren size={15} /> SOS
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => setConfirmOpen(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
