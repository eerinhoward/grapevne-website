import React from 'react'
import Layout from './components/Layout'

export default function About() {
  return (
    <Layout title="About — Grapevne">
      <section className="page-hero about-hero">
        <div className="wrap">
          <h1 className="display">Grapevne is entirely designed and built by students at Amherst, Brown, and Wellesley.</h1>
          <p className="display about-next">We're students who believe good food should not get thrown out.</p>
          <p className="display about-next">Our operations are incubated at the <a href="https://entrepreneurship.mit.edu/" target="_blank" rel="noopener noreferrer">MIT Martin Trust Center for Entrepreneurship</a>.</p>
        </div>
      </section>
    </Layout>
  )
}
