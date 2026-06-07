import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Audit from './pages/Audit'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CopyGenerator from './pages/CopyGenerator'
import Chat from './pages/Chat'
import Onboarding from './pages/Onboarding'
import CreateCampaign from './pages/CreateCampaign'
import CompetitorSpy from './pages/CompetitorSpy'


function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={
          <PrivateRoute><Onboarding /></PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/copy-generator" element={
          <PrivateRoute><CopyGenerator /></PrivateRoute>
        } />
        <Route path="/chat" element={
          <PrivateRoute><Chat /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/create-campaign" element={
          <PrivateRoute><CreateCampaign /></PrivateRoute>
        } />
        <Route path="/competitor-spy" element={<PrivateRoute><CompetitorSpy /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App