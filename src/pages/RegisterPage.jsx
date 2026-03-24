import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, ROLES, ROLE_LABELS, ROLE_HOME } from '../context/AuthContext'

export default function RegisterPage() {
  const { register, isAuthenticated, role } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    role: ROLES.CUSTOMER,
  })
  const [error, setError] = useState('')

  if (isAuthenticated) {
    navigate(ROLE_HOME[role] || '/', { replace: true })
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.company) {
      setError('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    const result = register(form)
    if (result.success) {
      navigate(ROLE_HOME[result.user.role] || '/', { replace: true })
    } else {
      setError(result.error)
    }
  }

  const ROLE_OPTIONS = [
    { value: ROLES.CUSTOMER, label: 'Corporate Customer', desc: 'Order gifts for your team', icon: '🏢' },
    { value: ROLES.VENDOR, label: 'Vendor / Manufacturer', desc: 'List and sell your products', icon: '🏭' },
    { value: ROLES.ADMIN, label: 'Admin', desc: 'Manage the platform', icon: '⚙️' },
  ]

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: 24 }}>
              <span className="logo-icon">🎁</span>
              Gifts<span>Kart</span>
            </Link>
            <h1>Create Account</h1>
            <p>Join GiftsKart — corporate gifting made simple</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Role Selector */}
            <div className="form-group">
              <label className="form-label">I am a...</label>
              <div className="role-selector">
                {ROLE_OPTIONS.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    className={`role-pill ${form.role === r.value ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, role: r.value })}
                  >
                    <span className="role-pill-icon">{r.icon}</span>
                    <span className="role-pill-label">{r.label}</span>
                    <span className="role-pill-desc">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Company / Organization</label>
                <input className="form-input" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Your company name" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.in" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 6 characters" />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
