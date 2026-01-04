import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ContactForm from './ContactForm'

function Universities() {
  const location = useLocation()
  const logoRef = useRef(null)
  const currentRotateX = useRef(0)
  const currentRotateY = useRef(0)
  const targetRotateX = useRef(0)
  const targetRotateY = useRef(0)
  const animationFrameId = useRef(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const lastScrollY = useRef(0)
  const [scrollStep, setScrollStep] = useState(0) // 0 = initial, 1 = Place and trust, 2 = Shared by the people already there, 3 = Make it legible
  const scrollStepRef = useRef(0)
  const isScrollingRef = useRef(false)
  const [hoveredPartner, setHoveredPartner] = useState(null)
  const [selectedPartnerIndex, setSelectedPartnerIndex] = useState(null)
  const [showUseCases, setShowUseCases] = useState(false)
  
  // Define scroll positions for each step - calculated dynamically
  const getScrollPositions = () => {
    const vh = window.innerHeight
    // Hero section is approximately 800px (600px min-height + padding)
    const heroHeight = 800
    const sectionHeight = vh  // Match the actual content section height (min-h-screen)
    return {
      0: 0,                           // Initial position (hero)
      1: heroHeight,                  // Place and trust section
      2: heroHeight + sectionHeight,      // Shared by the people already there section
      3: heroHeight + sectionHeight * 2,  // Make it legible section
      4: heroHeight + sectionHeight * 3,  // Make reporting real section
      5: heroHeight + sectionHeight * 4   // It becomes routine section
    }
  }

  const partners = [
    {
      name: 'Trinity College',
      image: '/trinitylogo.svg',
      description: `At Trinity College, Grapevne is being implemented in partnership with the Sustainability Department to notify students about available leftover food on campus.

Instead of relying on ad-hoc emails, word of mouth, or last-minute signage, Grapevne provides a simple way to: notify students when surplus food is available, thereby reduce food waste from campus events and meetings, and support sustainability initiatives without adding staff overhead.

The app is launching campus-wide in Spring 2026 as part of Trinity's broader sustainability efforts.`
    },
    {
      name: 'Stevens',
      image: '/stevens.png',
      description: 'Stevens Institute of Technology partner description coming soon.'
    }
  ]

  const handlePartnerClick = (index) => {
    setSelectedPartnerIndex(index)
  }

  const handleNext = () => {
    setSelectedPartnerIndex((prev) => (prev + 1) % partners.length)
  }

  const handlePrev = () => {
    setSelectedPartnerIndex((prev) => (prev - 1 + partners.length) % partners.length)
  }

  const handleCloseGallery = () => {
    setSelectedPartnerIndex(null)
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedPartnerIndex !== null) {
        if (e.key === 'ArrowRight' || e.key === '+' || e.key === '=') {
          setSelectedPartnerIndex((prev) => (prev + 1) % partners.length)
        } else if (e.key === 'ArrowLeft' || e.key === '-') {
          setSelectedPartnerIndex((prev) => (prev - 1 + partners.length) % partners.length)
        } else if (e.key === 'Escape') {
          setSelectedPartnerIndex(null)
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [selectedPartnerIndex, partners.length])

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
      const isClickable = target.closest('a, button, [onclick], [role="button"]')
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

  useEffect(() => {
    const handleWheel = (e) => {
      // Don't interfere if form is open
      if (isFormOpen) return
      
      e.preventDefault()
      
      if (isScrollingRef.current) return
      isScrollingRef.current = true
      
      const scrollingDown = e.deltaY > 0
      let targetStep = scrollStepRef.current
      
      if (scrollingDown) {
        // Scrolling down - advance to next step
        if (scrollStepRef.current < 5) {
          targetStep = scrollStepRef.current + 1
        }
      } else {
        // Scrolling up - go back to previous step
        if (scrollStepRef.current > 0) {
          targetStep = scrollStepRef.current - 1
        }
      }
      
      if (targetStep !== scrollStepRef.current) {
        scrollStepRef.current = targetStep
        setScrollStep(targetStep)
        
        // Smooth scroll to target position
        const positions = getScrollPositions()
        window.scrollTo({
          top: positions[targetStep],
          behavior: 'smooth'
        })
        
        // Reset scrolling flag after animation
        setTimeout(() => {
          isScrollingRef.current = false
        }, 300)
      } else {
        isScrollingRef.current = false
      }
    }
    
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const positions = getScrollPositions()
      
      // Update step based on scroll position (for initial load or direct navigation)
      let newStep = 0
      if (scrollY >= positions[5] - 50) {
        newStep = 5
      } else if (scrollY >= positions[4] - 50) {
        newStep = 4
      } else if (scrollY >= positions[3] - 50) {
        newStep = 3
      } else if (scrollY >= positions[2] - 50) {
        newStep = 2
      } else if (scrollY >= positions[1] - 50) {
        newStep = 1
      }
      
      if (scrollStepRef.current !== newStep) {
        scrollStepRef.current = newStep
        setScrollStep(newStep)
      }
      
      // Header show/hide based on scroll direction
      // Always show at top of page
      if (scrollY < 100) {
        setShowHeader(true)
      } else if (scrollY < lastScrollY.current) {
        // Scrolling up - show header
        setShowHeader(true)
      } else if (scrollY > lastScrollY.current) {
        // Scrolling down - hide header
        setShowHeader(false)
      }
      
      lastScrollY.current = scrollY
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isFormOpen])

  return (
    <div className="min-h-screen bg-white">
      {/* Background Strip */}
      <div 
        className="fixed top-0 left-0 right-0 h-[120px] bg-white z-10"
      />
      
      {/* Header with Logo - always visible */}
      <header 
        className="pt-4 pb-4 px-4 fixed top-0 left-0 right-0 bg-white z-20"
      >
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
      <main className="pl-8 md:pl-16 pr-8 md:pr-16 py-20" style={{ paddingTop: '140px', paddingBottom: '40px' }}>
        <div className="space-y-16">
          {/* Hero Section */}
          <section className="text-left pt-12 pb-8 min-h-[600px] relative">
            {/* Step 0: Hero with header and partner pills */}
            <div 
              className="absolute inset-0 transition-opacity duration-300"
              style={{ 
                opacity: scrollStep === 0 ? 1 : 0,
                pointerEvents: scrollStep === 0 ? 'auto' : 'none'
              }}
            >
              {/* Partner Pills - absolutely positioned at bottom left of hero section */}
              {partners.map((partner, index) => {
                const rotations = [-2, 1.5]
                const rotation = rotations[index] || 0
                const delays = ['0s', '0.3s']
                const delay = delays[index] || '0s'
                
                // Position at bottom left, stacked vertically - moved up slightly
                const leftPosition = index === 0 ? '6rem' : '0'
                const bottomPosition = index === 0 ? '2.75rem' : '6.25rem'
                
                return (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      bottom: bottomPosition,
                      left: leftPosition,
                      transform: `rotate(${rotation}deg)`,
                      zIndex: hoveredPartner === index ? 1000 : index
                    }}
                  >
                    <button
                      onClick={() => handlePartnerClick(index)}
                      className={`partner-pill-bounce border border-black bg-white rounded-full text-base font-medium hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center ${partner.image && partner.name === 'Stevens' ? '' : 'px-6 py-3'}`}
                      onMouseEnter={() => setHoveredPartner(index)}
                      onMouseLeave={() => setHoveredPartner(null)}
                      style={{
                        color: '#1a1a1a',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        whiteSpace: 'nowrap',
                        padding: partner.image ? (partner.name === 'Stevens' ? '0' : '12px 16px') : undefined,
                        animationDelay: delay
                      }}
                    >
                      {partner.image ? (
                        <img src={partner.image} alt={partner.name} className={partner.name === 'Stevens' ? 'h-24 w-auto object-contain' : 'h-12 w-auto object-contain'} style={partner.name === 'Stevens' ? { margin: '-6px' } : {}} />
                      ) : (
                        <>
                          {partner.name} →
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
              
              <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 relative">
                {/* Header */}
              <h1 className="text-6xl md:text-7xl font-bold leading-tight" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                  Built for <span style={{ color: 'var(--grapevne-blue)' }}>Universities.</span><br />
                  <span style={{ color: '#1a1a1a' }}>Designed for Students.</span>
              </h1>
              
              {/* 1x5 Grid Image */}
              <div className="grid grid-cols-5 gap-0 -ml-8 md:-ml-16 -mr-8 md:-mr-16" style={{ width: 'calc(100% + 4rem)' }}>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'grayscale(1)' }}>
                  <img 
                    src="/university.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'sepia(1) hue-rotate(60deg) saturate(2)' }}>
                  <img 
                    src="/university2.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                  <img 
                    src="/university.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'sepia(1) hue-rotate(180deg) saturate(2)' }}>
                  <img 
                    src="/university2.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'sepia(1) hue-rotate(300deg) saturate(2)' }}>
                  <img 
                    src="/university.jpg" 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Folder Tabs - commented out */}
              {/*
              <div className="fixed left-0 right-0" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw', minHeight: '120px', bottom: '75px' }}>
                <div 
                  className="absolute py-2 px-6 text-sm font-bold uppercase tracking-wide"
                  style={{ 
                    backgroundColor: '#DCDCDC',
                    color: '#1a1a1a',
                    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
                    paddingRight: '32px',
                    width: '50%',
                    top: '0',
                    left: '0',
                    height: '120px',
                    zIndex: 1
                  }}
                >
                  Travel
                </div>
                <div 
                  className="absolute py-2 text-sm font-bold uppercase tracking-wide"
                  style={{ 
                    backgroundColor: '#3FA9F5',
                    color: 'white',
                    clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%)',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    top: '0',
                    left: 'calc(50% - 20px)',
                    right: '0',
                    height: '120px',
                    zIndex: 2
                  }}
                >
                  Energy
                </div>
                <div 
                  className="absolute py-2 px-6 text-sm font-bold uppercase tracking-wide"
                  style={{ 
                    backgroundColor: '#3FA9F5',
                    color: 'white',
                    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) calc(100% - 20px), calc(100% - 40px) 100%, 0 100%)',
                    paddingRight: '32px',
                    width: '28%',
                    top: '40px',
                    left: '0',
                    height: '80px',
                    zIndex: 3
                  }}
                >
                  Waste
                </div>
                <div 
                  className="absolute py-2 text-sm font-bold uppercase tracking-wide"
                  style={{ 
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    clipPath: 'polygon(20px 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    top: '40px',
                    left: 'calc(28% - 20px)',
                    width: '28%',
                    height: '80px',
                    zIndex: 2
                  }}
                >
                  Catering
                </div>
                <div 
                  className="absolute py-2 text-sm font-bold uppercase tracking-wide"
                  style={{ 
                    backgroundColor: '#0CAD55',
                    color: 'white',
                    clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%)',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    top: '40px',
                    left: 'calc(56% - 40px)',
                    right: '0',
                    height: '40px',
                    zIndex: 3
                  }}
                >
                  Suppliers
                </div>
                <div 
                  className="absolute py-2 px-6 text-sm font-bold uppercase tracking-wide"
                  style={{ 
                    backgroundColor: '#F66800',
                    color: 'white',
                    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
                    paddingRight: '32px',
                    width: '45%',
                    top: '80px',
                    left: '0',
                    height: '40px',
                    zIndex: 3
                  }}
                >
                  Community
                </div>
                <div 
                  className="absolute py-2 text-sm font-bold uppercase tracking-wide"
                  style={{ 
                    backgroundColor: '#DCDCDC',
                    color: '#1a1a1a',
                    clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%)',
                    paddingLeft: '32px',
                    paddingRight: '32px',
                    top: '80px',
                    left: 'calc(45% - 20px)',
                    right: '0',
                    height: '40px',
                    zIndex: 4
                  }}
                >
                  Conclusion
                </div>
              </div>
              */}
              </div>
            </div>
            
          </section>

          {/* Narrative Sections with Sticky Navigation - Step 1+ */}
          <section className="relative" style={{ minHeight: '500vh' }}>
            <div className="flex gap-12">
              {/* Sticky Left Navigation */}
              <div 
                className="sticky self-start transition-opacity duration-300"
                style={{ 
                  width: '30%', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  opacity: scrollStep >= 1 ? 1 : 0,
                  pointerEvents: scrollStep >= 1 ? 'auto' : 'none'
                }}
              >
                <nav className="space-y-6">
                  <div
                    className={`cursor-pointer transition-colors ${scrollStep === 1 ? 'font-bold' : 'font-normal'}`}
                    style={{ 
                      color: scrollStep === 1 ? '#1a1a1a' : '#999',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontSize: '1.125rem'
                    }}
                    onClick={() => {
                      scrollStepRef.current = 1
                      setScrollStep(1)
                      const positions = getScrollPositions()
                      window.scrollTo({ top: positions[1], behavior: 'smooth' })
                    }}
                  >
                    Place and trust.
                  </div>
                  <div 
                    className={`cursor-pointer transition-colors ${scrollStep === 2 ? 'font-bold' : 'font-normal'}`}
                    style={{ 
                      color: scrollStep === 2 ? '#1a1a1a' : '#999',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontSize: '1.125rem'
                    }}
                    onClick={() => {
                      scrollStepRef.current = 2
                      setScrollStep(2)
                      const positions = getScrollPositions()
                      window.scrollTo({ top: positions[2], behavior: 'smooth' })
                    }}
                  >
                    Shared by the people already there.
                  </div>
                  <div 
                    className={`cursor-pointer transition-colors ${scrollStep === 3 ? 'font-bold' : 'font-normal'}`}
                    style={{ 
                      color: scrollStep === 3 ? '#1a1a1a' : '#999',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontSize: '1.125rem'
                    }}
                    onClick={() => {
                      scrollStepRef.current = 3
                      setScrollStep(3)
                      const positions = getScrollPositions()
                      window.scrollTo({ top: positions[3], behavior: 'smooth' })
                    }}
                  >
                    Make it legible.
                  </div>
                  <div 
                    className={`cursor-pointer transition-colors ${scrollStep === 4 ? 'font-bold' : 'font-normal'}`}
              style={{ 
                      color: scrollStep === 4 ? '#1a1a1a' : '#999',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontSize: '1.125rem'
                    }}
                    onClick={() => {
                      scrollStepRef.current = 4
                      setScrollStep(4)
                      const positions = getScrollPositions()
                      window.scrollTo({ top: positions[4], behavior: 'smooth' })
                    }}
                  >
                    Make reporting real.
            </div>
            <div 
                    className={`cursor-pointer transition-colors ${scrollStep === 5 ? 'font-bold' : 'font-normal'}`}
              style={{ 
                      color: scrollStep === 5 ? '#1a1a1a' : '#999',
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontSize: '1.125rem'
                    }}
                    onClick={() => {
                      scrollStepRef.current = 5
                      setScrollStep(5)
                      const positions = getScrollPositions()
                      window.scrollTo({ top: positions[5], behavior: 'smooth' })
                    }}
                  >
                    It becomes routine.
                  </div>
                </nav>
              </div>
              
              {/* Right Column - Narrative Content */}
              <div className="flex-1">
                {/* Step 1: Place and trust section */}
                <div 
                  className="min-h-screen flex items-center transition-colors duration-300"
                >
                  <div className="w-full space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 1 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Place and trust.
                    </h2>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 1 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Things work better when they're built for the place they're used.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 1 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Everything you see is specific to your campus.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 1 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Students, organizers, and campus affiliates join through their university.
                    </p>
                  </div>
                </div>

                {/* Step 2: Shared by the people already there section */}
                <div 
                  className="min-h-screen flex items-center transition-colors duration-300"
                >
                  <div className="w-full space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 2 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Shared by the people already there.
                    </h2>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 2 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Posting takes seconds. Checking takes even less.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 2 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      When students are looking, they know where to check.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 2 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      When food is left over, organizers know where to share it.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 2 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      It's the same place. Every time.
                    </p>
                  </div>
                </div>

                {/* Step 3: Make it legible section */}
                <div 
                  className="min-h-screen flex items-center transition-colors duration-300"
                >
                  <div className="w-full space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 3 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Make it legible.
                    </h2>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 3 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Built for campus life. Clear. Immediate. Uncluttered.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 3 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      When free food becomes available, students hear about it in time.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 3 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Designed to feel like second nature.
                    </p>
                    <div className="pt-6">
                      <img 
                        src="/push-notification.png" 
                        alt="Push notification example" 
                        className="max-w-md rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 4: Make reporting real section */}
                <div 
                  className="min-h-screen flex items-center transition-colors duration-300"
                >
                  <div className="w-full space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 4 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Make reporting real.
                    </h2>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 4 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      When sharing happens in one place, it's easier to see what's actually happening.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 4 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Universities get a clearer picture of surplus activity over time.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 4 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      Not through surveys or estimates, but through everyday use.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 4 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      That visibility supports sustainability reporting and planning, without adding work for students or staff.
                    </p>
                  </div>
                </div>

                {/* Step 5: It becomes routine section */}
                <div 
                  className="min-h-screen flex items-center transition-colors duration-300"
                >
                  <div className="w-full space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 5 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      It becomes routine.
                    </h2>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 5 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      It takes less effort than the alternatives.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 5 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      So people keep using it.
                    </p>
                    <p className="text-xl leading-relaxed transition-colors duration-300" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: scrollStep === 5 ? 'var(--grapevne-blue)' : '#1a1a1a' }}>
                      And when people keep using it, it becomes the place campus turns to.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center pt-8">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
            >
              {isFormOpen ? 'Close Form' : 'Get in Touch'}
            </button>
          </section>

          {/* Contact Form */}
          <section className="transition-all duration-500 ease-in-out">
            <ContactForm 
              isOpen={isFormOpen} 
              onClose={() => setIsFormOpen(false)}
              emailTo="universities@grapevneapp.com"
            />
          </section>

        </div>
      </main>

      {/* Partner Gallery Modal */}
      {selectedPartnerIndex !== null && (
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
              className="fixed right-8 md:right-16 top-8 text-xl md:text-2xl font-bold z-10"
              style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              exit
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
              {/* Partner Pill */}
              <div className="mb-6 w-full flex justify-start">
                <div
                  className={`border border-black bg-white rounded-full flex items-center justify-center ${partners[selectedPartnerIndex].name === 'Stevens' ? '' : 'px-6 py-3'}`}
                  style={{
                    transform: `rotate(${partners[selectedPartnerIndex].name === 'Trinity College' ? '-2deg' : '1.5deg'})`,
                    padding: partners[selectedPartnerIndex].image ? (partners[selectedPartnerIndex].name === 'Stevens' ? '0' : '12px 16px') : undefined
                  }}
                >
                  {partners[selectedPartnerIndex].image ? (
                    <img 
                      src={partners[selectedPartnerIndex].image} 
                      alt={partners[selectedPartnerIndex].name} 
                      className={partners[selectedPartnerIndex].name === 'Stevens' ? 'h-24 w-auto object-contain' : 'h-12 w-auto object-contain'} 
                      style={partners[selectedPartnerIndex].name === 'Stevens' ? { margin: '-6px' } : {}} 
                    />
                  ) : (
                    <>
                      {partners[selectedPartnerIndex].name} →
                    </>
                  )}
                </div>
              </div>

              {/* Black bar */}
              <div className="w-full h-1 bg-black mb-6"></div>

              {/* Description */}
              <div 
                className="text-lg md:text-xl mb-8 w-full whitespace-pre-line"
                style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif', lineHeight: '1.6', textAlign: 'justify' }}
              >
                {partners[selectedPartnerIndex].description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer - anchored to bottom of page */}
      <footer className="pt-3 pb-4 px-4 bg-white">
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

export default Universities