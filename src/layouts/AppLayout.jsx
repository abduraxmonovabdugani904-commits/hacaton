import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Confetti from '../features/Confetti'
import BadgeUnlock from '../features/BadgeUnlock'
import { useApp } from '../hooks/useApp'

export default function AppLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, celebrate, setCelebrate } = useApp()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  if (!profile) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Navbar onMenu={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {celebrate > 0 && <Confetti key={celebrate} onDone={() => setCelebrate(0)} />}
      <BadgeUnlock />
    </div>
  )
}
