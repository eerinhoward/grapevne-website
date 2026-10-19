import React, { useState } from 'react'
import Layout from './components/Layout'

const SCHOOLS = ['Trinity College', 'Stevens Institute of Technology']

const BENEFITS = [
  {
    title: 'Make an impact',
    body: 'Help reduce food waste on your campus while connecting students with free food opportunities. Your efforts directly benefit your community.',
  },
  {
    title: 'Build your network',
    body: 'Work with campus administration, student organizations, and brands. Gain valuable experience in community building and product growth.',
  },
  {
    title: 'Flexible commitment',
    body: "We work around your schedule. Whether you're a freshman or senior, there's a way to contribute that fits your life.",
  },
]

const EMPTY = { name: '', email: '', school: '', otherSchool: '', year: '', message: '' }

export default function Ambassadors() {
  const [formData, setFormData] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  const showOther = formData.school === 'other'

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'school') {
      setFormData((current) => ({
        ...current,
        school: value,
        otherSchool: value === 'other' ? current.otherSchool : '',
      }))
      return
    }
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const school = formData.school === 'other' ? formData.otherSchool : formData.school
    if (!formData.name || !formData.email || !school || !formData.year) return
    console.log('Form submitted:', { ...formData, school })
    setSubmitted(true)
    window.setTimeout(() => {
      setSubmitted(false)
      setFormData(EMPTY)
    }, 3000)
  }

  return (
    <Layout title="Ambassadors — Grapevne">
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker"><i /> Ambassadors</p>
          <h1 className="display">Bring Grapevne to your campus.</h1>
          <p className="lede">Help your peers discover free food. Build something meaningful.</p>
        </div>
      </section>

      <div className="wrap" style={{ marginTop: 28 }}>
        <img src="/ambassadors-ad.png" alt="Grapevne student ambassadors" style={{ width: '100%', maxHeight: 460, objectFit: 'cover', borderRadius: 28 }} />
      </div>

      <section className="section">
        <div className="wrap cards cards-3">
          {BENEFITS.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <h2 className="display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 16 }}>Get started</h2>
          {submitted ? (
            <div className="card">
              <h3>Thank you.</h3>
              <p>We'll be in touch soon.</p>
            </div>
          ) : (
            <form className="card" onSubmit={handleSubmit}>
              <label className="field">
                <span>Full name</span>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>Email address</span>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>School</span>
                <select name="school" value={formData.school} onChange={handleChange} required>
                  <option value="">Select your school</option>
                  {SCHOOLS.map((school) => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </label>
              {showOther && (
                <label className="field">
                  <span>Don't see your school? Let's bring Grapevne to your campus.</span>
                  <input name="otherSchool" value={formData.otherSchool} onChange={handleChange} placeholder="Enter your school name" required />
                </label>
              )}
              <label className="field">
                <span>Year in school</span>
                <select name="year" value={formData.year} onChange={handleChange} required>
                  <option value="">Select year</option>
                  {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Why are you interested in being a Grapevne ambassador?</span>
                <textarea name="message" rows="5" value={formData.message} onChange={handleChange} />
              </label>
              <button className="btn btn-ink" type="submit">Submit</button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  )
}
