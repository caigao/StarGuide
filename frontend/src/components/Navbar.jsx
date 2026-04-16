import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const NAV_ITEMS = [
  { path: '/qa', label: '智能问答', emoji: '🧠' },
  { path: '/tracker', label: '行为追踪', emoji: '📊' },
  { path: '/pecs', label: '沟通板', emoji: '🖼️' },
  { path: '/breathe', label: '喘息空间', emoji: '💚' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-emoji">🌟</span>
          <span className="brand-text">星语向导</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="菜单">
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span><span></span><span></span>
          </span>
        </button>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-emoji">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            {user ? (
              <div className="user-menu">
                {user.role === 'admin' && (
                  <Link to="/admin" className="nav-link admin-link" onClick={() => setMenuOpen(false)}>
                    👑 管理
                  </Link>
                )}
                <span className="user-info">
                  {user.avatar_emoji} {user.username}
                </span>
                <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
                  退出
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-sm btn-secondary" onClick={() => setMenuOpen(false)}>
                  登录
                </Link>
                <Link to="/register" className="btn btn-sm btn-primary" onClick={() => setMenuOpen(false)}>
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
