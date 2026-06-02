import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BACKEND = 'http://localhost:8080'
const AI = 'http://localhost:8001'

function CreateCampaign() {
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [creating, setCreating] = useState(false)
  const [strategy, setStrategy] = useState(null)
  const [error, setError] = useState('')
  const [creative, setCreative] = useState({
    imageFile: null,
    imagePreview: null,
    useAI: false,
    aiPrompt: '',
    generatingImage: false,
    generatedImageUrl: null,
  })

  const [form, setForm] = useState({
    goal: '',
    target_audience: '',
    daily_budget: '',
    duration_days: 30,
    offer: '',
    city: 'Cairo',
  })

  const btn = (val, current) =>
    `py-3 px-4 rounded-lg text-sm font-medium border transition text-left ${
      val === current
        ? 'bg-blue-600 border-blue-600 text-white'
        : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500'
    }`

  const handleNextToCreative = () => {
    if (!form.goal || !form.target_audience || !form.daily_budget) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    setStep(2)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCreative(prev => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
      generatedImageUrl: null,
      useAI: false,
    }))
  }

  const handleGenerateImage = async () => {
    if (!creative.aiPrompt) {
      setError('Please enter a description for the AI image')
      return
    }
    setError('')
    setCreative(prev => ({ ...prev, generatingImage: true }))
    try {
      const res = await axios.post(`${AI}/generate-image`, {
        prompt: creative.aiPrompt,
        business_id: userId,
      })
      setCreative(prev => ({
        ...prev,
        generatedImageUrl: res.data.image_url,
        imageFile: null,
        imagePreview: null,
        generatingImage: false,
      }))
    } catch (err) {
      setError('Failed to generate image. Please try again or upload your own.')
      setCreative(prev => ({ ...prev, generatingImage: false }))
    }
  }

  const handleGenerateStrategy = async () => {
    setGenerating(true)
    setError('')
    try {
      const res = await axios.post(`${AI}/generate-campaign-strategy`, {
        business_id: userId,
        industry: localStorage.getItem('industry') || 'business',
        goal: form.goal,
        target_audience: form.target_audience,
        daily_budget: parseFloat(form.daily_budget),
        duration_days: form.duration_days,
        offer: form.offer,
        city: form.city,
      })
      setStrategy(res.data)
      setStep(3)
    } catch (err) {
      setError('Failed to generate strategy. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('name', strategy.campaign_name)
      formData.append('objective', strategy.objective)
      formData.append('adSetName', strategy.ad_set_name)
      formData.append('optimizationGoal', strategy.optimization_goal)
      formData.append('dailyBudget', strategy.daily_budget)
      formData.append('targeting', JSON.stringify(strategy.targeting))
      formData.append('headline', strategy.ad_copy?.headline || '')
      formData.append('body', strategy.ad_copy?.body || '')
      formData.append('cta', strategy.ad_copy?.cta || 'LEARN_MORE')
      formData.append('linkUrl', 'https://adpilot-frontend-chi.vercel.app')

      if (creative.imageFile) {
        formData.append('image', creative.imageFile)
      } else if (creative.generatedImageUrl) {
        formData.append('imageUrl', creative.generatedImageUrl)
      }

      const res = await axios.post(
        `${BACKEND}/api/campaigns/create?userId=${userId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setStep(4)
    } catch (err) {
      setError('Failed to create campaign. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const hasCreative = creative.imageFile || creative.generatedImageUrl

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>
          Ad<span className="text-blue-500">Pilot</span>
        </div>
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-400 hover:text-white transition">
          ← Back to dashboard
        </button>
      </nav>

      {/* Step indicator */}
      <div className="max-w-2xl mx-auto px-8 pt-8">
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {['Campaign brief', 'Add creative', 'Review strategy', 'Launched'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step === i + 1 ? 'bg-blue-600 text-white' :
                step > i + 1 ? 'bg-green-500 text-white' :
                'bg-white/10 text-gray-500'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${step === i + 1 ? 'text-white' : 'text-gray-500'}`}>{label}</span>
              {i < 3 && <div className="w-6 h-px bg-white/10 mx-1"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 — Brief */}
      {step === 1 && (
        <section className="max-w-2xl mx-auto px-8 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create a new campaign</h1>
            <p className="text-gray-400">Answer 5 questions and AdPilot will build the perfect campaign strategy.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">What is your main goal?</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Get more leads', 'Increase sales', 'Build brand awareness', 'Get more website traffic', 'Get more app installs', 'Get more store visits'].map(opt => (
                  <button key={opt} type="button" onClick={() => setForm({...form, goal: opt})} className={btn(opt, form.goal)}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Who do you want to target?</h3>
              <input
                type="text"
                value={form.target_audience}
                onChange={(e) => setForm({...form, target_audience: e.target.value})}
                placeholder="e.g. Women aged 25-40 in Cairo interested in fitness"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
              />
              <div>
                <p className="text-xs text-gray-500 mb-2">City</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Cairo', 'Alexandria', 'Giza', 'All Egypt', 'Custom'].map(opt => (
                    <button key={opt} type="button" onClick={() => setForm({...form, city: opt})} className={btn(opt, form.city)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Daily budget (EGP)</h3>
              <div className="grid grid-cols-3 gap-3">
                {['50', '100', '150', '200', '500', '1000'].map(opt => (
                  <button key={opt} type="button" onClick={() => setForm({...form, daily_budget: opt})} className={btn(opt, form.daily_budget)}>
                    EGP {opt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={form.daily_budget}
                onChange={(e) => setForm({...form, daily_budget: e.target.value})}
                placeholder="Or enter custom amount"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Campaign duration</h3>
              <div className="grid grid-cols-4 gap-3">
                {[7, 14, 30, 60].map(opt => (
                  <button key={opt} type="button" onClick={() => setForm({...form, duration_days: opt})} className={btn(opt, form.duration_days)}>
                    {opt} days
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Special offer (optional)</h3>
              <input
                type="text"
                value={form.offer}
                onChange={(e) => setForm({...form, offer: e.target.value})}
                placeholder="e.g. First week free, 20% discount, Free consultation"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}

            <button onClick={handleNextToCreative} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
              Next — Add creative →
            </button>
          </div>
        </section>
      )}

      {/* Step 2 — Creative */}
      {step === 2 && (
        <section className="max-w-2xl mx-auto px-8 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Add your ad creative</h1>
            <p className="text-gray-400">Upload an image or generate one with AI. This will be used as your ad visual.</p>
          </div>

          <div className="space-y-6">

            {/* Upload option */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Option 1 — Upload your image</h3>
              <p className="text-xs text-gray-500">Recommended: 1080×1080px or 1200×628px, JPG or PNG, max 30MB</p>

              <label className="block">
                <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  creative.imagePreview ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-white/20'
                }`}>
                  {creative.imagePreview ? (
                    <div>
                      <img src={creative.imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-3 object-cover" />
                      <p className="text-sm text-green-400">✓ Image uploaded</p>
                      <p className="text-xs text-gray-500 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl mb-2">📷</p>
                      <p className="text-sm text-gray-400">Click to upload image</p>
                      <p className="text-xs text-gray-600 mt-1">JPG, PNG up to 30MB</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* AI generate option */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Option 2 — Generate with AI (DALL-E 3)</h3>
              <input
                type="text"
                value={creative.aiPrompt}
                onChange={(e) => setCreative(prev => ({ ...prev, aiPrompt: e.target.value }))}
                placeholder="e.g. Professional gym with modern equipment, energetic atmosphere, warm lighting"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
              />

              {creative.generatedImageUrl && (
                <div>
                  <img src={creative.generatedImageUrl} alt="Generated" className="w-full rounded-xl mb-2 max-h-64 object-cover" />
                  <p className="text-sm text-green-400">✓ AI image generated</p>
                </div>
              )}

              <button
                onClick={handleGenerateImage}
                disabled={creative.generatingImage || !creative.aiPrompt}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {creative.generatingImage ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Generating image...</>
                ) : '✨ Generate AI image'}
              </button>
            </div>

            {/* Skip option */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-gray-500">💡 You can skip this step and add a creative later in Meta Ads Manager. The campaign and ad set will still be created.</p>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 bg-white/5 hover:bg-white/10 text-gray-400 font-medium py-3 rounded-lg transition text-sm">
                ← Back
              </button>
              <button
                onClick={handleGenerateStrategy}
                disabled={generating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {generating ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>AI is building your strategy...</>
                ) : hasCreative ? '🚀 Generate strategy →' : 'Skip creative — Generate strategy →'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Step 3 — Review strategy */}
      {step === 3 && strategy && (
        <section className="max-w-2xl mx-auto px-8 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Review your campaign</h1>
            <p className="text-gray-400">AdPilot has built this strategy using your business knowledge and Egypt media buying best practices.</p>
          </div>

          <div className="space-y-5">

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
              <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-2">AI Strategy Reasoning</p>
              <p className="text-sm text-gray-300">{strategy.strategy_reasoning}</p>
            </div>

            {/* Creative preview */}
            {(creative.imagePreview || creative.generatedImageUrl) && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Ad Creative</p>
                <img
                  src={creative.imagePreview || creative.generatedImageUrl}
                  alt="Ad creative"
                  className="w-full rounded-xl max-h-48 object-cover"
                />
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold">Campaign details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Campaign name</p>
                  <p className="text-sm text-white font-medium">{strategy.campaign_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Objective</p>
                  <p className="text-sm text-white font-medium">{strategy.objective}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Daily budget</p>
                  <p className="text-sm text-white font-medium">EGP {strategy.daily_budget}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Optimization goal</p>
                  <p className="text-sm text-white font-medium">{strategy.optimization_goal}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Estimated CPL</p>
                  <p className="text-sm text-green-400 font-medium">{strategy.estimated_cpl}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Estimated reach</p>
                  <p className="text-sm text-white font-medium">{strategy.estimated_reach}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <h3 className="font-semibold">Targeting</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Age range</p>
                  <p className="text-sm text-white">{strategy.targeting?.age_min} - {strategy.targeting?.age_max}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm text-white">
                    {strategy.targeting?.geo_locations?.cities?.map(c => c.name).join(', ') || 'Egypt'}
                  </p>
                </div>
              </div>
              {strategy.targeting?.flexible_spec?.[0]?.interests && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {strategy.targeting.flexible_spec[0].interests.map((interest, i) => (
                      <span key={i} className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                        {interest.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <h3 className="font-semibold">Ad copy</h3>
              <div>
                <p className="text-xs text-gray-500 mb-1">Headline</p>
                <p className="text-sm text-white font-medium">{strategy.ad_copy?.headline}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Body</p>
                <p className="text-sm text-gray-300">{strategy.ad_copy?.body}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Call to action</p>
                <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
                  {strategy.ad_copy?.cta}
                </span>
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-yellow-400 text-sm">⚠ Campaign will be created in <strong>PAUSED</strong> status. Review and activate in Meta Ads Manager.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 bg-white/5 hover:bg-white/10 text-gray-400 font-medium py-3 rounded-lg transition text-sm">
                ← Edit creative
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {creating ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Creating campaign in Meta...</>
                ) : '✓ Create campaign in Meta →'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Step 4 — Success */}
      {step === 4 && (
        <section className="max-w-2xl mx-auto px-8 pb-16 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
            <h1 className="text-3xl font-bold mb-2">Campaign created!</h1>
            <p className="text-gray-400">Your campaign has been created in Meta Ads Manager with PAUSED status.</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-6 space-y-3">
            <p className="text-sm font-semibold text-white">{strategy?.campaign_name}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Objective:</span> <span className="text-gray-300">{strategy?.objective}</span></div>
              <div><span className="text-gray-500">Budget:</span> <span className="text-gray-300">EGP {strategy?.daily_budget}/day</span></div>
              <div><span className="text-gray-500">Est. CPL:</span> <span className="text-green-400">{strategy?.estimated_cpl}</span></div>
              <div><span className="text-gray-500">Status:</span> <span className="text-yellow-400">PAUSED</span></div>
            </div>
            {(creative.imagePreview || creative.generatedImageUrl) && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Creative attached</p>
                <img src={creative.imagePreview || creative.generatedImageUrl} alt="Creative" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setStep(1)
                setStrategy(null)
                setCreative({ imageFile: null, imagePreview: null, useAI: false, aiPrompt: '', generatingImage: false, generatedImageUrl: null })
                setForm({ goal: '', target_audience: '', daily_budget: '', duration_days: 30, offer: '', city: 'Cairo' })
              }}
              className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 font-medium py-3 rounded-lg transition"
            >
              Create another campaign
            </button>
            <button onClick={() => navigate('/dashboard')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
              Go to dashboard →
            </button>
          </div>
        </section>
      )}

    </div>
  )
}

export default CreateCampaign