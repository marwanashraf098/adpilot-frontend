import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard() {
  const navigate = useNavigate()
  const businessName = localStorage.getItem('businessName')
  const email = localStorage.getItem('email')
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token')
  const [accounts, setAccounts] = useState([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleConnectMeta = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/meta/oauth-url?userId=${userId}`
    )
      window.location.href = res.data.url
    } catch (err) {
      alert('Failed to get Meta OAuth URL')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">AdPilot</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{businessName}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Welcome back, {businessName}</h2>
          <p className="text-gray-400 mt-1">Connect your ad accounts to get started</p>
        </div>

        {/* Connect accounts section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

          {/* Meta card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                f
              </div>
              <div>
                <h3 className="font-semibold">Meta Ads</h3>
                <p className="text-gray-400 text-xs">Facebook & Instagram</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Connect your Meta ad account to monitor and optimize your campaigns.
            </p>
            <button
              onClick={handleConnectMeta}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition"
            >
              Connect Meta Account
            </button>
          </div>

          {/* Google card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold">
                G
              </div>
              <div>
                <h3 className="font-semibold">Google Ads</h3>
                <p className="text-gray-400 text-xs">Search & Display</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Connect your Google Ads account to manage search and display campaigns.
            </p>
            <button
              disabled
              className="w-full bg-gray-800 text-gray-500 text-sm font-semibold rounded-lg px-4 py-2.5 cursor-not-allowed"
            >
              Coming soon
            </button>
          </div>

          {/* TikTok card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <h3 className="font-semibold">TikTok Ads</h3>
                <p className="text-gray-400 text-xs">TikTok for Business</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Connect your TikTok Ads account to reach younger audiences.
            </p>
            <button
              disabled
              className="w-full bg-gray-800 text-gray-500 text-sm font-semibold rounded-lg px-4 py-2.5 cursor-not-allowed"
            >
              Coming soon
            </button>
          </div>

        </div>

        {/* Stats placeholder */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <p className="text-gray-500 text-sm">
            Connect a Meta account to see your campaign performance here
          </p>
        </div>

      </div>
    </div>
  )
}

export default Dashboard