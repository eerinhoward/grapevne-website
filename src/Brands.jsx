import React, { useState } from 'react'
import Layout from './components/Layout'
import ContactForm from './ContactForm'

const CARDS = [
  {
    title: 'Short-lived by nature.',
    image: '/iphone image.png',
    alt: 'A Grapevne post on an iPhone',
    fit: 'contain',
    body: [
      'Events. Activations. Surplus product.',
      'Pick the window. Post it. Your brand shows up at the top of the feed.',
      "It fades when it's over.",
    ],
  },
  {
    title: 'Campus-wide reach.',
    image: '/notification.png',
    alt: 'A Grapevne push notification',
    fit: 'contain',
    body: [
      "You don't really know who will care until it's there.",
      "We don't try to guess. Grapevne puts it in front of the campus right away.",
      'One notification. Everyone on campus. No detours.',
    ],
  },
  {
    title: 'Ambassadors.',
    image: '/friends.png',
    alt: 'Students together on campus',
    fit: 'cover',
    body: ['A direct way for ambassadors to share products with their campus.'],
  },
  {
    title: 'Designed for real turnout.',
    image: '/see-who-iphone.png',
    alt: 'Grapevne showing who is going',
    fit: 'contain',
    body: [
      'See response speed and compare outcomes across campuses.',
      "Context helps teams understand what's working.",
    ],
  },
  {
    title: 'Deployed one campus at a time.',
    image: '/university.jpg',
    alt: 'A university campus',
    fit: 'cover',
    body: [
      'Brand activity aligns with institutional access, local norms, and the physical constraints of each university.',
      'One campus. Then the next.',
    ],
  },
]

export default function Brands() {
  const [formOpen, setFormOpen] = useState(false)
  const [playing, setPlaying] = useState(false)

  return (
    <Layout title="Brands — Grapevne">
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker"><i /> Brands</p>
          <h1 className="display"><em>Brands,</em><br />for our college generation.</h1>
          <p className="lede">
            Brands don't live on campus. Grapevne does. Grapevne provides the consistent entry point for on-campus activations.
          </p>
        </div>
      </section>

      <div className="wrap">
        <div className="photo-row">
          {['/pizza food.png', '/gathering.jpg', '/Photoshoot3.jpg', '/friends.png', '/taking.jpg'].map((src) => (
            <img key={src} src={src} alt="" />
          ))}
        </div>
      </div>

      <section className="section">
        <div className="wrap cards">
          {CARDS.map((card) => (
            <article className="card" key={card.title}>
              <div className={card.fit === 'contain' ? 'media-well' : 'media-well cover'}>
                <img src={card.image} alt={card.alt} />
              </div>
              <h3>{card.title}</h3>
              {card.body.map((line) => (
                <p key={line} style={{ marginTop: 8 }}>{line}</p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {playing ? (
              <video src="/demo.mov" controls autoPlay playsInline style={{ width: '100%', display: 'block', background: '#101820' }} />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                style={{
                  width: '100%',
                  minHeight: 320,
                  border: 0,
                  cursor: 'pointer',
                  background: `linear-gradient(180deg, rgba(16,24,32,.25), rgba(16,24,32,.55)), url('/homepage.jpg') center/cover`,
                  color: '#f6f0e6',
                  font: 'inherit',
                  fontWeight: 700,
                  fontSize: '1.4rem',
                }}
              >
                Play the demo
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="closing" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <h2 className="display">The campus wants it. We make sure they hear about it.</h2>
          <button className="btn btn-ink" type="button" onClick={() => setFormOpen((open) => !open)}>
            {formOpen ? 'Close form' : 'Get in touch'}
          </button>
          <div style={{ textAlign: 'left', marginTop: 8 }}>
            <ContactForm isOpen={formOpen} onClose={() => setFormOpen(false)} emailTo="brands@grapevneapp.com" />
          </div>
        </div>
      </section>
    </Layout>
  )
}
