import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from './components/Layout'
import DownloadLink from './components/DownloadLink'

const SOUND = '/grapevne-phone-sound.mp4'

const PHONES = [
  {
    src: '/never-miss-iphone.png',
    alt: 'The feed: an ice cream cart on the quad, drinks and snacks at the student union, pizza after an econ seminar, and a physics tea',
  },
  {
    src: '/one-swipe-iphone.png',
    alt: 'A post for a lookalike contest with pizza for participants, at the student center, expiring in 36 minutes',
  },
  {
    src: '/see-who-iphone.png',
    alt: 'A map post for a history colloquium reception in the lounge at the campus dining hall',
  },
]

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
      <section className="section impact">
        <div className="wrap">
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0 0 22px' }}>Impact</h2>
          <div className="impact-stats">
            <div>
              <strong>200</strong>
              <span>students on Grapevne at Trinity, Wellesley, MIT, and UChicago</span>
            </div>
            <div>
              <strong>Spring 2026</strong>
              <span>launched campus-wide at Trinity</span>
            </div>
          </div>
          <blockquote className="impact-quote">
            <p>Help us keep food out of the landfill while also feeding hungry students.</p>
            <cite>
              Trinity College Sustainability
              {' · '}
              <a href="https://www.trincoll.edu/sustainability/sample-page-2/campus-operations/food-and-dining/" target="_blank" rel="noopener noreferrer">Food and Dining</a>
            </cite>
          </blockquote>
        </div>
        <div className="phone-strip">
          <div className="phone-track">
            {[0, 1].map((copy) => (
              <div className="phone-set" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>
                {PHONES.map((phone) => (
                  <figure key={phone.src}>
                    <img src={phone.src} alt={copy === 1 ? '' : phone.alt} />
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
