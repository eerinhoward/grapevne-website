import React, { lazy, Suspense, useState, useRef } from 'react'
import Layout from './components/Layout'

const ContactForm = lazy(() => import('./ContactForm'))

const PARTNER = {
  name: 'Trinity College',
  image: '/trinitylogo.svg',
  description: `At Trinity College, Grapevne is being implemented in partnership with the Sustainability Department to make student response more visible in one place.

Instead of relying on ad-hoc emails, word of mouth, or last-minute signage, Grapevne gives campuses a clearer way to understand what students notice, engage with, and show up for.

The app is launching campus-wide in Spring 2026 as part of Trinity's broader sustainability efforts.`,
}

const PILLARS = [
  {
    title: 'Data-Driven Decision Making',
    body: 'Real-time engagement data provides measurable insight into waste reduction and surplus distribution.',
  },
  {
    title: 'Financial Optimization',
    body: 'Campus analytics reveal how efficiently surplus food reaches students and support more effective resource allocation.',
  },
  {
    title: 'Innovation',
    body: 'Digitizing surplus-to-demand systems enables campuses to test and advance zero-waste and carbon reduction strategies.',
  },
  {
    title: 'Student Experience',
    body: 'Accessible, human-centered solutions powered by technology reduce barriers to food access and support more sustainable behavior on campus.',
  },
]

const PHOTOS = [
  '/universitiesimage.jpg',
  '/universitiesimage2.jpg',
  '/Photozhoot3.png',
  '/universitiesimage5.jpg',
  '/universitiesimage4.jpg',
]

const FAQS = [
  {
    question: 'What does Grapevne actually track?',
    answer: 'Grapevne can surface interaction signals like swipes, saves, engagement patterns, timing windows, and which posts generate attention. The point is to make student response more legible instead of leaving activity scattered across disconnected systems.',
  },
  {
    question: 'Can campuses learn which events students care about?',
    answer: 'Yes. When students interact with posts in one place, campuses can better understand what gets traction, what time windows perform best, and which kinds of events or drops generate the most response.',
  },
  {
    question: 'Who posts on Grapevne?',
    answer: 'Posts can come from student organizations, campus departments, approved affiliates, or other university-connected groups. Grapevne makes that activity easier to distribute and easier to understand.',
  },
  {
    question: 'Does this create more work for staff?',
    answer: 'The goal is the opposite. Grapevne is meant to reduce friction by making distribution and student response easier to see, without relying on scattered email threads, group chats, or manual tracking.',
  },
  {
    question: 'Is it specific to each campus?',
    answer: 'Yes. Grapevne is designed to feel local to the university using it. Students are not entering a generic public feed. They are interacting inside a campus-specific environment.',
  },
]

export default function Universities() {
  const [openFaq, setOpenFaq] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [partnerOpen, setPartnerOpen] = useState(false)
  const formRef = useRef(null)

  const openForm = () => {
    setFormOpen(true)
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }

  return (
    <Layout title="Universities — Grapevne">
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker"><i /> Universities</p>
          <h1 className="display">Built for <em>universities.</em><br />Designed for students.</h1>
          <p className="lede">A shared feed for events, leftover and free food, on campus.</p>
        </div>
      </section>

      <div className="wrap">
        <div className="photo-row">
          {PHOTOS.map((src) => (
            <img key={src} src={src} alt="" />
          ))}
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <article className="card partner">
            <img className="logo" src={PARTNER.image} alt={PARTNER.name} />
            <div>
              <p className="kicker"><i /> Partner campus</p>
              <h2 className="display" style={{ fontSize: '2.4rem', margin: '8px 0 10px' }}>{PARTNER.name}</h2>
              <p className="lede">Launching campus-wide in Spring 2026 with the Sustainability Department.</p>
              <button className="btn btn-ghost-ink" type="button" style={{ marginTop: 16 }} onClick={() => setPartnerOpen((open) => !open)} aria-expanded={partnerOpen}>
                {partnerOpen ? 'Hide details' : 'Read the partnership'}
              </button>
              {partnerOpen && (
                <div style={{ marginTop: 16, whiteSpace: 'pre-line', lineHeight: 1.6 }}>{PARTNER.description}</div>
              )}
            </div>
          </article>

          <div className="cards" style={{ marginTop: 16 }}>
            {PILLARS.map((pillar) => (
              <article className="card" key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <div>
            <p className="kicker"><i /> Visibility</p>
            <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', margin: '10px 0 14px' }}>Make student engagement measurable.</h2>
            <p className="lede">Centralizing interaction enables campuses to better analyze student engagement, identify what gains traction, and measure how interest translates into attendance.</p>
            <p className="lede" style={{ marginTop: 14, fontStyle: 'italic' }}>That includes signals around what students swipe on, save, revisit, and ultimately show up for.</p>
          </div>
          <img src="/snake.jpg" alt="Students together on campus" />
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap split">
          <img src="/phones.png" alt="Grapevne on two phones" />
          <div>
            <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', margin: '0 0 14px' }}>
              Useful for students.<br />Useful for campuses.
            </h2>
            <p className="lede">Immediate on the surface. Measurable underneath.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="display" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.6rem)', marginBottom: 8 }}>Frequently asked questions.</h2>
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
          <h2 className="display">Want to bring Grapevne to your campus?</h2>
          <p className="lede" style={{ margin: '0 auto 20px' }}>
            A better student-facing system on the surface. A clearer dataset underneath.
          </p>
          <button className="btn btn-ink" type="button" onClick={openForm}>Get in touch</button>
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
