import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ContactForm from './ContactForm'

function Brands() {
  const location = useLocation()
  const logoRef = useRef(null)
  const currentRotateX = useRef(0)
  const currentRotateY = useRef(0)
  const targetRotateX = useRef(0)
  const targetRotateY = useRef(0)
  const animationFrameId = useRef(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // Scroll-lock horizontal state
  const horizontalScrollRef = useRef(null)
  const stickyContainerRef = useRef(null)
  const [horizontalProgress, setHorizontalProgress] = useState(0)
  

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

    // Scroll-lock: vertical scroll controls horizontal scroll
    const handleScroll = () => {
      if (!stickyContainerRef.current || !horizontalScrollRef.current) return
      
      const container = stickyContainerRef.current
      const scrollEl = horizontalScrollRef.current
      const maxScrollLeft = scrollEl.scrollWidth - scrollEl.clientWidth
      
      if (maxScrollLeft <= 0) return
      
      // Get the container's position
      const containerRect = container.getBoundingClientRect()
      const headerHeight = 140
      
      // Calculate how far we've scrolled into the sticky zone
      // The sticky zone starts when container top reaches header bottom
      // and ends when we've scrolled an amount equal to the horizontal scroll width
      const scrollIntoContainer = -containerRect.top + headerHeight
      const scrollRange = container.offsetHeight - window.innerHeight
      
      if (scrollIntoContainer >= 0 && scrollIntoContainer <= scrollRange) {
        // We're in the sticky zone - translate vertical to horizontal
        const progress = Math.min(1, Math.max(0, scrollIntoContainer / scrollRange))
        setHorizontalProgress(progress)
        scrollEl.scrollLeft = progress * maxScrollLeft
      } else if (scrollIntoContainer < 0) {
        // Before sticky zone
        setHorizontalProgress(0)
        scrollEl.scrollLeft = 0
      } else {
        // After sticky zone
        setHorizontalProgress(1)
        scrollEl.scrollLeft = maxScrollLeft
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial call
    setTimeout(handleScroll, 100)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

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
          <div className="flex items-center gap-3 pr-8 md:pr-12">
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
                className="h-28 w-auto"
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
      <main className="py-20" style={{ paddingTop: '140px', paddingBottom: '0' }}>
          {/* Hero Section */}
        <section className="text-left pt-12 pb-8 min-h-[600px] pl-8 md:pl-16 pr-8 md:pr-16">
            <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight" style={{ fontFamily: '"Futura Bold", sans-serif' }}>
                <span style={{ color: 'var(--grapevne-blue)' }}>Brands,</span><br />
                <span style={{ color: '#1a1a1a' }}>for our college generation.</span>
              </h1>
              
              {/* 1x5 Grid Image */}
              <div className="grid grid-cols-5 gap-0 -ml-8 md:-ml-16 -mr-8 md:-mr-16" style={{ width: 'calc(100% + 4rem)' }}>
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'sepia(1) hue-rotate(180deg) saturate(2)' }}>
                <img 
                  src="/pizza food.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'sepia(1) hue-rotate(300deg) saturate(2)' }}>
                <img 
                  src="/pizza food.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'sepia(1) hue-rotate(60deg) saturate(2)' }}>
                <img 
                  src="/pizza food.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'grayscale(1)' }}>
                <img 
                  src="/pizza food.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                <img 
                  src="/pizza food.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
              {/* Brand Description */}
                <div className="space-y-0.5 text-right">
                <p className="text-2xl leading-relaxed font-bold" style={{ color: '#1a1a1a', fontFamily: '"Futura Bold", sans-serif' }}>
                    Brands don't live on campus. <span style={{ color: 'var(--grapevne-blue)' }}>Grapevne</span> does.
                </p>
                <p className="text-2xl leading-relaxed font-bold" style={{ color: '#1a1a1a', fontFamily: '"Futura Bold", sans-serif' }}>
                    <span style={{ color: 'var(--grapevne-blue)' }}>Grapevne</span> provides the consistent entry point for on-campus activations.
                </p>
              </div>
            </div>
          </section>

          {/* Scroll-Locked Horizontal Narrative Section */}
          {/* This container is tall to provide scroll space for the horizontal progression */}
          <div 
            ref={stickyContainerRef}
            style={{ height: '300vh' }}
          >
            {/* Sticky wrapper that stays in view while scrolling */}
            <div 
              className="sticky top-[140px] bg-white py-8"
              style={{ height: 'calc(100vh - 180px)' }}
            >
              {/* Progress indicator */}
              <div className="flex items-center mb-8 pl-8 md:pl-16 pr-8 md:pr-16">
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-100"
                    style={{ 
                      width: `${horizontalProgress * 100}%`,
                      backgroundColor: 'var(--grapevne-blue)'
                    }}
                  />
                </div>
              </div>
              
              {/* Horizontal scroll container - controlled by vertical scroll */}
              <div 
                ref={horizontalScrollRef}
                id="brands-narrative-scroll"
                className="flex gap-8 overflow-x-hidden pb-4 h-full items-center"
                style={{ 
                  scrollbarWidth: 'none', 
                  msOverflowStyle: 'none'
                }}
              >
              
              {/* Card 1 */}
              <div className="flex-shrink-0 w-80 md:w-96 pl-8 md:pl-16" style={{ minWidth: '320px' }}>
                <div className="h-48 md:h-64 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img src="/iphone image.png" alt="" className="h-full object-contain transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Futura Bold", sans-serif', color: '#1a1a1a' }}>
                  Short-lived by nature.
                </h3>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Events. Activations. Surplus product.
                </p>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Pick the window. Post it. Your brand shows up at the top of the feed.
                </p>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  It fades when it's over.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex-shrink-0 w-80 md:w-96" style={{ minWidth: '320px' }}>
                <div className="h-48 md:h-64 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img 
                    src="/notification.png" 
                    alt="Push notification example" 
                    className="h-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Futura Bold", sans-serif', color: '#1a1a1a' }}>
                  Campus-wide reach.
                </h3>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  You don't really know who will care until it's there.
                </p>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  We don't try to guess. <span style={{ color: 'var(--grapevne-blue)' }}>Grapevne</span> puts it in front of the campus right away.
                </p>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  One notification. Everyone on campus. No detours.
                </p>
              </div>

{/* Card 5: Ambassadors */}
              <div className="flex-shrink-0 w-80 md:w-96" style={{ minWidth: '320px' }}>
                <div className="h-48 md:h-64 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img src="/iphone image.png" alt="" className="h-full object-contain transition-transform duration-300 hover:scale-105" />
                          </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Futura Bold", sans-serif', color: '#1a1a1a' }}>
                  Ambassadors.
                </h3>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  A direct way for ambassadors to share products with their campus.
                </p>
                      </div>

              {/* Card 6: Low friction by design */}
              <div className="flex-shrink-0 w-80 md:w-96" style={{ minWidth: '320px' }}>
                <div className="h-48 md:h-64 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img src="/iphone image.png" alt="" className="h-full object-contain transition-transform duration-300 hover:scale-105" />
                    </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Futura Bold", sans-serif', color: '#1a1a1a' }}>
                  Designed for real turnout.
                </h3>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  See response speed and compare outcomes across campuses.
                </p>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Context helps teams understand what's working.
                </p>
                  </div>

              {/* Card 7: Deployed one campus at a time */}
              <div className="flex-shrink-0 w-80 md:w-96 pr-8 md:pr-16" style={{ minWidth: '320px' }}>
                <div className="h-48 md:h-64 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img src="/iphone image.png" alt="" className="h-full object-contain transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Futura Bold", sans-serif', color: '#1a1a1a' }}>
                  Deployed one campus at a time.
                </h3>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Brand activity aligns with institutional access, local norms, and the physical constraints of each university.
                </p>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  One campus. Then the next.
                </p>
              </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <section 
            className="w-full"
            style={{ backgroundColor: '#fafafa', position: 'static' }}
          >
            <video 
              src="/demo.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
              style={{ display: 'block' }}
            />
          </section>

          {/* Final Section: Full-Screen Device Mockup */}
          <section 
            className="min-h-screen flex flex-col items-center justify-center px-8 md:px-16 relative"
            style={{ backgroundColor: '#fafafa' }}
          >
            <div className="max-w-4xl mx-auto text-center mb-12 md:pt-24" style={{ paddingTop: '3.25rem' }}>
              <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: '"Futura Bold", sans-serif', color: '#1a1a1a' }}>
                The campus wants it. We make sure they hear about it.
              </h2>
              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="inline-block bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
              >
                {isFormOpen ? 'Close Form' : 'Get in Touch'}
              </button>
            </div>
            
            {/* Device Mockup */}
            <div className="relative w-full max-w-md mx-auto">
              <img 
                src="/iphone image.png" 
                alt="Grapevne app on iPhone" 
                className="w-full h-auto mx-auto"
                style={{ maxHeight: '60vh', objectFit: 'contain' }}
              />
            </div>
          </section>

          {/* Contact Form */}
          <section className="transition-all duration-500 ease-in-out px-8 md:px-16 pb-8">
            <ContactForm 
              isOpen={isFormOpen} 
              onClose={() => setIsFormOpen(false)}
              emailTo="brands@grapevneapp.com"
            />
          </section>
      </main>

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
            <span className="text-gray-400 font-medium ml-2">LEGAL AREA</span>
            <Link to="/terms" className="hover-grapevne-blue transition-colors footer-link">Terms</Link>
            <Link to="/privacy" className="hover-grapevne-blue transition-colors footer-link">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Brands