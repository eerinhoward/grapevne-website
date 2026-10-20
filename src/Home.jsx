import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from './components/Layout'
import DownloadLink from './components/DownloadLink'

const APP_SCREENS = [
  { src: '/never-miss-iphone.png', label: 'The feed' },
  { src: '/one-swipe-iphone.png', label: 'One swipe' },
  { src: '/see-who-iphone.png', label: 'Who’s going' },
]

export default function Home() {
  const [screen, setScreen] = useState(0)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return undefined
    const id = window.setInterval(() => {
      setScreen((current) => (current + 1) % APP_SCREENS.length)
    }, 2800)
    return () => window.clearInterval(id)
  }, [])

  return (
    <Layout title="Grapevne — The feed that feeds you">
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <img src="/Photoshoot1.jpg" alt="" />
        </div>
        <div className="hero-visual">
          <div className="app-demo">
            {APP_SCREENS.map((item, index) => (
              <img
                key={item.src}
                src={item.src}
                alt={item.label}
                className={index === screen ? 'on' : undefined}
              />
            ))}
          </div>
          <div className="demo-dots" role="tablist" aria-label="App screens">
            {APP_SCREENS.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={index === screen}
                aria-label={item.label}
                className={index === screen ? 'on' : undefined}
                onClick={() => setScreen(index)}
              />
            ))}
          </div>
          <p className="demo-caption">{APP_SCREENS[screen].label}</p>
        </div>
        <div className="hero-copy">
          <h1>The feed that feeds you.</h1>
          <p>Events, leftover food, and who’s going. On your campus.</p>
          <div className="cta-row">
            <DownloadLink className="btn btn-blue">Download</DownloadLink>
            <Link to="/universities" className="btn btn-ghost">For universities</Link>
          </div>
        </div>
      </section>

      <section className="closing">
        <h2>The feed that feeds you.</h2>
        <div className="cta-row">
          <DownloadLink className="btn btn-blue">Download on the App Store</DownloadLink>
          <Link to="/about" className="btn btn-ghost">About Grapevne</Link>
        </div>
      </section>
    </Layout>
  )
}
