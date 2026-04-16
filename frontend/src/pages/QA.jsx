import { useState, useRef, useEffect } from 'react'
import api from '../services/api'
import './QA.css'

const QUICK_SCENARIOS = [
  '孩子在超市突然尖叫大哭，拒绝离开玩具区',
  '孩子拒绝吃饭，一看到不喜欢的食物就推开',
  '孩子睡前非常焦躁，反复从床上起来不肯睡觉',
  '孩子在公园和其他小朋友发生了冲突，推了别人',
  '孩子一直重复某个动作或某句话，停不下来',
  '孩子对突然的声音（如门铃）极度恐惧',
]

export default function QA() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const scenario = text || input.trim()
    if (!scenario || loading) return

    const userMsg = { role: 'user', content: scenario }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Build history for context
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: m.content
      }))

      const token = localStorage.getItem('token')
      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ scenario, history })
      })

      if (!response.ok) {
        let errorData = ''
        try {
          const json = await response.json()
          errorData = json.error
        } catch {
          errorData = response.statusText
        }
        throw new Error(errorData || '服务出错了')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let fullContent = ''

      // Placeholder for streaming
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk
        
        setMessages(prev => {
          const newMsgs = [...prev]
          newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], content: fullContent }
          return newMsgs
        })
      }
    } catch (err) {
      const errMsg = { role: 'assistant', content: '❌ 抱歉，' + err.message }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage()
  }

  return (
    <div className="qa-page page">
      <div className="container">
        <div className="page-header">
          <h1>🧠 智能场景问答</h1>
          <p>描述您遇到的场景，获取专业的分步应对建议</p>
        </div>

        {messages.length === 0 && (
          <div className="quick-scenarios">
            <p className="quick-label">💡 快速选择常见场景：</p>
            <div className="quick-grid">
              {QUICK_SCENARIOS.map((s, i) => (
                <button key={i} className="quick-btn" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="msg-avatar">
                  {msg.role === 'user' ? '👤' : '🌟'}
                </div>
                <div className="msg-bubble">
                  <div className="msg-content" dangerouslySetInnerHTML={{
                    __html: msg.role === 'assistant'
                      ? formatMarkdown(msg.content)
                      : escapeHtml(msg.content)
                  }} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="msg-avatar">🌟</div>
                <div className="msg-bubble">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input-bar" onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-input chat-input"
              placeholder="描述您遇到的场景，如：孩子在超市突然尖叫..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary send-btn" disabled={loading || !input.trim()}>
              发送
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function formatMarkdown(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/## (.*)/g, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\d+\.\s(.*)$/gm, '<li>$1</li>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br/>')
}
