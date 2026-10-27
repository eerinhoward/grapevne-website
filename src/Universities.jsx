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
    label: 'Download Grapevne, choose your school, verify a .edu email, and join that school’s private feed',
    lines: ['Exclusively for [.edu]'],
    steps: [
      ['Download the app', 'Get Grapevne for iPhone on the App Store.'],
      ['Select your campus', 'Open the app and choose your school.'],
      ['Verify your email', 'Enter your school .edu address and tap the sign-in link we send. Some schools use their own campus sign-in.'],
      ['Join your feed', 'The feed is private to that school. Anyone on campus can post leftover food, and you see it while it lasts.'],
    ],
  },
]

const FAQS = [
  {
    question: 'Can faculty and staff use Grapevne?',
    answer: 'Yes. Grapevne is open to students, faculty, and staff at the campuses we serve. You\'ll need your school .edu email to sign up, and you must be 18 or older.',
  },
  {
    question: 'Is Grapevne run by my school?',
    answer: 'No. Grapevne is an independent, third-party app. Unless we\'ve announced an official partnership with your school, we aren\'t affiliated with or endorsed by it.',
  },
  {
    question: 'How does Grapevne verify accounts?',
    answer: 'Every account is tied to a school email. You sign up with your .edu address and tap a sign-in link we send to it. Some schools use their own campus sign-in instead. Other users see your username and profile, never your email. Verification confirms you have an email at that school; it doesn\'t confirm your name or whether you\'re a student, faculty, or staff member.',
  },
  {
    question: 'Can other people on Grapevne see who I am?',
    answer: 'Only what you choose to show. Your name, username, profile photo, and bio are all up to you. You don\'t have to use your real name or a photo of yourself. Other users also see your school and your activity on Grapevne, like the posts you share and the ones you\'re going to. Your school email is never shown to other users. It\'s only used to verify your account.',
  },
  {
    question: 'Who moderates Grapevne?',
    answer: 'The Grapevne team. Anyone can report a post or block a user in the app, and every report goes straight to our team for review. We remove content and suspend accounts that break our community rules.',
  },
  {
    question: 'What does Grapevne do with my data?',
    answer: 'We collect what we need to run the app: your school email to verify your account, the profile you create, the posts you share and the ones you\'re going to, and basic device and usage information. Your data is stored on Google Firebase, and we use a small number of service providers for things like maps and analytics. You can delete your account in Edit Profile.',
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

export default function Universities() {
  const [formOpen, setFormOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)
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
      <section className="uni-stage">
        <div className="uni-stage-copy">
          <h1 className="display">Cultivating a <span>zero-waste</span> campus.</h1>
          <p>Grapevne takes that institutional challenge and meets it where students already are, in a feed.</p>
          <button className="btn btn-blue" type="button" onClick={openForm}>Get in touch</button>
        </div>
        <div className="pillar-mosaic" aria-label="What Grapevne does for a campus">
          <a className="pillar" href="#the-gap">
            <img src="/gathering.jpg" alt="" />
            <h2>Extra food. Students still looking.</h2>
            <p>Campus events order for the crowd they hope for. The leftovers usually go in the trash.</p>
            <span>The gap</span>
          </a>
          <a className="pillar" href="#how-it-works">
            <img src="/university.jpg" alt="" />
            <h2>Posted in seconds. Seen in the feed.</h2>
            <p>Organizers post leftover food, and students on that campus see it while it’s still there.</p>
            <span>How it works</span>
          </a>
          <a className="pillar" href="#insights">
            <img src="/hero-bg.jpg" alt="" />
            <h2>What the campus shared.</h2>
            <p>Reporting and data from the feed, so a school can see what was shared.</p>
            <span>Insights</span>
          </a>
        </div>
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

      <section className="know know-one" id="how-it-works">
        <h2 className="display">Get to Know Grapevne.</h2>
        <div className="know-one-row">
          {DEMOS.map((demo) => (
            <article className="know-pair" key={demo.key}>
              <div className="story">
                <h2>{demo.lines[0]}</h2>
                <ul className="steps">
                  {demo.steps.map(([title, text]) => (
                    <li key={title}><strong>{title}:</strong> {text}</li>
                  ))}
                </ul>
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

      <section className="uni-problem" id="the-gap">
        <p>As anyone who runs campus events knows, most of them end with extra food. Club meetings, department talks, and catered receptions all order for the crowd they hope for, not the one that shows up. When the event ends, the leftovers usually go in the trash, while students across campus are looking for their next meal. Grapevne closes that gap. Organizers post leftover food in seconds, and students nearby see it in their feed while it’s still there.</p>
        <p>Grapevne takes that institutional challenge and meets it where students already are, in a feed.</p>
        <p>Grapevne started in 2025 after a simple observation: there's a lot of free food on campus, and it doesn't get where it needs to go. Information arrives late. Food goes to waste.</p>
        <p>People usually hear about things through each other. Grapevne makes that process faster, beautifully organized, and campus-wide.</p>
      </section>

      <section className="uni-problem" id="insights">
        <h2 className="display">Insights</h2>
        <p>Reporting and data from the feed, so a school can see what was shared.</p>
      </section>

      <section className="faq-section" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="display">Frequently Asked</h2>
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
                <ContactForm isOpen={formOpen} onClose={() => setFormOpen(false)} emailTo="universities@grapevneapp.com" variant="campus" />
              </Suspense>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
