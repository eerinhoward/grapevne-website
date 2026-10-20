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

  useEffect(() => {
    const video = eduRef.current
    if (!video) return undefined
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) video.pause()
    return undefined
  }, [])

  const openForm = () => {
    setFormOpen(true)
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }

  return (
    <Layout title="Universities — Grapevne">
      <section className="page-hero uni-hero">
        <div className="hero-bg" aria-hidden="true">
          <img src="/uni-hero.jpg" alt="" />
        </div>
        <div className="wrap">
          <p className="kicker"><i /> Universities</p>
          <h1 className="display">Free food and campus events, in one feed.</h1>
          <p className="lede">
            Grapevne is the shared feed for leftover food, events, and who’s going. Students find it while it lasts. The university sees what they show up for.
          </p>
        </div>
      </section>

      <section className="section">
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

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split edu-works">
          <div>
            <p className="kicker"><i /> On campus</p>
            <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '10px 0 14px' }}>Getting Started.</h2>
            <div className="story">
              <p>Every account is .edu-verified. Users must verify they are students of their school before gaining access to anything on Grapevne</p>
              <p>Each school gets its own feed. Departments and student groups post leftover food and events. Students see them while they last, and the university sees what people notice and show up for.</p>
            </div>
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
