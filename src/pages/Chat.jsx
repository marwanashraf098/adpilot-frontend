import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Chat() {
  const navigate = useNavigate()
  const businessName = localStorage.getItem('businessName')
  const userId = localStorage.getItem('userId')
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your AdPilot AI media buyer. I have access to your campaign data and I'm here to help. Ask me anything — "Why is my CPL high?", "Which campaign should I scale?", "Write me a new ad for my clinic".`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }
    fetchCampaigns()
    scrollToBottom()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`https://adpilot-backend-production-24e1.up.railway.app/api/campaigns?userId=${userId}`)
      setCampaigns(res.data.map(c => ({
        name: c.name,
        status: c.status,
        spend: c.spend || 0,
        clicks: c.clicks || 0,
        ctr: c.ctr || 0,
        cpc: c.cpc || 0,
        daily_budget: c.dailyBudget || 0,
        impressions: c.impressions || 0
      })))
    } catch (err) {
      console.error('Failed to fetch campaigns', err)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await axios.post('https://adpilot-ai-service-production.up.railway.app/chat', {
        message: userMessage,
        campaigns: campaigns,
        industry: 'business'
      })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble connecting. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = [
    "Why is my CPL high?",
    "Which campaign should I scale?",
    "What's my best performing campaign?",
    "Write me a new ad hook"
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>AdPilot</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{businessName}</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Dashboard
          </button>
        </div>
      </div>

      {/* Chat header */}
      <div className="px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">AI</div>
          <div>
            <h2 className="font-semibold text-sm">AdPilot AI Media Buyer</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-gray-400">Online — analyzing your {campaigns.length} campaigns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-1">AI</div>
            )}
            <div className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-gray-900 border border-gray-800 text-gray-100 rounded-tl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">AI</div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4 flex flex-wrap gap-2 flex-shrink-0">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setInput(s); }}
              className="text-xs bg-gray-900 border border-gray-700 hover:border-blue-500 text-gray-300 px-3 py-2 rounded-lg transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-800 flex-shrink-0">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything about your campaigns..."
            rows={1}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm resize-none"
            style={{minHeight: '44px', maxHeight: '120px'}}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-4 py-3 transition flex-shrink-0"
          >
            →
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>

    </div>
  )
}

export default Chat