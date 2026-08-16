import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AppRoutes from './routes/index.jsx'
import { AppProvider } from './context/AppContext.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
