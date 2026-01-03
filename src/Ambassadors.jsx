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
    const cursor = document.createElement('div')
    cursor.innerHTML = '🍔'
    cursor.style.position = 'fixed'
    cursor.style.pointerEvents = 'none'
    cursor.style.fontSize = '24px'
    cursor.style.zIndex = '9999'
    cursor.style.transform = 'translate(-50%, -50%)'
    document.body.appendChild(cursor)
    document.body.style.cursor = 'none'

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
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'

      const target = e.target
      const isClickable = target.closest('a, button, [onclick], [role="button"], input, textarea, select')
      if (isClickable) {
        cursor.style.opacity = '0'
      } else {
        cursor.style.opacity = '1'
      }

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
      document.body.removeChild(cursor)
      document.body.style.cursor = 'auto'
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
      <header className="pt-4 pb-4 px-4 relative">
        <div className="flex justify-center items-center gap-4">
          <div className="flex flex-col items-center">
            <Link to="/press" className="text-lg font-bold text-gray-900 hover-grapevne-blue transition-colors lowercase">
              Press
            </Link>
            {location.pathname === '/press' && (
              <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }}></div>
            )}
          </div>
          <Link to="/" className="flex justify-center">
            <img 
              ref={logoRef}
              src="/filledTransparent.png" 
              alt="Grapevne Logo" 
              className="h-28 w-auto"
              style={{ 
                transformStyle: 'preserve-3d',
                willChange: 'transform'
              }}
            />
          </Link>
          <div className="flex flex-col items-center">
            <Link to="/about" className="text-lg font-bold text-gray-900 hover-grapevne-blue transition-colors lowercase">
              About
            </Link>
            {location.pathname === '/about' && (
              <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }}></div>
            )}
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
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Make an Impact
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Help reduce food waste on your campus while connecting students with free food opportunities. Your efforts directly benefit your community.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Build Your Network
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Work with campus administration, student organizations, and brands. Gain valuable experience in community building and product growth.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Flexible Commitment
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We work around your schedule. Whether you're a freshman or senior, there's a way to contribute that fits your life.
              </p>
            </div>
          </section>

          {/* Form Section */}
          <section className="pt-8">
            <h2 className="text-4xl font-light text-gray-900 mb-8 text-center">
              Get Started
            </h2>
            
            {submitted ? (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-900 mb-4">Thank you!</p>
                <p className="text-xl text-gray-600">We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent text-lg"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent text-lg"
                  />
                </div>

                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                    School/University
                  </label>
                  <select
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent text-lg bg-white"
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
                      <p className="text-base text-gray-600">
                        Don't see your school? Let's bring Grapevne to your campus.
                      </p>
                      <input
                        type="text"
                        id="otherSchool"
                        name="otherSchool"
                        value={formData.otherSchool}
                        onChange={handleChange}
                        required
                        placeholder="Enter your school name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent text-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    Year in School
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent text-lg bg-white"
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Why are you interested in being a Grapevne ambassador? (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent text-lg resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-1">
          <div className="flex justify-center items-center gap-3">
            <span className="ip-symbol text-black" style={{ transform: 'translateY(-1px)' }}>®</span>
            <span className="ip-symbol text-black" style={{ transform: 'translateY(1px)' }}>™</span>
            <span className="ip-symbol text-black" style={{ transform: 'translateY(-1px)' }}>©</span>
          </div>
          <div className="flex justify-center items-center gap-3 text-xs text-gray-600">
            <span className="text-gray-400 font-medium">USE CASES</span>
            <Link to="/universities" className="hover-grapevne-blue transition-colors footer-link">Universities</Link>
            <Link to="/brands" className="hover-grapevne-blue transition-colors footer-link">Brands</Link>
            <Link to="/ambassadors" className="hover-grapevne-blue transition-colors footer-link">Ambassadors</Link>
            <span className="text-gray-400 font-medium ml-2">LEGAL AREA</span>
            <Link to="/terms" className="hover-grapevne-blue transition-colors footer-link">Terms of Service</Link>
            <Link to="/privacy" className="hover-grapevne-blue transition-colors footer-link">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Ambassadors

