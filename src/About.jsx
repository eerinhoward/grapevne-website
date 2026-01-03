import React, { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

function About() {
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
      const isClickable = target.closest('a, button, [onclick], [role="button"], input, textarea, select')
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

    // Start animation loop
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="space-y-16">
          {/* Hero Section */}
          <section className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-light mb-8 leading-tight lowercase" style={{ color: '#1a1a1a' }}>
              I gather, therefore I am.
            </h1>
          </section>

          {/* First Section */}
          <section className="space-y-6 text-center">
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Since the beginning, people have found reasons to come together.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Around food. Around stories. Around whatever was available.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Sharing a meal is one of the oldest social acts we have. It's how friendships start, ideas spread, and communities take shape.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              And yet, somehow, getting fed on campus has become weirdly hard.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Free food exists everywhere - club meetings, pop-ups, events, leftover catering - but it's scattered, unannounced, and easy to miss. You hear about it ten minutes too late. Or not at all.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              So we built something better.
            </p>
          </section>

          {/* Solution Section */}
          <section className="space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light leading-tight lowercase" style={{ color: '#1a1a1a' }}>
              From "there might be food" to "I'm on my way"
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Grapevne makes campus food visible in real time.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Not tomorrow. Not in a buried email. Not through five group chats.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Whether you're posting leftover pizza, finding a pop-up across campus, or just trying to eat between classes, Grapevne turns missed moments into shared ones.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              It's simple: see what's happening, where it is, and when it's gone.
            </p>
          </section>

          {/* Built For Section */}
          <section className="space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light leading-tight lowercase" style={{ color: '#1a1a1a' }}>
              Built for how campuses actually work
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              We didn't design Grapevne in theory - we built it while living this problem.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              We know how fast food disappears.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              We know how chaotic campus schedules are.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              We know how often things go to waste simply because no one knew.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              So we made something lightweight, fast, and social by default. No friction. No overthinking. Just enough structure to make sharing easy - and finding food even easier.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Because when access improves, waste drops.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              And when food moves better, people do too.
            </p>
          </section>

          {/* Team Section */}
          <section className="space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl font-light leading-tight lowercase" style={{ color: '#1a1a1a' }}>
              Who's behind this?
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              We're a small team who cares a little too much about how things move through campus.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Some of us hate seeing food thrown out.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Some of us hate missing it.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Some of us just believe that access - to food, to space, to each other - shouldn't depend on being "in the know."
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Different backgrounds, same belief:
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              small systems shape daily life more than big ideas do.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              That's why we're building Grapevne.
            </p>
            <p className="text-xl leading-relaxed" style={{ color: '#1a1a1a' }}>
              Not to reinvent campus - but to make it work the way it always should have.
            </p>
          </section>
        </div>
      </main>

      {/* Footer with ®, ™, and © symbols */}
      <footer className="py-8 px-4">
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
        </div>
      </footer>
    </div>
  )
}

export default About

