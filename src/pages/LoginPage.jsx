import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth, ROLE_LABELS, ROLE_HOME, ROLES } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated, role } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  // Redirect if already logged in
  if (isAuthenticated) {
    const dest = location.state?.from || ROLE_HOME[role] || '/'
    navigate(dest, { replace: true })
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }
    const result = login(form.email, form.password)
    if (result.success) {
      const dest = location.state?.from || ROLE_HOME[result.user.role] || '/'
      navigate(dest, { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="logo" style={{ justifyContent: 'center', marginBottom: 24 }}>
              <span className="logo-icon">🎁</span>
              Gifts<span>Kart</span>
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to your GiftsKart account</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.in"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Create one</Link></p>
          </div>

          <div className="auth-demo">
            <h4>Demo Accounts</h4>
            <div className="demo-accounts">
              <button className="demo-account-btn" onClick={() => { setForm({ email: 'priya@technova.in', password: 'customer123' }); setError('') }}>
                <span className="demo-role-badge customer">Customer</span>
                <span>priya@technova.in</span>
              </button>
              <button className="demo-account-btn" onClick={() => { setForm({ email: 'vendor@craftworks.in', password: 'vendor123' }); setError('') }}>
                <span className="demo-role-badge vendor">Vendor</span>
                <span>vendor@craftworks.in</span>
              </button>
              <button className="demo-account-btn" onClick={() => { setForm({ email: 'admin@giftskart.in', password: 'admin123' }); setError('') }}>
                <span className="demo-role-badge admin">Admin</span>
                <span>admin@giftskart.in</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
