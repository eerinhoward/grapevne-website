import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Universities() {
  const location = useLocation()
  const logoRef = useRef(null)
  const currentRotateX = useRef(0)
  const currentRotateY = useRef(0)
  const targetRotateX = useRef(0)
  const targetRotateY = useRef(0)
  const animationFrameId = useRef(null)
  
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <header className="pt-4 pb-4 px-4 relative">
        <div className="flex justify-center items-center gap-4">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="space-y-16">
          {/* Hero Section */}
          <section className="text-center">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-6 leading-tight">
              For Universities
            </h1>
            <p className="text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Real-time visibility into campus behavior. Reduce food waste. Understand student engagement patterns.
            </p>
          </section>


          {/* Benefits Section */}
          <section className="space-y-12">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Real-Time Behavioral Insights
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Gain unprecedented visibility into when and where students are most active. See movement patterns, engagement hotspots, and demand signals that traditional systems can't capture.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Reduce Food Waste
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Students voluntarily generate data by posting leftover food from events. See when and where surplus emerges in real time, so you can redirect food before it becomes waste—no operational changes required.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Sustainability Analytics
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Track food recovery metrics, measure impact, and demonstrate sustainability progress. Unlike systems that depend on staff compliance, Grapevne works because students want to use it.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Higher Student Engagement
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Achieve materially higher engagement compared to typical campus apps. Our utility-first design means students check the app daily—creating a rich behavioral data layer for your institution.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                No Operational Overhead
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Unlike food waste systems that require staff training and compliance, Grapevne requires no operational change. Students voluntarily generate the data through everyday behavior.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center pt-8">
            <p className="text-xl text-gray-600 mb-8">
              Ready to build the behavioral data layer for your campus?
            </p>
            <a 
              href="mailto:universities@grapevneapp.com" 
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
            >
              Get in Touch
            </a>
          </section>

          {/* Trusted Partners Section */}
          <section className="pt-12 pb-8">
            <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">
              trusted by our friendly neighborhood partners:
            </h3>
            <div className="flex flex-wrap gap-16 md:gap-24">
              <div className="text-left">
                <div className="font-bold text-gray-900 text-lg mb-2">Trinity College</div>
                <div className="text-gray-600 text-base">
                  300 Summit St.<br />
                  Hartford, CT 06106
                </div>
                    </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 text-lg mb-2">Stevens Institute of Technology</div>
                <div className="text-gray-600 text-base">
                  1 Castle Point Terrace<br />
                  Hoboken, NJ 07030
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 mt-12">
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
        </div>
      </footer>
    </div>
  )
}

export default Universities

