import React, { lazy, Suspense, useEffect, useState, useRef } from 'react'
import Layout from './components/Layout'

const ContactForm = lazy(() => import('./ContactForm'))

const DEMOS = [
  {
    key: 'edu',
    slot: 'edu-demo',
    src: '/grapevne-edu-login-hero.mp4',
    poster: '/grapevne-edu-login-poster.jpg',
    label: 'Signing in with a .edu email, from choosing a school to the verified campus feed',
    lines: [
      'Exclusively for [.Edu]',
      'Each school gets its own feed. Departments and student groups post leftover food and events. Students see them while they last, and the university sees what people notice and show up for.',
    ],
  },
  {
    key: 'safety',
    slot: 'safety-demo',
    src: '/grapevne-food-safety-hero.mp4',
    poster: '/grapevne-food-safety-poster.jpg',
    label: 'Setting how long a food post stays up, then marking it gone when the food runs out',
    lines: [
      'Organizers set when the food is out, and when the post comes down. A post stays up for that window, and no longer than four hours.',
      'If the food runs out first, someone on campus can mark it gone. The post comes down.',
    ],
  },
]

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
  const demoRefs = useRef({})
  const knowRef = useRef(null)
  const [knowIndex, setKnowIndex] = useState(0)
  const [knowIn, setKnowIn] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!motion.matches) return undefined
    Object.values(demoRefs.current).forEach((video) => video?.pause())
    return undefined
  }, [])

  useEffect(() => {
    const section = knowRef.current
    if (!section) return undefined
    let frame = 0
    const headerOffset = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--header')
      const parsed = parseFloat(raw)
      return Number.isFinite(parsed) ? parsed : 64
    }
    const range = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      const start = sectionTop - headerOffset()
      const end = sectionTop + section.offsetHeight - window.innerHeight
      return { start, span: Math.max(end - start, 1) }
    }
    const update = () => {
      const { start, span } = range()
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / span))
      const last = DEMOS.length - 1
      setKnowIndex(Math.round(progress * last))
      const rect = section.getBoundingClientRect()
      setKnowIn(rect.top < window.innerHeight * 0.86 && rect.bottom > window.innerHeight * 0.2)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const scrollKnow = (direction) => {
    const section = knowRef.current
    if (!section) return
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header')) || 64
    const sectionTop = section.getBoundingClientRect().top + window.scrollY
    const start = sectionTop - header
    const end = sectionTop + section.offsetHeight - window.innerHeight
    const last = DEMOS.length - 1
    const next = Math.min(Math.max(knowIndex + direction, 0), last)
    const progress = last === 0 ? 0 : next / last
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    window.scrollTo({ top: start + progress * (end - start), behavior: motion.matches ? 'auto' : 'smooth' })
  }

  const openForm = () => {
    setFormOpen(true)
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }

  return (
    <Layout title="Universities — Grapevne">
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

      <section
        className={`know${knowIn ? ' is-in' : ''}`}
        ref={knowRef}
        style={{ '--know-steps': DEMOS.length - 1 }}
      >
        <div className="know-pin">
          <div className="know-head">
            <h2 className="display">Get to Know Grapevne.</h2>
            <div className="know-nav">
              <button className="know-arrow" type="button" onClick={() => scrollKnow(-1)} disabled={knowIndex === 0} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M4 11 L9 6 L14 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="know-arrow" type="button" onClick={() => scrollKnow(1)} disabled={knowIndex >= DEMOS.length - 1} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M4 7 L9 12 L14 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="know-wheel" aria-roledescription="wheel">
            <p className="sr-only" aria-live="polite">{DEMOS[knowIndex].lines[0]}</p>
            {DEMOS.map((demo, index) => (
              <article
                className={`know-slice${index === knowIndex ? ' is-active' : ''}`}
                key={demo.key}
                style={{ transform: `translate3d(0, ${(index - knowIndex) * 100}%, 0)` }}
                aria-hidden={index !== knowIndex}
              >
                <div className="story">
                  <h2>{demo.lines[0]}</h2>
                  {demo.lines.slice(1).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <div className={`app-demo-slot ${demo.slot}`}>
                  <div className="app-demo">
                    <video
                      ref={(node) => { demoRefs.current[demo.key] = node }}
                      src={demo.src}
                      poster={demo.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={demo.label}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
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
