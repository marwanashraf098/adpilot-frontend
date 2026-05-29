import { useState } from "react";
import axios from "axios";

const AI = "https://adpilot-ai-service-production.up.railway.app";
const BACKEND = "https://adpilot-backend-production-24e1.up.railway.app";

function Audit() {
  const [step, setStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [businessSummary, setBusinessSummary] = useState(null);
  const [urls, setUrls] = useState({
    website_url: "",
    facebook_page_url: "",
    instagram_url: "",
    tiktok_url: "",
  });
  const [form, setForm] = useState({
    business_name: "",
    industry: "business",
    currently_running_ads: "",
    monthly_budget: "",
    pixel_installed: "",
    current_cpl: "",
    ads_experience: "",
    main_goal: "",
    average_price: "",
    conversion_rate: "",
    monthly_customers_from_ads: "",
    customer_retention: "",
    monthly_revenue: "",
    revenue_from_ads_pct: "",
  });
  const [audit, setAudit] = useState(null);
  const [email, setEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!urls.website_url && !urls.facebook_page_url && !urls.instagram_url) {
      alert("Please enter at least one URL");
      return;
    }
    setScanning(true);
    try {
      const res = await axios.post(`${AI}/scan-business`, {
        website_url: urls.website_url,
        facebook_url: urls.facebook_page_url,
        instagram_url: urls.instagram_url,
      });
      const data = res.data;
      setBusinessSummary(data);
      if (!data.scan_failed) {
        setForm((prev) => ({
          ...prev,
          business_name: data.business_name || "",
          industry: data.industry || "business",
        }));
      } else {
        setBusinessSummary({ scan_failed: true });
      }
      setStep(2);
    } catch (err) {
      setBusinessSummary({ scan_failed: true });
      setStep(2);
    } finally {
      setScanning(false);
    }
  };

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!form.business_name) return;
    setStep(3);
    try {
      const res = await axios.post(`${AI}/audit`, {
        ...form,
        ...urls,
        scanned_description: businessSummary?.description || "",
        scanned_services: businessSummary?.services
          ? Array.isArray(businessSummary.services)
            ? businessSummary.services.join(", ")
            : businessSummary.services
          : "",
        scanned_target_audience: businessSummary?.target_audience || "",
        unique_selling_point: businessSummary?.unique_selling_point || "",
      });
      const auditData = res.data;
      setAudit(auditData);
      setStep(4);

      // Save audit result to backend silently
      axios
        .post(`${BACKEND}/api/audit/save`, {
          ...form,
          ...urls,
          overall_score: auditData.overall_score,
          estimated_monthly_waste: auditData.estimated_monthly_waste,
          full_result: auditData,
        })
        .catch((err) => console.error("Failed to save audit:", err));
    } catch (err) {
      setStep(2);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await axios.post(`${BACKEND}/api/waitlist/join`, { email });

      // Update audit record with email
      axios
        .post(`${BACKEND}/api/audit/save`, {
          ...form,
          ...urls,
          overall_score: audit?.overall_score,
          estimated_monthly_waste: audit?.estimated_monthly_waste,
          email: email,
          full_result: audit,
        })
        .catch(() => {});

      setWaitlistDone(true);
      if (window.fbq) {
        const eventId = `audit_lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        window.fbq("track", "Lead", {
          content_name: "Audit Tool Waitlist",
          content_category: "AdPilot",
        }, { eventID: eventId });
      }
    } catch (err) {
      setWaitlistDone(true);
    }
  };

  const resetAll = () => {
    setStep(1);
    setAudit(null);
    setWaitlistDone(false);
    setBusinessSummary(null);
    setUrls({
      website_url: "",
      facebook_page_url: "",
      instagram_url: "",
      tiktok_url: "",
    });
    setForm({
      business_name: "",
      industry: "business",
      currently_running_ads: "",
      monthly_budget: "",
      pixel_installed: "",
      current_cpl: "",
      ads_experience: "",
      main_goal: "",
      average_price: "",
      conversion_rate: "",
      monthly_customers_from_ads: "",
      customer_retention: "",
      monthly_revenue: "",
      revenue_from_ads_pct: "",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 75) return "bg-green-400/10 border-green-400/20";
    if (score >= 50) return "bg-yellow-400/10 border-yellow-400/20";
    return "bg-red-400/10 border-red-400/20";
  };

  const getBarColor = (score) => {
    if (score >= 75) return "bg-green-400";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-400";
  };

  const btn = (val, current) =>
    `py-3 rounded-lg text-sm font-medium border transition ${
      val === current
        ? "bg-blue-600 border-blue-600 text-white"
        : "bg-white/5 border-white/10 text-gray-400 hover:border-blue-500"
    }`;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <a href="/" className="text-xl font-bold">
          Ad<span className="text-blue-500">Pilot</span>
        </a>
        <a
          href="/#waitlist"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          Join waitlist
        </a>
      </nav>

      {/* Step indicator */}
      {step <= 2 && (
        <div className="max-w-2xl mx-auto px-8 pt-8">
          <div className="flex items-center gap-3 mb-8">
            {["Scan business", "Answer questions"].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === i + 1 ? "bg-blue-600 text-white" : step > i + 1 ? "bg-green-500 text-white" : "bg-white/10 text-gray-500"}`}
                >
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span
                  className={`text-sm ${step === i + 1 ? "text-white" : "text-gray-500"}`}
                >
                  {label}
                </span>
                {i < 1 && <div className="w-8 h-px bg-white/10 mx-1"></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1 — Scan */}
      {step === 1 && (
        <section className="max-w-2xl mx-auto px-8 pb-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              🆓 Free — no signup required
            </div>
            <h1 className="text-4xl font-bold mb-3">
              Free AI Advertising Audit
            </h1>
            <p className="text-gray-400">
              Enter your business URLs and our AI will scan your online presence
              to give you a personalized audit.
            </p>
          </div>

          <form onSubmit={handleScan} className="space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">
                Your online presence{" "}
                <span className="text-red-400 text-xs normal-case font-normal">
                  — enter at least one
                </span>
              </h3>
              {[
                {
                  key: "website_url",
                  label: "W",
                  bg: "bg-green-600",
                  placeholder: "Website URL (e.g. yourbusiness.com)",
                },
                {
                  key: "facebook_page_url",
                  label: "f",
                  bg: "bg-blue-600",
                  placeholder: "Facebook page URL (optional)",
                },
                {
                  key: "instagram_url",
                  label: "IG",
                  bg: "bg-gradient-to-br from-purple-500 to-pink-500",
                  placeholder: "Instagram profile URL (optional)",
                },
                {
                  key: "tiktok_url",
                  label: "TT",
                  bg: "bg-gray-800",
                  placeholder: "TikTok profile URL (optional)",
                },
              ].map(({ key, label, bg, placeholder }) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center text-xs font-bold flex-shrink-0`}
                  >
                    {label}
                  </div>
                  <input
                    type="text"
                    value={urls[key]}
                    onChange={(e) =>
                      setUrls({ ...urls, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={scanning}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Scanning your business...
                </>
              ) : (
                "🔍 Scan my business →"
              )}
            </button>
          </form>
        </section>
      )}

      {/* Step 2 — Questions */}
      {step === 2 && (
        <section className="max-w-2xl mx-auto px-8 pb-16">
          {businessSummary && !businessSummary.scan_failed ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-green-400 font-medium uppercase tracking-wider">
                  ✓ Business scanned
                </p>
                <button
                  onClick={() => {
                    setStep(1);
                    setBusinessSummary(null);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-300 transition"
                >
                  Re-scan →
                </button>
              </div>
              <p className="text-lg font-bold text-white mb-1">
                {businessSummary.business_name}
              </p>
              {businessSummary.description && (
                <p className="text-sm text-gray-400 mb-3 leading-relaxed">
                  {businessSummary.description}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {businessSummary.services &&
                  businessSummary.services.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Services</p>
                      <p className="text-xs text-gray-300">
                        {Array.isArray(businessSummary.services)
                          ? businessSummary.services.join(", ")
                          : businessSummary.services}
                      </p>
                    </div>
                  )}
                {businessSummary.target_audience && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      Target audience
                    </p>
                    <p className="text-xs text-gray-300">
                      {businessSummary.target_audience}
                    </p>
                  </div>
                )}
                {businessSummary.unique_selling_point && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">
                      What makes you different
                    </p>
                    <p className="text-xs text-gray-300">
                      {businessSummary.unique_selling_point}
                    </p>
                  </div>
                )}
                {businessSummary.price_range && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Price range</p>
                    <p className="text-xs text-gray-300 capitalize">
                      {businessSummary.price_range}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-6">
              <p className="text-yellow-400 text-sm font-medium mb-1">
                ⚠ Couldn't scan automatically
              </p>
              <p className="text-gray-400 text-xs">
                Fill in your business details below and we'll still generate an
                accurate audit.
              </p>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-gray-500 hover:text-gray-300 mt-2 transition"
              >
                ← Try again
              </button>
            </div>
          )}

          <form onSubmit={handleAudit} className="space-y-6">
            {/* Business details */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">
                Confirm business details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Business name *
                  </label>
                  <input
                    type="text"
                    value={form.business_name}
                    onChange={(e) =>
                      setForm({ ...form, business_name: e.target.value })
                    }
                    placeholder="Your business name"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Industry
                  </label>
                  <select
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
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
              </div>
            </div>

            {/* Advertising situation */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">
                Your advertising situation
              </h3>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  Are you currently running paid ads?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Yes", "No", "Stopped recently"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, currently_running_ads: opt })
                      }
                      className={btn(opt, form.currently_running_ads)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  Monthly ad budget
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Under EGP 3,000",
                    "EGP 3,000–10,000",
                    "EGP 10,000–30,000",
                    "EGP 30,000–100,000",
                    "EGP 100,000–300,000",
                    "Over EGP 300,000",
                    "Not running ads",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, monthly_budget: opt })}
                      className={btn(opt, form.monthly_budget)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  Is the Meta Pixel installed on your website?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Yes", "No", "I don't have a website", "I don't know"].map(
                    (opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, pixel_installed: opt })
                        }
                        className={btn(opt, form.pixel_installed)}
                      >
                        {opt}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  What is your current cost per lead (CPL)?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Under EGP 30",
                    "EGP 30–100",
                    "EGP 100–300",
                    "EGP 300–1,000",
                    "Over EGP 1,000",
                    "I don't track this",
                    "Not running ads",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, current_cpl: opt })}
                      className={btn(opt, form.current_cpl)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  How long have you been running ads?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "Never",
                    "Less than 3 months",
                    "3–12 months",
                    "1–3 years",
                    "Over 3 years",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, ads_experience: opt })}
                      className={btn(opt, form.ads_experience)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  What is your main advertising goal?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Get more leads",
                    "Increase sales",
                    "Build brand awareness",
                    "Get more website traffic",
                    "Get more app installs",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, main_goal: opt })}
                      className={btn(opt, form.main_goal)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial data */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">
                  Financial data
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Used to calculate your real ROAS and profitability
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Average product/service price (EGP)
                  </label>
                  <input
                    type="number"
                    value={form.average_price}
                    onChange={(e) =>
                      setForm({ ...form, average_price: e.target.value })
                    }
                    placeholder="e.g. 500"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Monthly total revenue (EGP)
                  </label>
                  <input
                    type="number"
                    value={form.monthly_revenue}
                    onChange={(e) =>
                      setForm({ ...form, monthly_revenue: e.target.value })
                    }
                    placeholder="e.g. 200000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  What % of your revenue comes from ads?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "Less than 20%",
                    "20–40%",
                    "40–60%",
                    "60–80%",
                    "Over 80%",
                    "I don't know",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, revenue_from_ads_pct: opt })
                      }
                      className={btn(opt, form.revenue_from_ads_pct)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  What % of leads convert to paying customers?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    "Less than 5%",
                    "5–15%",
                    "15–30%",
                    "30–50%",
                    "Over 50%",
                    "I don't know",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, conversion_rate: opt })}
                      className={btn(opt, form.conversion_rate)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  Monthly new customers from ads
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["0", "1–5", "5–20", "20–50", "50–100", "Over 100"].map(
                    (opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, monthly_customers_from_ads: opt })
                        }
                        className={btn(opt, form.monthly_customers_from_ads)}
                      >
                        {opt}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  How often does a customer come back?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "One time only",
                    "Monthly",
                    "Every few months",
                    "Yearly",
                    "Long-term (1+ year)",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, customer_retention: opt })
                      }
                      className={btn(opt, form.customer_retention)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Get my free audit →
            </button>
            <p className="text-center text-gray-600 text-xs">
              No signup required. Results in 60 seconds.
            </p>
          </form>
        </section>
      )}

      {/* Step 3 — Loading */}
      {step === 3 && (
        <section className="max-w-2xl mx-auto px-8 pt-32 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6 animate-pulse">
            AI
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Analyzing your business...
          </h2>
          <p className="text-gray-400 mb-8">
            Our AI is calculating your real profitability and advertising
            efficiency
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3">
            {[
              "✓ Processing business information",
              "✓ Calculating ROAS and profitability",
              "✓ Analyzing platform presence",
              "✓ Evaluating campaign structure",
              "⟳ Generating recommendations...",
            ].map((item, i) => (
              <p key={i} className="text-sm text-gray-400">
                {item}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Step 4 — Results */}
      {step === 4 && audit && (
        <section className="max-w-3xl mx-auto px-8 pt-12 pb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Your Advertising Audit</h2>
            <p className="text-gray-400 mb-6">{form.business_name}</p>
            <div
              className={`inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 ${getScoreBg(audit.overall_score)} mx-auto mb-4`}
            >
              <span
                className={`text-5xl font-bold ${getScoreColor(audit.overall_score)}`}
              >
                {audit.overall_score}
              </span>
              <span className="text-gray-400 text-sm">out of 100</span>
            </div>
            <p
              className={`text-lg font-semibold ${getScoreColor(audit.overall_score)}`}
            >
              {audit.overall_score >= 75
                ? "Good — room to improve"
                : audit.overall_score >= 50
                  ? "Average — significant issues found"
                  : "Poor — you're wasting budget"}
            </p>
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl px-6 py-3 inline-block">
              <p className="text-red-400 text-sm font-medium">
                💸 Estimated monthly waste:{" "}
                <strong>{audit.estimated_monthly_waste}</strong>
              </p>
            </div>
          </div>

          {/* Business summary */}
          {businessSummary && !businessSummary.scan_failed && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">
                Business profile used for this audit
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {businessSummary.business_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {businessSummary.description}
                  </p>
                </div>
                <div className="space-y-1">
                  {businessSummary.services && (
                    <p className="text-xs text-gray-500">
                      <span className="text-gray-400">Services:</span>{" "}
                      {Array.isArray(businessSummary.services)
                        ? businessSummary.services.join(", ")
                        : businessSummary.services}
                    </p>
                  )}
                  {businessSummary.target_audience && (
                    <p className="text-xs text-gray-500">
                      <span className="text-gray-400">Target:</span>{" "}
                      {businessSummary.target_audience}
                    </p>
                  )}
                  {businessSummary.price_range && (
                    <p className="text-xs text-gray-500">
                      <span className="text-gray-400">Price range:</span>{" "}
                      {businessSummary.price_range}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {audit.missing_platforms && audit.missing_platforms.length > 0 && (
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5 mb-6">
              <p className="text-yellow-400 text-sm font-medium mb-2">
                ⚠ Missing platforms your competitors are using
              </p>
              <div className="flex flex-wrap gap-2">
                {audit.missing_platforms.map((platform, i) => (
                  <span
                    key={i}
                    className="text-xs bg-yellow-500/10 text-yellow-300 px-3 py-1.5 rounded-full border border-yellow-500/20"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold mb-5">Score breakdown</h3>
            <div className="space-y-4">
              {Object.entries(audit.grades).map(([key, grade]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {grade.label}
                      </span>
                      <span
                        className={`text-sm font-semibold ${getScoreColor(grade.score)}`}
                      >
                        {grade.score}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getBarColor(grade.score)}`}
                      style={{ width: `${grade.score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{grade.finding}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-red-400">
                🔴 Top issues found
              </h3>
              <ul className="space-y-3">
                {audit.top_issues.map((issue, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <span className="text-red-400 flex-shrink-0 mt-0.5">✗</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 text-green-400">
                ⚡ Quick wins
              </h3>
              <ul className="space-y-3">
                {audit.quick_wins.map((win, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <span className="text-green-400 flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    {win}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold mb-2">
              Fix all of this automatically with AdPilot
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              AdPilot monitors your campaigns 24/7, fixes these issues
              automatically, and tells you exactly what to do next.
            </p>
            {!waitlistDone ? (
              <form
                onSubmit={handleWaitlist}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your business email"
                  required
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition text-sm whitespace-nowrap"
                >
                  Join waitlist →
                </button>
              </form>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg px-6 py-4 max-w-md mx-auto text-sm">
                ✓ You're on the waitlist! We'll reach out when we launch.
              </div>
            )}
            <button
              onClick={resetAll}
              className="mt-4 text-gray-500 text-sm hover:text-gray-300 transition block mx-auto"
            >
              Audit another business →
            </button>
          </div>
        </section>
      )}

      <footer className="border-t border-white/5 px-8 py-6 text-center">
        <p className="text-gray-600 text-sm">
          © 2026 AdPilot. Your AI media buyer. Built for Egypt and the Middle
          East.
        </p>
        <div className="flex items-center justify-center gap-6 mt-3">
          <a
            href="/privacy"
            className="text-gray-600 text-xs hover:text-gray-400 transition"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-gray-600 text-xs hover:text-gray-400 transition"
          >
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Audit;
