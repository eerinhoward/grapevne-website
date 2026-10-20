import React from 'react'
import { Link } from 'react-router-dom'
import Layout from './components/Layout'
import DownloadLink from './components/DownloadLink'

const POINTS = [
  {
    image: '/Photoshoot1.jpg',
    title: 'Free food, while it lasts.',
    body: 'Leftover pizza, club snacks, and open events show up in one feed.',
  },
  {
    image: '/gathering.jpg',
    title: 'One swipe. You’re in.',
    body: 'RSVP in a swipe. It saves to your calendar.',
  },
  {
    image: '/Photoshoot3.jpg',
    title: 'See who else is going.',
    body: 'The list, the map, and your friends. Meet them there.',
  },
]

const CHAPTERS = [
  {
    title: 'Never miss what’s happening.',
    body: 'A notification when a campus post goes live. No inbox, no flyer.',
    image: '/never-miss-iphone.png',
    alt: 'Grapevne feed on an iPhone',
    altBg: false,
  },
  {
    title: 'Show up if you want to.',
    body: 'One swipe RSVPs. Grapevne puts it on your calendar.',
    image: '/one-swipe-iphone.png',
    alt: 'RSVP on Grapevne',
    altBg: true,
  },
  {
    title: 'Know who’s already there.',
    body: 'See the list of who’s going, and where your friends are headed.',
    image: '/see-who-iphone.png',
    alt: 'Who is going, on Grapevne',
    altBg: false,
  },
]

const STRIP = [
  '/Photoshoot1.jpg',
  '/Photoshoot2.png',
  '/gathering.jpg',
  '/walking.jpg',
]

export default function Home() {
  return (
    <Layout title="Grapevne — The feed that feeds you">
      <section className="hero">
        <p className="eyebrow">Free on the App Store</p>
        <h1>The feed that feeds you.</h1>
        <p>Events, leftover food, and who’s going. On your campus.</p>
        <div className="cta-row">
          <DownloadLink className="btn btn-blue">Download</DownloadLink>
          <Link to="/universities" className="btn btn-ghost">For universities</Link>
        </div>
        <img className="hero-product" src="/never-miss-iphone.png" alt="The Grapevne app on an iPhone" />
      </section>

      <div className="wrap">
        <div className="tiles">
          {POINTS.map((point) => (
            <article className="tile" key={point.title}>
              <img src={point.image} alt="" />
              <h2>{point.title}</h2>
              <p>{point.body}</p>
            </article>
          ))}
        </div>
      </div>

      {CHAPTERS.map((chapter) => (
        <section className={chapter.altBg ? 'chapter alt' : 'chapter'} key={chapter.title}>
          <h2>{chapter.title}</h2>
          <p>{chapter.body}</p>
          <img className="phone" src={chapter.image} alt={chapter.alt} />
        </section>
      ))}

      <div className="filmstrip">
        {STRIP.map((src) => (
          <img key={src} src={src} alt="" />
        ))}
      </div>

      <section className="note">
        <p>Trinity College is offering Grapevne so leftover food reaches students instead of the landfill.</p>
        <Link to="/press">Read the feature</Link>
      </section>

      <section className="closing">
        <h2>The feed that feeds you.</h2>
        <div className="cta-row">
          <DownloadLink className="btn btn-blue">Download on the App Store</DownloadLink>
          <Link to="/about" className="btn btn-ghost">About Grapevne</Link>
        </div>
      </section>
    </Layout>
  )
}
