import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import { useApp } from '../hooks/useApp'

const Onboarding = lazy(() => import('../pages/Onboarding'))
const Dashboard = lazy(() => import('../pages/Dashboard'))
const WaterTracker = lazy(() => import('../pages/WaterTracker'))
const StepsTracker = lazy(() => import('../pages/StepsTracker'))
const SleepTracker = lazy(() => import('../pages/SleepTracker'))
const Workout = lazy(() => import('../pages/Workout'))
const Medicine = lazy(() => import('../pages/Medicine'))
const Coach = lazy(() => import('../pages/Coach'))
const SOS = lazy(() => import('../pages/SOS'))
const Leaderboard = lazy(() => import('../pages/Leaderboard'))
const Profile = lazy(() => import('../pages/Profile'))
const Settings = lazy(() => import('../pages/Settings'))

function PageFallback() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton variant="line" />
      <LoadingSkeleton variant="chart" />
    </div>
  )
}

export default function AppRoutes() {
  const { profile } = useApp()

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route
          path="/login"
          element={
            profile ? <Navigate to="/dashboard" replace /> : <Onboarding />
          }
        />
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<Navigate to={profile ? '/dashboard' : '/login'} replace />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/water" element={<WaterTracker />} />
          <Route path="/steps" element={<StepsTracker />} />
          <Route path="/sleep" element={<SleepTracker />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/medicine" element={<Medicine />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route
          path="*"
          element={<Navigate to={profile ? '/dashboard' : '/login'} replace />}
        />
        </Route>
      </Routes>
    </Suspense>
  )
}
