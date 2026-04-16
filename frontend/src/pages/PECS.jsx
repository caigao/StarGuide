import { useState, useEffect } from 'react'
import api from '../services/api'
import './PECS.css'

const CATEGORIES = [
  { key: 'all', label: '全部', emoji: '📋' },
  { key: 'daily', label: '日常', emoji: '🌅' },
  { key: 'emotion', label: '情绪', emoji: '😊' },
  { key: 'activity', label: '活动', emoji: '🎨' },
  { key: 'food', label: '饮食', emoji: '🍚' },
]

const EMOJI_OPTIONS = ['⭐', '🌈', '🎈', '🧩', '🎯', '🏠', '🚗', '📱', '🎪', '🧸', '⚽', '🎹']

export default function PECS() {
  const [cards, setCards] = useState([])
  const [filter, setFilter] = useState('all')
  const [schedule, setSchedule] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  // New card form
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('daily')
  const [iconEmoji, setIconEmoji] = useState('⭐')
  const [color, setColor] = useState('#7C6EF0')

  useEffect(() => { loadCards() }, [])

  const loadCards = async () => {
    try {
      const res = await api.get('/api/pecs/cards')
      setCards(res.data)
    } catch (err) {
      console.error('加载卡片失败', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredCards = filter === 'all' ? cards : cards.filter(c => c.category === filter)

  const addToSchedule = (card) => {
    setSchedule(prev => [...prev, { ...card, scheduleId: Date.now() + Math.random() }])
  }

  const removeFromSchedule = (scheduleId) => {
    setSchedule(prev => prev.filter(s => s.scheduleId !== scheduleId))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/api/pecs/cards', { title, category, icon_emoji: iconEmoji, color })
      setShowForm(false)
      setTitle('')
      loadCards()
    } catch (err) {
      alert(err.response?.data?.error || '创建失败')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定删除这张卡片吗？')) return
    try {
      await api.delete(`/api/pecs/cards/${id}`)
      setSchedule(prev => prev.filter(s => s.id !== id))
      loadCards()
    } catch (err) {
      alert('删除失败')
    }
  }

  const printSchedule = () => {
    window.print()
  }

  if (loading) return <div className="page loading"><div className="loading-spinner" /></div>

  return (
    <div className="pecs-page page">
      <div className="container">
        <div className="page-header">
          <h1>🖼️ 可视化沟通板</h1>
          <p>使用 PECS 卡片创建视觉日程表，帮助孩子理解日常流程</p>
        </div>

        <div className="pecs-layout">
          {/* Cards Panel */}
          <div className="cards-panel">
            <div className="panel-header">
              <h3>卡片库</h3>
              <button className="btn btn-sm btn-primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? '取消' : '➕ 自定义'}
              </button>
            </div>

            {/* New Card Form */}
            {showForm && (
              <form className="new-card-form" onSubmit={handleCreate}>
                <input type="text" className="form-input" placeholder="卡片标题"
                  value={title} onChange={e => setTitle(e.target.value)} required />
                <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="daily">日常</option>
                  <option value="emotion">情绪</option>
                  <option value="activity">活动</option>
                  <option value="food">饮食</option>
                </select>
                <div className="emoji-picker">
                  {EMOJI_OPTIONS.map(em => (
                    <button key={em} type="button"
                      className={`emoji-opt ${iconEmoji === em ? 'active' : ''}`}
                      onClick={() => setIconEmoji(em)}>{em}</button>
                  ))}
                </div>
                <div className="color-row">
                  <label>颜色</label>
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-sm btn-primary">创建卡片</button>
              </form>
            )}

            {/* Category Filter */}
            <div className="category-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  className={`cat-tab ${filter === cat.key ? 'active' : ''}`}
                  onClick={() => setFilter(cat.key)}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Card Grid */}
            <div className="pecs-grid">
              {filteredCards.map(card => (
                <div
                  key={card.id}
                  className="pecs-card"
                  style={{ '--card-color': card.color }}
                  onClick={() => addToSchedule(card)}
                >
                  <span className="pecs-emoji">{card.icon_emoji}</span>
                  <span className="pecs-title">{card.title}</span>
                  <button className="pecs-delete" onClick={(e) => { e.stopPropagation(); handleDelete(card.id) }}>×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Panel */}
          <div className="schedule-panel">
            <div className="panel-header">
              <h3>📅 今日日程</h3>
              {schedule.length > 0 && (
                <div className="schedule-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => setSchedule([])}>清空</button>
                  <button className="btn btn-sm btn-warm" onClick={printSchedule}>🖨️ 打印</button>
                </div>
              )}
            </div>

            {schedule.length === 0 ? (
              <div className="empty-state">
                <div className="emoji">👈</div>
                <p>点击左侧卡片添加到日程</p>
              </div>
            ) : (
              <div className="schedule-list" id="print-schedule">
                <h2 className="print-title">📅 今日日程表</h2>
                {schedule.map((item, i) => (
                  <div key={item.scheduleId} className="schedule-item" style={{ '--card-color': item.color }}>
                    <span className="schedule-num">{i + 1}</span>
                    <span className="schedule-emoji">{item.icon_emoji}</span>
                    <span className="schedule-label">{item.title}</span>
                    <button className="schedule-remove no-print" onClick={() => removeFromSchedule(item.scheduleId)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
