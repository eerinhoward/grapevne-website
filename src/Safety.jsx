import React, { useEffect, useRef, useState } from 'react'
import Layout from './components/Layout'

const DEMO = {
  curve: 1876,
  src: '/grapevne-food-safety-hero.mp4',
  poster: '/grapevne-food-safety-poster.jpg',
  label: 'Organizers choose how long a food post stays up, up to four hours. The organizer can mark it gone, people can flag a post until it expires, and you can message about any post. Dietary tags help you find what fits but do not guarantee a dish is allergen-free.',
}

function place(el, box, animate, curve) {
  el.style.position = 'fixed'
  el.style.zIndex = '80'
  el.style.margin = '0'
  el.style.left = `${box.left}px`
  el.style.top = `${box.top}px`
  el.style.width = `${box.width}px`
  el.style.height = `${box.height}px`
  el.style.borderRadius = `${box.height * 143 / curve}px`
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

export default function Safety() {
  const frameRef = useRef(null)
  const videoRef = useRef(null)
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
    const el = frameRef.current
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
    place(el, originRef.current, false, DEMO.curve)
    setOpen(true)
    window.requestAnimationFrame(() => {
      place(el, next, !motion, DEMO.curve)
    })
    video.currentTime = 0
    video.muted = false
    video.play().catch(() => {})
  }

  const closeDemo = () => {
    const el = frameRef.current
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
    place(el, origin, true, DEMO.curve)
  }

  return (
    <Layout title="Safety — Grapevne">
      {open && (
        <button className="demo-backdrop" type="button" aria-label="Close the demo" onClick={closeDemo} />
      )}
      <section className="page-hero uni-open">
        <h1 className="display">Food Safety</h1>
      </section>
      <section className="safety-board">
        <div className="story">
          <p>When an organizer posts food, they choose how long it’s up. Posts can’t stay active longer than four hours.</p>
          <p>If the food runs out, the organizer can mark it as gone. You can also flag a post. When enough people flag it, the post expires. You can message about any post in the app.</p>
          <p>Dietary tags help you find what fits. They don’t guarantee a dish is allergen-free, so if you have an allergy, send a message before you go. Grapevne doesn’t make or check the food. <a href="/terms#food-safety">Terms</a></p>
        </div>
        <div className="app-demo-slot safety-demo">
          <div
            className={open ? 'app-demo is-open' : 'app-demo'}
            ref={frameRef}
            role="button"
            tabIndex={0}
            aria-expanded={open}
            aria-label={open ? DEMO.label : `Play: ${DEMO.label}`}
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
              src={DEMO.src}
              poster={DEMO.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}
