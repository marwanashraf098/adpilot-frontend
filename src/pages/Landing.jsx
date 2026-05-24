import { useState } from 'react'
import axios from 'axios'

function Landing() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleWaitlist = async (e) => {
    e.preventDefault()
    if (!email) return

    try {
      const res = await axios.post('https://adpilot-backend-production-24e1.up.railway.app/api/waitlist/join', { email })
      console.log('Waitlist response:', res.data)
      setSubmitted(true)

      if (window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'Waitlist Signup',
          content_category: 'AdPilot',
        })
      }
    } catch (err) {
      console.error('Waitlist error:', err)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="text-xl font-bold flex-shrink-0">
          Ad<span className="text-blue-500">Pilot</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#how" className="text-sm text-gray-400 hover:text-white transition">How it works</a>
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition">Features</a>
          <a href="#control" className="text-sm text-gray-400 hover:text-white transition">Your control</a>
          <a href="#compare" className="text-sm text-gray-400 hover:text-white transition">vs Agency</a>
        </div>
        <a href="#waitlist" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex-shrink-0">
          Join waitlist
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
          Coming soon — join the waitlist
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Your AI media buyer —
          <span className="text-blue-500"> always on, always optimizing</span>
        </h1>

        <p className="text-gray-400 text-base md:text-xl max-w-2xl mx-auto mb-6 leading-relaxed">
          AdPilot acts as your dedicated media buyer. It creates campaigns, writes ad copy,
          generates creatives, monitors performance 24/7, and tells you exactly what to fix —
          at a fraction of the cost of a marketing agency — all from one simple dashboard,
          no complicated ad managers needed.
        </p>

        <p className="text-blue-400 font-semibold text-base md:text-lg mb-10">
          Built for businesses in Egypt and the Middle East.
        </p>

        {!submitted ? (
          <form onSubmit={handleWaitlist} className="flex flex-col gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your business email"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition text-sm"
            >
              Join waitlist →
            </button>
          </form>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg px-6 py-4 max-w-md mx-auto text-sm">
            ✓ You're on the waitlist! We'll reach out when we launch.
          </div>
        )}

        <p className="text-gray-600 text-xs mt-4">No credit card required. Be the first to know when we launch.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">24/7</p>
            <p className="text-gray-500 text-sm mt-1">Campaign monitoring</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">15 min</p>
            <p className="text-gray-500 text-sm mt-1">Sync frequency</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">-60%</p>
            <p className="text-gray-500 text-sm mt-1">Avg wasted ad spend</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">3 sec</p>
            <p className="text-gray-500 text-sm mt-1">To generate ad copy</p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-white/2 border-y border-white/5 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Most businesses waste 40-60% of their ad budget</h2>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto">Without the right system, you're flying blind. AdPilot gives you the clarity and control you need.</p>
          <div className="grid grid-cols-1 gap-6">
            {[
              ['😤', 'No visibility', "You don't know which ad is working and which one is draining your budget until it's too late."],
              ['⏰', 'Too time consuming', 'Managing ads manually takes hours every week. Time you should be spending running your business.'],
              ['💸', 'Agencies are expensive', "A good media buyer costs EGP 8,000–15,000/month. Most small businesses simply can't afford that."],
            ].map(([icon, title, desc]) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">AdPilot works like a real media buyer</h2>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto">It does everything a professional media buyer does — at a fraction of the cost</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              ['1', 'Connect', 'Link your Facebook, Instagram, and Google Ads accounts in one click.'],
              ['2', 'AI Analyzes You', 'AdPilot scans your business, website, and products — then suggests campaigns, audiences, and budgets tailored to you.'],
              ['3', 'Monitor', 'AdPilot watches every campaign 24/7, catching problems before they waste your budget.'],
              ['4', 'Optimize', 'Get AI recommendations and approve with one tap — or let AdPilot handle it automatically.'],
            ].map(([num, title, desc]) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-xl font-bold mx-auto mb-4">{num}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Business Intelligence */}
      <section className="bg-white/2 border-y border-white/5 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                🧠 AI Business Intelligence
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Your AI startup consultant — from day one</h2>
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                AdPilot doesn't wait for instructions. From the moment you connect your account,
                it analyzes your business, scans your website, and studies your products — then
                proactively tells you exactly which campaigns you should be running, which audiences
                to target, and what budget to set. It notices opportunities you're missing and flags
                them before your competitors take them. Like having a senior marketing consultant
                working for your business 24/7.
              </p>
              <div className="space-y-4">
                {[
                  ['Website & product analysis', 'AdPilot scans your website and understands what you sell, who your customers are, and what makes you different.'],
                  ['Ready-made campaign suggestions', 'Before you run a single ad, AdPilot recommends which campaigns to run, which audiences to target, and what budget to set.'],
                  ['Industry benchmarks', "Know what a good CPL looks like for your industry before you spend a single pound. No more guessing."],
                  ['Competitor ad intelligence', "See what ads your competitors are running, which ones are working, and how to outperform them."],
                  ['Proactive campaign suggestions', "AdPilot spots opportunities — seasonal trends, untapped audiences, competitor gaps — and tells you to act before it's too late."],
                  ['Gap detection', "Running ads on Facebook but missing Google? AdPilot finds the gaps in your strategy and tells you exactly how to fill them."],
                  ['Growth roadmap', 'Get a 30-day advertising plan with clear priorities — so you always know what to focus on next.'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</div>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                <p className="text-xs text-gray-400 font-medium">AdPilot AI is analyzing your business...</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">✓ Website scanned</p>
                <p className="text-sm font-semibold">Cairo Clinic — Dermatology & Skin Care</p>
                <p className="text-xs text-gray-500 mt-1">3 services identified · Target audience analyzed</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-3">💡 AdPilot noticed you're missing these campaigns</p>
                <div className="space-y-2">
                  {[
                    ['Appointment booking — Lead Generation', 'High priority', true],
                    ['Skin care consultation — Awareness', 'Recommended', false],
                    ['Retargeting website visitors', 'Recommended', false],
                  ].map(([name, badge, high]) => (
                    <div key={name} className="flex items-center justify-between gap-2">
                      <p className="text-xs text-white">{name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${high ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">📊 Industry benchmarks for clinics in Egypt</p>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">EGP 55</p>
                    <p className="text-xs text-gray-500">Target CPL</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">1.8%</p>
                    <p className="text-xs text-gray-500">Avg CTR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">EGP 300</p>
                    <p className="text-xs text-gray-500">Min budget</p>
                  </div>
                </div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs text-amber-300 font-medium">⚡ Opportunity detected</p>
                <p className="text-xs text-gray-400 mt-1">Ramadan is in 3 weeks. Clinics running promotions now are seeing 2.3x more leads. You currently have no active campaign. Start one today.</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <p className="text-xs text-purple-300 font-medium">🧠 AI recommendation</p>
                <p className="text-xs text-gray-400 mt-1">Start with a lead generation campaign targeting women aged 25-45 in Cairo interested in skin care. Budget EGP 300/day. Expected CPL: EGP 45-65.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Everything your media buyer does — automated</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Built specifically for local businesses and SMEs in Egypt and the Middle East</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ['✨', 'AI Ad Copy Generator', 'Generate 3 professional ad variations in seconds. Hooks, body copy, and CTAs written by AI trained on winning ads.'],
              ['🎨', 'AI Creative Generation & Management', 'Generate ad images automatically with AI — or upload your own photos and videos. AdPilot analyzes performance and tells you when to refresh them.'],
              ['🚀', 'Full Campaign Creation', 'Answer 5 questions, upload your creative or let AI generate one, and AdPilot builds and launches the complete campaign. No experience needed.'],
              ['📊', 'Simple Campaign Dashboard', 'See all your campaigns across all platforms in one clean dashboard — health scores, spend, CTR, CPL. No complicated ad managers. Updated every 15 minutes.'],
              ['🤖', 'AI Recommendations', 'Specific, data-backed recommendations like "Pause this ad — CPL is 3x your target" with confidence scores and one-click approval.'],
              ['📱', 'WhatsApp Alerts', 'Instant WhatsApp notifications when a campaign underperforms — with one-tap actions to fix it immediately.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-blue-400 text-2xl mb-3">{icon}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creatives */}
      <section className="bg-white/2 border-y border-white/5 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                🎨 Creative Studio
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Your creatives. Supercharged by AI.</h2>
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                Upload your own photos and videos, or let AdPilot generate creatives for you.
                Either way, the AI analyzes performance, spots fatigue before it hurts your results,
                and suggests exactly when and what to change.
              </p>
              <div className="space-y-4">
                {[
                  ['Upload your own creatives', 'Photos, videos, or graphics — upload directly and run them across Meta, Google, and TikTok.'],
                  ['AI-generated creatives', "No photos? No problem. Describe your product and AI generates professional ad visuals instantly."],
                  ['Creative fatigue detection', 'AI monitors CTR trends and alerts you before your creative burns out — saving you from wasted spend.'],
                  ['Winning creative identification', 'See exactly which creative drives the most leads and lowest CPL — so you know what to scale.'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</div>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Creative Studio</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-lg flex-shrink-0">📸</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">Summer_Campaign.jpg</p>
                  <p className="text-xs text-gray-500">Uploaded · 1080x1080</p>
                </div>
                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full flex-shrink-0">Top performer</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/20 flex items-center justify-center text-lg flex-shrink-0">🤖</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">AI Generated Visual</p>
                  <p className="text-xs text-gray-500">Generated · Ready to use</p>
                </div>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full flex-shrink-0">New</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/20 flex items-center justify-center text-lg flex-shrink-0">⚠️</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Promo_Banner.jpg</p>
                  <p className="text-xs text-gray-500">Frequency 4.2 · CTR dropping</p>
                </div>
                <span className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-full flex-shrink-0">Refresh needed</span>
              </div>
              <div className="border border-dashed border-white/10 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm">⬆ Upload your creative</p>
                <p className="text-gray-600 text-xs mt-1">JPG, PNG, MP4 supported</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full media buyer */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              💼 Full Media Buyer Replacement
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Everything a senior media buyer does — automated</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">A great media buyer doesn't just run ads. They report, plan, test, optimize, and think ahead. AdPilot does all of it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ['📋', 'Weekly reports to the boss', 'Every Monday morning, AdPilot sends you a plain-English summary of what happened last week, why it happened, and exactly what to focus on next — delivered straight to your WhatsApp.'],
              ['💰', 'Budget management like a CFO', 'AdPilot makes sure you never overspend or underspend. It tracks every pound, shows your exact ROI, and reallocates budget from losing campaigns to winning ones automatically.'],
              ['📈', 'Knows when to scale and when to stop', 'AdPilot detects winning campaigns and tells you to scale before the opportunity passes. It catches losing campaigns early — before they drain your budget — and recommends pausing them.'],
              ['🧪', 'A/B testing — always improving', 'AdPilot recommends A/B tests across headlines, creatives, and audiences. When there is a winner, it tells you to kill the loser and scale the winner immediately.'],
              ['🎯', 'Retargeting — never let a lead go cold', 'AdPilot identifies people who visited your website, watched your videos, or engaged with your page — and automatically suggests retargeting campaigns to bring them back.'],
              ['📅', 'Seasonal & event awareness', 'Ramadan, Eid, back to school, summer — AdPilot knows the Egyptian and Middle Eastern calendar and proactively suggests campaigns before every peak season.'],
            ].map(([icon, title, desc]) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4">
                <div className="text-2xl flex-shrink-0">{icon}</div>
                <div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4 md:col-span-2">
              <div className="text-2xl flex-shrink-0">🌐</div>
              <div>
                <h3 className="font-semibold mb-2">Platform expertise built in</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Not every platform works for every business. AdPilot knows that a clinic should focus on Meta lead ads, an e-commerce store should test Google Shopping, and a restaurant should use Instagram Reels. It recommends the right platform for your business from day one.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You are in control */}
      <section id="control" className="bg-white/2 border-y border-white/5 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                🛡️ You are always in control
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">AI works for you. Not the other way around.</h2>
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                AdPilot is your AI media buyer — not your boss. It advises, suggests, and recommends.
                You decide. Every action the AI wants to take requires your approval.
                You can override anything, pause automation at any time, and always see exactly
                what AdPilot did and why. Full transparency. Full control. Zero surprises.
              </p>
              <div className="space-y-4">
                {[
                  ['Every recommendation needs your approval', 'AdPilot never moves money or changes campaigns without showing you first. You approve with one tap or dismiss — always your choice.'],
                  ['Full audit trail of every action', 'Every decision AdPilot makes or recommends is logged with a plain-English explanation. You always know what happened and why.'],
                  ['Set your own limits', 'Define daily spending caps, approval thresholds, and automation rules. AdPilot works within the boundaries you set — always.'],
                  ['Pause or override anytime', "Disable any automation with one click. You're never locked in. AdPilot serves you — you don't serve AdPilot."],
                  ['Confidence scores on every suggestion', 'Every recommendation shows a confidence score so you can decide how much weight to give it.'],
                  ['No complicated ad managers', 'Forget Facebook Ads Manager and Google Ads dashboards. AdPilot gives you one simple interface to manage everything across all platforms — no training required.'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">✓</div>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-gray-500 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5 space-y-3">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Your approval center</p>
              <div className="bg-white/5 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <p className="text-xs text-green-400 font-medium">Scale recommendation — Confidence 91%</p>
                </div>
                <p className="text-sm font-semibold mb-1">Increase budget for Clinic campaign</p>
                <p className="text-xs text-gray-400 mb-3">CPL is EGP 48 — 31% below your target. Increasing daily budget from EGP 400 to EGP 460 is projected to generate 12 more leads this week.</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-500/20 text-green-400 text-xs font-semibold py-2 rounded-lg">✓ Approve</button>
                  <button className="flex-1 bg-white/5 text-gray-400 text-xs font-semibold py-2 rounded-lg">Dismiss</button>
                </div>
              </div>
              <div className="bg-white/5 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <p className="text-xs text-red-400 font-medium">Warning — Confidence 88%</p>
                </div>
                <p className="text-sm font-semibold mb-1">Pause Gym campaign ad set</p>
                <p className="text-xs text-gray-400 mb-3">CPL has been 2.8x your target for 4 days. Pausing this ad set saves EGP 240/day with no impact on your best performing audiences.</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-red-500/20 text-red-400 text-xs font-semibold py-2 rounded-lg">Pause now</button>
                  <button className="flex-1 bg-white/5 text-gray-400 text-xs font-semibold py-2 rounded-lg">Keep running</button>
                </div>
              </div>
              <div className="bg-white/5 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <p className="text-xs text-blue-400 font-medium">Opportunity — Confidence 85%</p>
                </div>
                <p className="text-sm font-semibold mb-1">Launch Ramadan campaign now</p>
                <p className="text-xs text-gray-400 mb-3">Ramadan starts in 18 days. Competitors in your industry started 3 weeks ago. Starting now gives you time to optimize before peak demand.</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-500/20 text-blue-400 text-xs font-semibold py-2 rounded-lg">Create campaign</button>
                  <button className="flex-1 bg-white/5 text-gray-400 text-xs font-semibold py-2 rounded-lg">Remind me later</button>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-xs text-gray-500">Auto-execute if confidence ≥ 90%</p>
                <div className="w-8 h-4 bg-blue-600 rounded-full flex items-center justify-end px-0.5">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* vs Agency */}
      <section id="compare" className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">AdPilot vs Marketing Agency</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Why pay EGP 10,000/month for an agency when AI can do more for less?</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-white/5 px-4 py-4">
              <div className="text-xs font-semibold text-gray-400"></div>
              <div className="text-xs font-semibold text-center text-gray-400">Agency</div>
              <div className="text-xs font-semibold text-center text-blue-400">AdPilot</div>
            </div>
            {[
              ['Monthly cost', 'EGP 8,000–15,000', 'From EGP 750'],
              ['Campaign monitoring', 'Weekly', 'Every 15 min'],
              ['Ad copy writing', 'Days', 'In 3 seconds'],
              ['Creative generation', 'Extra cost', 'Included'],
              ['Upload creatives', '✗', '✓'],
              ['A/B testing', 'Manual', 'AI-automated'],
              ['Retargeting', 'Sometimes', 'Always'],
              ['Seasonal planning', 'If reminded', 'Proactive'],
              ['Weekly reports', 'Monthly PDF', 'WhatsApp'],
              ['You in control', 'Rarely', 'Always'],
              ['Managing ads', 'Complex tools', 'Simple dashboard'],
              ['Availability', 'Business hours', '24/7'],
              ['WhatsApp alerts', '✗', '✓'],
            ].map(([feature, agency, adpilot], i) => (
              <div key={i} className={`grid grid-cols-3 px-4 py-3 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                <div className="text-xs text-gray-300">{feature}</div>
                <div className="text-xs text-center text-gray-500">{agency}</div>
                <div className="text-xs text-center text-green-400 font-medium">{adpilot}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="waitlist" className="bg-blue-600/10 border-y border-blue-500/20 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Be the first to try AdPilot</h2>
          <p className="text-gray-400 mb-8">Join businesses in Egypt and the Middle East getting smarter about their ad spend.</p>
          {!submitted ? (
            <form onSubmit={handleWaitlist} className="flex flex-col gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your business email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition text-sm"
              >
                Join waitlist →
              </button>
            </form>
          ) : (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg px-6 py-4 max-w-md mx-auto text-sm">
              ✓ You're on the waitlist! We'll reach out when we launch.
            </div>
          )}
          <p className="text-gray-600 text-xs mt-4">No credit card required. Free during beta.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-6 text-center">
        <p className="text-gray-600 text-sm">© 2026 AdPilot. Your AI media buyer. Built for Egypt and the Middle East.</p>
      </footer>

    </div>
  )
}

export default Landing