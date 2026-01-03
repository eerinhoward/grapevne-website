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
  const [currentSection, setCurrentSection] = useState(0) // 0 = first, 1 = middle, 2 = map, 3 = campus footprint, 4 = no RSVP
  const [middleStep, setMiddleStep] = useState(0) // 0-4 for the animated sequence in section 1
  const [showHeader, setShowHeader] = useState(true)
  const lastScrollY = useRef(0)
  const currentSectionRef = useRef(0) // Track current section for scroll logic

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      const isScrollingDown = scrollY > lastScrollY.current
      
      // Content transitions - only allow moving one section at a time
      let targetSection = currentSectionRef.current
      
      if (isScrollingDown) {
        // Scrolling down - can only advance to next section
        if (currentSectionRef.current === 0 && scrollY >= 600) {
          targetSection = 1
        } else if (currentSectionRef.current === 1 && scrollY >= 5650) {
          targetSection = 2
        } else if (currentSectionRef.current === 2 && scrollY >= 7650) {
          targetSection = 3
        } else if (currentSectionRef.current === 3 && scrollY >= 8850) {
          targetSection = 4
        }
      } else {
        // Scrolling up - can only go back to previous section
        if (currentSectionRef.current === 4 && scrollY < 8850) {
          targetSection = 3
        } else if (currentSectionRef.current === 3 && scrollY < 7650) {
          targetSection = 2
        } else if (currentSectionRef.current === 2 && scrollY < 5650) {
          targetSection = 1
        } else if (currentSectionRef.current === 1 && scrollY < 600) {
          targetSection = 0
        }
      }
      
      if (targetSection !== currentSectionRef.current) {
        currentSectionRef.current = targetSection
        setCurrentSection(targetSection)
      }
      
      // Calculate middle step based on scroll position within section 1 (600-5350)
      // Custom thresholds: step 0 gets 1000px, step 1 gets 750px, step 3 gets 750px, step 5 gets 900px
      if (scrollY >= 600 && scrollY < 5650) {
        let step = 0
        if (scrollY >= 5200) step = 6  // Extra slide after italics (5200-5650)
        else if (scrollY >= 4300) step = 5  // "…before they're gone." (4300-5200) - 900px
        else if (scrollY >= 3550) step = 4  // (3550-4300) - 750px for "things worth leaving your dorm for"
        else if (scrollY >= 2800) step = 3  // (2800-3550) - 750px for "iconic campus moments"
        else if (scrollY >= 2350) step = 2  // (2350-2800)
        else if (scrollY >= 1600) step = 1  // (1600-2350) - 750px for "free food"
        // step 0: 600-1600 (1000px for initial tagline)
        setMiddleStep(step)
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

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      document.body.removeChild(cursor)
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <div className="bg-white flex flex-col" style={{ minHeight: '1100vh' }}>
      {/* Background Strip - hides with navbar */}
      <div 
        className="fixed top-0 left-0 right-0 h-[120px] bg-transparent z-10 transition-transform duration-300"
        style={{ transform: showHeader ? 'translateY(0)' : 'translateY(-100%)' }}
      />
      
      {/* Header with Logo - shows on scroll up, hides on scroll down */}
      <header 
        className="pt-4 pb-4 px-4 fixed top-0 left-0 right-0 bg-transparent z-20 transition-transform duration-300"
        style={{ transform: showHeader ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        <div className="flex justify-center items-center gap-4" style={{ perspective: '1000px' }}>
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
      </header>

      {/* Main Content - accounts for header (~120px) and fixed footer (~80px) */}
      <main className="fixed top-[120px] left-0 right-0 bottom-[80px] flex items-center justify-center overflow-hidden">
        {/* Original Slogan */}
        <div 
          className="absolute inset-0 flex items-center justify-start transition-all duration-700 ease-in-out"
          style={{
            transform: currentSection === 0 ? 'translateY(0)' : 'translateY(-100%)',
            opacity: currentSection === 0 ? 1 : 0,
            pointerEvents: currentSection === 0 ? 'auto' : 'none'
          }}
        >
          <div className="flex flex-col gap-4 md:gap-5 lg:gap-6">
            {/* Top - Bold Helvetica Slogan */}
            <div className="text-left pl-8 md:pl-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                What's happening.
              </h2>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
                While it's happening.
          </h2>
            </div>
            
            {/* Bottom - Horizontal Image Row */}
            <div className="flex gap-4 md:gap-5 lg:gap-6">
              <a href="https://www.instagram.com/henry_e_g_b_05/" target="_blank" rel="noopener noreferrer">
                <img src="/Photoshoot1.jpg" alt="" className="w-80 md:w-96 lg:w-[28rem] h-auto object-cover" />
              </a>
              <a href="https://www.instagram.com/henry_e_g_b_05/" target="_blank" rel="noopener noreferrer">
                <img src="/Photoshoot2.png" alt="" className="w-80 md:w-96 lg:w-[28rem] h-auto object-cover" />
              </a>
              <a href="https://www.instagram.com/henry_e_g_b_05/" target="_blank" rel="noopener noreferrer">
                <img src="/Photoshoot3.jpg" alt="" className="w-80 md:w-96 lg:w-[28rem] h-auto object-cover" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Middle Content - Grapevne description with animated sequence */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-8 md:px-16"
          style={{
            transform: currentSection === 1 ? 'translateY(0)' : (currentSection === 2 ? 'translateY(-100%)' : 'translateY(100%)'),
            opacity: currentSection === 1 ? 1 : 0,
            pointerEvents: currentSection === 1 ? 'auto' : 'none'
          }}
        >
          {/* Step 0: Initial tagline - centered, no iPhone */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-all duration-500"
            style={{ 
              opacity: middleStep === 0 ? 1 : 0,
              pointerEvents: middleStep === 0 ? 'auto' : 'none'
            }}
          >
            <div className="text-2xl md:text-3xl lg:text-4xl lowercase whitespace-nowrap" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
              <span>grapevne is </span>
              <span>a real-time campus discovery layer.</span>
            </div>
          </div>
          
          {/* Steps 1-4: Use cases with iPhone on the right */}
          <div 
            className="absolute inset-0 flex items-center justify-center gap-12 md:gap-16 lg:gap-24 transition-all duration-700"
            style={{ 
              opacity: middleStep >= 1 && middleStep < 5 ? 1 : 0,
              pointerEvents: middleStep >= 1 && middleStep < 5 ? 'auto' : 'none'
            }}
          >
            {/* Left side - sliding text */}
            <div 
              className="text-2xl md:text-3xl lg:text-4xl lowercase whitespace-nowrap transition-all duration-700"
              style={{ 
                fontFamily: 'Helvetica, Arial, sans-serif', 
                color: '#1a1a1a',
                // Start more to the right so full text is visible, then slide left as more items are added
                transform: middleStep >= 4 ? 'translateX(-600px)' : 
                          middleStep >= 3 ? 'translateX(100px)' : 
                          middleStep >= 2 ? 'translateX(300px)' : 'translateX(400px)'
              }}
            >
              <span>grapevne is </span>
              <span className="transition-all duration-500" style={{ opacity: middleStep >= 1 ? 1 : 0 }}>
                free food
              </span>
              <span 
                className="transition-all duration-500 inline-block"
                style={{ 
                  opacity: middleStep >= 2 ? 1 : 0,
                  transform: middleStep >= 2 ? 'translateX(0)' : 'translateX(30px)'
                }}
              >
                &nbsp;&amp;&nbsp;brand pop-ups
              </span>
              <span 
                className="transition-all duration-500 inline-block"
                style={{ 
                  opacity: middleStep >= 3 ? 1 : 0,
                  transform: middleStep >= 3 ? 'translateX(0)' : 'translateX(30px)'
                }}
              >
                &nbsp;&amp;&nbsp;iconic campus moments
              </span>
              <span 
                className="transition-all duration-500 inline-block"
                style={{ 
                  opacity: middleStep >= 4 ? 1 : 0,
                  transform: middleStep >= 4 ? 'translateX(0)' : 'translateX(30px)'
                }}
              >
                &nbsp;&amp;&nbsp;things worth leaving your dorm for
              </span>
            </div>
            
            {/* Right side - iPhone */}
            <div className="flex-shrink-0">
              <img 
                src="/iphone image.png" 
                alt="Grapevne App" 
                className="h-[400px] md:h-[500px] w-auto object-contain"
              />
            </div>
          </div>
          
          {/* Step 5-6: "…before they're gone." - centered, no iPhone */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-all duration-700"
            style={{ 
              opacity: middleStep >= 5 ? 1 : 0,
              pointerEvents: middleStep >= 5 ? 'auto' : 'none'
            }}
          >
            <div 
              className="text-2xl md:text-3xl lg:text-4xl lowercase text-center italic transition-all duration-700"
              style={{ 
                fontFamily: 'Helvetica, Arial, sans-serif', 
                color: '#1a1a1a',
                transform: middleStep >= 5 ? 'translateY(0)' : 'translateY(30px)'
              }}
            >
              …before they're gone.
            </div>
          </div>
        </div>
        
        {/* Section 2 - Map blurb */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-8 md:px-16"
          style={{
            transform: currentSection === 2 ? 'translateY(-5%)' : (currentSection === 3 ? 'translateY(-100%)' : 'translateY(100%)'),
            opacity: currentSection === 2 ? 1 : 0,
            pointerEvents: currentSection === 2 ? 'auto' : 'none'
          }}
        >
          <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-24">
            {/* Left side - Text */}
            <div className="text-2xl md:text-3xl lg:text-4xl lowercase text-left" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
              <div className="font-bold" style={{ textTransform: 'none', fontFamily: '"Cooper Black", serif' }}>
                Map what's happening <span className="font-bold italic">right now</span>
              </div>
              <div className="font-normal">See where things are popping off.</div>
              <div className="font-normal">See who's pulling up.</div>
              <div className="font-normal mt-4">No group chats.</div>
              <div className="font-normal">No flyers.</div>
            </div>
            
            {/* Right side - iPhone */}
            <div className="flex-shrink-0">
              <img 
                src="/iphone image.png" 
                alt="Grapevne App" 
                className="h-[400px] md:h-[500px] w-auto object-contain"
              />
            </div>
          </div>
        </div>
        
        {/* Section 3 - Campus footprint */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-8 md:px-16"
          style={{
            transform: currentSection === 3 ? 'translateY(-5%)' : (currentSection === 4 ? 'translateY(-100%)' : 'translateY(100%)'),
            opacity: currentSection === 3 ? 1 : 0,
            pointerEvents: currentSection === 3 ? 'auto' : 'none'
          }}
        >
          <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-24">
            {/* Left side - Text */}
            <div className="text-2xl md:text-3xl lg:text-4xl lowercase text-left" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
              <div className="font-bold mb-2" style={{ textTransform: 'none', fontFamily: '"Cooper Black", serif' }}>
                Your campus footprint, all in one place.
              </div>
              <div className="font-normal">moments.</div>
              <div className="font-normal">people.</div>
              <div className="font-normal">things you were part of.</div>
            </div>
            
            {/* Right side - iPhone */}
            <div className="flex-shrink-0">
              <img 
                src="/iphone image.png" 
                alt="Grapevne App" 
                className="h-[400px] md:h-[500px] w-auto object-contain"
              />
            </div>
          </div>
        </div>
        
        {/* Section 4 - No RSVP, No coordinate */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-8 md:px-16"
          style={{
            transform: currentSection === 4 ? 'translateY(-5%)' : 'translateY(100%)',
            opacity: currentSection === 4 ? 1 : 0,
            pointerEvents: currentSection === 4 ? 'auto' : 'none'
          }}
        >
          <div className="text-2xl md:text-3xl lg:text-4xl lowercase text-center" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              <span>RSVP.</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <svg className="w-10 h-10 md:w-12 md:h-12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
              <span>coordination.</span>
            </div>
            <div className="font-normal text-xl md:text-2xl lg:text-3xl">
              You just see what's happening and decide.
            </div>
          </div>
        </div>
      </main>

      {/* Footer with ®, ™, and © symbols - Persistent */}
      <footer className="pt-3 pb-4 px-4 fixed bottom-0 left-0 right-0 bg-white z-10">
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
          {/* Social Media Links */}
          <div className="flex justify-center items-center gap-3 mt-2">
            <a 
              href="https://www.linkedin.com/company/grapevneapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover-grapevne-blue transition-colors"
              style={{ color: '#1a1a1a' }}
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home

