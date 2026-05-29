import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const BACKEND = 'https://adpilot-backend-production-24e1.up.railway.app'
const AI = 'https://adpilot-ai-service-production.up.railway.app'

function Onboarding() {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = localStorage.getItem('userId')
  const [step, setStep] = useState(1)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [healthScore, setHealthScore] = useState(0)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    websiteUrl: '',
    facebookPageUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    businessName: '',
    industry: 'gym',
    city: '',
    description: '',
    services: '',
    uniqueSellingPoint: '',
    priceRange: 'mid-range',
    brandTone: 'friendly',
    targetAudience: '',
    minAge: 25,
    maxAge: 45,
    gender: 'all',
    customerSource: '',
    averageCustomerValue: '',
    buyingCycle: '',
    mainGoal: '',
    monthlyBudget: '',
    targetCpl: '',
    phoneNumber: '',
    biggestChallenge: '',
    competitors: '',
    competitorAdvantage: '',
    ourAdvantage: '',
  })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const stepParam = params.get('step')
    const connected = params.get('connected')
    if (stepParam && connected === 'true') {
      setStep(parseInt(stepParam))
      setHealthScore(90)
    }
  }, [])

  const updateScore = (newStep) => {
    const scores = { 1: 0, 2: 20, 3: 40, 4: 60, 5: 75, 6: 90, 7: 100 }
    setHealthScore(scores[newStep] || 0)
  }

  const handleScan = async () => {
    if (!form.websiteUrl && !form.facebookPageUrl && !form.instagramUrl) {
      setScanError('Please enter at least your website or Facebook page URL')
      return
    }
    setScanning(true)
    setScanError('')
    try {
      const res = await axios.post(`${AI}/scan-business`, {
        website_url: form.websiteUrl,
        facebook_url: form.facebookPageUrl,
        instagram_url: form.instagramUrl,
      })

      const data = res.data
      if (data.scan_failed) {
        setScanError(data.scan_message)
      }

      setForm(prev => ({
        ...prev,
        businessName: data.business_name || prev.businessName,
        industry: data.industry || prev.industry,
        city: data.city || prev.city,
        description: data.description || prev.description,
        services: Array.isArray(data.services) ? data.services.join(', ') : prev.services,
        uniqueSellingPoint: data.unique_selling_point || prev.uniqueSellingPoint,
        priceRange: data.price_range || prev.priceRange,
        brandTone: data.brand_tone || prev.brandTone,
        targetAudience: data.target_audience || prev.targetAudience,
        minAge: data.min_age || prev.minAge,
        maxAge: data.max_age || prev.maxAge,
        gender: data.gender || prev.gender,
        facebookPageUrl: data.facebook_url || prev.facebookPageUrl,
        instagramUrl: data.instagram_url || prev.instagramUrl,
        tiktokUrl: data.tiktok_url || prev.tiktokUrl,
        phoneNumber: data.phone_number || prev.phoneNumber,
      }))

      setStep(2)
      updateScore(2)
    } catch (err) {
      setScanError('Scan failed. Please fill in your details manually.')
      setStep(2)
      updateScore(2)
    } finally {
      setScanning(false)
    }
  }

  const saveStep = async (stepData) => {
    setSaving(true)
    try {
      await axios.post(`${BACKEND}/api/business/${userId}`, stepData)
    } catch (err) {
      console.error('Save failed', err)
    } finally {
      setSaving(false)
    }
  }

  const goToStep = async (nextStep, dataToSave) => {
    if (dataToSave && Object.keys(dataToSave).length > 0) await saveStep(dataToSave)
    setStep(nextStep)
    updateScore(nextStep)
    window.scrollTo(0, 0)
  }

  const handleComplete = async () => {
    await saveStep({
      healthScore: healthScore,
      onboardingComplete: true
    })
    navigate('/dashboard')
  }

  const progressWidth = `${(step / 7) * 100}%`

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="text-xl font-bold">Ad<span className="text-blue-500">Pilot</span></div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Health score</p>
            <p className={`text-lg font-bold ${healthScore >= 75 ? 'text-green-400' : healthScore >= 50 ? 'text-yellow-400' : 'text-blue-400'}`}>
              {healthScore}/100
            </p>
          </div>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="w-full bg-white/5 h-1">
        <div className="h-1 bg-blue-500 transition-all duration-500" style={{ width: progressWidth }}></div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Step 1 — Scan */}
        {step === 1 && (
          <div>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl mb-4">🔍</div>
              <h1 className="text-3xl font-bold mb-2">Let's set up your AdPilot</h1>
              <p className="text-gray-400">Enter your website URL and we'll scan your business automatically. Takes 30 seconds.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Website URL</label>
                <input
                  type="text"
                  value={form.websiteUrl}
                  onChange={(e) => setForm({...form, websiteUrl: e.target.value})}
                  placeholder="https://yourbusiness.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">f</div>
                <input
                  type="text"
                  value={form.facebookPageUrl}
                  onChange={(e) => setForm({...form, facebookPageUrl: e.target.value})}
                  placeholder="Facebook page URL (optional)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">IG</div>
                <input
                  type="text"
                  value={form.instagramUrl}
                  onChange={(e) => setForm({...form, instagramUrl: e.target.value})}
                  placeholder="Instagram URL (optional)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              {scanError && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3 text-yellow-400 text-sm">
                  ⚠ {scanError}
                </div>
              )}

              <button
                onClick={handleScan}
                disabled={scanning}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {scanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Scanning your business...
                  </>
                ) : (
                  '🔍 Scan my business →'
                )}
              </button>

              <button
                onClick={() => { setStep(2); updateScore(2) }}
                className="w-full text-gray-500 text-sm hover:text-gray-300 transition py-2"
              >
                Skip and fill manually →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Business details */}
        {step === 2 && (
          <div>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl mb-4">🏢</div>
              <h2 className="text-3xl font-bold mb-2">Your business details</h2>
              <p className="text-gray-400">We've pre-filled what we could. Review and correct anything that's wrong.</p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Business name *</label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm({...form, businessName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({...form, city: e.target.value})}
                    placeholder="e.g. Cairo"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Industry</label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm({...form, industry: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                >
                  <option value="gym">Gym / Fitness</option>
                  <option value="clinic">Clinic / Healthcare</option>
                  <option value="restaurant">Restaurant / Food</option>
                  <option value="salon">Beauty Salon</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="automotive">Automotive</option>
                  <option value="business">Other Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Business description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  rows={3}
                  placeholder="What does your business do?"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Main services / products</label>
                <input
                  type="text"
                  value={form.services}
                  onChange={(e) => setForm({...form, services: e.target.value})}
                  placeholder="e.g. Personal training, Group classes, Nutrition coaching"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">What makes you different?</label>
                <input
                  type="text"
                  value={form.uniqueSellingPoint}
                  onChange={(e) => setForm({...form, uniqueSellingPoint: e.target.value})}
                  placeholder="Your unique selling point"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price range</label>
                  <select
                    value={form.priceRange}
                    onChange={(e) => setForm({...form, priceRange: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                  >
                    <option value="budget">Budget</option>
                    <option value="mid-range">Mid-range</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Brand tone</label>
                  <select
                    value={form.brandTone}
                    onChange={(e) => setForm({...form, brandTone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="urgent">Urgent</option>
                    <option value="luxury">Luxury</option>
                    <option value="energetic">Energetic</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => goToStep(3, {
                  websiteUrl: form.websiteUrl,
                  facebookPageUrl: form.facebookPageUrl,
                  instagramUrl: form.instagramUrl,
                  businessName: form.businessName,
                  industry: form.industry,
                  city: form.city,
                  description: form.description,
                  services: form.services,
                  uniqueSellingPoint: form.uniqueSellingPoint,
                  priceRange: form.priceRange,
                  brandTone: form.brandTone,
                })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Customers */}
        {step === 3 && (
          <div>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl mb-4">👥</div>
              <h2 className="text-3xl font-bold mb-2">Your customers</h2>
              <p className="text-gray-400">Tell us about the people who buy from you.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Who are your customers?</label>
                <input
                  type="text"
                  value={form.targetAudience}
                  onChange={(e) => setForm({...form, targetAudience: e.target.value})}
                  placeholder="e.g. Women aged 25-40 in Cairo interested in fitness"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">Age range</label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={form.minAge}
                    onChange={(e) => setForm({...form, minAge: parseInt(e.target.value)})}
                    className="w-24 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={form.maxAge}
                    onChange={(e) => setForm({...form, maxAge: parseInt(e.target.value)})}
                    className="w-24 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                  <span className="text-gray-500">years old</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {['all', 'female', 'male'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({...form, gender: opt})}
                      className={`py-3 rounded-lg text-sm font-medium border transition capitalize ${
                        form.gender === opt
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500'
                      }`}
                    >
                      {opt === 'all' ? 'All genders' : opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">Where do customers come from?</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Walk-in', 'Social media', 'Referral', 'Online search', 'Ads', 'Other'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({...form, customerSource: opt})}
                      className={`py-3 rounded-lg text-sm font-medium border transition ${
                        form.customerSource === opt
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">How long does it take a customer to decide to buy?</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Instantly', 'Same day', 'Few days', 'Few weeks', 'Few months'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({...form, buyingCycle: opt})}
                      className={`py-3 rounded-lg text-sm font-medium border transition ${
                        form.buyingCycle === opt
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Average customer value (EGP)</label>
                <input
                  type="number"
                  value={form.averageCustomerValue}
                  onChange={(e) => setForm({...form, averageCustomerValue: e.target.value})}
                  placeholder="e.g. 500"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              <button
                onClick={() => goToStep(4, {
                  targetAudience: form.targetAudience,
                  minAge: form.minAge,
                  maxAge: form.maxAge,
                  gender: form.gender,
                  customerSource: form.customerSource,
                  buyingCycle: form.buyingCycle,
                  averageCustomerValue: form.averageCustomerValue ? parseFloat(form.averageCustomerValue) : null,
                })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Goals */}
        {step === 4 && (
          <div>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold mb-2">Your goals</h2>
              <p className="text-gray-400">What do you want AdPilot to help you achieve?</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-3">Main advertising goal</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Get more leads', 'Increase sales', 'Build brand awareness', 'Get more website traffic', 'Get more app installs', 'Get more store visits'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({...form, mainGoal: opt})}
                      className={`py-3 rounded-lg text-sm font-medium border transition ${
                        form.mainGoal === opt
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">Monthly ad budget (EGP)</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Under 1,000', '1,000–3,000', '3,000–10,000', '10,000–30,000', 'Over 30,000'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({...form, monthlyBudget: opt})}
                      className={`py-3 rounded-lg text-sm font-medium border transition ${
                        form.monthlyBudget === opt
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500'
                      }`}
                    >
                      EGP {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Target cost per lead (EGP)</label>
                <input
                  type="number"
                  value={form.targetCpl}
                  onChange={(e) => setForm({...form, targetCpl: e.target.value})}
                  placeholder="e.g. 50"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">WhatsApp number for alerts</label>
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({...form, phoneNumber: e.target.value})}
                  placeholder="+201234567890"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">You'll get WhatsApp alerts when campaigns underperform</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">What's your biggest challenge with advertising?</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    'My ads are too expensive (high CPL)',
                    'My ads get clicks but no leads',
                    "I don't know what's working",
                    "I've never run ads before",
                    "My agency isn't delivering results",
                    "I'm running ads myself but it's too complex"
                  ].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({...form, biggestChallenge: opt})}
                      className={`py-3 px-4 rounded-lg text-sm font-medium border transition text-left ${
                        form.biggestChallenge === opt
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => goToStep(5, {
                  mainGoal: form.mainGoal,
                  monthlyBudget: form.monthlyBudget,
                  targetCpl: form.targetCpl ? parseFloat(form.targetCpl) : null,
                  phoneNumber: form.phoneNumber,
                  biggestChallenge: form.biggestChallenge,
                })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 5 — Competition */}
        {step === 5 && (
          <div>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl mb-4">🔎</div>
              <h2 className="text-3xl font-bold mb-2">Your competition</h2>
              <p className="text-gray-400">AdPilot will monitor your competitors' ads and alert you when they launch something new.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Top 3 competitors (Facebook page names or URLs)</label>
                <textarea
                  value={form.competitors}
                  onChange={(e) => setForm({...form, competitors: e.target.value})}
                  rows={3}
                  placeholder="e.g. Gold's Gym Cairo, FitLife Egypt, Curves Egypt"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">What do competitors do better than you?</label>
                <input
                  type="text"
                  value={form.competitorAdvantage}
                  onChange={(e) => setForm({...form, competitorAdvantage: e.target.value})}
                  placeholder="e.g. Bigger brand, more locations, lower prices"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">What do YOU do better than competitors?</label>
                <input
                  type="text"
                  value={form.ourAdvantage}
                  onChange={(e) => setForm({...form, ourAdvantage: e.target.value})}
                  placeholder="e.g. Better trainers, more personal, results-focused"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goToStep(6, {
                    competitors: form.competitors,
                    competitorAdvantage: form.competitorAdvantage,
                    ourAdvantage: form.ourAdvantage,
                  })}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Continue →
                </button>
                <button
                  onClick={() => goToStep(6, {})}
                  className="px-6 bg-white/5 hover:bg-white/10 text-gray-400 font-medium py-3 rounded-lg transition text-sm"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 6 — Connect Meta */}
        {step === 6 && (
          <div>
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl mb-4">🔗</div>
              <h2 className="text-3xl font-bold mb-2">Connect your Meta account</h2>
              <p className="text-gray-400">Connect your Facebook ad account so AdPilot can monitor and optimize your campaigns.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold mb-2">What AdPilot will access:</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Read your campaign performance data</li>
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Read your ad account metrics</li>
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Create and manage campaigns (with your approval)</li>
                  <li className="flex items-center gap-2"><span className="text-red-400">✗</span> We never post to your personal profile</li>
                  <li className="flex items-center gap-2"><span className="text-red-400">✗</span> We never access your messages</li>
                </ul>
              </div>

              <button
                onClick={async () => {
                  try {
                    const res = await axios.get(`${BACKEND}/api/meta/oauth-url?userId=${userId}`)
                    window.location.href = res.data.url
                  } catch (err) {
                    alert('Failed to connect Meta. Please try again.')
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Connect Facebook & Instagram Ads →
              </button>

              <button
                onClick={() => goToStep(7, {})}
                className="w-full text-gray-500 text-sm hover:text-gray-300 transition py-2"
              >
                Skip for now — connect later →
              </button>
            </div>
          </div>
        )}

        {/* Step 7 — Health score */}
        {step === 7 && (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center text-xl mb-4 mx-auto">🎉</div>
              <h2 className="text-3xl font-bold mb-2">You're all set!</h2>
              <p className="text-gray-400">Your Meta account is connected and AdPilot is ready to go.</p>
            </div>

            <div className={`inline-flex flex-col items-center justify-center w-40 h-40 rounded-full border-4 mx-auto mb-6 border-green-400 bg-green-400/10`}>
              <span className="text-5xl font-bold text-green-400">{healthScore}</span>
              <span className="text-gray-400 text-sm">out of 100</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-6">
              <h3 className="font-semibold mb-4">What's ready:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-green-400"><span>✓</span> Business profile created</li>
                <li className="flex items-center gap-2 text-green-400"><span>✓</span> Meta account connected</li>
                <li className="flex items-center gap-2 text-green-400"><span>✓</span> Campaigns syncing</li>
                <li className="flex items-center gap-2 text-green-400"><span>✓</span> AI recommendations ready</li>
                <li className="flex items-center gap-2 text-green-400"><span>✓</span> WhatsApp alerts configured</li>
              </ul>
            </div>

            <button
              onClick={handleComplete}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {saving ? 'Setting up your dashboard...' : 'Enter my dashboard →'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default Onboarding