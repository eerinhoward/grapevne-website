import React, { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Home from './Home'
import Press from './Press'
import Brands from './Brands'
import Terms from './Terms'
import Privacy from './Privacy'
import About from './About'

const Universities = lazy(() => import('./Universities'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Analytics />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/press" element={<Press />} />
        <Route path="/about" element={<About />} />
        <Route path="/brands" element={<Brands />} />
        <Route
          path="/universities"
          element={
            <Suspense fallback={<div className="section wrap">Loading…</div>}>
              <Universities />
            </Suspense>
          }
        />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/ambassadors" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
