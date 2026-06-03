import { useState, useRef } from 'react'
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
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const [creatives, setCreatives] = useState({
    images: [],        // [{file, preview}]
    videos: [],        // [{file, preview, name}]
    generatedImages: [], // [{url}]
    aiPrompt: '',
    generatingImage: false,
  })

  const [copyVariants, setCopyVariants] = useState({
    headlines: [],
    bodies: [],
    generating: false,
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

  const totalCreatives = creatives.images.length + creatives.videos.length + creatives.generatedImages.length
  const hasCreatives = totalCreatives > 0

  // Handle multiple image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const remaining = 5 - creatives.images.length
    const toAdd = files.slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).slice(2)
    }))
    setCreatives(prev => ({ ...prev, images: [...prev.images, ...toAdd] }))
  }

  const removeImage = (id) => {
    setCreatives(prev => ({ ...prev, images: prev.images.filter(img => img.id !== id) }))
  }

  // Handle video uploads
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const remaining = 2 - creatives.videos.length
    const toAdd = files.slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      id: Math.random().toString(36).slice(2)
    }))
    setCreatives(prev => ({ ...prev, videos: [...prev.videos, ...toAdd] }))
  }

  const removeVideo = (id) => {
    setCreatives(prev => ({ ...prev, videos: prev.videos.filter(v => v.id !== id) }))
  }

  const removeGeneratedImage = (idx) => {
    setCreatives(prev => ({
      ...prev,
      generatedImages: prev.generatedImages.filter((_, i) => i !== idx)
    }))
  }

  // Generate AI image
  const handleGenerateImage = async () => {
    if (!creatives.aiPrompt) {
      setError('Please enter a description for the AI image')
      return
    }
    if (creatives.images.length + creatives.generatedImages.length >= 5) {
      setError('Maximum 5 images allowed')
      return
    }
    setError('')
    setCreatives(prev => ({ ...prev, generatingImage: true }))
    try {
      const res = await axios.post(`${AI}/generate-image`, {
        prompt: creatives.aiPrompt,
        business_id: userId,
      })
      setCreatives(prev => ({
        ...prev,
        generatedImages: [...prev.generatedImages, { url: res.data.image_url, id: Math.random().toString(36).slice(2) }],
        generatingImage: false,
      }))
    } catch (err) {
      setError('Failed to generate image. Please try again.')
      setCreatives(prev => ({ ...prev, generatingImage: false }))
    }
  }

  // Generate copy variants
  const handleGenerateCopyVariants = async () => {
    setCopyVariants(prev => ({ ...prev, generating: true }))
    try {
      const res = await axios.post(`${AI}/generate-copy-variants`, {
        business_id: userId,
        industry: localStorage.getItem('industry') || 'business',
        goal: form.goal,
        target_audience: form.target_audience,
        offer: form.offer,
      })
      setCopyVariants({
        headlines: res.data.headlines || [],
        bodies: res.data.bodies || [],
        generating: false,
      })
    } catch (err) {
      setCopyVariants(prev => ({ ...prev, generating: false }))
    }
  }

  const handleNextToCreative = () => {
    if (!form.goal || !form.target_audience || !form.daily_budget) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    setStep(2)
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

      // Add multiple images
      creatives.images.forEach((img, i) => {
        formData.append(`images`, img.file)
      })

      // Add generated image URLs
      if (creatives.generatedImages.length > 0) {
        formData.append('imageUrls', JSON.stringify(creatives.generatedImages.map(img => img.url)))
      }

      // Add videos
      creatives.videos.forEach((vid) => {
        formData.append('videos', vid.file)
      })

      // Add copy variants if generated
      if (copyVariants.headlines.length > 0) {
        formData.append('headlines', JSON.stringify(copyVariants.headlines))
        formData.append('bodies', JSON.stringify(copyVariants.bodies))
      }

      await axios.post(
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

  const resetAll = () => {
    setStep(1)
    setStrategy(null)
    setCreatives({ images: [], videos: [], generatedImages: [], aiPrompt: '', generatingImage: false })
    setCopyVariants({ headlines: [], bodies: [], generating: false })
    setForm({ goal: '', target_audience: '', daily_budget: '', duration_days: 30, offer: '', city: 'Cairo' })
    setError('')
  }

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
          {['Campaign brief', 'Add creatives', 'Review strategy', 'Launched'].map((label, i) => (
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
                  <button key={opt} type="button" onClick={() => setForm({...form, goal: opt})} className={btn(opt, form.goal)}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Who do you want to target?</h3>
              <input type="text" value={form.target_audience} onChange={(e) => setForm({...form, target_audience: e.target.value})}
                placeholder="e.g. Women aged 25-40 in Cairo interested in fitness"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm" />
              <div>
                <p className="text-xs text-gray-500 mb-2">City</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Cairo', 'Alexandria', 'Giza', 'All Egypt', 'Custom'].map(opt => (
                    <button key={opt} type="button" onClick={() => setForm({...form, city: opt})} className={btn(opt, form.city)}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Daily budget (EGP)</h3>
              <div className="grid grid-cols-3 gap-3">
                {['50', '100', '150', '200', '500', '1000'].map(opt => (
                  <button key={opt} type="button" onClick={() => setForm({...form, daily_budget: opt})} className={btn(opt, form.daily_budget)}>EGP {opt}</button>
                ))}
              </div>
              <input type="number" value={form.daily_budget} onChange={(e) => setForm({...form, daily_budget: e.target.value})}
                placeholder="Or enter custom amount"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Campaign duration</h3>
              <div className="grid grid-cols-4 gap-3">
                {[7, 14, 30, 60].map(opt => (
                  <button key={opt} type="button" onClick={() => setForm({...form, duration_days: opt})} className={btn(opt, form.duration_days)}>{opt} days</button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Special offer (optional)</h3>
              <input type="text" value={form.offer} onChange={(e) => setForm({...form, offer: e.target.value})}
                placeholder="e.g. First week free, 20% discount, Free consultation"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm" />
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}
            <button onClick={handleNextToCreative} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
              Next — Add creatives →
            </button>
          </div>
        </section>
      )}

      {/* Step 2 — Creatives */}
      {step === 2 && (
        <section className="max-w-2xl mx-auto px-8 pb-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Add your ad creatives</h1>
            <p className="text-gray-400">Add up to 5 images and 2 videos. Meta will automatically test which performs best.</p>
          </div>

          <div className="space-y-6">

            {/* Images section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Images</h3>
                <span className="text-xs text-gray-500">{creatives.images.length + creatives.generatedImages.length}/5</span>
              </div>
              <p className="text-xs text-gray-500">Recommended: 1080×1080px or 1200×628px, JPG or PNG, max 30MB each</p>

              {/* Image previews */}
              {(creatives.images.length > 0 || creatives.generatedImages.length > 0) && (
                <div className="grid grid-cols-3 gap-3">
                  {creatives.images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={img.preview} alt="" className="w-full h-24 object-cover rounded-lg" />
                      <button onClick={() => removeImage(img.id)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                      <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1 rounded">Upload</span>
                    </div>
                  ))}
                  {creatives.generatedImages.map((img, idx) => (
                    <div key={img.id} className="relative group">
                      <img src={img.url} alt="" className="w-full h-24 object-cover rounded-lg" />
                      <button onClick={() => removeGeneratedImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
                      <span className="absolute bottom-1 left-1 text-xs bg-purple-600/80 text-white px-1 rounded">AI</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              {creatives.images.length + creatives.generatedImages.length < 5 && (
                <label className="block">
                  <div className="border-2 border-dashed border-white/10 hover:border-white/20 rounded-xl p-6 text-center cursor-pointer transition">
                    <p className="text-2xl mb-1">📷</p>
                    <p className="text-sm text-gray-400">Click to upload images</p>
                    <p className="text-xs text-gray-600 mt-1">JPG, PNG — select multiple at once</p>
                  </div>
                  <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* Videos section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">Videos</h3>
                <span className="text-xs text-gray-500">{creatives.videos.length}/2</span>
              </div>
              <p className="text-xs text-gray-500">MP4 or MOV, max 4GB, recommended 15-30 seconds</p>

              {creatives.videos.length > 0 && (
                <div className="space-y-2">
                  {creatives.videos.map((vid) => (
                    <div key={vid.id} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                      <span className="text-xl">🎬</span>
                      <span className="text-sm text-gray-300 flex-1 truncate">{vid.name}</span>
                      <button onClick={() => removeVideo(vid.id)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                    </div>
                  ))}
                </div>
              )}

              {creatives.videos.length < 2 && (
                <label className="block">
                  <div className="border-2 border-dashed border-white/10 hover:border-white/20 rounded-xl p-6 text-center cursor-pointer transition">
                    <p className="text-2xl mb-1">🎬</p>
                    <p className="text-sm text-gray-400">Click to upload video</p>
                    <p className="text-xs text-gray-600 mt-1">MP4, MOV up to 4GB</p>
                  </div>
                  <input ref={videoInputRef} type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
                </label>
              )}
            </div>

            {/* DALL-E 3 section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">✨ Generate images with AI (DALL-E 3)</h3>
              <input type="text" value={creatives.aiPrompt}
                onChange={(e) => setCreatives(prev => ({ ...prev, aiPrompt: e.target.value }))}
                placeholder="e.g. Professional gym with modern equipment, energetic atmosphere, warm lighting"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm" />
              <button onClick={handleGenerateImage}
                disabled={creatives.generatingImage || !creatives.aiPrompt || creatives.images.length + creatives.generatedImages.length >= 5}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                {creatives.generatingImage ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Generating image...</>
                ) : '✨ Generate AI image'}
              </button>
            </div>

            {/* Copy variants section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">🧪 Generate copy variants</h3>
                <span className="text-xs text-gray-500">Meta will test all combinations</span>
              </div>
              <p className="text-xs text-gray-400">Generate 3 headline variants and 3 body variants. Meta Dynamic Creative will automatically test which combination performs best.</p>

              {copyVariants.headlines.length > 0 && (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Headlines</p>
                    <div className="space-y-2">
                      {copyVariants.headlines.map((h, i) => (
                        <div key={i} className="bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 flex items-center gap-2">
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">H{i+1}</span>
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Bodies</p>
                    <div className="space-y-2">
                      {copyVariants.bodies.map((b, i) => (
                        <div key={i} className="bg-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 flex items-center gap-2">
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">B{i+1}</span>
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleGenerateCopyVariants} disabled={copyVariants.generating}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                {copyVariants.generating ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Generating variants...</>
                ) : copyVariants.headlines.length > 0 ? '🔄 Regenerate variants' : '🧪 Generate copy variants'}
              </button>
            </div>

            {/* Dynamic creative info */}
            {totalCreatives > 1 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-400 text-sm font-medium mb-1">🚀 Dynamic Creative enabled</p>
                <p className="text-xs text-gray-400">You have {totalCreatives} creatives. Meta will automatically test all combinations and allocate more budget to the best performing one.</p>
              </div>
            )}

            {/* Skip info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-gray-500">💡 Creatives are optional. You can add them later in Meta Ads Manager.</p>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 bg-white/5 hover:bg-white/10 text-gray-400 font-medium py-3 rounded-lg transition text-sm">
                ← Back
              </button>
              <button onClick={handleGenerateStrategy} disabled={generating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
                {generating ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>AI is building your strategy...</>
                ) : hasCreatives ? `🚀 Generate strategy (${totalCreatives} creative${totalCreatives > 1 ? 's' : ''}) →` : 'Skip creatives — Generate strategy →'}
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
            {totalCreatives > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Creatives ({totalCreatives})</p>
                  {totalCreatives > 1 && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Dynamic Creative</span>}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {creatives.images.map((img) => (
                    <img key={img.id} src={img.preview} alt="" className="w-full h-16 object-cover rounded-lg" />
                  ))}
                  {creatives.generatedImages.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img.url} alt="" className="w-full h-16 object-cover rounded-lg" />
                      <span className="absolute bottom-0.5 left-0.5 text-xs bg-purple-600/80 text-white px-1 rounded">AI</span>
                    </div>
                  ))}
                  {creatives.videos.map((vid) => (
                    <div key={vid.id} className="w-full h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🎬</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Copy variants preview */}
            {copyVariants.headlines.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Copy variants ({copyVariants.headlines.length} headlines, {copyVariants.bodies.length} bodies)</p>
                <div className="space-y-1">
                  {copyVariants.headlines.map((h, i) => (
                    <p key={i} className="text-xs text-gray-400"><span className="text-blue-400">H{i+1}:</span> {h}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold">Campaign details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500 mb-1">Campaign name</p><p className="text-sm text-white font-medium">{strategy.campaign_name}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Objective</p><p className="text-sm text-white font-medium">{strategy.objective}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Daily budget</p><p className="text-sm text-white font-medium">EGP {strategy.daily_budget}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Optimization goal</p><p className="text-sm text-white font-medium">{strategy.optimization_goal}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Estimated CPL</p><p className="text-sm text-green-400 font-medium">{strategy.estimated_cpl}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Estimated reach</p><p className="text-sm text-white font-medium">{strategy.estimated_reach}</p></div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <h3 className="font-semibold">Targeting</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500 mb-1">Age range</p><p className="text-sm text-white">{strategy.targeting?.age_min} - {strategy.targeting?.age_max}</p></div>
                <div><p className="text-xs text-gray-500 mb-1">Location</p><p className="text-sm text-white">{strategy.targeting?.geo_locations?.cities?.map(c => c.name).join(', ') || 'Egypt'}</p></div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <h3 className="font-semibold">Ad copy</h3>
              <div><p className="text-xs text-gray-500 mb-1">Headline</p><p className="text-sm text-white font-medium">{strategy.ad_copy?.headline}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">Body</p><p className="text-sm text-gray-300">{strategy.ad_copy?.body}</p></div>
              <div><p className="text-xs text-gray-500 mb-1">CTA</p>
                <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">{strategy.ad_copy?.cta}</span>
              </div>
            </div>

            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-yellow-400 text-sm">⚠ Campaign will be created in <strong>PAUSED</strong> status. Review and activate in Meta Ads Manager.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-6 bg-white/5 hover:bg-white/10 text-gray-400 font-medium py-3 rounded-lg transition text-sm">← Edit creatives</button>
              <button onClick={handleCreate} disabled={creating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
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
            {totalCreatives > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">{totalCreatives} creative{totalCreatives > 1 ? 's' : ''} attached {totalCreatives > 1 ? '— Dynamic Creative enabled' : ''}</p>
                <div className="flex gap-2">
                  {creatives.images.slice(0, 3).map((img) => (
                    <img key={img.id} src={img.preview} alt="" className="w-16 h-16 object-cover rounded-lg" />
                  ))}
                  {creatives.generatedImages.slice(0, 2).map((img, i) => (
                    <img key={i} src={img.url} alt="" className="w-16 h-16 object-cover rounded-lg" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={resetAll} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 font-medium py-3 rounded-lg transition">
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