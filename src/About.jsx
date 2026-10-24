import React from 'react'
import Layout from './components/Layout'

export default function About() {
  return (
    <Layout title="About — Grapevne">
      <section className="page-hero about-hero">
        <div className="wrap">
          <h1 className="display">Grapevne is entirely designed and built by students at <a href="https://www.linkedin.com/in/sara-shiferaw-6082b8207/" target="_blank" rel="noopener noreferrer">Amherst</a>, <a href="https://www.linkedin.com/in/jasmine-kamara/" target="_blank" rel="noopener noreferrer">Brown</a>, and <a href="https://www.linkedin.com/in/erin-howard/?isSelfProfile=true" target="_blank" rel="noopener noreferrer">Wellesley</a>.</h1>
          <p className="display about-next">We're students who believe good food should not get thrown out.</p>
          <p className="display about-next">Our operations are incubated at the <a href="https://entrepreneurship.mit.edu/" target="_blank" rel="noopener noreferrer">MIT Martin Trust Center for Entrepreneurship</a>.</p>
        </div>
      </section>
    </Layout>
  )
}
