import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-12 mb-6">
          {/* Newsletter Signup */}
          <div className="flex-1 max-w-sm">
            <h3 className="text-2xl font-light mb-4">Join the Grapevne Community</h3>
            <form className="space-y-4">
              <div className="flex items-center border-b border-gray-300 pb-2">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="flex-1 outline-none text-sm bg-transparent"
                />
                <button type="submit" className="text-gray-400 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <input type="checkbox" id="privacy-consent" className="w-4 h-4" />
                <label htmlFor="privacy-consent" className="text-gray-600">
                  I have read the <Link to="/privacy" className="underline hover-grapevne-blue transition-colors">Privacy Policy</Link> and consent to the processing of my personal data for marketing purposes
                </label>
              </div>
            </form>
          </div>
          
          {/* Footer Links */}
          <div className="flex flex-col items-end gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 font-medium">USE CASES</span>
              <Link to="/universities" className="hover-grapevne-blue transition-colors">Universities</Link>
              <Link to="/brands" className="hover-grapevne-blue transition-colors">Brands</Link>
              <Link to="/ambassadors" className="hover-grapevne-blue transition-colors">Ambassadors</Link>
              <span className="text-gray-400 font-medium ml-2">LEGAL AREA</span>
              <Link to="/terms" className="hover-grapevne-blue transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover-grapevne-blue transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-3">
          <span className="ip-symbol text-black" style={{ transform: 'translateY(-1px)' }}>®</span>
          <span className="ip-symbol text-black" style={{ transform: 'translateY(1px)' }}>™</span>
          <span className="ip-symbol text-black" style={{ transform: 'translateY(-1px)' }}>©</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

