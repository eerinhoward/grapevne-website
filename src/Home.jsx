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
  const [showNewContent, setShowNewContent] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset
      
      // Content transition
      if (scrollY > 300) {
        setShowNewContent(true)
      } else {
        setShowNewContent(false)
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
    <div className="bg-white flex flex-col" style={{ minHeight: '200vh' }}>
      {/* Header with Logo - shows on scroll up, hides on scroll down */}
      <header 
        className="pt-4 pb-4 px-4 fixed top-0 left-0 right-0 bg-transparent z-20 transition-transform duration-300"
        style={{ transform: showHeader ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        <div className="flex justify-center items-center gap-4" style={{ perspective: '1000px' }}>
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

      {/* Main Content - accounts for header (~120px) and fixed footer (~80px) */}
      <main className="fixed top-[120px] left-0 right-0 bottom-[80px] flex items-center justify-center overflow-hidden">
        {/* Original Slogan */}
        <div 
          className="absolute inset-0 flex items-center justify-start transition-all duration-700 ease-in-out"
          style={{
            transform: showNewContent ? 'translateY(-100%)' : 'translateY(0)',
            opacity: showNewContent ? 0 : 1,
            pointerEvents: showNewContent ? 'none' : 'auto'
          }}
        >
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
            {/* Top - Bold Helvetica Slogan */}
            <div className="text-left pl-8 md:pl-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                what's happening.
              </h2>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
                while it's happening.
          </h2>
            </div>
            
            {/* Bottom - Horizontal Image Row */}
            <div className="flex gap-4 md:gap-5 lg:gap-6">
              <a href="https://www.instagram.com/henry_e_g_b_05/" target="_blank" rel="noopener noreferrer">
                <img src="/Photoshoot1.jpg" alt="" className="w-80 md:w-96 lg:w-[28rem] h-auto object-cover" />
              </a>
              <a href="https://www.instagram.com/henry_e_g_b_05/" target="_blank" rel="noopener noreferrer">
                <img src="/Photoshoot2.jpg" alt="" className="w-80 md:w-96 lg:w-[28rem] h-auto object-cover" />
              </a>
              <a href="https://www.instagram.com/henry_e_g_b_05/" target="_blank" rel="noopener noreferrer">
                <img src="/Photoshoot3.png" alt="" className="w-80 md:w-96 lg:w-[28rem] h-auto object-cover" />
              </a>
            </div>
          </div>
        </div>
        
        {/* New Content */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out px-8 md:px-16"
          style={{
            transform: showNewContent ? 'translateY(-5%)' : 'translateY(100%)',
            opacity: showNewContent ? 1 : 0,
            pointerEvents: showNewContent ? 'auto' : 'none'
          }}
        >
          <div className="flex items-center justify-center gap-12 md:gap-16 lg:gap-24">
            {/* Left side - Text */}
            <div className="text-2xl md:text-3xl lg:text-4xl text-gray-900 lowercase text-left" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
              <div className="font-bold">
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
      </main>

      {/* Footer with ®, ™, and © symbols - Persistent */}
      <footer className="pt-3 pb-4 px-4 fixed bottom-0 left-0 right-0 bg-white z-10">
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
          {/* Social Media Links */}
          <div className="flex justify-center items-center gap-3 mt-2">
            <a 
              href="https://www.linkedin.com/company/grapevneapp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-900 hover-grapevne-blue transition-colors"
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
              className="text-gray-900 hover-grapevne-blue transition-colors"
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
              className="text-gray-900 hover-grapevne-blue transition-colors"
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

