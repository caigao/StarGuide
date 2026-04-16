import { useState, useEffect } from 'react'
import api from '../services/api'
import './Admin.css'

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      console.error('加载管理数据失败', err)
      alert(err.response?.data?.error || '加载管理数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`绝对确定要删除用户 "${username}" 吗？此操作无法撤销。`)) return

    try {
      const res = await api.delete(`/api/admin/users/${userId}`)
      alert(res.data.message)
      loadAdminData()
    } catch (err) {
      alert(err.response?.data?.error || '删除失败')
    }
  }

  if (loading) return <div className="page loading"><div className="loading-spinner" /></div>

  return (
    <div className="admin-page page">
      <div className="container">
        <div className="page-header">
          <h1>👑 系统管理</h1>
          <p>查看系统运行数据与管理用户账号</p>
        </div>

        {stats && (
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">总注册用户</span>
              <span className="stat-number">{stats.total_users}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">总追踪记录</span>
              <span className="stat-number">{stats.total_logs}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">总沟通卡片</span>
              <span className="stat-number">{stats.total_cards}</span>
            </div>
          </div>
        )}

        <div className="admin-section card">
          <div className="section-header">
            <h3>👥 用户管理</h3>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>用户</th>
                  <th>邮箱</th>
                  <th>注册时间</th>
                  <th>追踪记录</th>
                  <th>PECS 卡片</th>
                  <th>权限</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <span className="user-emoji">{u.avatar_emoji}</span>
                        {u.username}
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>{u.log_count}</td>
                    <td>{u.card_count}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                        {u.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteUser(u.id, u.username)}
                        >
                          删除
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
