import React, { lazy, Suspense, useEffect, useState, useRef } from 'react'
import Layout from './components/Layout'

const ContactForm = lazy(() => import('./ContactForm'))

const DEMOS = [
  {
    key: 'edu',
    slot: 'edu-demo',
    curve: 1878,
    src: '/grapevne-edu-login-hero.mp4',
    poster: '/grapevne-edu-login-poster.jpg',
    label: 'Signing in with a .edu email, from choosing a school to the verified campus feed',
    lines: [
      'Exclusively for [.edu]',
      'Each school gets its own feed. Departments and student groups post leftover food and events. Students see them while they last, and the university sees what people notice and show up for.',
    ],
  },
  {
    key: 'safety',
    slot: 'safety-demo',
    curve: 1876,
    src: '/grapevne-food-safety-hero.mp4',
    poster: '/grapevne-food-safety-poster.jpg',
    label: 'Setting how long a food post stays up, then marking it gone when the food runs out',
    lines: [
      'Food Safety',
      'Organizers set when the food is out, and when the post comes down. A post stays up for that window, and no longer than four hours.',
    ],
  },
]

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

const FAQS = [
  {
    question: 'What do students see?',
    answer: 'A feed for their campus: leftover and free food, events, and who’s going. It is specific to the university, not a public stream.',
  },
  {
    question: 'Who can post?',
    answer: 'Student organizations, campus departments, and other university-connected groups the school approves.',
  },
  {
    question: 'Does this add work for staff?',
    answer: 'No. People post where students already look, instead of maintaining separate emails, chats, and sign-up sheets.',
  },
  {
    question: 'What can a campus measure?',
    answer: 'Which posts students swipe and save, who says they’re going, and which times and events get a response.',
  },
]

