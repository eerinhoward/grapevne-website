import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Home() {
  const location = useLocation()
  const logoRef = useRef(null)
  const currentRotateX = useRef(0)
  const currentRotateY = useRef(0)
  const targetRotateX = useRef(0)
  const targetRotateY = useRef(0)
  const animationFrameId = useRef(null)
  const [currentSection, setCurrentSection] = useState(0) // 0 = hero, 1 = never miss, 2 = one swipe, 3 = see who, 4 = Grapevne
  const [middleStep, setMiddleStep] = useState(0) // 0-4 for the animated sequence in section 1
  const [showHeader, setShowHeader] = useState(true)
  const lastScrollY = useRef(0)
  const currentSectionRef = useRef(0) // Track current section for scroll logic
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const lastImageIndexRef = useRef(-1)
  const trailIdRef = useRef(0)
  const mainRef = useRef(null)
  const [trailImages, setTrailImages] = useState([])
  const [imagesReady, setImagesReady] = useState(false)
  const images = ['/Photoshoot1.jpg', '/Photoshoot2.png', '/Photoshoot3.jpg', '/homepage.jpg', '/snake.jpg', '/taking.jpg', '/gathering.jpg']
  const maxImages = 8
  const TRAIL_THROTTLE_MS = 16 // ~60fps
  const TRAIL_DISTANCE_PX = 35
  const lastTrailTimeRef = useRef(0)

  // Preload all trail images and verify they're ready before enabling trail
  useEffect(() => {
    let mounted = true
    const loadPromises = images.map((src) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = () => resolve(null) // Skip failed images
        img.src = src
      })
    })
    Promise.all(loadPromises).then(() => {
      if (mounted) setImagesReady(true)
    })
    return () => { mounted = false }
  }, [])

  const getRandomImageIndex = () => {
    if (images.length <= 1) return 0
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * images.length)
    } while (newIndex === lastImageIndexRef.current)
    lastImageIndexRef.current = newIndex
    return newIndex
  }

  useEffect(() => {
    if (currentSection !== 4) {
      setTrailImages([])
      return
    }

    const addTrailAt = (clientX, clientY) => {
      if (!imagesReady || !mainRef.current) return

      const rect = mainRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top

      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return

      const now = performance.now()
      const elapsed = now - lastTrailTimeRef.current
      const distanceX = Math.abs(clientX - lastPositionRef.current.x)
      const distanceY = Math.abs(clientY - lastPositionRef.current.y)
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      if (distance >= TRAIL_DISTANCE_PX && elapsed >= TRAIL_THROTTLE_MS) {
        lastTrailTimeRef.current = now
        lastPositionRef.current = { x: clientX, y: clientY }

        const newImage = {
          id: ++trailIdRef.current,
          x,
          y,
          src: images[getRandomImageIndex()]
        }

        setTrailImages((prev) => {
          const updated = [...prev, newImage]
          return updated.length > maxImages ? updated.slice(-maxImages) : updated
        })
      }
    }

    const handlePointer = (e) => {
      const x = e.clientX ?? e.touches?.[0]?.clientX
      const y = e.clientY ?? e.touches?.[0]?.clientY
      if (x != null && y != null) addTrailAt(x, y)
    }

    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      if (touch) {
        lastPositionRef.current = { x: touch.clientX, y: touch.clientY }
        addTrailAt(touch.clientX, touch.clientY)
      }
    }

    window.addEventListener('mousemove', handlePointer, { passive: true })
    window.addEventListener('touchmove', handlePointer, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handlePointer)
      window.removeEventListener('touchmove', handlePointer)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [currentSection, imagesReady])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const isScrollingDown = scrollY > lastScrollY.current
      
      // Content transitions - only allow moving one section at a time
      let targetSection = currentSectionRef.current
      
      if (isScrollingDown) {
        // Scrolling down - can only advance to next section (each feature section ~1200px)
        if (currentSectionRef.current === 0 && scrollY >= 300) {
          targetSection = 1
        } else if (currentSectionRef.current === 1 && scrollY >= 1500) {
          targetSection = 2
        } else if (currentSectionRef.current === 2 && scrollY >= 2700) {
          targetSection = 3
        } else if (currentSectionRef.current === 3 && scrollY >= 3900) {
          targetSection = 4
        }
      } else {
        // Scrolling up - can only go back to previous section
        if (currentSectionRef.current === 4 && scrollY < 3900) {
          targetSection = 3
        } else if (currentSectionRef.current === 3 && scrollY < 2700) {
          targetSection = 2
        } else if (currentSectionRef.current === 2 && scrollY < 1500) {
          targetSection = 1
        } else if (currentSectionRef.current === 1 && scrollY < 300) {
          targetSection = 0
        }
      }
      
      if (targetSection !== currentSectionRef.current) {
        currentSectionRef.current = targetSection
        setCurrentSection(targetSection)
      }
      
      // Calculate middle step based on scroll position within section 1 (600-1500)
      if (scrollY >= 600 && scrollY < 1500) {
        setMiddleStep(0)
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

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [])

  return (
    <div className="bg-white flex flex-col" style={{ minHeight: '650vh' }}>
      {/* Background Strip - hides with navbar */}
      <div 
        className="fixed top-0 left-0 right-0 h-[88px] sm:h-[100px] md:h-[120px] bg-transparent z-10 transition-transform duration-300"
        style={{ transform: showHeader ? 'translateY(0)' : 'translateY(-100%)' }}
      />
      
      {/* Header with Logo - shows on scroll up, hides on scroll down */}
      <header 
        className="pt-4 pb-4 px-4 fixed left-0 right-0 bg-transparent z-20 transition-transform duration-300"
        style={{ 
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
          top: 0,
          paddingTop: 'max(1rem, env(safe-area-inset-top))'
        }}
      >
        <div className="flex justify-between items-center gap-2" style={{ perspective: '1000px' }}>
          <nav className="flex items-center gap-3 sm:gap-4 md:gap-6 pl-2 sm:pl-6 md:pl-12 flex-1 min-w-0 flex-shrink">
            <div className="flex flex-col items-center shrink-0">
              <Link to="/universities" className="text-[13px] sm:text-base md:text-lg font-bold hover-grapevne-blue transition-colors lowercase whitespace-nowrap py-2 flex items-center" style={{ color: '#1a1a1a' }}>universities</Link>
              {location.pathname === '/universities' && <div className="w-1.5 h-1.5 rounded-full -mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }} />}
            </div>
            {/* brands - commented out for now
            <div className="flex flex-col items-center shrink-0">
              <Link to="/brands" className="text-[13px] sm:text-base md:text-lg font-bold hover-grapevne-blue transition-colors lowercase whitespace-nowrap py-2 flex items-center" style={{ color: '#1a1a1a' }}>brands</Link>
              {location.pathname === '/brands' && <div className="w-1.5 h-1.5 rounded-full -mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }} />}
            </div>
            */}
            <div className="flex flex-col items-center shrink-0">
              <Link to="/about" className="text-[13px] sm:text-base md:text-lg font-bold hover-grapevne-blue transition-colors lowercase py-2 flex items-center" style={{ color: '#1a1a1a' }}>about</Link>
              {location.pathname === '/about' && <div className="w-1.5 h-1.5 rounded-full -mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }} />}
            </div>
            <div className="flex flex-col items-center shrink-0">
              <Link to="/press" className="text-[13px] sm:text-base md:text-lg font-bold hover-grapevne-blue transition-colors lowercase py-2 flex items-center" style={{ color: '#1a1a1a' }}>press</Link>
              {location.pathname === '/press' && <div className="w-1.5 h-1.5 rounded-full -mt-1" style={{ backgroundColor: 'var(--grapevne-blue)' }} />}
            </div>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-6 md:pr-12 shrink-0">
            <a 
              href="https://apps.apple.com/us/app/grapevne/id6745459372" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[13px] sm:text-base md:text-lg font-bold hover-grapevne-blue transition-colors lowercase px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center whitespace-nowrap shadow-sm"
              style={{ color: '#1a1a1a' }}
            >
              download
            </a>
            <div className="flex flex-col items-center shrink-0">
              <Link to="/" className="flex justify-center min-h-[44px] min-w-[44px] items-center">
                <img 
                ref={logoRef}
                src="/filledTransparent.png" 
                alt="Grapevne Logo" 
                className="h-10 sm:h-14 md:h-20 lg:h-28 w-auto"
                style={{ 
                  transformStyle: 'preserve-3d',
                  willChange: 'transform'
                }}
              />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - accounts for header, footer, and safe areas on iPhone */}
      <main 
        ref={mainRef} 
        className="fixed left-0 right-0 flex items-center justify-center overflow-hidden"
        style={{
          top: 'calc(88px + env(safe-area-inset-top, 0px))',
          bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        {/* Trail Images - Bottom Layer (on Grapevne section) */}
        {currentSection === 4 && (
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ zIndex: 1 }}
          >
            {trailImages.map((img, index) => (
              <img
                key={img.id}
                src={img.src}
                alt=""
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute object-cover select-none"
                style={{
                  left: img.x,
                  top: img.y,
                  width: 'clamp(5.5rem, 20vw, 24rem)',
                  aspectRatio: '4/3',
                  transform: 'translate(-50%, -50%)',
                  zIndex: index,
                  willChange: 'transform',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  animation: 'trailFadeIn 0.2s ease-out forwards'
                }}
              />
            ))}
          </div>
        )}
        
        {/* Original Slogan */}
        <div 
          className="absolute inset-0 flex items-start justify-center md:justify-start transition-all duration-700 ease-in-out cursor-pointer"
          style={{
            transform: currentSection === 0 ? 'translateY(0)' : 'translateY(-100%)',
            opacity: currentSection === 0 ? 1 : 0,
            pointerEvents: currentSection === 0 ? 'auto' : 'none',
            paddingTop: '40px',
            zIndex: 10
          }}
          onClick={() => {
            if (currentSection === 0) {
              window.scrollTo({
                top: 300,
                behavior: 'smooth'
              })
            }
          }}
        >
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-0 md:mx-0 md:max-w-none">
            {/* Top - Grapevne */}
            <div className="text-center md:text-left md:pl-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold" style={{ fontFamily: '"Futura Bold", sans-serif', color: 'var(--grapevne-blue)' }}>
                Grapevne
              </h2>
            </div>
            
            {/* Spacer */}
            <div className="h-8 sm:h-10 md:h-12 flex-shrink-0" />
            
            {/* Brands image grid - 2x2 on mobile, 1x5 strip on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-0 w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" style={{ maxWidth: '100vw' }}>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'sepia(1) hue-rotate(180deg) saturate(2)' }}>
                <img src="/pizza food.png" alt="" className="w-full h-full object-cover" loading="eager" decoding="async" />
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'sepia(1) hue-rotate(300deg) saturate(2)' }}>
                <img src="/pizza food.png" alt="" className="w-full h-full object-cover" loading="eager" decoding="async" />
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3', filter: 'sepia(1) hue-rotate(60deg) saturate(2)' }}>
                <img src="/pizza food.png" alt="" className="w-full h-full object-cover" loading="eager" decoding="async" />
              </div>
              <div className="relative w-full overflow-hidden hidden md:block" style={{ aspectRatio: '4 / 3', filter: 'grayscale(1)' }}>
                <img src="/pizza food.png" alt="" className="w-full h-full object-cover" loading="eager" decoding="async" />
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                <img src="/pizza food.png" alt="" className="w-full h-full object-cover" loading="eager" decoding="async" />
              </div>
            </div>
            
            {/* Tagline */}
            <div className="text-center md:text-left md:pl-16">
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight" style={{ fontFamily: '"Futura Bold", sans-serif', color: '#1a1a1a' }}>
                The feed that feeds you.
              </h2>
            </div>
          </div>
        </div>
        
        {/* Middle Content - Grapevne description with animated sequence */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-5 sm:px-8 md:px-16 overflow-y-auto"
          style={{
            transform: currentSection === 1 ? 'translateY(0)' : (currentSection === 2 ? 'translateY(-100%)' : 'translateY(100%)'),
            opacity: currentSection === 1 ? 1 : 0,
            pointerEvents: currentSection === 1 ? 'auto' : 'none'
          }}
        >
          {/* Steps 0-4: Stack on mobile, side-by-side on desktop */}
          <div 
            className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-16 lg:gap-24 transition-all duration-700 py-4 md:py-0"
            style={{ 
              opacity: middleStep >= 0 ? 1 : 0,
              pointerEvents: middleStep >= 0 ? 'auto' : 'none'
            }}
          >
            {/* Text - top on mobile, left on desktop */}
            <div className="text-center md:text-left max-w-xl order-2 md:order-1">
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 md:mb-6" style={{ fontFamily: '"Futura Bold", sans-serif', color: '#1a1a1a' }}>
                Never miss<br />what's happening
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Push notifications when campus posts go live. No more checking emails or walking past flyers.
              </p>
            </div>
            
            {/* iPhone - top on mobile for visual hierarchy */}
            <div className="flex-shrink-0 order-1 md:order-2 mt-4 md:mt-6">
              <img 
                src="/never-miss-iphone.png" 
                alt="Grapevne app - Never miss what's happening" 
                className="h-[480px] sm:h-[520px] md:h-[440px] lg:h-[540px] w-auto object-contain iphone-bounce max-h-[72vh] sm:max-h-[78vh] md:max-h-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2 - One swipe RSVP */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-5 sm:px-8 md:px-16 overflow-y-auto"
          style={{
            transform: currentSection === 2 ? 'translateY(-5%)' : (currentSection === 3 ? 'translateY(-100%)' : 'translateY(100%)'),
            opacity: currentSection === 2 ? 1 : 0,
            pointerEvents: currentSection === 2 ? 'auto' : 'none'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-16 lg:gap-24 py-4 md:py-0">
            <div className="text-center md:text-left max-w-xl order-2 md:order-1">
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 md:mb-6" style={{ fontFamily: '"Futura Bold", sans-serif', color: '#1a1a1a' }}>
                One swipe. You're in.
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                One swipe RSVPs. It saves to your calendar automatically.
              </p>
            </div>
            <div className="flex-shrink-0 order-1 md:order-2 mt-4 md:mt-6">
              <img 
                src="/one-swipe-iphone.png" 
                alt="Grapevne app - One swipe RSVP" 
                className="h-[480px] sm:h-[520px] md:h-[440px] lg:h-[540px] w-auto object-contain iphone-bounce max-h-[72vh] sm:max-h-[78vh] md:max-h-none"
              />
            </div>
          </div>
        </div>
        
        {/* Section 3 - Campus footprint */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-5 sm:px-8 md:px-16 overflow-y-auto"
          style={{
            transform: currentSection === 3 ? 'translateY(-5%)' : (currentSection === 4 ? 'translateY(-100%)' : 'translateY(100%)'),
            opacity: currentSection === 3 ? 1 : 0,
            pointerEvents: currentSection === 3 ? 'auto' : 'none'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-16 lg:gap-24 py-4 md:py-0">
            <div className="text-center md:text-left max-w-xl order-2 md:order-1">
              <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 md:mb-6" style={{ fontFamily: '"Futura Bold", sans-serif', color: '#1a1a1a' }}>
                See who else is going
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                See the list of who's going. See where your friends are going on the map. Meet them there.
              </p>
            </div>
            <div className="flex-shrink-0 order-1 md:order-2 mt-4 md:mt-6">
              <img 
                src="/see-who-iphone.png" 
                alt="Grapevne app - See who else is going" 
                className="h-[480px] sm:h-[520px] md:h-[440px] lg:h-[540px] w-auto object-contain iphone-bounce max-h-[72vh] sm:max-h-[78vh] md:max-h-none"
              />
            </div>
          </div>
        </div>
        
        {/* Section 4 - Grapevne */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-5 sm:px-8 md:px-16"
          style={{
            transform: currentSection === 4 ? 'translateY(-5%)' : 'translateY(100%)',
            opacity: currentSection === 4 ? 1 : 0,
            pointerEvents: currentSection === 4 ? 'auto' : 'none',
            zIndex: 5
          }}
        >
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold" style={{ fontFamily: '"Futura Bold", sans-serif', color: 'var(--grapevne-blue)' }}>
            Grapevne
          </div>
        </div>
      </main>

      {/* Footer with ®, ™, and © symbols - Persistent */}
      <footer 
        className="pt-2 sm:pt-3 px-3 sm:px-4 fixed bottom-0 left-0 right-0 bg-white z-10"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-0.5 sm:gap-1">
          <div className="flex justify-center items-center gap-2 sm:gap-3">
            <span className="ip-symbol text-base sm:text-lg" style={{ transform: 'translateY(-1px)', color: '#1a1a1a' }}>®</span>
            <span className="ip-symbol text-base sm:text-lg" style={{ transform: 'translateY(1px)', color: '#1a1a1a' }}>™</span>
            <span className="ip-symbol text-base sm:text-lg" style={{ transform: 'translateY(-1px)', color: '#1a1a1a' }}>©</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 gap-y-0.5 text-[11px] sm:text-xs text-gray-600">
            <span className="text-gray-400 font-medium hidden sm:inline">USE CASES</span>
            <Link to="/universities" className="hover-grapevne-blue transition-colors footer-link py-1">Universities</Link>
            {/* <Link to="/brands" className="hover-grapevne-blue transition-colors footer-link py-1">Brands</Link> */}
            <span className="text-gray-400 font-medium hidden sm:inline ml-1">LEGAL</span>
            <Link to="/terms" className="hover-grapevne-blue transition-colors footer-link py-1">Terms</Link>
            <Link to="/privacy" className="hover-grapevne-blue transition-colors footer-link py-1">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home



