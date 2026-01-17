import { useNavigate } from 'react-router-dom'
import '../styles/navbar.css'

interface NavbarProps {
  isAdmin?: boolean
}

function Navbar({ isAdmin = false }: NavbarProps) {
  const navigate = useNavigate()
  const user = localStorage.getItem('user')
  const parsedUser = user ? JSON.parse(user) : null

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <header className={`navbar ${isAdmin ? 'navbar-admin' : ''}`}>
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1 className="navbar-logo" onClick={() => handleNavigation('/')}>
            🎬 ShowTimeX
          </h1>
        </div>

        <nav className="navbar-menu">
          <ul className="navbar-links">
            <li>
              <a onClick={() => handleNavigation('/')} className="nav-link">
                Home
              </a>
            </li>
            {!isAdmin && parsedUser && (
              <li>
                <a onClick={() => handleNavigation('/my-bookings')} className="nav-link">
                  My Bookings
                </a>
              </li>
            )}
            {isAdmin && (
              <li>
                <a onClick={() => handleNavigation('/')} className="nav-link">
                  View as User
                </a>
              </li>
            )}
          </ul>
        </nav>

        <div className="navbar-actions">
          {parsedUser ? (
            <>
              <span className="navbar-user">{parsedUser.username}</span>
              {!isAdmin && parsedUser.role === 'admin' && (
                <button
                  className="navbar-btn navbar-admin-btn"
                  onClick={() => handleNavigation('/admin-dashboard')}
                >
                  Admin Panel
                </button>
              )}
              <button className="navbar-btn navbar-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="navbar-btn navbar-login-btn"
                onClick={() => handleNavigation('/login')}
              >
                Login
              </button>
              <button
                className="navbar-btn navbar-signup-btn"
                onClick={() => handleNavigation('/signup')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
