import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from './components/Layout'
import DownloadLink from './components/DownloadLink'

const SOUND = '/grapevne-phone-sound.mp4'

function place(el, box, animate) {
  el.style.position = 'fixed'
  el.style.zIndex = '80'
  el.style.margin = '0'
  el.style.left = `${box.left}px`
  el.style.top = `${box.top}px`
  el.style.width = `${box.width}px`
  el.style.height = `${box.height}px`
  el.style.borderRadius = `${box.height * 143 / 1876}px`
  el.style.transition = animate
    ? 'left 0.45s ease, top 0.45s ease, width 0.45s ease, height 0.45s ease, border-radius 0.45s ease'
    : 'none'
}

function clearPlace(el) {
  if (!el) return
  el.style.position = ''
  el.style.zIndex = ''
  el.style.margin = ''
  el.style.left = ''
  el.style.top = ''
  el.style.width = ''
  el.style.height = ''
  el.style.borderRadius = ''
  el.style.transition = ''
}

export default function Home() {
  const videoRef = useRef(null)
  const demoRef = useRef(null)
  const originRef = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const video = videoRef.current
    if (!video || !motion.matches || open) return undefined
    video.pause()
    return undefined
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') closeDemo()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const openDemo = () => {
    const el = demoRef.current
    const video = videoRef.current
    if (!el || !video || open) return
    originRef.current = el.getBoundingClientRect()
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const height = Math.min(window.innerHeight * 0.86, 820)
    const width = height * (896 / 1876)
    const next = {
      left: (window.innerWidth - width) / 2,
      top: (window.innerHeight - height) / 2,
      width,
      height,
    }
    place(el, originRef.current, false)
    setOpen(true)
    window.requestAnimationFrame(() => {
      place(el, next, !motion)
    })
    const start = () => {
      video.currentTime = 0
      video.muted = false
      video.play().catch(() => {})
    }
    if (video.dataset.sound === '1') {
      start()
      return
    }
    video.dataset.sound = '1'
    video.src = SOUND
    video.load()
    video.addEventListener('loadeddata', start, { once: true })
  }

  const closeDemo = () => {
    const el = demoRef.current
    const video = videoRef.current
    const origin = originRef.current
    if (video) video.muted = true
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || !origin || motion) {
      clearPlace(el)
      setOpen(false)
      return
    }
    const finish = (event) => {
      if (event && event.propertyName !== 'left') return
      el.removeEventListener('transitionend', finish)
      clearPlace(el)
      setOpen(false)
    }
    el.addEventListener('transitionend', finish)
    window.setTimeout(() => finish(), 500)
    place(el, origin, true)
  }

  return (
    <Layout title="Grapevne — The feed that feeds you">
      {open && (
        <button className="demo-backdrop" type="button" aria-label="Close the demo" onClick={closeDemo} />
      )}
      <section className="hero">
        <div className="hero-visual">
          <div className="hero-bg" aria-hidden="true">
            <img src="/hero-bg.jpg" alt="" decoding="async" />
          </div>
          <div className="app-demo-slot">
            <div
              className={open ? 'app-demo is-open' : 'app-demo'}
              ref={demoRef}
              role="button"
              tabIndex={0}
              aria-expanded={open}
              aria-label={open ? 'Grapevne app demo' : 'Play the Grapevne demo'}
              onClick={open ? undefined : openDemo}
              onKeyDown={(event) => {
                if (open) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openDemo()
                }
              }}
            >
              <video
                ref={videoRef}
                src="/grapevne-phone-hero.mp4"
                poster="/grapevne-phone-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
          </div>
        </div>
        <div className="hero-copy">
          <h1>The feed that feeds you.</h1>
          <p className="hook">Grapevne is building the default way campuses share leftover food.</p>
          <div className="blurb">
            <p>Grapevne started in 2025 after a simple observation: there's a lot of free food on campus, and it doesn't get where it needs to go. Information arrives late. Food goes to waste.</p>
            <p>People usually hear about things through each other. Grapevne makes that process faster, beautifully organized, and campus-wide.</p>
            <p>We hope it finds you when you need it, and makes the moment a little better.</p>
          </div>
          <div className="cta-row">
            <DownloadLink className="btn btn-blue">Download</DownloadLink>
            <Link to="/universities" className="btn btn-ghost">Learn More</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
