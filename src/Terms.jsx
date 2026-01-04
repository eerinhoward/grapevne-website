import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Terms() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(null)
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
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-20">
        <div>
          {/* Preface Header */}
          <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: '#1a1a1a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
            Preface
          </h1>
          
          {/* Legal Process Summary */}
          <section className="space-y-6" style={{ textAlign: 'justify', fontFamily: 'Helvetica, Arial, sans-serif' }}>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Our legal framework is built in partnership with the <a href="https://entrepreneurship.mit.edu/bu-law-clinic/" target="_blank" rel="noopener noreferrer" className="highlight-link highlight-link-blue">BU/MIT Student Innovations Law Clinic</a> (SILC), which provides legal advice to student entrepreneurs. The clinic is staffed by BU Law students under law faculty supervision across three practice groups: Intellectual Property & Media; Privacy, Security & Health; and Venture & Finance. SILC has been involved since the beginning of Grapevne's conceptualization and formation, providing ongoing compliance guidance and legal oversight.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Given that Grapevne facilitates the sharing of food on campus, we work closely with the clinic to address food safety regulations, liability considerations, and compliance requirements. This includes guidance on food handling standards and campus-specific regulations that protect both those sharing food and those receiving it. The clinic's early involvement has helped shape our platform design and user safety measures from the ground up.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              SILC's expertise in intellectual property, information privacy, corporate law, and platform liability helps us navigate the complex legal landscape of operating a platform that connects students, universities, and brands around food sharing. Their guidance on user conduct policies, platform protections, and regulatory compliance has been integral to Grapevne's development.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Our terms of service reflect this collaborative approach, ensuring transparency, safety, and legal compliance while maintaining the community-driven spirit of Grapevne.
            </p>
          </section>

          {/* Terms Tabs */}
          <section className="pt-6">
            <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 flex flex-col terms-tabs-container">
              <button
                onClick={() => setActiveTab(activeTab === 'app' ? null : 'app')}
                className={`terms-tab-edge ${activeTab === 'app' ? 'active' : ''}`}
              >
                App Terms of Service
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'website' ? null : 'website')}
                className={`terms-tab-edge ${activeTab === 'website' ? 'active' : ''}`}
              >
                Website Terms of Service
              </button>
            </div>
            
            {/* App Terms Content */}
            <div className={`terms-content ${activeTab === 'app' ? 'open' : ''}`}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Agreement to Terms
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    By accessing or using the Grapevne mobile application, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Use License
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Permission is granted to download and use the Grapevne mobile application for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the application, use it for any commercial purpose, or attempt to decompile or reverse engineer any software contained in the Grapevne app.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    User Conduct
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    You agree to use the Grapevne app only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the service. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our service.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Food Safety and Liability
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Grapevne serves as a platform for connecting users with free food opportunities. We do not prepare, handle, or distribute food. Users who share food are responsible for ensuring compliance with all applicable food safety regulations. Grapevne is not liable for any issues arising from food shared through the platform. Users consume food at their own risk and should exercise appropriate judgment regarding food safety.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Disclaimer
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    The Grapevne mobile application is provided on an 'as is' basis. Grapevne makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                </div>
              </div>
            </div>

            {/* Website Terms Content */}
            <div className={`terms-content ${activeTab === 'website' ? 'open' : ''}`}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Agreement to Terms
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    By accessing or using the Grapevne website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this website.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Use License
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Permission is granted to temporarily access and view the Grapevne website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose, or attempt to decompile or reverse engineer any software contained on the Grapevne website.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    User Conduct
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    You agree to use the Grapevne website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Disclaimer
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    The materials on the Grapevne website are provided on an 'as is' basis. Grapevne makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
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

export default Terms

