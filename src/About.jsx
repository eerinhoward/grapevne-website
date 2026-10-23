import React, { useEffect, useState } from 'react'
import Layout from './components/Layout'

const CURRENT = [
  { name: 'Erin Howard', position: 'Founder', linkedin: 'https://www.linkedin.com/in/erin-howard', image: '/erin.png' },
  { name: 'Sara Shiferaw', position: 'Head of Communications', linkedin: 'https://www.linkedin.com', image: '/team-member-2-1.png' },
  { name: 'Jasmine Kamara', position: 'Head of Growth', linkedin: 'https://www.linkedin.com', image: '/team-member-3-1.png' },
]

const ALUMNI = [
  { name: 'Dylan Koa', position: 'Head of Marketing', linkedin: 'https://www.linkedin.com', image: '/team-member-4-1.png' },
  { name: 'Ryan Kang', position: 'Head of UR/UX', linkedin: 'https://www.linkedin.com', image: '/team-member-5-1.png' },
  { name: 'Siran Rao', position: 'Head of Product Management', linkedin: 'https://www.linkedin.com', image: '/team-member-6-1.png', fit: 'contain' },
  { name: 'Calvin Prajogo', position: 'Head of Engineering', linkedin: 'https://www.linkedin.com', image: null },
]

const TEAM = [...CURRENT, ...ALUMNI]

function TeamGrid({ people, offset, onSelect }) {
  return (
    <div className="team-grid">
      {people.map((person, index) => (
        <button key={person.name} className="team-card" type="button" onClick={() => onSelect(offset + index)}>
          {person.image ? (
            <img src={person.image} alt="" className={person.fit === 'contain' ? 'contain' : undefined} />
          ) : (
            <span className="avatar" aria-hidden="true">{person.name.split(' ').map((part) => part[0]).join('')}</span>
          )}
          <span>
            <strong>{person.name}</strong>
            <em>{person.position}</em>
          </span>
        </button>
      ))}
    </div>
  )
}

function hasProfile(url) {
  if (!url) return false
  try {
    const path = new URL(url).pathname.replace(/\/$/, '')
    return path.length > 0 && path !== '/company' && !path.endsWith('linkedin.com')
  } catch {
    return false
  }
}

export default function About() {
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (selected === null) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setSelected(null)
      if (event.key === 'ArrowRight') setSelected((index) => (index + 1) % TEAM.length)
      if (event.key === 'ArrowLeft') setSelected((index) => (index - 1 + TEAM.length) % TEAM.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [selected])

  const member = selected === null ? null : TEAM[selected]

  return (
    <Layout title="About — Grapevne">
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker"><i /> About</p>
          <h1 className="display">Hi there.</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="wrap story">
          <p>Today, Grapevne is being shaped by a small team of three college students. Grapevne is entirely designed and built by students at Amherst, Brown, and Wellesley. Our operations are incubated at the <a href="https://entrepreneurship.mit.edu/" target="_blank" rel="noopener noreferrer">MIT Martin Trust Center for Entrepreneurship</a>.</p>
          <div className="socials">
            <a href="https://www.instagram.com/grapevne" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/company/grapevne" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.tiktok.com/@grapevne" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: 28 }}>The team</h2>
          <div className="team-group">
            <h3 className="kicker">Current</h3>
            <TeamGrid people={CURRENT} offset={0} onSelect={setSelected} />
          </div>
          <div className="team-group">
            <h3 className="kicker">Alumni</h3>
            <TeamGrid people={ALUMNI} offset={CURRENT.length} onSelect={setSelected} />
          </div>
        </div>
      </section>

      {member && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={`Meet ${member.name}`} onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <div>
                <p className="kicker"><i /> Meet {member.name.split(' ')[0]}</p>
                <h2 className="display" style={{ fontSize: '2.4rem', marginTop: 8 }}>{member.name}</h2>
                <p className="lede">{member.position}</p>
                {hasProfile(member.linkedin) && (
                  <p><a href={member.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
                )}
              </div>
              <button className="icon-btn" type="button" onClick={() => setSelected(null)} aria-label="Close">×</button>
            </div>
            {member.image ? (
              <img src={member.image} alt={member.name} />
            ) : (
              <div className="avatar avatar-lg" aria-hidden="true">{member.name.split(' ').map((part) => part[0]).join('')}</div>
            )}
            <button className="icon-btn modal-nav" style={{ left: 12 }} type="button" onClick={() => setSelected((index) => (index - 1 + TEAM.length) % TEAM.length)} aria-label="Previous teammate">‹</button>
            <button className="icon-btn modal-nav" style={{ right: 12 }} type="button" onClick={() => setSelected((index) => (index + 1) % TEAM.length)} aria-label="Next teammate">›</button>
          </div>
        </div>
      )}
    </Layout>
  )
}
