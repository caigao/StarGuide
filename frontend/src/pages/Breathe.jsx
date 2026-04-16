import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import './Breathe.css'

const BREATHING_PHASES = [
  { label: '吸气', duration: 4, emoji: '🌬️' },
  { label: '屏住', duration: 4, emoji: '⏸️' },
  { label: '呼气', duration: 6, emoji: '💨' },
]

export default function Breathe() {
  const [tab, setTab] = useState('chat') // chat | breathe | mindful
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好呀 ☺️ 我是星语向导，你的情感支持伙伴。\n\n今天感觉怎么样？无论开心还是疲惫，我都在这里陪你聊聊。💚' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [quotes, setQuotes] = useState([])
  const [quoteIdx, setQuoteIdx] = useState(0)

  // Breathing
  const [breathing, setBreathing] = useState(false)
  const [phase, setPhase] = useState(0)
  const [timer, setTimer] = useState(0)
  const intervalRef = useRef(null)

  // Mindfulness
  const [mindfulTime, setMindfulTime] = useState(180) // 3 min default
  const [mindfulRunning, setMindfulRunning] = useState(false)
  const [mindfulLeft, setMindfulLeft] = useState(180)
  const mindfulRef = useRef(null)

  const chatEndRef = useRef(null)

  useEffect(() => {
    api.get('/api/breathe/quotes').then(res => {
      setQuotes(res.data)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Quote rotation
  useEffect(() => {
    if (quotes.length === 0) return
    const interval = setInterval(() => {
      setQuoteIdx(prev => (prev + 1) % quotes.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [quotes])

  // Breathing exercise
  useEffect(() => {
    if (!breathing) {
      clearInterval(intervalRef.current)
      return
    }

    let currentPhase = 0
    let currentTime = BREATHING_PHASES[0].duration
    setPhase(0)
    setTimer(currentTime)

    intervalRef.current = setInterval(() => {
      currentTime--
      if (currentTime <= 0) {
        currentPhase = (currentPhase + 1) % BREATHING_PHASES.length
        currentTime = BREATHING_PHASES[currentPhase].duration
      }
      setPhase(currentPhase)
      setTimer(currentTime)
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [breathing])

  // Mindfulness timer
  useEffect(() => {
    if (!mindfulRunning) {
      clearInterval(mindfulRef.current)
      return
    }
    mindfulRef.current = setInterval(() => {
      setMindfulLeft(prev => {
        if (prev <= 1) {
          setMindfulRunning(false)
          return mindfulTime
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(mindfulRef.current)
  }, [mindfulRunning])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.slice(1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content
      }))
      const res = await api.post('/api/breathe/chat', { message: text, history })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我暂时无法回复。请深呼吸，稍后再试 💚' }])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="breathe-page page">
      <div className="container">
        <div className="page-header">
          <h1>💚 家长喘息空间</h1>
          <p>这里是属于你的安全空间，放慢脚步，照顾自己</p>
        </div>

        {/* Quote Banner */}
        {quotes.length > 0 && (
          <div className="quote-banner">
            <p className="quote-text">"{quotes[quoteIdx]?.text}"</p>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="breathe-tabs">
          <button className={`tab-btn ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')}>
            💬 情感陪伴
          </button>
          <button className={`tab-btn ${tab === 'breathe' ? 'active' : ''}`} onClick={() => setTab('breathe')}>
            🌬️ 呼吸练习
          </button>
          <button className={`tab-btn ${tab === 'mindful' ? 'active' : ''}`} onClick={() => setTab('mindful')}>
            🧘 正念冥想
          </button>
        </div>

        {/* Chat Tab */}
        {tab === 'chat' && (
          <div className="companion-chat">
            <div className="chat-messages companion-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                  <div className="msg-avatar">{msg.role === 'user' ? '👤' : '💚'}</div>
                  <div className="msg-bubble">
                    <div className="msg-content">{msg.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message assistant">
                  <div className="msg-avatar">💚</div>
                  <div className="msg-bubble">
                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form className="chat-input-bar" onSubmit={e => { e.preventDefault(); sendMessage() }}>
              <input
                type="text"
                className="form-input chat-input"
                placeholder="说说你的感受..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btn btn-warm send-btn" disabled={loading || !input.trim()}>
                发送
              </button>
            </form>
          </div>
        )}

        {/* Breathing Tab */}
        {tab === 'breathe' && (
          <div className="breathing-section">
            <div className={`breath-circle ${breathing ? 'active' : ''}`}
              data-phase={phase}>
              <div className="breath-inner">
                <span className="breath-emoji">{breathing ? BREATHING_PHASES[phase].emoji : '🌟'}</span>
                <span className="breath-label">{breathing ? BREATHING_PHASES[phase].label : '准备好了吗？'}</span>
                {breathing && <span className="breath-timer">{timer}</span>}
              </div>
            </div>
            <button
              className={`btn ${breathing ? 'btn-secondary' : 'btn-primary'} breath-toggle`}
              onClick={() => setBreathing(!breathing)}
            >
              {breathing ? '⏹ 停止' : '▶️ 开始呼吸练习'}
            </button>
            <p className="breath-guide">
              吸气 4 秒 → 屏住 4 秒 → 呼气 6 秒
            </p>
          </div>
        )}

        {/* Mindfulness Tab */}
        {tab === 'mindful' && (
          <div className="mindful-section">
            <div className="mindful-timer-display">
              <span className="mindful-time">{formatTime(mindfulLeft)}</span>
              <span className="mindful-label">{mindfulRunning ? '正在冥想中...' : '设置冥想时间'}</span>
            </div>
            {!mindfulRunning && (
              <div className="mindful-presets">
                {[60, 180, 300, 600].map(s => (
                  <button key={s}
                    className={`btn btn-sm ${mindfulTime === s ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setMindfulTime(s); setMindfulLeft(s) }}
                  >
                    {s / 60} 分钟
                  </button>
                ))}
              </div>
            )}
            <button
              className={`btn ${mindfulRunning ? 'btn-secondary' : 'btn-warm'} mindful-toggle`}
              onClick={() => {
                if (!mindfulRunning) setMindfulLeft(mindfulTime)
                setMindfulRunning(!mindfulRunning)
              }}
            >
              {mindfulRunning ? '⏹ 结束' : '🧘 开始冥想'}
            </button>
            <div className="mindful-tips">
              <p>💡 小贴士：</p>
              <ul>
                <li>找一个安静的地方坐下</li>
                <li>轻轻闭上眼睛</li>
                <li>关注你的呼吸</li>
                <li>当思绪飘走时，温柔地带回到呼吸上</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