export default function Universities() {
  const [openFaq, setOpenFaq] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const formRef = useRef(null)
  const frameRefs = useRef({})
  const videoRefs = useRef({})
  const originRef = useRef(null)
  const [openKey, setOpenKey] = useState(null)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!motion.matches) return undefined
    Object.entries(videoRefs.current).forEach(([key, video]) => {
      if (key !== openKey) video?.pause()
    })
    return undefined
  }, [openKey])

  useEffect(() => {
    if (!openKey) return undefined
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
  }, [openKey])

  const openDemo = (key) => {
    const el = frameRefs.current[key]
    const video = videoRefs.current[key]
    const demo = DEMOS.find((item) => item.key === key)
    if (!el || !video || !demo || openKey) return
    const box = el.getBoundingClientRect()
    originRef.current = { key, box }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const height = Math.min(window.innerHeight * 0.86, 820)
    const width = height * (896 / 1876)
    const next = {
      left: (window.innerWidth - width) / 2,
      top: (window.innerHeight - height) / 2,
      width,
      height,
    }
    place(el, box, false, demo.curve)
    setOpenKey(key)
    window.requestAnimationFrame(() => {
      place(el, next, !motion, demo.curve)
    })
    video.currentTime = 0
    video.muted = false
    video.play().catch(() => {})
  }

  const closeDemo = () => {
    const origin = originRef.current
    if (!origin) return
    const el = frameRefs.current[origin.key]
    const video = videoRefs.current[origin.key]
    const demo = DEMOS.find((item) => item.key === origin.key)
    if (video) video.muted = true
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || !demo || motion) {
      clearPlace(el)
      originRef.current = null
      setOpenKey(null)
      return
    }
    const finish = (event) => {
      if (event && event.propertyName !== 'left') return
      el.removeEventListener('transitionend', finish)
      clearPlace(el)
      originRef.current = null
      setOpenKey(null)
    }
    el.addEventListener('transitionend', finish)
    window.setTimeout(() => finish(), 500)
    place(el, origin.box, true, demo.curve)
  }

  const openForm = () => {
    setFormOpen(true)
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }

  return (
    <Layout title="Universities — Grapevne">
      {openKey && (
        <button className="demo-backdrop" type="button" aria-label="Close the demo" onClick={closeDemo} />
      )}
      <section className="hero uni-hero">
        <div className="hero-copy">
          <h1>Free food and campus events, in one feed.</h1>
        </div>
        <div className="hero-visual">
          <div className="hero-bg" aria-hidden="true">
            <img src="/uni-hero.jpg" alt="" />
          </div>
        </div>
      </section>

      <section className="uni-problem">
        <p>Cultivating a zero-waste campus.</p>
        <p>As anyone who runs campus events knows, most of them end with extra food. Club meetings, department talks, and catered receptions all order for the crowd they hope for, not the one that shows up. When the event ends, the leftovers usually go in the trash, while students across campus are looking for their next meal. Grapevne closes that gap. Organizers post leftover food in seconds, and students nearby see it in their feed while it’s still there.</p>
        <p>Grapevne takes that institutional challenge and meets it where students already are, in a feed.</p>
        <p>Grapevne started in 2025 after a simple observation: there's a lot of free food on campus, and it doesn't get where it needs to go. Information arrives late. Food goes to waste.</p>
        <p>People usually hear about things through each other. Grapevne makes that process faster, beautifully organized, and campus-wide.</p>
      </section>

      <section className="campus-now" aria-label="Trusted By">
        <div className="split">
          <div>
            <p className="trusted">Trusted By</p>
            <img className="campus-logo" src="/trinitylogo.svg" alt="Trinity College" />
            <p>Launched campus-wide in Spring 2026 with the Sustainability Department.</p>
          </div>
          <div className="campus-stage">
            <a className="browser" href="https://www.trincoll.edu/sustainability/sample-page-2/campus-operations/food-and-dining/" target="_blank" rel="noopener noreferrer">
              <div className="browser-bar">
                <span className="traffic" aria-hidden="true"><i /><i /><i /></span>
                <span className="browser-url">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <rect x="2.2" y="5.2" width="7.6" height="5.2" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M3.8 5.2V3.6a2.2 2.2 0 0 1 4.4 0V5.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  <span>trincoll.edu/sustainability/…/food-and-dining</span>
                </span>
                <span aria-hidden="true" />
              </div>
              <span className="browser-view">
                <img
                  src="/trinity-free-food.jpg"
                  alt="Trinity College’s Food and Dining page, with the Free Food section open. Opens the live page."
                />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="know">
        <h2 className="display">Get to Know Grapevne.</h2>
        <div className="know-grid">
          {DEMOS.map((demo, index) => (
            <article className={`know-cell ${index === 0 ? 'is-left' : 'is-right'}`} key={demo.key}>
              <div className="story">
                <h2>{demo.lines[0]}</h2>
                {demo.lines.slice(1).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className={`app-demo-slot ${demo.slot}`}>
                <div
                  className={openKey === demo.key ? 'app-demo is-open' : 'app-demo'}
                  ref={(node) => { frameRefs.current[demo.key] = node }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={openKey === demo.key}
                  aria-label={openKey === demo.key ? demo.label : `Play: ${demo.label}`}
                  onClick={openKey ? undefined : () => openDemo(demo.key)}
                  onKeyDown={(event) => {
                    if (openKey) return
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openDemo(demo.key)
                    }
                  }}
                >
                  <video
                    ref={(node) => { videoRefs.current[demo.key] = node }}
                    src={demo.src}
                    poster={demo.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <h2 className="display">Frequently Asked</h2>
        <div className="faq">
          {FAQS.map((faq, index) => {
            const open = openFaq === index
            return (
              <div key={faq.question}>
                <button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)}>
                  <span>{faq.question}</span>
                  <span aria-hidden="true">{open ? '–' : '+'}</span>
                </button>
                {open && <p className="answer">{faq.answer}</p>}
              </div>
            )
          })}
        </div>
      </section>

      <section className="closing" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <h2 className="display">Bring Grapevne to your (s)quad</h2>
          <p className="lede" style={{ margin: '0 auto 20px' }}>
            Tell us about your school. We’ll show you how the feed works.
          </p>
          <button className="btn btn-blue" type="button" onClick={openForm}>Get in touch</button>
          <div ref={formRef} style={{ scrollMarginTop: 96, textAlign: 'left', marginTop: 8 }}>
            {formOpen && (
              <Suspense fallback={null}>
                <ContactForm isOpen={formOpen} onClose={() => setFormOpen(false)} emailTo="universities@grapevneapp.com" />
              </Suspense>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
