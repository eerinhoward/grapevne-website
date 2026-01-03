import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Press() {
  const location = useLocation()
  const ticketsContainerRef = useRef(null)
  const ticketRefs = useRef([])
  const [selectedItem, setSelectedItem] = useState(null)
  const logoRef = useRef(null)
  const currentRotateX = useRef(0)
  const currentRotateY = useRef(0)
  const targetRotateX = useRef(0)
  const targetRotateY = useRef(0)
  const animationFrameId = useRef(null)
  const scrollAnimationFrameId = useRef(null)

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

      // Hide cursor when hovering over links or clickable elements
      const target = e.target
      const isClickable = target.closest('a, button, [onclick], [role="button"]')
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

        // Distance from cursor to logo center
        const dx = e.clientX - logoCenterX
        const dy = e.clientY - logoCenterY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Max distance for full effect (viewport diagonal)
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const maxDistance = Math.sqrt(viewportWidth * viewportWidth + viewportHeight * viewportHeight)
        const normalizedDistance = Math.min(distance / maxDistance, 1)
        
        // Inverted influence: farther = more rotation (moderate sensitivity)
        const influence = normalizedDistance * 0.35 + 0.2
        
        // Direction from cursor to logo (counter-intuitive: rotate away from cursor)
        const angle = Math.atan2(dy, dx)
        
        // Max rotation: moderate value between original and reduced
        const maxRotation = 60
        targetRotateY.current = Math.cos(angle) * maxRotation * influence
        targetRotateX.current = -Math.sin(angle) * maxRotation * influence
      }
    }

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(updateLogoTransform)

    // Physics state
    let scrollPosition = 0
    let velocity = 0
    let targetPosition = 0
    const friction = 0.92 // Damping factor
    const spring = 0.15 // Spring factor for smooth movement

    // Get all ticket elements
    const getTicketElements = () => {
      if (!ticketsContainerRef.current) return []
      return Array.from(ticketsContainerRef.current.children)
    }

    const handleWheel = (e) => {
      // Don't handle wheel if modal is open
      if (selectedItem) return
      
      e.preventDefault()
      if (ticketsContainerRef.current) {
        // Add velocity based on scroll delta
        const delta = e.deltaY * 0.5
        velocity += delta * 0.1 // Accumulate velocity
        targetPosition += delta
        
        // Limit scroll bounds
        const containerWidth = ticketsContainerRef.current.scrollWidth
        const viewportWidth = window.innerWidth
        const maxTranslate = Math.max(0, containerWidth - viewportWidth)
        targetPosition = Math.max(0, Math.min(targetPosition, maxTranslate))
      }
    }

    const handleKeyDown = (e) => {
      // Don't handle keys if modal is open
      if (selectedItem) {
        if (e.key === 'Escape') {
          setSelectedItem(null)
        }
        return
      }
      
      if (ticketsContainerRef.current) {
        const containerWidth = ticketsContainerRef.current.scrollWidth
        const viewportWidth = window.innerWidth
        const maxTranslate = Math.max(0, containerWidth - viewportWidth)
        const scrollAmount = 200 // Pixels to scroll per arrow key press
        
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          targetPosition = Math.max(0, targetPosition - scrollAmount)
          velocity = -scrollAmount * 0.2 // Add some velocity for smoothness
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          targetPosition = Math.min(maxTranslate, targetPosition + scrollAmount)
          velocity = scrollAmount * 0.2 // Add some velocity for smoothness
        }
      }
    }

    const animate = () => {
      if (ticketsContainerRef.current) {
        // Apply spring physics to position
        const diff = targetPosition - scrollPosition
        scrollPosition += diff * spring
        
        // Apply velocity with friction
        scrollPosition += velocity
        velocity *= friction
        
        // Update container position
        ticketsContainerRef.current.style.transform = `translateX(-${scrollPosition}px)`
        
        // Update ticket rotations based on velocity (swing effect)
        const tickets = getTicketElements()
        tickets.forEach((ticket) => {
          if (ticket && ticket.classList.contains('ticket-wrapper')) {
            const index = parseInt(ticket.getAttribute('data-index') || '0')
            const baseRotations = [-0.5, 0.3, -0.2, 0.4, -0.3, 0.2, -0.4, 0.5, -0.1]
            const baseRotation = baseRotations[index % baseRotations.length] || 0
            
            // Add dynamic rotation based on velocity (swing effect)
            // More velocity = more swing, with damping
            const velocityRotation = Math.min(Math.max(velocity * 0.03, -8), 8)
            const totalRotation = baseRotation + velocityRotation
            
            ticket.style.transform = `rotate(${totalRotation}deg)`
          }
        })
      }
      
      scrollAnimationFrameId.current = requestAnimationFrame(animate)
    }

    // Start animation loop
    animate()

    document.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      if (scrollAnimationFrameId.current) {
        cancelAnimationFrame(scrollAnimationFrameId.current)
      }
      document.body.removeChild(cursor)
      document.body.style.cursor = 'auto'
    }
  }, [selectedItem])

  // Sample testimonials/press items - replace with real content
  const pressItems = [
    {
      id: 1,
      title: "Revolutionizing Campus Food Discovery",
      author: "Campus Tech Review",
      source: "campustech.review",
      quote: "Grapevne transforms how students find free food on campus while providing valuable insights to universities.",
      teamMember: false
    },
    {
      id: 2,
      title: "A Game Changer for Student Life",
      author: "Erin Howard",
      source: "Founder",
      quote: "The app addresses food waste and social isolation simultaneously - a win-win for campuses.",
      teamMember: true
    },
    {
      id: 3,
      title: "Gen Z's New Favorite App",
      author: "Tech Campus",
      source: "techcampus.com",
      quote: "Finally, a campus app that students actually want to use. The free food angle is genius.",
      teamMember: false
    },
    {
      id: 4,
      title: "Sustainability Meets Innovation",
      author: "Green Campus",
      source: "greencampus.org",
      quote: "Grapevne's approach to reducing food waste through student engagement is innovative and effective.",
      teamMember: false
    },
    {
      id: 5,
      title: "Trinity College Partnership",
      author: "Trinity News",
      source: "trinity.edu/news",
      quote: "Trinity becomes the first official partner, bringing real-time behavioral insights to campus operations.",
      teamMember: false
    },
    {
      id: 6,
      title: "The Future of Campus Analytics",
      author: "Higher Ed Tech",
      source: "higheredtech.com",
      quote: "Universities gain unprecedented visibility into student movement and engagement patterns.",
      teamMember: false
    },
    {
      id: 7,
      title: "Brand Engagement on Campus",
      author: "Marketing Campus",
      source: "marketingcampus.io",
      quote: "Brands can now understand campus-level interest and run more effective activations.",
      teamMember: false
    },
    {
      id: 8,
      title: "Utility-First Design Wins",
      author: "UX Campus",
      source: "uxcampus.design",
      quote: "By focusing on daily utility, Grapevne achieves higher engagement than typical campus apps.",
      teamMember: false
    },
    {
      id: 9,
      title: "Building the Data Layer",
      author: "Data Campus",
      source: "datacampus.tech",
      quote: "Grapevne is building the behavioral data layer for closed institutional networks.",
      teamMember: false
    }
  ]

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header with Logo */}
      <header className="pt-4 pb-4 px-4 relative flex-shrink-0">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-center items-center gap-4">
            <div className="flex flex-col items-center">
              <Link to="/press" className="text-lg font-bold hover-grapevne-blue transition-colors lowercase" style={{ color: '#1a1a1a' }}>
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
              <Link to="/about" className="text-lg font-bold hover-grapevne-blue transition-colors lowercase" style={{ color: '#1a1a1a' }}>
                About
              </Link>
              {location.pathname === '/about' && (
                <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }}></div>
              )}
            </div>
          </div>
          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://www.linkedin.com/company/grapevneapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover-grapevne-blue transition-colors"
              style={{ color: '#1a1a1a' }}
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/grapevne.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover-grapevne-blue transition-colors"
              style={{ color: '#1a1a1a' }}
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162 0 3.403 2.759 6.162 6.162 6.162 3.403 0 6.162-2.759 6.162-6.162 0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://www.tiktok.com/@grapevne" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover-grapevne-blue transition-colors"
              style={{ color: '#1a1a1a' }}
              aria-label="TikTok"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Kitchen Order Rail */}
      <main className="flex-1 flex flex-col justify-center py-6 overflow-hidden">
        {/* Header Text */}
        <div className="text-left px-4 mb-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: 'var(--grapevne-blue)' }}>
            We brought the receipts 😮‍💨
          </h2>
        </div>
        
        {/* Order Rail - the metal bar */}
        <div className="relative mb-1" style={{ height: '6px', perspective: '1000px' }}>
          {/* 3D Top face - main rail surface */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #e2e8f0 0%, #cbd5e1 15%, #94a3b8 40%, #64748b 60%, #475569 85%, #334155 100%)',
              boxShadow: `
                0 4px 12px rgba(0,0,0,0.4),
                inset 0 2px 4px rgba(255,255,255,0.4),
                inset 0 -2px 2px rgba(0,0,0,0.3),
                0 0 0 1px rgba(0,0,0,0.1)
              `,
              borderRadius: '3px',
              transform: 'translateZ(2px)',
              transformStyle: 'preserve-3d'
            }}
          ></div>
          
          {/* Front face - gives depth */}
          <div 
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '2px',
              background: 'linear-gradient(to bottom, #475569 0%, #334155 50%, #1e293b 100%)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
              borderRadius: '0 0 3px 3px',
              transform: 'rotateX(90deg)',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d'
            }}
          ></div>
          
          {/* Metallic shine/highlight */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 25%, transparent 70%)',
              borderRadius: '3px',
              pointerEvents: 'none',
              transform: 'translateZ(1px)'
            }}
          ></div>
          
          {/* Subtle texture overlay */}
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 6px),
                repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)
              `,
              borderRadius: '3px',
              pointerEvents: 'none'
            }}
          ></div>
          
          {/* Bottom shadow for depth */}
          <div 
            className="absolute top-full left-0 right-0"
            style={{
              height: '4px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
              pointerEvents: 'none',
              filter: 'blur(2px)'
            }}
          ></div>
        </div>
        
        {/* Scrolling Tickets Container */}
        <div className="overflow-hidden pb-8">
          <div 
            ref={ticketsContainerRef}
            className="flex gap-6 px-8" 
            style={{ 
              minWidth: 'max-content'
            }}
          >
            {pressItems.map((item, index) => {
              // Base rotation for each ticket
              const rotations = [-0.5, 0.3, -0.2, 0.4, -0.3, 0.2, -0.4, 0.5, -0.1];
              const baseRotation = rotations[index % rotations.length];
              
              return (
              <div 
                key={item.id} 
                className="flex-shrink-0 w-64 relative ticket-wrapper"
                data-index={index}
                style={{
                  transform: `rotate(${baseRotation}deg)`,
                  transformOrigin: 'top center',
                  willChange: 'transform'
                }}
              >
                {/* Ticket Clip - attaches to rail */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-gray-400 rounded-t-lg border-2 border-gray-500 border-b-0 shadow-md"></div>
                
                {/* Ticket */}
                <div 
                  className="receipt-ticket border-2 border-gray-300 rounded-sm overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 relative mt-1 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Order Ticket Header - like kitchen ticket */}
                  <div className="bg-gray-50 border-b-2 border-dashed border-gray-300 px-3 py-2 flex items-center justify-between relative z-10" style={{ background: 'linear-gradient(to bottom, #f5f5f5 0%, #f0f0f0 100%)' }}>
                    <div className="text-xs font-mono text-gray-600 font-bold">
                      ORDER #{String(item.id).padStart(3, '0')}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.teamMember ? (
                        <span className="team-member-tag text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          {item.source.toUpperCase()}
                        </span>
                      ) : (
                        <div className="text-xs font-mono text-gray-500">
                          {item.source.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Ticket Content - like order items */}
                  <div className="p-4 relative z-10">
                    <div className="mb-3">
                      <div className="text-xs font-mono text-gray-500 mb-1">ITEM:</div>
                      <h2 className="text-base font-bold leading-tight mb-2" style={{ color: '#1a1a1a' }}>
                        {item.title}
                      </h2>
                    </div>
                    
                    <div className="mb-3 border-t border-dashed border-gray-200 pt-3">
                      <div className="text-xs font-mono text-gray-500 mb-1">FROM:</div>
                      <p className="text-sm text-gray-700 font-medium">
                        {item.author}
                      </p>
                    </div>
                    
                    <div className="border-t border-dashed border-gray-200 pt-3">
                      <div className="text-xs font-mono text-gray-500 mb-1">NOTES:</div>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        "{item.quote}"
                      </p>
                    </div>
                  </div>
                  
                  {/* Perforated edge effect at bottom */}
                  <div className="h-1 bg-gray-100 border-t border-dashed border-gray-300"></div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Fullscreen Detail View */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-white z-50 flex"
          onClick={() => setSelectedItem(null)}
        >
          {/* Left side - Image */}
          <div className="w-1/2 bg-white flex items-center justify-center p-12">
            <div 
              className="w-96 h-96 border-2 bg-white flex items-center justify-center relative"
              style={{
                maxWidth: '80%',
                maxHeight: '80%',
                aspectRatio: '1 / 1',
                borderColor: '#3B82F6',
                borderStyle: 'dashed'
              }}
            >
              {/* Corner handles like macOS selection */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-2 border-blue-500 bg-white"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-blue-500 bg-white"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-2 border-blue-500 bg-white"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-blue-500 bg-white"></div>
              
              {/* X lines for broken image placeholder */}
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="0" x2="100" y2="100" stroke="#3B82F6" strokeWidth="1"/>
                <line x1="100" y1="0" x2="0" y2="100" stroke="#3B82F6" strokeWidth="1"/>
              </svg>
            </div>
          </div>

          {/* Right side - Text Content */}
          <div className="w-1/2 flex flex-col justify-center p-12 relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedItem(null)
              }}
              className="absolute top-8 right-8 text-gray-400 text-4xl font-light leading-none"
              style={{ lineHeight: '1' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              ×
            </button>
            
            <div className="max-w-lg">
              <h1 className="text-5xl font-normal mb-8 leading-tight" style={{ color: '#1a1a1a' }}>
                {selectedItem.title}
              </h1>
              
              <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                "{selectedItem.quote}"
              </p>
              
              <div>
                <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">From</p>
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-lg font-medium" style={{ color: '#1a1a1a' }}>
                    {selectedItem.author}
                  </p>
                  {selectedItem.teamMember && (
                    <span className="team-member-tag text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {selectedItem.source.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {selectedItem.source}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 px-4 flex-shrink-0">
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
            <Link to="/terms" className="hover-grapevne-blue transition-colors footer-link">Terms of Service</Link>
            <Link to="/privacy" className="hover-grapevne-blue transition-colors footer-link">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Press

