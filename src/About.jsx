import React from 'react'
import Layout from './components/Layout'

const TEAM = [
  { name: 'Erin Howard', image: '/erin-cutout.png' },
  { name: 'Sara Shiferaw', image: '/sara-cutout.png' },
  { name: 'Jasmine Kamara', image: '/jasmine-cutout.png' },
]

export default function About() {
  return (
    <Layout title="About — Grapevne">
      <section className="page-hero about-hero">
        <div className="about-floats">
          {TEAM.map((person) => (
            <img key={person.name} className={`float-face is-${person.name.split(' ')[0].toLowerCase()}`} src={person.image} alt={person.name} />
          ))}
        </div>
        <div className="wrap">
          <h1 className="display">Grapevne is entirely designed and built by students at Amherst, Brown, and Wellesley.</h1>
          <p className="display about-next">We're students who believe good food should not get thrown out.</p>
          <p className="display about-next">Our operations are incubated at the <a href="https://entrepreneurship.mit.edu/" target="_blank" rel="noopener noreferrer">MIT Martin Trust Center for Entrepreneurship</a>.</p>
        </div>
      </section>
    </Layout>
  )
}
