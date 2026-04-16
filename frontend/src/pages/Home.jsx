import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Home.css'

const FEATURES = [
  {
    emoji: '🧠',
    title: '智能场景问答',
    desc: '面对突发状况，快速获取 AI 驱动的专业分步应对建议',
    path: '/qa',
    color: '#7C6EF0',
  },
  {
    emoji: '📊',
    title: '行为与情绪追踪',
    desc: '可视化记录面板，追踪每日情绪与干预效果趋势',
    path: '/tracker',
    color: '#42A5F5',
  },
  {
    emoji: '🖼️',
    title: '可视化沟通板',
    desc: '在线生成 PECS 视觉提示卡片和结构化日程表',
    path: '/pecs',
    color: '#FF8A65',
  },
  {
    emoji: '💚',
    title: '家长喘息空间',
    desc: 'AI 情感陪伴、呼吸练习与正念冥想放松引导',
    path: '/breathe',
    color: '#66BB6A',
  },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="star-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        <div className="hero-content container">
          <span className="hero-emoji">🌟</span>
          <h1>星语向导</h1>
          <p className="hero-subtitle">用科技的温度，守护每一颗星星的成长</p>
          <p className="hero-desc">
            面向自闭症儿童家庭的全天候智能康复辅助平台<br />
            结合 AI 技术与专业康复理论，让每一位家长都能获得专业级的支持
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/qa" className="btn btn-primary btn-lg">
                🧠 开始使用
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  ✨ 免费注册
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  登录账号
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features container">
        <h2 className="section-title">四大核心功能</h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <Link to={f.path} key={i} className="feature-card" style={{ '--feature-color': f.color }}>
              <span className="feature-emoji">{f.emoji}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="feature-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section className="pain-points container">
        <h2 className="section-title">我们理解您的挑战</h2>
        <div className="pain-grid">
          <div className="pain-item">
            <span>😰</span>
            <p>孩子情绪突然崩溃<br/>不知如何应对</p>
          </div>
          <div className="pain-item">
            <span>🔁</span>
            <p>刻板行为频繁发生<br/>缺乏科学干预手段</p>
          </div>
          <div className="pain-item">
            <span>🗣️</span>
            <p>沟通障碍严重<br/>亲子交流困难重重</p>
          </div>
          <div className="pain-item">
            <span>💔</span>
            <p>长期高压照护<br/>身心疲惫不堪</p>
          </div>
        </div>
        <p className="pain-solution">
          ✨ <strong>星语向导</strong>用 AI 技术为您提供 <em>专业、温暖、全天候</em> 的支持
        </p>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="container">
          <p>🌟 星语向导 StarGuide — 每一颗星星都值得被温柔以待</p>
          <p className="footer-sub">Powered by Google Gemini AI</p>
        </div>
      </footer>
    </div>
  )
}
