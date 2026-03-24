import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute — wraps a page component with role-based access.
 * @param {string[]} allowedRoles — roles allowed to access this route
 * @param {React.ReactNode} children — the page component
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <AccessDenied />
  }

  return children
}

function AccessDenied() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="access-denied">
          <div className="access-denied-icon">🔒</div>
          <h1>Access Denied</h1>
          <p>You don't have permission to view this page.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Go to Homepage</a>
        </div>
      </div>
    </div>
  )
}
