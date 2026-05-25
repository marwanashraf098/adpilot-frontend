import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CopyGenerator from './pages/CopyGenerator'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Audit from './pages/Audit'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/copy-generator" element={
          <PrivateRoute><CopyGenerator /></PrivateRoute>
        } />
        <Route path="/chat" element={
          <PrivateRoute><Chat /></PrivateRoute>
        } />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/audit" element={<Audit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App