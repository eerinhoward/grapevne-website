import React, { lazy, Suspense, useEffect, useState, useRef } from 'react'
import Layout from './components/Layout'

const ContactForm = lazy(() => import('./ContactForm'))

const BENEFITS = [
  {
    title: 'Food gets there in time',
    body: 'Students see leftover and free food while it lasts, so more of it gets claimed and less of it goes to waste.',
  },
  {
    title: 'One place to post',
    body: 'Departments and student groups post once. The same news no longer has to chase email threads, group chats, and last-minute signs.',
  },
  {
    title: 'A clear read on interest',
    body: 'Swipes, saves, and who’s going show which events and drops students actually care about, and when.',
  },
]

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
  const eduRef = useRef(null)
  const safetyRef = useRef(null)
  const knowRef = useRef(null)
  const [knowIndex, setKnowIndex] = useState(0)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!motion.matches) return undefined
    eduRef.current?.pause()
    safetyRef.current?.pause()
    return undefined
  }, [])

  useEffect(() => {
    const el = knowRef.current
    if (!el) return undefined
    const step = () => {
      const slides = el.querySelectorAll('.know-slide')
      if (slides.length > 1) return slides[1].offsetLeft - slides[0].offsetLeft
      const slide = slides[0]
      return slide ? slide.getBoundingClientRect().width : el.clientWidth
    }
    const update = () => {
      const size = step()
      const index = size > 0 ? Math.round(el.scrollLeft / size) : 0
      setKnowIndex(index)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scrollKnow = (direction) => {
    const el = knowRef.current
    if (!el) return
    const slides = el.querySelectorAll('.know-slide')
    const step = slides.length > 1
      ? slides[1].offsetLeft - slides[0].offsetLeft
      : (slides[0]?.getBoundingClientRect().width || el.clientWidth)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    el.scrollBy({ left: direction * step, behavior: motion.matches ? 'auto' : 'smooth' })
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
          <div className="blurb">
            <p>As anyone who runs campus events knows, most of them end with extra food. Club meetings, department talks, and catered receptions all order for the crowd they hope for, not the one that shows up. When the event ends, the leftovers usually go in the trash, while students across campus are looking for their next meal. Grapevne closes that gap. Organizers post leftover food in seconds, and students nearby see it in their feed while it’s still there.</p>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-bg" aria-hidden="true">
            <img src="/uni-hero.jpg" alt="" />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 18 }}>What you get</h2>
          <div className="cards cards-3">
            {BENEFITS.map((benefit) => (
              <article className="card" key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <div>
            <p className="kicker"><i /> Why Grapevne</p>
            <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', margin: '10px 0 14px' }}>
              Students already hear about campus through each other.
            </h2>
            <p className="lede">
              Grapevne makes that faster, organized, and specific to your school. Each campus gets its own feed. Students get something immediate. Staff get a read on what earns attention, without another system to run.
            </p>
          </div>
          <img src="/phones.png" alt="Grapevne on two phones" />
        </div>
      </section>

      <section className="section know" style={{ paddingTop: 0 }}>
        <div className="wrap know-head">
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: 0 }}>Get to know Grapevne</h2>
          <div className="know-nav">
            <button className="know-arrow" type="button" onClick={() => scrollKnow(-1)} disabled={knowIndex === 0} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M11 4 L6 9 L11 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="know-arrow" type="button" onClick={() => scrollKnow(1)} disabled={knowIndex >= 1} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M7 4 L12 9 L7 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="know-scroll" ref={knowRef} tabIndex={0} aria-label="Get to know Grapevne">
          <article className="know-slide">
            <div className="story">
              <p>Every account is .edu-verified. Users must verify they are students of their school before gaining access to anything on Grapevne</p>
              <p>Each school gets its own feed. Departments and student groups post leftover food and events. Students see them while they last, and the university sees what people notice and show up for.</p>
            </div>
            <div className="app-demo-slot edu-demo">
              <div className="app-demo">
                <video
                  ref={eduRef}
                  src="/grapevne-edu-login-hero.mp4"
                  poster="/grapevne-edu-login-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Signing in with a .edu email, from choosing a school to the verified campus feed"
                />
              </div>
            </div>
          </article>
          <article className="know-slide">
            <div className="story">
              <p>Organizers set when the food is out, and when the post comes down. A post stays up for that window, and no longer than four hours.</p>
              <p>If the food runs out first, someone on campus can mark it gone. The post comes down.</p>
            </div>
            <div className="app-demo-slot safety-demo">
              <div className="app-demo">
                <video
                  ref={safetyRef}
                  src="/grapevne-food-safety-hero.mp4"
                  poster="/grapevne-food-safety-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Setting how long a food post stays up, then marking it gone when the food runs out"
                />
              </div>
            </div>
          </article>
        </div>
        <div className="know-dots" aria-hidden="true">
          <i className={knowIndex === 0 ? 'is-on' : undefined} />
          <i className={knowIndex >= 1 ? 'is-on' : undefined} />
        </div>
      </section>

      <section className="section impact" style={{ paddingTop: 0 }}>
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
        <div className="campus-now">
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

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0 0 14px' }}>Pilot</h2>
          <div className="story">
            <p>A new campus starts as a pilot: one school, for a term. Long enough to see whether leftover food gets claimed and whether students use the feed.</p>
            <p>After the term, we talk about staying, and what it costs.</p>
          </div>
          <button className="btn btn-blue" type="button" onClick={openForm}>Talk about a pilot</button>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 8 }}>Questions</h2>
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
        </div>
      </section>

      <section className="closing" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <h2 className="display">Bring Grapevne to your campus.</h2>
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
