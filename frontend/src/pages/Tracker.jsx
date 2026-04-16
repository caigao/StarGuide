import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import api from '../services/api'
import './Tracker.css'

const MOOD_LABELS = ['', '😫 很差', '😟 较差', '😐 一般', '😊 较好', '😄 很好']
const EFFECT_LABELS = ['', '无效果', '微弱', '一般', '有效', '非常有效']

export default function Tracker() {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [mood, setMood] = useState(3)
  const [behaviorDesc, setBehaviorDesc] = useState('')
  const [intervention, setIntervention] = useState('')
  const [effect, setEffect] = useState(3)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [logsRes, statsRes] = await Promise.all([
        api.get('/api/logs'),
        api.get('/api/logs/stats?days=30')
      ])
      setLogs(logsRes.data)
      setStats(statsRes.data)
    } catch (err) {
      console.error('加载数据失败', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/api/logs', {
        date, mood, behavior_desc: behaviorDesc,
        intervention, effect, notes
      })
      setShowForm(false)
      setBehaviorDesc('')
      setIntervention('')
      setNotes('')
      setMood(3)
      setEffect(3)
      loadData()
    } catch (err) {
      alert(err.response?.data?.error || '提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这条记录吗？')) return
    try {
      await api.delete(`/api/logs/${id}`)
      loadData()
    } catch (err) {
      alert('删除失败')
    }
  }

  if (loading) return <div className="page loading"><div className="loading-spinner" /></div>

  return (
    <div className="tracker-page page">
      <div className="container">
        <div className="page-header">
          <h1>📊 行为与情绪追踪</h1>
          <p>记录每日情绪与干预效果，见证成长轨迹</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-number">{stats.total_logs}</span>
              <span className="stat-label">总记录数</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.avg_mood || '-'}</span>
              <span className="stat-label">平均情绪</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.days}</span>
              <span className="stat-label">统计天数</span>
            </div>
          </div>
        )}

        {/* Chart */}
        {stats?.trend?.length > 1 && (
          <div className="chart-card card">
            <h3>📈 近 30 天趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,110,240,0.1)" />
                <XAxis dataKey="date" stroke="#6E6B8A" tick={{ fontSize: 12 }}
                  tickFormatter={d => d.slice(5)} />
                <YAxis domain={[1, 5]} stroke="#6E6B8A" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#242240', border: '1px solid rgba(124,110,240,0.3)', borderRadius: 8 }}
                  labelStyle={{ color: '#A8A5C0' }}
                />
                <Legend />
                <Line type="monotone" dataKey="avg_mood" name="情绪" stroke="#7C6EF0"
                  strokeWidth={2} dot={{ fill: '#7C6EF0', r: 4 }} />
                <Line type="monotone" dataKey="avg_effect" name="干预效果" stroke="#FF8A65"
                  strokeWidth={2} dot={{ fill: '#FF8A65', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Add Button */}
        <button className="btn btn-primary add-log-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '取消' : '➕ 新增记录'}
        </button>

        {/* Form */}
        {showForm && (
          <form className="log-form card" onSubmit={handleSubmit}>
            <h3>📝 新增行为记录</h3>

            <div className="form-row">
              <div className="form-group">
                <label>日期</label>
                <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>情绪评分：{MOOD_LABELS[mood]}</label>
                <input type="range" min="1" max="5" value={mood} onChange={e => setMood(+e.target.value)}
                  className="mood-slider" />
                <div className="slider-labels">
                  <span>😫</span><span>😟</span><span>😐</span><span>😊</span><span>😄</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>行为描述 *</label>
              <textarea className="form-input" placeholder="描述孩子今天的行为表现..."
                value={behaviorDesc} onChange={e => setBehaviorDesc(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>干预方法</label>
              <textarea className="form-input" placeholder="采用了什么干预措施..."
                value={intervention} onChange={e => setIntervention(e.target.value)} />
            </div>

            <div className="form-group">
              <label>干预效果：{EFFECT_LABELS[effect]}</label>
              <input type="range" min="1" max="5" value={effect} onChange={e => setEffect(+e.target.value)}
                className="mood-slider" />
            </div>

            <div className="form-group">
              <label>备注</label>
              <input type="text" className="form-input" placeholder="其他需要记录的信息..."
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? '提交中...' : '✅ 保存记录'}
            </button>
          </form>
        )}

        {/* Log List */}
        <div className="log-list">
          <h3>📋 历史记录</h3>
          {logs.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">📝</div>
              <p>还没有记录，点击"新增记录"开始追踪吧</p>
            </div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="log-item card">
                <div className="log-header">
                  <div className="log-date">{log.date}</div>
                  <div className="log-mood">{MOOD_LABELS[log.mood]}</div>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(log.id)}>删除</button>
                </div>
                <p className="log-desc">{log.behavior_desc}</p>
                {log.intervention && (
                  <p className="log-detail"><strong>干预：</strong>{log.intervention}</p>
                )}
                <div className="log-footer">
                  <span className="badge badge-primary">效果: {EFFECT_LABELS[log.effect]}</span>
                  {log.notes && <span className="log-notes">{log.notes}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
