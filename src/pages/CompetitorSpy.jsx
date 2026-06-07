import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AI = 'https://adpilot-ai-service-production.up.railway.app'

function CompetitorSpy() {
  const navigate = useNavigate()
  const businessName = localStorage.getItem('businessName')
  const userId = localStorage.getItem('userId')
  const industry = localStorage.getItem('industry') || 'business'

  const [competitorName, setCompetitorName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSpy = async () => {
    if (!competitorName.trim()) {
      setError('Please enter a competitor name')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await axios.post(`${AI}/competitor-spy`, {
        competitor_name: competitorName,
        industry: industry,
        business_id: userId,
        country: 'EG'
      })
      setResult(res.data)
    } catch (err) {
      setError('Failed to analyze competitor. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>AdPilot</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{businessName}</span>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-white transition">
            ← Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">🕵️ Competitor Spy</h2>
          <p className="text-gray-400 text-sm mt-1">See what your competitors are running on Facebook and get AI-powered insights to outcompete them.</p>
        </div>

        {/* Search */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <label className="block text-sm text-gray-400 mb-2">Competitor name or Facebook page name</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={competitorName}
              onChange={(e) => setCompetitorName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSpy()}
              placeholder="e.g. Gold's Gym Cairo, FitLife Egypt"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
            />
            <button
              onClick={handleSpy}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition flex items-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Analyzing...</>
              ) : '🔍 Spy'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <p className="text-xs text-gray-600 mt-2">Searches Meta Ad Library for active ads in Egypt</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Scanning Meta Ad Library for {competitorName}...</p>
            <p className="text-gray-600 text-sm mt-1">Analyzing their ads with AI</p>
          </div>
        )}

        {/* Results */}
        {!loading && result && (
          <div className="space-y-6">

            {/* Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{result.competitor}</h3>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                  {result.total_ads || 0} active ads found
                </span>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-300">{result.analysis.strategy_summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Main message</p>
                  <p className="text-sm text-white">{result.analysis.main_message}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Target audience</p>
                  <p className="text-sm text-white">{result.analysis.target_audience}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Ad frequency</p>
                  <p className="text-sm text-white">{result.analysis.ad_frequency}</p>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">AI Insights</h3>
              <div className="flex flex-col gap-3">
                {result.analysis.insights?.map((insight, i) => (
                  <div key={i} className={`rounded-xl p-4 border ${
                    insight.type === 'opportunity' ? 'bg-green-500/5 border-green-500/20' :
                    insight.type === 'threat' ? 'bg-red-500/5 border-red-500/20' :
                    'bg-blue-500/5 border-blue-500/20'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        insight.type === 'opportunity' ? 'bg-green-500/10 text-green-400' :
                        insight.type === 'threat' ? 'bg-red-500/10 text-red-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {insight.type === 'opportunity' ? '💡 Opportunity' :
                         insight.type === 'threat' ? '⚠ Threat' : 'ℹ Observation'}
                      </span>
                      <p className="text-sm font-semibold text-white">{insight.title}</p>
                    </div>
                    <p className="text-xs text-gray-400">{insight.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended response */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
              <h3 className="font-semibold mb-2 text-green-400">🎯 Your recommended response</h3>
              <p className="text-sm text-gray-300">{result.analysis.recommended_response}</p>
              <button
                onClick={() => navigate('/create-campaign')}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                Create a competing campaign →
              </button>
            </div>

            {/* Active ads */}
            {result.ads && result.ads.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Active ads ({result.ads.length})</h3>
                <div className="grid grid-cols-2 gap-4">
                  {result.ads.map((ad, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">{ad.page_name}</span>
                        <span className="text-xs text-gray-600">{ad.ad_creation_time?.split('T')[0]}</span>
                      </div>
                      {ad.ad_creative_link_title && (
                        <p className="text-sm font-medium text-white mb-1">{ad.ad_creative_link_title}</p>
                      )}
                      {ad.ad_creative_body && (
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{ad.ad_creative_body}</p>
                      )}
                      {ad.ad_snapshot_url && (
                        <a href={ad.ad_snapshot_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 transition">
                          View ad →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}

export default CompetitorSpy