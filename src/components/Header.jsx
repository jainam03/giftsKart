import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth, ROLE_LABELS, ROLE_HOME } from '../context/AuthContext'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, isAuthenticated, logout, role } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    setOpen(false)
    navigate('/')
  }

  const roleColor = {
    customer: '#2196f3',
    vendor: '#ff9800',
    admin: '#e53935',
  }

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

          {/* Customer-specific links */}
          {isAuthenticated && (role === 'customer' || role === 'admin') && (
            <>
              <NavLink to="/bulk-order" onClick={() => setOpen(false)}>Bulk Order</NavLink>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
            </>
          )}

          {/* Vendor-specific link */}
          {isAuthenticated && (role === 'vendor' || role === 'admin') && (
            <NavLink to="/vendor" onClick={() => setOpen(false)}>Vendor Panel</NavLink>
          )}

          {/* Admin-specific link */}
          {isAuthenticated && role === 'admin' && (
            <NavLink to="/admin" onClick={() => setOpen(false)} className="nav-cta">Admin</NavLink>
          )}

          {/* Auth section */}
          {!isAuthenticated ? (
            <NavLink to="/login" onClick={() => setOpen(false)} className="nav-cta">Login</NavLink>
          ) : (
            <div className="user-dropdown" ref={dropdownRef}>
              <button
                className="user-dropdown-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="user-avatar" style={{ borderColor: roleColor[role] }}>
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="user-dropdown-name">{user.name?.split(' ')[0]}</span>
                <span className="user-dropdown-chevron">{dropdownOpen ? '▲' : '▼'}</span>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-fullname">{user.name}</div>
                    <div className="user-dropdown-email">{user.email}</div>
                    <div className="user-dropdown-role-badge" style={{ background: roleColor[role] }}>
                      {ROLE_LABELS[role]}
                    </div>
                  </div>
                  <div className="user-dropdown-divider" />
                  <button
                    className="user-dropdown-item"
                    onClick={() => { navigate(ROLE_HOME[role] || '/'); setDropdownOpen(false); }}
                  >
                    📊 My Dashboard
                  </button>
                  <button className="user-dropdown-item logout" onClick={handleLogout}>
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
