import React from 'react'
import Layout from './components/Layout'

const TEAM = [
  { name: 'Erin Howard', position: 'Founder', linkedin: 'https://www.linkedin.com/in/erin-howard', image: '/erin.png' },
  { name: 'Sara Shiferaw', position: 'Head of Communications', image: '/team-member-2-1.png' },
  { name: 'Jasmine Kamara', position: 'Head of Growth', image: '/team-member-3-1.png' },
]

export default function About() {
  return (
    <Layout title="About — Grapevne">
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker"><i /> About</p>
          <h1 className="display">Grapevne is entirely designed and built by students at Amherst, Brown, and Wellesley. We're students who believe good food should not get thrown out.</h1>
          <p className="display about-next">Our operations are incubated at the <a href="https://entrepreneurship.mit.edu/" target="_blank" rel="noopener noreferrer">MIT Martin Trust Center for Entrepreneurship</a>.</p>
          <div className="socials">
            <a href="https://www.instagram.com/grapevne" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.linkedin.com/company/grapevne" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.tiktok.com/@grapevne" target="_blank" rel="noopener noreferrer">TikTok</a>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 36 }}>
        <div className="wrap">
          <div className="team-row">
            {TEAM.map((person) => (
              <figure key={person.name}>
                <img src={person.image} alt={person.name} width="200" height="200" />
                <figcaption>
                  {person.linkedin ? (
                    <a href={person.linkedin} target="_blank" rel="noopener noreferrer"><strong>{person.name}</strong></a>
                  ) : (
                    <strong>{person.name}</strong>
                  )}
                  <span>{person.position}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
