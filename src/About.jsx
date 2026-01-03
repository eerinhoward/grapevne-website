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
  const teamListRef = useRef(null)
  const teamLinkRef = useRef(null)
  
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
    { name: 'Erin Howard', position: 'Founder', linkedin: 'https://www.linkedin.com/in/erin-howard' },
    { name: 'Sara Shiferaw', position: 'Head of Communications', linkedin: 'https://www.linkedin.com' },
    { name: 'Jasmine Kamara', position: 'Head of Growth', linkedin: 'https://www.linkedin.com' },
    { name: 'Dylan Koa', position: 'Head of Marketing', linkedin: 'https://www.linkedin.com' },
    { name: 'Ryan Kang', position: 'Head of UR/UX', linkedin: 'https://www.linkedin.com' },
    { name: 'Siran Rao', position: 'Head of Product Management', linkedin: 'https://www.linkedin.com' },
    { name: 'Calvin Prajogo', position: 'Head of Engineering', linkedin: 'https://www.linkedin.com' }
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
            <div className="flex flex-col items-center">
              <Link to="/press" className="text-lg font-bold hover-grapevne-blue transition-colors lowercase" style={{ color: '#1a1a1a' }}>
                Press
              </Link>
              {location.pathname === '/press' && (
                <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }}></div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <Link to="/about" className="text-lg font-bold hover-grapevne-blue transition-colors lowercase" style={{ color: '#1a1a1a' }}>
                About
              </Link>
              {location.pathname === '/about' && (
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
          {/* First Section - Image Left, Text Right */}
          <section className="flex flex-col md:flex-row items-center gap-8 md:gap-6">
            <div className="w-full md:w-1/2">
              <img 
                src="/walking.jpg" 
                alt="Grapevne community" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
                We're here to make what's already happening easier to find.
              </h2>
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', textAlign: 'justify' }}>
                Grapevne is a campus platform for free food and other moments that don't last long. By showing what exists in real time, we help students move through campus with more awareness - and less waste.
              </p>
            </div>
          </section>

          {/* Second Section - Text Left, Image Right */}
          <section className="flex flex-col md:flex-row items-center gap-8 md:gap-6">
            <div className="w-full md:w-1/2 space-y-6 order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#1a1a1a' }}>
                What makes us different
              </h2>
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', textAlign: 'justify' }}>
                A lot of what happens on campus spreads quietly. Someone hears about it, tells a friend, and if you're nearby, you make it in time. Grapevne is built to surface those moments - before they pass.
              </p>
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', textAlign: 'justify' }}>
                We focus on availability over popularity. Free food and other finite moments show up suddenly and fade fast. By showing what's available in real time, we help students see what's happening around them, not what's trending elsewhere - and move through campus with more awareness and less waste.
              </p>
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', textAlign: 'justify' }}>
                Free food is the entry point. But Grapevne isn't just about food. It's about the moments that don't last long, but are worth noticing while they do - and deciding whether you're on your way.
              </p>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <img 
                src="/girl.png" 
                alt="Grapevne moments" 
                className="w-full h-auto object-cover"
              />
            </div>
          </section>

          {/* Third Section - Image Left, Text Right */}
          <section className="flex flex-col md:flex-row items-start gap-8 md:gap-6 relative">
            <div className="w-full md:w-1/2">
              <img 
                src="/friends.png" 
                alt="Grapevne team" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6">
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
                , still working from inside the environments it serves.
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
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base transition-colors block group"
                        style={{ 
                          color: '#1a1a1a', 
                          wordWrap: 'break-word', 
                          overflowWrap: 'break-word',
                          maxWidth: '100%',
                          display: 'block'
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
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </main>


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
            <Link to="/ambassadors" className="hover-grapevne-blue transition-colors footer-link">Ambassadors</Link>
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

