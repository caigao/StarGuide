import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Auth.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPw) {
      setError('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      await register(username, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-emoji">✨</span>
            <h1>加入星语向导</h1>
            <p>创建账号，开始您的康复辅助之旅</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            <div className="form-group">
              <label htmlFor="reg-username">用户名</label>
              <input
                id="reg-username"
                type="text"
                className="form-input"
                autoComplete="new-password"
                placeholder="2-20 个字符"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">邮箱</label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                autoComplete="new-password"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">密码</label>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                autoComplete="new-password"
                placeholder="至少 6 个字符"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm">确认密码</label>
              <input
                id="reg-confirm"
                type="password"
                className="form-input"
                autoComplete="new-password"
                placeholder="再次输入密码"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? '注册中...' : '🌟 注册'}
            </button>
          </form>

          <p className="auth-switch">
            已有账号？ <Link to="/login">立即登录</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
