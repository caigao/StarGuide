import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(loginId, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-emoji">🌟</span>
            <h1>欢迎回来</h1>
            <p>登录您的星语向导账号</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            <div className="form-group">
              <label htmlFor="login-id">用户名 / 邮箱</label>
              <input
                id="login-id"
                type="text"
                className="form-input"
                autoComplete="new-password"
                placeholder="请输入用户名或邮箱"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">密码</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                autoComplete="new-password"
                placeholder="请输入密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? '登录中...' : '🚀 登录'}
            </button>
          </form>

          <p className="auth-switch">
            还没有账号？ <Link to="/register">立即注册</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
