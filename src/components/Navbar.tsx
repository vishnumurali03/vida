import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isAuthenticated, isLoading, loginWithGoogle, loginWithFacebook, logout } = useAuth()

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Vida
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isMenuOpen} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                to="/" 
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/recipes" 
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Recipes
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/about" 
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/articles" 
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Articles
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link 
                  to="/submit" 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Submit Recipe
                </Link>
              </li>
            )}
            
            {/* Authentication Section */}
            {isLoading ? (
              <li className="nav-item">
                <span className="nav-link">Loading...</span>
              </li>
            ) : isAuthenticated && user ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{ border: 'none', background: 'none' }}
                >
                  {user.avatar && (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="rounded-circle me-2"
                      width="32"
                      height="32"
                    />
                  )}
                  {user.name}
                </button>
                <ul className={`dropdown-menu ${isUserMenuOpen ? 'show' : ''}`}>
                  <li>
                    <span className="dropdown-item-text">
                      <small className="text-muted">{user.email}</small>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => {
                        logout()
                        setIsUserMenuOpen(false)
                        setIsMenuOpen(false)
                      }}
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-primary me-2"
                    onClick={() => {
                      loginWithGoogle()
                      setIsMenuOpen(false)
                    }}
                  >
                    <i className="fab fa-google me-1"></i>
                    Sign in with Google
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      loginWithFacebook()
                      setIsMenuOpen(false)
                    }}
                  >
                    <i className="fab fa-facebook-f me-1"></i>
                    Sign in with Facebook
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
} 