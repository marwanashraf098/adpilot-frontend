import { useState } from "react";
import axios from "axios";

function Audit() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    business_name: "",
    industry: "business",
    facebook_page_url: "",
    instagram_url: "",
    tiktok_url: "",
    website_url: "",
    currently_running_ads: "",
    monthly_budget: "",
    pixel_installed: "",
    current_cpl: "",
    ads_experience: "",
    main_goal: "",
  });
  const [audit, setAudit] = useState(null);
  const [email, setEmail] = useState("");
  const [waitlistDone, setWaitlistDone] = useState(false);

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!form.business_name) return;
    if (
      !form.facebook_page_url &&
      !form.instagram_url &&
      !form.tiktok_url &&
      !form.website_url
    ) {
      alert("Please enter at least one platform URL");
      return;
    }
    setStep(2);
    try {
      const res = await axios.post("http://localhost:8001/audit", form);
      setAudit(res.data);
      setStep(3);
    } catch (err) {
      console.error("Audit failed", err);
      setStep(1);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleWaitlist = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await axios.post("http://localhost:8080/api/waitlist/join", { email });
      setWaitlistDone(true);
      if (window.fbq) {
        window.fbq("track", "Lead", {
          content_name: "Audit Tool Waitlist",
          content_category: "AdPilot",
        });
      }
    } catch (err) {
      setWaitlistDone(true);
    }
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

      {/* Step 1 — Form */}
      {step === 1 && (
        <section className="max-w-2xl mx-auto px-8 pt-16 pb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              🆓 Free — no signup required
            </div>
            <h1 className="text-4xl font-bold mb-3">
              Free AI Advertising Audit
            </h1>
            <p className="text-gray-400">
              Answer a few questions and get a personalized audit of your
              advertising strategy in 60 seconds.
            </p>
          </div>

          <form onSubmit={handleAudit} className="space-y-6">
            {/* Business info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">
                Business info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Business name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.business_name}
                    onChange={(e) =>
                      setForm({ ...form, business_name: e.target.value })
                    }
                    placeholder="e.g. Cairo Gym"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                    required
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

            {/* Online presence */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-sm text-gray-300 uppercase tracking-wider">
                Online presence{" "}
                <span className="text-red-400 text-xs normal-case font-normal">
                  — enter at least one
                </span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    f
                  </div>
                  <input
                    type="text"
                    value={form.facebook_page_url}
                    onChange={(e) =>
                      setForm({ ...form, facebook_page_url: e.target.value })
                    }
                    placeholder="Facebook page URL"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    IG
                  </div>
                  <input
                    type="text"
                    value={form.instagram_url}
                    onChange={(e) =>
                      setForm({ ...form, instagram_url: e.target.value })
                    }
                    placeholder="Instagram profile URL"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    TT
                  </div>
                  <input
                    type="text"
                    value={form.tiktok_url}
                    onChange={(e) =>
                      setForm({ ...form, tiktok_url: e.target.value })
                    }
                    placeholder="TikTok profile URL"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    W
                  </div>
                  <input
                    type="text"
                    value={form.website_url}
                    onChange={(e) =>
                      setForm({ ...form, website_url: e.target.value })
                    }
                    placeholder="Website URL"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Advertising questions */}
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
                      className={`py-3 rounded-lg text-sm font-medium border transition ${
                        form.currently_running_ads === opt
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-blue-500"
                      }`}
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
                    "Under EGP 1,000",
                    "EGP 1,000–3,000",
                    "EGP 3,000–10,000",
                    "EGP 10,000–30,000",
                    "Over EGP 30,000",
                    "Not running ads",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, monthly_budget: opt })}
                      className={`py-3 rounded-lg text-sm font-medium border transition ${
                        form.monthly_budget === opt
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-blue-500"
                      }`}
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
                        className={`py-3 rounded-lg text-sm font-medium border transition ${
                          form.pixel_installed === opt
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white/5 border-white/10 text-gray-400 hover:border-blue-500"
                        }`}
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
                    "EGP 30–70",
                    "EGP 70–150",
                    "Over EGP 150",
                    "I don't track this",
                    "Not running ads",
                  ].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setForm({ ...form, current_cpl: opt })}
                      className={`py-3 rounded-lg text-sm font-medium border transition ${
                        form.current_cpl === opt
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-blue-500"
                      }`}
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
                      className={`py-3 rounded-lg text-sm font-medium border transition ${
                        form.ads_experience === opt
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-blue-500"
                      }`}
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
                      className={`py-3 rounded-lg text-sm font-medium border transition ${
                        form.main_goal === opt
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-blue-500"
                      }`}
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

      {/* Step 2 — Loading */}
      {step === 2 && (
        <section className="max-w-2xl mx-auto px-8 pt-32 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold mx-auto mb-6 animate-pulse">
            AI
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Analyzing your business...
          </h2>
          <p className="text-gray-400 mb-8">
            Our AI is reviewing your advertising situation
          </p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-3">
            {[
              "✓ Processing your business information",
              "✓ Analyzing platform presence",
              "✓ Evaluating campaign structure",
              "✓ Reviewing targeting strategy",
              "⟳ Calculating budget efficiency...",
            ].map((item, i) => (
              <p key={i} className="text-sm text-gray-400">
                {item}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Step 3 — Results */}
      {step === 3 && audit && (
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
              automatically, and tells you exactly what to do next. Join the
              waitlist to be first when we launch.
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
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm"
                  required
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
              onClick={() => {
                setStep(1);
                setAudit(null);
                setWaitlistDone(false);
              }}
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
