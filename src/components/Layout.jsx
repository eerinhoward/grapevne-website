import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DownloadLink from './DownloadLink'

const NAV = [
  { to: '/universities', label: 'Universities' },
  { to: '/safety', label: 'Safety' },
  { to: '/about', label: 'About' },
]

function NavLinks({ onNavigate }) {
  const { pathname } = useLocation()
  return NAV.map((item) => (
    <Link
      key={item.to}
      to={item.to}
      className={pathname === item.to ? 'active' : undefined}
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  ))
}

export default function Layout({ title = 'Grapevne', children }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="site">
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Grapevne home">
          <img src="/mark.png" alt="" />
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <NavLinks />
        </nav>
        <div className="header-actions">
          <DownloadLink className="btn btn-blue btn-small header-download">Download</DownloadLink>
          <button
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <span />
            <span />
          </button>
        </div>
        <div className="menu-panel" id="site-menu" hidden={!open}>
          <NavLinks onNavigate={() => setOpen(false)} />
          <DownloadLink className="btn btn-blue">Download on the App Store</DownloadLink>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <Link to="/" className="brand">
              <img src="/mark.png" alt="" />
              <span>Grapevne</span>
            </Link>
            <p>the feed that feeds you</p>
          </div>
          <div>
            <h3>Campus</h3>
            <ul>
              <li><Link to="/universities">Universities</Link></li>
              <li><Link to="/safety">Safety</Link></li>
              <li><Link to="/brands">Brands</Link></li>
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><a href="https://www.instagram.com/grapevne" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@grapevne" target="_blank" rel="noopener noreferrer">TikTok</a></li>
              <li><a href="https://www.linkedin.com/company/grapevne" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
          <div>
            <h3>Legal</h3>
            <ul>
              <li><Link to="/terms">Terms</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="wrap footer-base">
          <span>© {new Date().getFullYear()} Grapevne</span>
          <span className="marks" aria-label="Registered, trademark, and copyright">® ™ ©</span>
        </div>
      </footer>
      {pathname !== '/universities' && (
        <Link to="/universities" className="campus-bar">
          <img src="/mark.png" alt="" />
          <span>Are you a university? Learn how Grapevne works on <span>your campus.</span></span>
        </Link>
      )}
    </div>
  )
}
