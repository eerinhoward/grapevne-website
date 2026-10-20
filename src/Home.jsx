import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Layout from './components/Layout'
import DownloadLink from './components/DownloadLink'

export default function Home() {
  const videoRef = useRef(null)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const video = videoRef.current
    if (!video || !motion.matches) return undefined
    video.pause()
    return undefined
  }, [])

  return (
    <Layout title="Grapevne — The feed that feeds you">
      <section className="hero">
        <div className="hero-visual">
          <div className="hero-bg" aria-hidden="true">
            <img src="/Photoshoot1.jpg" alt="" />
          </div>
          <div className="app-demo">
            <video
              ref={videoRef}
              src="/grapevne-phone.mp4"
              autoPlay
              muted
              loop
              playsInline
              aria-label="Grapevne app demo"
            />
          </div>
        </div>
        <div className="hero-copy">
          <h1>The feed that feeds you.</h1>
          <div className="blurb">
            <p>Grapevne started in 2025 after a simple observation: there's a lot of free food on campus, and it doesn't get where it needs to go. Information arrives late. Food goes to waste.</p>
            <p>People usually hear about things through each other. Grapevne makes that process faster, beautifully organized, and campus-wide.</p>
            <p>We hope it finds you when you need it, and makes the moment a little better.</p>
          </div>
          <div className="cta-row">
            <DownloadLink className="btn btn-blue">Download</DownloadLink>
            <Link to="/universities" className="btn btn-ghost">For universities</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
