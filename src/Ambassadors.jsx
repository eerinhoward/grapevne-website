import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Ambassadors() {
  const location = useLocation()
  const logoRef = useRef(null)
  const currentRotateX = useRef(0)
  const currentRotateY = useRef(0)
  const targetRotateX = useRef(0)
  const targetRotateY = useRef(0)
  const animationFrameId = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    otherSchool: '',
    year: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [showOtherSchool, setShowOtherSchool] = useState(false)

  // Official partner schools
  const officialPartners = [
    'Trinity College',
    'Stevens Institute of Technology',
    // Add more official partner schools here
  ]

  useEffect(() => {
    const updateLogoTransform = () => {
      if (logoRef.current) {
        const logo = logoRef.current
        const lerpFactor = 0.6
        currentRotateX.current += (targetRotateX.current - currentRotateX.current) * lerpFactor
        currentRotateY.current += (targetRotateY.current - currentRotateY.current) * lerpFactor
        logo.style.transform = `perspective(1000px) rotateX(${currentRotateX.current}deg) rotateY(${currentRotateY.current}deg)`
      }
      animationFrameId.current = requestAnimationFrame(updateLogoTransform)
    }

    const handleMouseMove = (e) => {
      if (logoRef.current) {
        const logo = logoRef.current
        const rect = logo.getBoundingClientRect()
        const logoCenterX = rect.left + rect.width / 2
        const logoCenterY = rect.top + rect.height / 2
        const dx = e.clientX - logoCenterX
        const dy = e.clientY - logoCenterY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const maxDistance = Math.sqrt(viewportWidth * viewportWidth + viewportHeight * viewportHeight)
        const normalizedDistance = Math.min(distance / maxDistance, 1)
        const influence = normalizedDistance * 0.35 + 0.2
        const angle = Math.atan2(dy, dx)
        const maxRotation = 60
        targetRotateY.current = Math.cos(angle) * maxRotation * influence
        targetRotateX.current = -Math.sin(angle) * maxRotation * influence
      }
    }

    animationFrameId.current = requestAnimationFrame(updateLogoTransform)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  const handleChange = (e) => {
    if (e.target.name === 'school') {
      const isOther = e.target.value === 'other'
      setShowOtherSchool(isOther)
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        otherSchool: isOther ? formData.otherSchool : ''
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Use otherSchool if "other" was selected, otherwise use school
    const schoolValue = formData.school === 'other' ? formData.otherSchool : formData.school
    const submitData = {
      ...formData,
      school: schoolValue
    }
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', submitData)
    setSubmitted(true)
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setShowOtherSchool(false)
      setFormData({
        name: '',
        email: '',
        school: '',
        otherSchool: '',
        year: '',
        message: ''
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <header className="pt-4 pb-4 px-4 relative" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <div className="flex justify-between items-center flex-wrap gap-2" style={{ perspective: '1000px' }}>
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 pl-4 sm:pl-6 md:pl-12 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <Link to="/universities" className="text-lg font-bold hover-grapevne-blue transition-colors lowercase italic whitespace-nowrap" style={{ color: '#1a1a1a' }}>
                  universities
                </Link>
                {location.pathname === '/universities' && (
                  <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }}></div>
                )}
              </div>
              <div className="flex flex-col items-center">
                <Link to="/brands" className="text-lg font-bold hover-grapevne-blue transition-colors lowercase italic whitespace-nowrap" style={{ color: '#1a1a1a' }}>
                  brands
                </Link>
                {location.pathname === '/brands' && (
                  <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }}></div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Link to="/about" className="text-lg font-bold hover-grapevne-blue transition-colors lowercase" style={{ color: '#1a1a1a' }}>
                About
              </Link>
              {location.pathname === '/about' && (
                <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }}></div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <Link to="/press" className="text-lg font-bold hover-grapevne-blue transition-colors lowercase" style={{ color: '#1a1a1a' }}>
                Press
              </Link>
              {location.pathname === '/press' && (
                <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }}></div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 pr-4 sm:pr-6 md:pr-12">
            <a
              href="https://apps.apple.com/us/app/grapevne/id6745459372"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold hover-grapevne-blue transition-colors lowercase"
              style={{ color: '#1a1a1a' }}
            >
              download
            </a>
            <Link to="/" className="flex justify-center">
              <img
                ref={logoRef}
                src="/filledTransparent.png"
                alt="Grapevne Logo"
                className="h-16 sm:h-20 md:h-28 w-auto"
                style={{
                  transformStyle: 'preserve-3d',
                  willChange: 'transform'
                }}
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* American Apparel-style Ad Image - Full Width with Overlay Text */}
        <div className="w-full mb-16 relative px-4 md:px-8">
          <div className="w-full relative" style={{ backgroundColor: '#f5f5f5' }}>
            <img
              src="/HenryBayhaXP2C7783-2 (1).jpg"
              alt="Grapevne Ambassadors"
              className="w-full object-cover block"
              style={{ height: '500px', objectFit: 'cover', objectPosition: 'center 40%' }}
            />
            <h1 className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl font-light text-white leading-tight whitespace-nowrap" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Student Ambassadors
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center">
              <p className="text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Bring Grapevne to your campus. Help your peers discover free food. Build something meaningful.
              </p>
            </section>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="space-y-16">

            {/* Benefits Section */}
            <section className="space-y-12">
              <div>
                <h2 className="text-4xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                  Make an Impact
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Help reduce food waste on your campus while connecting students with free food opportunities. Your efforts directly benefit your community.
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                  Build Your Network
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Work with campus administration, student organizations, and brands. Gain valuable experience in community building and product growth.
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                  Flexible Commitment
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  We work around your schedule. Whether you're a freshman or senior, there's a way to contribute that fits your life.
                </p>
              </div>
            </section>

            {/* Form Section */}
            <section className="pt-8 w-full px-4">
              <h2 className="text-4xl font-light mb-8 text-center" style={{ color: '#1a1a1a' }}>
                Get Started
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <p className="text-2xl mb-4" style={{ color: '#1a1a1a' }}>Thank you!</p>
                  <p className="text-xl text-gray-600">We'll be in touch soon.</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-4xl mx-auto">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: 'white' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ backgroundColor: 'white' }}
                      />
                    </div>

                    <div>
                      <label htmlFor="school" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                        School/University *
                      </label>
                      <select
                        id="school"
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-no-repeat bg-right"
                        style={{
                          backgroundColor: 'white',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundSize: '12px',
                          color: formData.school ? '#1a1a1a' : '#999'
                        }}
                      >
                        <option value="">Select your school</option>
                        {officialPartners.map((school) => (
                          <option key={school} value={school}>
                            {school}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>

                      {showOtherSchool && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-gray-600">
                            Don't see your school? Let's bring Grapevne to your campus.
                          </p>
                          <input
                            type="text"
                            id="otherSchool"
                            name="otherSchool"
                            value={formData.otherSchool}
                            onChange={handleChange}
                            placeholder="Enter your school name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ backgroundColor: 'white' }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="year" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                        Year in School *
                      </label>
                      <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none bg-no-repeat bg-right"
                        style={{
                          backgroundColor: 'white',
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 12px center',
                          backgroundSize: '12px',
                          color: formData.year ? '#1a1a1a' : '#999'
                        }}
                      >
                        <option value="">Select year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>
                        Why are you interested in being a Grapevne ambassador?
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        style={{ backgroundColor: 'white' }}
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleSubmit}
                        className="w-full bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-1">
          <div className="flex justify-center items-center gap-3">
            <span className="ip-symbol" style={{ transform: 'translateY(-1px)', color: '#1a1a1a' }}>®</span>
            <span className="ip-symbol" style={{ transform: 'translateY(1px)', color: '#1a1a1a' }}>™</span>
            <span className="ip-symbol" style={{ transform: 'translateY(-1px)', color: '#1a1a1a' }}>©</span>
          </div>
          <div className="flex justify-center items-center gap-3 text-xs text-gray-600">
            <span className="text-gray-400 font-medium">USE CASES</span>
            <Link to="/universities" className="hover-grapevne-blue transition-colors footer-link">Universities</Link>
            <Link to="/brands" className="hover-grapevne-blue transition-colors footer-link">Brands</Link>
            <span className="text-gray-400 font-medium ml-2">LEGAL AREA</span>
            <Link to="/terms" className="hover-grapevne-blue transition-colors footer-link">Terms</Link>
            <Link to="/privacy" className="hover-grapevne-blue transition-colors footer-link">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Ambassadors