import React, { useState } from 'react'

const REASONS = [
  'Bring Grapevne to our campus',
  'Partnership',
  'Press',
  'Something else',
]

const EMPTY = {
  name: '',
  email: '',
  organization: '',
  reason: '',
  message: '',
  school: '',
  role: '',
}

export default function ContactForm({ isOpen, onClose, emailTo = 'universities@grapevneapp.com', variant = 'general' }) {
  const campus = variant === 'campus'
  const [formData, setFormData] = useState(EMPTY)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const school = formData.school.trim()
    const role = formData.role.trim()
    const email = formData.email.trim()
    if (campus) {
      if (!school || !role || !email) {
        setSubmitStatus('error')
        return
      }
    } else if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    try {
      const subject = encodeURIComponent(campus ? `Grapevne for ${school}` : `Contact form from ${formData.name}`)
      const body = encodeURIComponent(
        campus
          ? `School: ${school}\nRole: ${role}\nEmail: ${email}`
          : `Name: ${formData.name}\nEmail: ${formData.email}\nOrganization: ${formData.organization}\nReason: ${formData.reason}\n\nMessage:\n${formData.message}`
      )
      window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`
      setSubmitStatus('success')
      window.setTimeout(() => {
        setFormData(EMPTY)
        setSubmitStatus(null)
        onClose()
      }, 2000)
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <form className="card" onSubmit={handleSubmit} style={{ marginTop: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h3 style={{ marginTop: 0 }}>Get in touch</h3>
        <button className="icon-btn" type="button" onClick={onClose} aria-label="Close form">×</button>
      </div>
      {campus ? (
        <>
          <label className="field">
            <span>School</span>
            <input id="school" name="school" value={formData.school} onChange={handleChange} autoComplete="organization" required />
          </label>
          <label className="field">
            <span>Role</span>
            <input id="role" name="role" value={formData.role} onChange={handleChange} autoComplete="organization-title" required />
          </label>
          <label className="field">
            <span>Email</span>
            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" required />
          </label>
        </>
      ) : (
        <>
          <div className="form-grid">
            <label className="field">
              <span>Name</span>
              <input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Email</span>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
          </div>
          <label className="field">
            <span>Organization</span>
            <input id="organization" name="organization" value={formData.organization} onChange={handleChange} />
          </label>
          <label className="field">
            <span>Reason for contact</span>
            <select id="reason" name="reason" value={formData.reason} onChange={handleChange}>
              <option value="">Select an option</option>
              {REASONS.map((reason) => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Message</span>
            <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required />
          </label>
        </>
      )}
      {submitStatus === 'success' && <p className="form-status ok">Opening your email client…</p>}
      {submitStatus === 'error' && <p className="form-status error">{campus ? 'Please add your school, role, and email.' : 'Please fill in all required fields.'}</p>}
      <div className="cta-row">
        <button className="btn btn-ink" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
        <button className="btn btn-ghost-ink" type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  )
}
