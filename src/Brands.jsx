import React, { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Brands() {
  const location = useLocation()
  const [openIndex, setOpenIndex] = useState(null)
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
      <header className="pt-8 pb-6 px-4 relative">
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
      <main>
        {/* Split Screen Layout - Problem Statement */}
        <div className="w-full px-4 md:px-8">
          <div className="w-full flex" style={{ height: '80vh' }}>
            <div className="flex-1" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
              <img 
                src="/HenryBayhaXP2C7839 (1).jpg" 
                alt="Campus Scene" 
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(100%) contrast(1.1)' }}
              />
            </div>
            <div className="flex-1" style={{ backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '60px', paddingBottom: '60px' }}>
              <div className="text-right px-8 max-w-4xl">
              <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-3">
                You had to be there
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-6">
                And most students weren't
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight mb-2">
                Campus activations reward chance, not reach
              </h2>
              <h2 className="text-4xl md:text-5xl font-bold text-black leading-tight">
                <span style={{ color: '#A8D5E2' }}>Grapevne</span> makes them persistent
              </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-20">
          <div className="space-y-16">
          {/* Benefits Section */}
          <section className="space-y-12">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Connect to Gen Z Within Seconds
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Reach thousands of Gen Z students instantly. With COSU approval, run instant pop-ups and get your food & drink products in front of engaged students in real time. No waiting, no delays—instant connection to the campus community.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Instant Pop-Ups & Activations
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Launch campus pop-ups and study breaks with instant notifications to all students on the app at that campus. Market your brand, promote your products, and drive foot traffic—all within seconds of activation. Reach students when they need a break, when they're hungry, when they're ready to discover something new.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Market & Promote Food & Drink Products
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Perfect for food and beverage brands looking to reach Gen Z. Showcase new products, run tastings, build brand awareness, and drive sales through targeted campus activations. Students are already on the app looking for food—meet them where they are.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Real-Time Engagement & Insights
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                See instant results. Track attendance, engagement, and campus-level interest in real time. Understand when and where students are most active to optimize your marketing strategy and maximize ROI.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center pt-8">
            <p className="text-xl text-gray-600 mb-8">
              Ready to connect with campus communities?
            </p>
            <a 
              href="mailto:brands@grapevneapp.com" 
              className="inline-block bg-black text-white px-8 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
            >
              Get in Touch
            </a>
          </section>

          {/* FAQ Section */}
          <section className="pt-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-12">Frequently asked questions</h2>
            <div className="space-y-0">
              {[
                {
                  question: "How do I get started with Grapevne for my brand?",
                  answer: "Contact us at brands@grapevneapp.com to discuss your campus activation goals and we'll help you get started."
                },
                {
                  question: "What approval do I need from COSU?",
                  answer: "You'll need approval from the campus's COSU (Campus Operations and Student Union) office before running activations. We can help guide you through this process."
                },
                {
                  question: "How much does it cost?",
                  answer: "Pricing varies based on your activation needs and campus reach. Contact us for a customized quote."
                },
                {
                  question: "Which campuses are available?",
                  answer: "We're expanding to campuses nationwide. Contact us to see if your target campus is available."
                },
                {
                  question: "What kind of insights can I get?",
                  answer: "You'll receive real-time data on student engagement, attendance patterns, and campus-level interest in your brand or products."
                },
                {
                  question: "How quickly can I set up a campus activation?",
                  answer: "Once COSU approval is obtained, activations can typically be set up within a few days."
                }
              ].map((faq, index) => (
                <div key={index}>
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between py-6 text-left transition-colors group"
                  >
                    <span className="text-lg text-gray-900 group-hover:text-[#60A5FA] transition-colors">{faq.question}</span>
                    <span className="text-gray-400 group-hover:text-[#60A5FA] text-xl transition-colors" style={{ transform: openIndex === index ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      ›
                    </span>
                  </button>
                  {openIndex === index && (
                    <div className="pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                  {index < 5 && (
                    <div className="border-t border-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </section>
          </div>
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
            <Link to="/universities" className="hover-grapevne-blue transition-colors">Universities</Link>
            <Link to="/brands" className="hover-grapevne-blue transition-colors">Brands</Link>
            <Link to="/ambassadors" className="hover-grapevne-blue transition-colors">Ambassadors</Link>
            <span className="text-gray-400 font-medium ml-2">LEGAL AREA</span>
            <Link to="/terms" className="hover-grapevne-blue transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover-grapevne-blue transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Brands

