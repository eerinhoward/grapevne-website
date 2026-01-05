import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function About() {
  const location = useLocation()
  const logoRef = useRef(null)
  const currentRotateX = useRef(0)
  const currentRotateY = useRef(0)
  const targetRotateX = useRef(0)
  const targetRotateY = useRef(0)
  const animationFrameId = useRef(null)
  const [showTeamList, setShowTeamList] = useState(false)
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null)
  const teamListRef = useRef(null)
  const teamLinkRef = useRef(null)
  const [showUseCases, setShowUseCases] = useState(false)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTeamList && 
          teamListRef.current && 
          !teamListRef.current.contains(event.target) &&
          teamLinkRef.current &&
          !teamLinkRef.current.contains(event.target)) {
        setShowTeamList(false)
      }
    }
    
    if (showTeamList) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTeamList])
  
  const teamMembers = [
    { name: 'Erin Howard', position: 'Founder', linkedin: 'https://www.linkedin.com/in/erin-howard', image: '/team-member-1-1.png' },
    { name: 'Sara Shiferaw', position: 'Head of Communications', linkedin: 'https://www.linkedin.com', image: '/team-member-2-1.png' },
    { name: 'Jasmine Kamara', position: 'Head of Growth', linkedin: 'https://www.linkedin.com', image: '/team-member-3-1.png' },
    { name: 'Dylan Koa', position: 'Head of Marketing', linkedin: 'https://www.linkedin.com', image: '/team-member-4-1.png' },
    { name: 'Ryan Kang', position: 'Head of UR/UX', linkedin: 'https://www.linkedin.com', image: '/team-member-5-1.png' },
    { name: 'Siran Rao', position: 'Head of Product Management', linkedin: 'https://www.linkedin.com', image: '/team-member-6-1.png' },
    { name: 'Calvin Prajogo', position: 'Head of Engineering', linkedin: 'https://www.linkedin.com', image: '/team-member-1-1.png' }
  ]

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0]
  }

  const handleMemberClick = (index) => {
    setSelectedMemberIndex(index)
    setShowTeamList(false)
  }

  const handleNext = () => {
    setSelectedMemberIndex((prev) => (prev + 1) % teamMembers.length)
  }

  const handlePrev = () => {
    setSelectedMemberIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length)
  }

  const handleCloseGallery = () => {
    setSelectedMemberIndex(null)
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedMemberIndex !== null) {
        if (e.key === 'ArrowRight' || e.key === '+' || e.key === '=') {
          setSelectedMemberIndex((prev) => (prev + 1) % teamMembers.length)
        } else if (e.key === 'ArrowLeft' || e.key === '-') {
          setSelectedMemberIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length)
        } else if (e.key === 'Escape') {
          setSelectedMemberIndex(null)
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [selectedMemberIndex, teamMembers.length])
  
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

      // 3D effect for logo
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

    // Start animation loop
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <header className="pt-4 pb-4 px-4 relative">
        <div className="flex justify-between items-center" style={{ perspective: '1000px' }}>
          <div className="flex items-center gap-6 pl-8 md:pl-12">
            <div className="flex items-center"
              onMouseEnter={() => setShowUseCases(true)}
              onMouseLeave={() => setShowUseCases(false)}
            >
              <div className="flex flex-col items-center">
                <div 
                  className="text-lg font-bold hover-grapevne-blue transition-colors lowercase cursor-pointer" 
                  style={{ color: '#1a1a1a' }}
                  onClick={() => setShowUseCases(true)}
                >
                  Use Cases
                </div>
                {(location.pathname === '/universities' || location.pathname === '/brands') && !showUseCases && (
                  <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }}></div>
                )}
              </div>
              <div 
                className="flex items-center gap-4 overflow-hidden transition-all duration-300 ease-in-out"
                style={{ 
                  maxWidth: showUseCases ? '300px' : '0px',
                  opacity: showUseCases ? 1 : 0,
                  marginLeft: showUseCases ? '24px' : '0px'
                }}
              >
                <Link to="/universities" className="text-lg font-bold hover-grapevne-blue transition-colors lowercase italic whitespace-nowrap" style={{ color: '#1a1a1a' }}>
                  Universities
                </Link>
                <Link to="/brands" className="text-lg font-bold hover-grapevne-blue transition-colors lowercase italic whitespace-nowrap" style={{ color: '#1a1a1a' }}>
                  Brands
                </Link>
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
            <a 
              href="https://apps.apple.com/us/app/grapevne/id6745459372" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-lg font-bold hover-grapevne-blue transition-colors lowercase"
              style={{ color: '#1a1a1a' }}
            >
              download
            </a>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-20" style={{ position: 'relative' }}>
        <div className="space-y-16 md:space-y-24">
          {/* Social Icons - Centered */}
          <section className="flex flex-col items-center justify-center py-16">
            <div className="flex justify-center items-center gap-6">
              <a 
                href="https://www.instagram.com/grapevne" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-4xl transition-colors hover:opacity-70"
                style={{ color: '#1a1a1a' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/grapevne" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-4xl transition-colors hover:opacity-70"
                style={{ color: '#1a1a1a' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@grapevne" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-4xl transition-colors hover:opacity-70"
                style={{ color: '#1a1a1a' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </section>

          {/* Our History Section */}
          <section className="flex flex-col items-start gap-8 md:gap-6 relative">
            <div className="w-full space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
                Our history
            </h2>
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', textAlign: 'justify' }}>
                Grapevne started in 2025 after a simple observation: free food on campus is abundant, but poorly distributed. Information arrives late. Food goes to waste.
              </p>
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', textAlign: 'justify' }}>
                That gap revealed a larger opportunity in how finite moments move through campus. Free food isn't just a perk - it's a shared campus habit. Grapevne grew out of the idea that if you can make that habit visible, you can make campus life more efficient, more connected, and less wasteful.
              </p>
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', textAlign: 'justify' }}>
                Today, Grapevne is being shaped by a small team of{' '}
                <span 
                  ref={teamLinkRef}
                  onClick={() => setShowTeamList(true)}
                  className="cursor-pointer"
                  style={{ 
                    textDecoration: 'underline',
                    textDecorationStyle: 'dashed',
                    textDecorationColor: '#3FA9F5',
                    color: '#3FA9F5'
                  }}
                >
                  7 college students
                </span>
                , building it from inside the environments it serves.
              </p>
            </div>
            {showTeamList && (
              <div 
                ref={teamListRef}
                className="hidden md:block absolute"
                style={{ 
                  left: '100%',
                  marginLeft: '2rem',
                  width: '220px',
                  maxWidth: '220px',
                  top: '0'
                }}
              >
                <ul className="space-y-2">
                  {teamMembers.map((member, index) => (
                    <li key={index} style={{ wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '220px' }}>
                      <button
                        onClick={() => handleMemberClick(index)}
                        className="text-base transition-colors block group cursor-pointer w-full text-left"
                        style={{ 
                          color: '#1a1a1a', 
                          wordWrap: 'break-word', 
                          overflowWrap: 'break-word',
                          maxWidth: '100%',
                          display: 'block',
                          background: 'none',
                          border: 'none',
                          padding: '0',
                          font: 'inherit'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#3FA9F5'
                          e.target.textContent = member.position
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#1a1a1a'
                          e.target.textContent = member.name
                        }}
                      >
                        {member.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>


      {/* Team Member Gallery Modal */}
      {selectedMemberIndex !== null && (
        <div 
          className="fixed inset-0 bg-white z-50 flex items-center justify-center"
          style={{ backgroundColor: '#ffffff' }}
          onClick={handleCloseGallery}
        >
          <div 
            className="relative w-full h-full flex flex-col items-center justify-center px-8 py-12 max-w-6xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseGallery}
              className="absolute top-8 right-8 text-2xl font-bold"
              style={{ color: '#1a1a1a' }}
            >
              ×
            </button>

            {/* Navigation buttons */}
            <button
              onClick={handlePrev}
              className="fixed left-8 md:left-16 top-1/2 transform -translate-y-1/2 text-5xl md:text-6xl font-bold z-10 transition-colors"
              style={{ color: '#1a1a1a' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--grapevne-blue)'}
              onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}
            >
              −
            </button>
            <button
              onClick={handleNext}
              className="fixed right-8 md:right-16 top-1/2 transform -translate-y-1/2 text-5xl md:text-6xl font-bold z-10 transition-colors"
              style={{ color: '#1a1a1a' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--grapevne-blue)'}
              onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}
            >
              +
            </button>

            {/* Gallery content */}
            <div className="flex flex-col items-center w-full">
              {/* Header: "Meet [First Name]" */}
              <h1 
                className="text-5xl md:text-6xl font-bold mb-6 text-left w-full"
                style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                Meet {getFirstName(teamMembers[selectedMemberIndex].name)}.
              </h1>

              {/* Black bar */}
              <div className="w-full h-1 bg-black mb-6"></div>

              {/* Position/Subtext */}
              <p 
                className="text-xl md:text-2xl mb-8 text-left w-full"
                style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}
              >
                {teamMembers[selectedMemberIndex].position}
              </p>

              {/* Image */}
              <div className="w-full max-w-4xl">
                <img 
                  src={teamMembers[selectedMemberIndex].image} 
                  alt={teamMembers[selectedMemberIndex].name}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer with ®, ™, and © symbols */}
      <footer className="py-8 px-4">
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

export default About

