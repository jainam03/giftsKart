import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="header" id="main-header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-icon">🎁</span>
          Gifts<span>Kart</span>
        </Link>

        <button className="mobile-menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? '✕' : '☰'}
        </button>

        <nav className={`nav ${open ? 'open' : ''}`} id="main-nav">
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/catalogue" onClick={() => setOpen(false)}>Catalogue</NavLink>
          <NavLink to="/festival-gifts" onClick={() => setOpen(false)}>Festival Gifts</NavLink>
          <NavLink to="/corporate-gifts" onClick={() => setOpen(false)}>Corporate Gifts</NavLink>
          <NavLink to="/bulk-order" onClick={() => setOpen(false)}>Bulk Order</NavLink>
          <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
          <NavLink to="/admin" onClick={() => setOpen(false)} className="nav-cta">Admin</NavLink>
        </nav>
      </div>
    </header>
  )
}
