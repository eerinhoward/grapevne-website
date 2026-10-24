import React from 'react'
import Layout from './components/Layout'

const GALLERY = [
  { src: '/Photoshoot1.jpg', alt: 'Students sharing pizza outside at night' },
  { src: '/Photoshoot2.png', alt: 'Students gathered with food' },
  { src: '/Photoshoot3.jpg', alt: 'Campus photoshoot' },
  { src: '/gathering.jpg', alt: 'A campus gathering' },
  { src: '/walking.jpg', alt: 'Students walking on campus' },
  { src: '/taking.jpg', alt: 'Students on campus' },
  { src: '/homepage.jpg', alt: 'Campus life' },
  { src: '/university.jpg', alt: 'University campus' },
]

const FEATURE = {
  title: 'Trinity College · Food and Dining',
  author: 'Trinity College Sustainability',
  source: 'trincoll.edu',
  sourceUrl: 'https://www.trincoll.edu/sustainability/sample-page-2/campus-operations/food-and-dining/',
  quote: 'To reduce food waste, Trinity is now offering the Grapevne app, which allows anyone on campus who has leftover food, whether it be from an event, or just an opened box of cereal in your dorm, to offer that food to the community. Anyone looking for free food will be notified and can claim it. Help us keep food out of the landfill while also feeding hungry students.',
  image: '/Photoshoot1.jpg',
}

export default function Press() {
  return (
    <Layout title="Press — Grapevne">
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker"><i /> Press</p>
          <h1 className="display">In the wild.</h1>
          <p className="lede">What campuses are saying about getting leftover food to the people who want it.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 28 }}>
        <div className="wrap">
          <article className="press-feature">
            <img src={FEATURE.image} alt="" />
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p className="kicker"><i /> {FEATURE.source}</p>
              <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '10px 0 14px' }}>{FEATURE.title}</h2>
              <p style={{ fontSize: '1.08rem', lineHeight: 1.6, marginTop: 0 }}>“{FEATURE.quote}”</p>
              <p style={{ marginBottom: 0 }}>
                <strong>{FEATURE.author}</strong>
                <br />
                <a href={FEATURE.sourceUrl} target="_blank" rel="noopener noreferrer">Read on {FEATURE.source}</a>
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 18 }}>On campus</h2>
          <div className="gallery">
            {GALLERY.map((photo) => (
              <img key={photo.src} src={photo.src} alt={photo.alt} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}
