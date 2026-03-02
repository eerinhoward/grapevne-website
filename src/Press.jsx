import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Press() {
  const location = useLocation()
  const ticketsContainerRef = useRef(null)
  const ticketRefs = useRef([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [reachedEnd, setReachedEnd] = useState(false)
  const logoRef = useRef(null)
  const currentRotateX = useRef(0)
  const currentRotateY = useRef(0)
  const targetRotateX = useRef(0)
  const targetRotateY = useRef(0)
  const animationFrameId = useRef(null)
  const scrollAnimationFrameId = useRef(null)
  const scrollPositionRef = useRef(0)

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
      
      if (ticketsContainerRef.current) {
        const containerWidth = ticketsContainerRef.current.scrollWidth
        const viewportWidth = window.innerWidth
        const maxTranslate = Math.max(0, containerWidth - viewportWidth)
        
        // Check if we're at the end and scrolling down, or at the start and scrolling up
        const atEnd = scrollPositionRef.current >= maxTranslate - 10
        const atStart = scrollPositionRef.current <= 10
        const scrollingDown = e.deltaY > 0
        const scrollingUp = e.deltaY < 0
        
        // If at end and scrolling down, allow vertical scroll
        if (atEnd && scrollingDown) {
          setReachedEnd(true)
          return // Don't prevent default, allow vertical scroll
        }
        
        // If at start and scrolling up, allow vertical scroll
        if (atStart && scrollingUp) {
          return // Don't prevent default, allow vertical scroll
        }
        
        // If we were in vertical scroll mode but now scrolling back
        if (scrollingUp && atEnd) {
          setReachedEnd(false)
        }
        
        e.preventDefault()
        // Add velocity based on scroll delta
        const delta = e.deltaY * 0.5
        velocity += delta * 0.1 // Accumulate velocity
        targetPosition += delta
        
        // Limit scroll bounds
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
        
        // Track scroll position in ref
        scrollPositionRef.current = scrollPosition
        
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
    
    // Handle scroll event for detecting scroll back to top
    const handleScroll = () => {
      if (window.scrollY <= 0) {
        setReachedEnd(false)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      if (scrollAnimationFrameId.current) {
        cancelAnimationFrame(scrollAnimationFrameId.current)
      }
    }
  }, [selectedItem])

  // Sample testimonials/press items - replace with real content
  const photoshootImages = [
    "/Photoshoot1.jpg",
    "/Photoshoot2.png",
    "/Photoshoot3.jpg",
    "/HenryBayhaXP2C7783-2 (1).jpg",
    "/HenryBayhaXP2C7839 (1).jpg",
    "/Screenshot 2026-01-02 at 10.51.10 PM.png",
    "/Screenshot 2026-01-02 at 10.52.05 PM.png",
    "/Photoshoot1.jpg",
    "/Photoshoot2.png"
  ]

  const pressItems = [
    {
      id: 1,
      title: "Revolutionizing Campus Food Discovery",
      author: "Campus Tech Review",
      source: "campustech.review",
      quote: "Grapevne transforms how students find free food on campus while providing valuable insights to universities.",
      teamMember: false,
      image: photoshootImages[0]
    },
    {
      id: 2,
      title: "A Game Changer for Student Life",
      author: "Erin Howard",
      source: "Founder",
      quote: "The app addresses food waste and social isolation simultaneously - a win-win for campuses.",
      teamMember: true,
      image: photoshootImages[1]
    },
    {
      id: 3,
      title: "Gen Z's New Favorite App",
      author: "Tech Campus",
      source: "techcampus.com",
      quote: "Finally, a campus app that students actually want to use. The free food angle is genius.",
      teamMember: false,
      image: photoshootImages[2]
    },
    {
      id: 4,
      title: "Sustainability Meets Innovation",
      author: "Green Campus",
      source: "greencampus.org",
      quote: "Grapevne's approach to reducing food waste through student engagement is innovative and effective.",
      teamMember: false,
      image: photoshootImages[3]
    },
    {
      id: 5,
      title: "Trinity College Partnership",
      author: "Trinity News",
      source: "trinity.edu/news",
      quote: "Trinity becomes the first official partner, bringing real-time behavioral insights to campus operations.",
      teamMember: false,
      image: photoshootImages[4]
    },
    {
      id: 6,
      title: "The Future of Campus Analytics",
      author: "Higher Ed Tech",
      source: "higheredtech.com",
      quote: "Universities gain unprecedented visibility into student movement and engagement patterns.",
      teamMember: false,
      image: photoshootImages[5]
    },
    {
      id: 7,
      title: "Brand Engagement on Campus",
      author: "Marketing Campus",
      source: "marketingcampus.io",
      quote: "Brands can now understand campus-level interest and run more effective activations.",
      teamMember: false,
      image: photoshootImages[6]
    },
    {
      id: 8,
      title: "Utility-First Design Wins",
      author: "UX Campus",
      source: "uxcampus.design",
      quote: "By focusing on daily utility, Grapevne achieves higher engagement than typical campus apps.",
      teamMember: false,
      image: photoshootImages[7]
    },
    {
      id: 9,
      title: "Building the Data Layer",
      author: "Data Campus",
      source: "datacampus.tech",
      quote: "Grapevne is building the behavioral data layer for closed institutional networks.",
      teamMember: false,
      image: photoshootImages[8]
    }
  ]

  return (
    <div className={`min-h-screen bg-white flex flex-col ${reachedEnd ? 'overflow-auto' : 'overflow-hidden h-screen'}`}>
      {/* Header with Logo */}
      <header className="pt-4 pb-4 px-4 relative flex-shrink-0" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <div className="flex justify-between items-center gap-2" style={{ perspective: '1000px' }}>
          <nav className="flex items-center gap-3 sm:gap-4 md:gap-6 pl-2 sm:pl-6 md:pl-12 flex-1 min-w-0 flex-shrink">
            <Link to="/universities" className="text-[13px] sm:text-base md:text-lg font-bold hover-grapevne-blue transition-colors lowercase whitespace-nowrap py-2 flex items-center shrink-0" style={{ color: '#1a1a1a' }}>universities</Link>
            <Link to="/brands" className="text-[13px] sm:text-base md:text-lg font-bold hover-grapevne-blue transition-colors lowercase whitespace-nowrap py-2 flex items-center shrink-0" style={{ color: '#1a1a1a' }}>brands</Link>
            <Link to="/about" className="text-[13px] sm:text-base md:text-lg font-bold hover-grapevne-blue transition-colors lowercase py-2 flex items-center shrink-0" style={{ color: '#1a1a1a' }}>about</Link>
            <Link to="/press" className="text-[13px] sm:text-base md:text-lg font-bold hover-grapevne-blue transition-colors lowercase py-2 flex items-center shrink-0" style={{ color: '#1a1a1a' }}>press</Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-6 md:pr-12 shrink-0">
            <a href="https://apps.apple.com/us/app/grapevne/id6745459372" target="_blank" rel="noopener noreferrer" className="text-[13px] sm:text-base md:text-lg font-bold hover-grapevne-blue transition-colors lowercase py-2 flex items-center whitespace-nowrap" style={{ color: '#1a1a1a' }}>download</a>
            <Link to="/" className="flex justify-center min-h-[44px] min-w-[44px] items-center">
              <img ref={logoRef} src="/filledTransparent.png" alt="Grapevne Logo" className="h-10 sm:h-14 md:h-20 lg:h-28 w-auto"
                style={{ 
                  transformStyle: 'preserve-3d',
                  willChange: 'transform'
                }}
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Kitchen Order Rail */}
      <main className="flex-1 flex flex-col justify-center py-6 overflow-hidden">
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
                  
                  {/* Image above title - edge to edge */}
                  <div className="w-full overflow-hidden" style={{ aspectRatio: '4/2' }}>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
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
              className="w-96 h-96 border-2 bg-white flex items-center justify-center relative overflow-hidden"
              style={{
                maxWidth: '80%',
                maxHeight: '80%',
                aspectRatio: '4 / 2',
                borderColor: '#3B82F6',
                borderStyle: 'dashed'
              }}
            >
              {/* Corner handles like macOS selection */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-2 border-blue-500 bg-white z-10"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 border-2 border-blue-500 bg-white z-10"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-2 border-blue-500 bg-white z-10"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-blue-500 bg-white z-10"></div>
              
              {/* Actual image */}
              {selectedItem.image && (
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              )}
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
      <footer className="py-2 px-4 bg-white fixed bottom-2 left-0 right-0">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-0.5">
          <div className="flex justify-center items-center gap-3">
            <span className="ip-symbol text-sm" style={{ transform: 'translateY(-1px)', color: '#1a1a1a' }}>®</span>
            <span className="ip-symbol text-sm" style={{ transform: 'translateY(1px)', color: '#1a1a1a' }}>™</span>
            <span className="ip-symbol text-sm" style={{ transform: 'translateY(-1px)', color: '#1a1a1a' }}>©</span>
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

export default Press

