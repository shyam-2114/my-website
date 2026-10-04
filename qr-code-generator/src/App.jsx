import { useState, useEffect } from 'react'
import BottomNav from './components/BottomNav'
import QRGeneratorPage from './components/QRGeneratorPage'
import AboutPage from './components/AboutPage'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

export default function App() {
  const [page, setPage] = useState('generator')

  // Keep the browser's back/forward buttons and refreshes in sync with the
  // active page, without needing a routing library.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'about' || hash === 'generator') setPage(hash)

    function handleHashChange() {
      const next = window.location.hash.replace('#', '')
      if (next === 'about' || next === 'generator') setPage(next)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  function navigate(next) {
    setPage(next)
    window.location.hash = next
  }

  return (
    <div className="app-shell">
      <main className="app-content">
        <ErrorBoundary>
          {page === 'generator' ? <QRGeneratorPage /> : <AboutPage />}
        </ErrorBoundary>
      </main>
      <BottomNav page={page} onNavigate={navigate} />
    </div>
  )
}
