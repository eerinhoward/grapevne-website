import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Privacy() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(null)
  const [showUseCases, setShowUseCases] = useState(false)
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
                Info
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
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-20">
        <div>
          {/* Preface Header */}
          <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: '#1a1a1a', fontFamily: '"Futura Bold", sans-serif' }}>
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
              Our privacy policy reflects this collaborative approach, ensuring transparency, safety, and legal compliance while maintaining the community-driven spirit of Grapevne.
            </p>
          </section>

          {/* Privacy Tabs */}
          <section className="pt-6">
            <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 flex flex-col terms-tabs-container">
              <button
                onClick={() => setActiveTab(activeTab === 'app' ? null : 'app')}
                className={`terms-tab-edge ${activeTab === 'app' ? 'active' : ''}`}
              >
                App Privacy Policy
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'website' ? null : 'website')}
                className={`terms-tab-edge ${activeTab === 'website' ? 'active' : ''}`}
              >
                Website Privacy Policy
              </button>
            </div>
            
            {/* App Privacy Content */}
            <div className={`terms-content ${activeTab === 'app' ? 'open' : ''}`}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Information We Collect
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We collect information that you provide directly to us, such as when you create an account, post content, or contact us for support. We also automatically collect certain information about your device and how you interact with our service.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    How We Use Your Information
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to communicate with you about products, services, and events that may be of interest to you.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Information Sharing
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We may share aggregated, anonymized data with partner universities and brands to help them understand campus-level patterns and engagement. We do not sell your personal information to third parties.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Data Security
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Your Rights
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    You have the right to access, update, or delete your personal information at any time. You can also opt out of certain data collection practices through your account settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Website Privacy Content */}
            <div className={`terms-content ${activeTab === 'website' ? 'open' : ''}`}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Information We Collect
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    When you visit the Grapevne website, we may collect information about your device, browser, and how you interact with our website. This includes information such as your IP address, browser type, and pages you visit.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Cookies and Tracking
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    We use cookies and similar tracking technologies to collect and use information about your interaction with our website. You can control cookie preferences through your browser settings.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-light mb-4" style={{ color: '#1a1a1a' }}>
                    Third-Party Services
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 mt-4">
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

export default Privacy

