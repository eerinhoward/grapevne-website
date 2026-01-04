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
  const [selectedGoal, setSelectedGoal] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const goals = {
    'Campus Awareness': 'Reach students through real, in-person moments.',
    'Product Sampling': 'Distribute food or goods during high-traffic campus moments with zero guesswork.',
    'Event Visibility': 'Surface pop-ups and brand moments to students already nearby.',
    'Authentic Engagement': 'Be discovered through utility, not interruption.'
  }
  
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
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="space-y-16">
          {/* Hero Section */}
          <section className="text-left">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
              Brands,<br />
              for the college generation
            </h1>
            
            {/* 1x4 Grid Image */}
            <div className="grid grid-cols-4 gap-0 mb-12 w-full max-w-7xl">
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 2', filter: 'sepia(1) hue-rotate(180deg) saturate(2)' }}>
                <img 
                  src="/pizza food.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 2', filter: 'sepia(1) hue-rotate(300deg) saturate(2)' }}>
                <img 
                  src="/pizza food.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 2', filter: 'sepia(1) hue-rotate(60deg) saturate(2)' }}>
                <img 
                  src="/pizza food.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3 / 2', filter: 'grayscale(1)' }}>
                <img 
                  src="/pizza food.png" 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Brand Description */}
            <div className="mb-12 space-y-4">
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                A brand pop-up can change the pace of a day.
              </p>
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                It's social, unexpected, and temporary.
              </p>
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Some of the best brand moments on campus are easy to miss and short-lived.
              </p>
              <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Grapevne helps students catch them in time.
              </p>
              <p className="text-xl leading-relaxed italic" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                Campus moments don't wait.
              </p>
            </div>
            
            {/* Goal List */}
            <div className="mb-8">
              <div className="space-y-3">
                {Object.keys(goals).map((goal) => (
                  <div 
                    key={goal} 
                    className="cursor-pointer"
                    onClick={() => setSelectedGoal(selectedGoal === goal ? '' : goal)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center" style={{ paddingTop: '0.5rem' }}>
                        {selectedGoal === goal && (
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--grapevne-blue)' }}></div>
                        )}
                      </div>
                      <div className="text-xl flex-1" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                        <div className="font-medium mb-1">{goal}</div>
                        {selectedGoal === goal && (
                          <div className="text-base font-normal" style={{ color: '#666' }}>
                            {goals[goal]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
              emailTo="brands@grapevneapp.com"
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 mt-12">
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

export default Brands