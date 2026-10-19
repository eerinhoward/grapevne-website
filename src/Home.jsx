import React from 'react'
import { Link } from 'react-router-dom'
import Layout from './components/Layout'
import DownloadLink from './components/DownloadLink'

const FEATURES = [
  {
    step: '01',
    title: "Never miss what's happening",
    body: 'Push notifications when campus posts go live. No more checking emails or walking past flyers.',
    image: '/never-miss-iphone.png',
    alt: 'Grapevne feed with campus food posts',
  },
  {
    step: '02',
    title: "One swipe. You're in.",
    body: 'One swipe RSVPs. It saves to your calendar automatically.',
    image: '/one-swipe-iphone.png',
    alt: 'RSVP on Grapevne with a single swipe',
  },
  {
    step: '03',
    title: 'See who else is going',
    body: "See the list of who's going. See where your friends are going on the map. Meet them there.",
    image: '/see-who-iphone.png',
    alt: 'Grapevne showing who is going to a campus post',
  },
]

const TICKER = [
  'Free food',
  'Campus events',
  'One-swipe RSVP',
  "Who's going",
  'Leftover pizza',
  'Club meetings',
  'Saved to your calendar',
  'Campus-wide',
]

export default function Home() {
  const ticker = [...TICKER, ...TICKER]

  return (
    <Layout title="Grapevne — The feed that feeds you">
      <section className="hero">
        <div>
          <p className="kicker"><i /> Free on the App Store</p>
          <h1 className="display">
            The feed<br />that <em>feeds</em><br />you.
          </h1>
          <p className="lede">
            A shared feed for events, leftover and free food, on campus. Hear about it when it posts. Show up if you want to.
          </p>
          <div className="cta-row">
            <DownloadLink className="btn btn-blue">Download on the App Store</DownloadLink>
            <Link to="/universities" className="btn btn-ghost">For universities</Link>
          </div>
        </div>
        <div className="hero-stage">
          <div className="hero-panel">
            <img className="hero-phone" src="/never-miss-iphone.png" alt="The Grapevne app on an iPhone" />
          </div>
          <img className="print print-a" src="/Photoshoot1.jpg" alt="" />
          <img className="print print-b" src="/gathering.jpg" alt="" />
          <img className="print print-c" src="/pizza food.png" alt="" />
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {ticker.map((item, index) => (
            <span key={`${item}-${index}`}>{item} ·</span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <h2 className="display">Campus, in one feed.</h2>
            <p className="lede">
              People usually hear about things through each other. Grapevne makes that faster, organized, and campus-wide.
            </p>
          </div>
          {FEATURES.map((feature, index) => (
            <article className={index % 2 === 1 ? 'feature reverse' : 'feature'} key={feature.step}>
              <div className="feature-copy">
                <div className="step">{feature.step}</div>
                <h3 className="display">{feature.title}</h3>
                <p className="lede">{feature.body}</p>
              </div>
              <div className="phone-well">
                <img src={feature.image} alt={feature.alt} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="facts">
        <div className="fact">
          <strong>2025</strong>
          <p>Grapevne started after a simple observation: there's a lot of free food on campus, and it doesn't get where it needs to go.</p>
        </div>
        <div className="fact">
          <strong>Seven</strong>
          <p>College students are shaping it. We use it too.</p>
        </div>
        <div className="fact">
          <strong>Spring 2026</strong>
          <p>Launching campus-wide at Trinity College with the Sustainability Department.</p>
        </div>
      </section>

      <section className="quote-band">
        <img src="/Photoshoot2.png" alt="Students sharing food on campus" />
        <div className="quote-copy">
          <p className="kicker"><i /> Trinity College</p>
          <p>
            “To reduce food waste, Trinity is now offering the Grapevne app, which allows anyone on campus who has leftover food to offer that food to the community.”
          </p>
          <Link to="/press">Read the feature</Link>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <p className="kicker" style={{ justifyContent: 'center' }}><i /> Get Grapevne</p>
          <h2 className="display">The feed that feeds you.</h2>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <DownloadLink className="btn btn-ink">Download on the App Store</DownloadLink>
            <Link to="/about" className="btn btn-ghost-ink">Meet the team</Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
