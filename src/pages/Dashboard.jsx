import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

function HealthScore({ score }) {
  const color = score >= 70 ? 'text-green-400 bg-green-400/10' :
                score >= 50 ? 'text-yellow-400 bg-yellow-400/10' :
                'text-red-400 bg-red-400/10'
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${color}`}>
      {score}
    </span>
  )
}

function calcHealth(campaign) {
  let score = 100
  if (campaign.ctr < 1) score -= 30
  if (campaign.cpc > 5) score -= 20
  if (campaign.status !== 'ACTIVE') score -= 20
  return Math.max(score, 10)
}

function Dashboard() {
  const navigate = useNavigate()
  const businessName = localStorage.getItem('businessName')
  const token = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(false)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`https://adpilot-backend-production-24e1.up.railway.app/api/campaigns?userId=${userId}`)
      setCampaigns(res.data)
      fetchRecommendations(res.data)
    } catch (err) {
      console.error('Failed to fetch campaigns', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleConnectMeta = async () => {
    try {
      const res = await axios.get(`https://adpilot-backend-production-24e1.up.railway.app/api/meta/oauth-url?userId=${userId}`)
      window.location.href = res.data.url
    } catch (err) {
      alert('Failed to get Meta OAuth URL')
    }
  }

  const totalSpend = campaigns.reduce((sum, c) => sum + (c.spend || 0), 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0)
  const avgCtr = campaigns.length > 0
    ? (campaigns.reduce((sum, c) => sum + (c.ctr || 0), 0) / campaigns.length).toFixed(2)
    : 0

  const fetchRecommendations = async (campaignData) => {
    if (campaignData.length === 0) return
    setLoadingRecs(true)
    try {
      const payload = {
        industry: 'GYM',
        target_cpl: 50,
        business_id: userId,
        campaigns: campaignData.map(c => ({
          name: c.name,
          status: c.status,
          spend: c.spend || 0,
          clicks: c.clicks || 0,
          ctr: c.ctr || 0,
          cpc: c.cpc || 0,
          daily_budget: c.dailyBudget || 0,
          impressions: c.impressions || 0
        }))
      }
      const res = await axios.post('https://adpilot-ai-service-production.up.railway.app/generate-recommendations', payload)
      setRecommendations(res.data.recommendations)
    } catch (err) {
      console.error('Failed to fetch recommendations', err)
    } finally {
      setLoadingRecs(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">AdPilot</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{businessName}</span>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold">Campaigns</h2>
            <p className="text-gray-400 text-sm mt-1">Last synced just now</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/chat')}
              className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition"
            >
              💬 AI Chat
            </button>
            <button
              onClick={() => navigate('/copy-generator')}
              className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition"
            >
              ✨ AI Copy Generator
            </button>
            <button
              onClick={handleConnectMeta}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition"
            >
              + Connect Account
            </button>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Total spend</p>
            <p className="text-2xl font-semibold">${totalSpend.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Total clicks</p>
            <p className="text-2xl font-semibold">{totalClicks.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Avg CTR</p>
            <p className="text-2xl font-semibold">{avgCtr}%</p>
          </div>
        </div>

        {/* Campaigns table */}
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <p className="text-gray-500 mb-4">No campaigns found</p>
            <button
              onClick={handleConnectMeta}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition"
            >
              Connect Meta Account
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs text-gray-400 font-medium px-6 py-4">Health</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-6 py-4">Campaign</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">Spend</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">Clicks</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">CTR</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">CPC</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, i) => {
                  const health = calcHealth(campaign)
                  return (
                    <tr
                      key={campaign.id}
                      className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition ${i === campaigns.length - 1 ? 'border-0' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <HealthScore score={health} />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{campaign.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{campaign.objective}</p>
                      </td>
                      <td className="px-6 py-4 text-right text-sm">${(campaign.spend || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-sm">{(campaign.clicks || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-sm">{campaign.ctr || 0}%</td>
                      <td className="px-6 py-4 text-right text-sm">${campaign.cpc || 0}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          campaign.status === 'ACTIVE'
                            ? 'bg-green-400/10 text-green-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <h3 className="font-semibold">AI Recommendations</h3>
            {loadingRecs && <span className="text-xs text-gray-500">Analyzing...</span>}
          </div>

          {loadingRecs && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <p className="text-gray-500 text-sm">AI is analyzing your campaigns...</p>
            </div>
          )}

          {!loadingRecs && recommendations.length > 0 && (
            <div className="flex flex-col gap-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${
                    rec.type === 'warning' ? 'bg-red-500/10 text-red-400' :
                    rec.type === 'success' ? 'bg-green-500/10 text-green-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {rec.type === 'warning' ? '⚠' : rec.type === 'success' ? '↑' : 'i'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white mb-1">{rec.title}</p>
                    <p className="text-xs text-gray-400">{rec.reasoning}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-500">Confidence: {rec.confidence}%</span>
                    <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition">
                      Dismiss
                    </button>
                    <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      rec.type === 'warning' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' :
                      rec.type === 'success' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                      'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                    }`}>
                      {rec.type === 'warning' ? 'Fix now' : rec.type === 'success' ? 'Scale' : 'Review'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard