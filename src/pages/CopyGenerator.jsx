import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function CopyGenerator() {
  const navigate = useNavigate()
  const businessName = localStorage.getItem('businessName')
  const industry = 'GYM' // we'll make this dynamic later
  const userId = localStorage.getItem('userId')

  const [form, setForm] = useState({
    industry: industry,
    product: '',
    target_audience: '',
    objective: '',
    offer: '',
    business_name: businessName || ''
  })

  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleGenerate = async () => {
    if (!form.product || !form.target_audience || !form.objective) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true)
    setError('')
    setVariants([])
    try {
      const res = await axios.post('https://adpilot-ai-service-production.up.railway.app/generate-copy', {
        ...form,
        business_id: userId
      })      
      setVariants(res.data.variants)
    } catch (err) {
      setError('Failed to generate copy. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopied(index)
    setTimeout(() => setCopied(null), 2000)
  }

  const fullAdText = (v) => `${v.hook}\n\n${v.body}\n\n${v.cta}`

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
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

      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-semibold">AI Copy Generator</h2>
          <p className="text-gray-400 text-sm mt-1">
            Fill in your brief and get 3 professional ad variations in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Brief form */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-5">Your brief</h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  What are you selling? <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  placeholder="e.g. Summer gym membership"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Who is your target customer? <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="target_audience"
                  value={form.target_audience}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  placeholder="e.g. Men aged 20-35 in Cairo"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  What do you want them to do? <span className="text-red-400">*</span>
                </label>
                <select
                  name="objective"
                  value={form.objective}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                >
                  <option value="">Select objective</option>
                  <option value="Call to book an appointment">Call to book an appointment</option>
                  <option value="Fill a lead form">Fill a lead form</option>
                  <option value="Visit the website">Visit the website</option>
                  <option value="Buy the product online">Buy the product online</option>
                  <option value="Visit the store">Visit the store</option>
                  <option value="Send a WhatsApp message">Send a WhatsApp message</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Any special offer or promotion?
                </label>
                <input
                  type="text"
                  name="offer"
                  value={form.offer}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  placeholder="e.g. First week free, 20% discount"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition"
              >
                {loading ? 'Generating...' : '✨ Generate 3 ad variations'}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {loading && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                <div className="text-gray-400 text-sm">AI is writing your ads...</div>
                <div className="mt-3 flex justify-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'0ms'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'150ms'}}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay:'300ms'}}></div>
                </div>
              </div>
            )}

            {!loading && variants.length === 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                <p className="text-gray-500 text-sm">
                  Fill in the brief and click Generate to see your ad variations here
                </p>
              </div>
            )}

            {variants.map((v, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">
                    {v.angle}
                  </span>
                  <button
                    onClick={() => handleCopy(fullAdText(v), i)}
                    className="text-xs text-gray-400 hover:text-white transition"
                  >
                    {copied === i ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-white font-semibold text-sm mb-2">{v.hook}</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{v.body}</p>
                <p className="text-blue-400 text-sm font-medium">👉 {v.cta}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default CopyGenerator