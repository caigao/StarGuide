import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import QA from './pages/QA'
import Tracker from './pages/Tracker'
import PECS from './pages/PECS'
import Breathe from './pages/Breathe'
import Admin from './pages/Admin'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="qa" element={
          <ProtectedRoute><QA /></ProtectedRoute>
        } />
        <Route path="tracker" element={
          <ProtectedRoute><Tracker /></ProtectedRoute>
        } />
        <Route path="pecs" element={
          <ProtectedRoute><PECS /></ProtectedRoute>
        } />
        <Route path="breathe" element={
          <ProtectedRoute><Breathe /></ProtectedRoute>
        } />
        <Route path="admin" element={
          <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}
