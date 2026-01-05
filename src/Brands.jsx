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
  const [showUseCases, setShowUseCases] = useState(false)
  
  // Horizontal scroll state
  const horizontalScrollRef = useRef(null)
  const [horizontalProgress, setHorizontalProgress] = useState(0)
  const totalCards = 5
  

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

    // Track horizontal scroll progress
    const handleHorizontalScroll = () => {
      if (!horizontalScrollRef.current) return
      const scrollContainer = horizontalScrollRef.current
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth
      if (maxScrollLeft > 0) {
        setHorizontalProgress(scrollContainer.scrollLeft / maxScrollLeft)
      }
    }

    // Add scroll listener to horizontal container after mount
    const scrollContainer = horizontalScrollRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleHorizontalScroll, { passive: true })
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleHorizontalScroll)
      }
      document.body.removeChild(cursor)
      document.body.style.cursor = 'auto'
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
      <main className="py-20" style={{ paddingTop: '140px', paddingBottom: '0' }}>
        {/* Hero Section */}
        <section className="text-left pt-12 pb-8 min-h-[600px] pl-8 md:pl-16 pr-8 md:pr-16">
            <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
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
                <p className="text-xl leading-relaxed font-bold" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    On campus, brand events are the kind of thing you hear about too late.
                </p>
                <p className="text-xl leading-relaxed font-bold" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    You hear about it after the fact and realize you were next door.
                </p>
                <p className="text-xl leading-relaxed font-bold" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                    <span style={{ color: 'var(--grapevne-blue)' }}>Grapevne</span> is a real-time layer for brand presence on campus, where timing matters.
                </p>
                </div>
              </div>
          </section>

          {/* Horizontal Narrative Section */}
          <section className="py-16 pl-8 md:pl-16">
            {/* Progress indicator */}
            <div className="flex items-center gap-4 mb-8 pr-8 md:pr-16">
              <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-150"
                  style={{ 
                    width: `${horizontalProgress * 100}%`,
                    backgroundColor: 'var(--grapevne-blue)'
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-500" style={{ minWidth: '3rem' }}>
                {Math.round(horizontalProgress * (totalCards - 1)) + 1}/{totalCards}
              </span>
            </div>
            
            {/* Horizontal scroll container */}
            <div 
              ref={horizontalScrollRef}
              id="brands-narrative-scroll"
              className="flex gap-8 overflow-x-auto pb-4"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none', 
                WebkitOverflowScrolling: 'touch'
              }}
            >
              
              {/* Card 1 */}
              <div className="flex-shrink-0 w-80 md:w-96" style={{ minWidth: '320px' }}>
                <div className="h-48 md:h-64 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img src="/iphone image.png" alt="" className="h-full object-contain transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Campus Awareness.
                </h3>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Reach students through real, in-person moments.
                </p>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Be where students are, when they're there.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex-shrink-0 w-80 md:w-96" style={{ minWidth: '320px' }}>
                <div className="h-48 md:h-64 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img src="/iphone image.png" alt="" className="h-full object-contain transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Product Sampling.
                </h3>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Distribute food or goods during high-traffic campus moments with zero guesswork.
                </p>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Timing is everything.
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex-shrink-0 w-80 md:w-96" style={{ minWidth: '320px' }}>
                <div className="h-48 md:h-64 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img 
                    src="/notification.png" 
                    alt="Push notification example" 
                    className="h-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Event Visibility.
                </h3>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Surface pop-ups and brand moments to students already nearby.
                </p>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Real-time notifications reach students in time.
                </p>
              </div>
              
              {/* Card 4 */}
              <div className="flex-shrink-0 w-80 md:w-96" style={{ minWidth: '320px' }}>
                <div className="h-48 md:h-64 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img src="/iphone image.png" alt="" className="h-full object-contain transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Authentic Engagement.
                </h3>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Be discovered through utility, not interruption.
                </p>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Students find value in what you offer, naturally.
                </p>
              </div>

              {/* Card 5: Ambassadors */}
              <div className="flex-shrink-0 w-80 md:w-96 pr-8 md:pr-16" style={{ minWidth: '320px' }}>
                <div className="h-48 md:h-64 mb-6 flex items-center justify-center bg-gray-50 rounded-lg">
                  <img src="/iphone image.png" alt="" className="h-full object-contain transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Ambassadors.
                </h3>
                <p className="text-base leading-relaxed mb-3" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Give your ambassadors the direct channel to students on their campus looking for brand perks.
                </p>
                <p className="text-base leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                  Connect directly with the students who want what you're offering.
                </p>
              </div>
            </div>
          </section>

          {/* Final Section: Full-Screen Device Mockup */}
          <section 
            className="min-h-screen flex flex-col items-center justify-center px-8 md:px-16 relative"
            style={{ backgroundColor: '#fafafa' }}
          >
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                Ready when your<br />
                <span style={{ color: 'var(--grapevne-blue)' }}>students are.</span>
              </h2>
              <p className="text-xl leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#666' }}>
                Be where students are, when they're looking.
              </p>
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

          {/* CTA Section */}
          <section className="text-center py-20 px-8 md:px-16">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
            >
              {isFormOpen ? 'Close Form' : 'Get in Touch'}
            </button>
          </section>

          {/* Contact Form */}
          <section className="transition-all duration-500 ease-in-out px-8 md:px-16 pb-20">
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