import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const BACKEND = 'https://adpilot-backend-production-24e1.up.railway.app'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    businessName: '',
    industry: 'GYM'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${BACKEND}/api/auth/register`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('businessName', res.data.businessName)
      localStorage.setItem('email', res.data.email)
      localStorage.setItem('userId', res.data.userId)
      localStorage.setItem('industry', res.data.industry || 'business')
      navigate('/onboarding')
    } catch (err) {
      setError('Registration failed. Email may already be in use.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">AdPilot</h1>
          <p className="text-gray-400 mt-2">Start managing your ads with AI</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-6">Create your account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="Ahmed Mohamed" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Business name</label>
              <input type="text" name="businessName" value={form.businessName} onChange={handleChange} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="Cairo Gym" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Industry</label>
              <select name="industry" value={form.industry} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition">
                <option value="GYM">Gym</option>
                <option value="CLINIC">Clinic</option>
                <option value="RESTAURANT">Restaurant</option>
                <option value="SALON">Beauty Salon</option>
                <option value="ECOMMERCE">E-commerce</option>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="AUTOMOTIVE">Automotive</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="you@business.com" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register