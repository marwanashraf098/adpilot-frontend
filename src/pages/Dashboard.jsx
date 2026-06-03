import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND = 'http://localhost:8080'
const AI = 'http://localhost:8001'

function HealthScore({ score }) {
  const color =
    score >= 70
      ? "text-green-400 bg-green-400/10"
      : score >= 50
        ? "text-yellow-400 bg-yellow-400/10"
        : "text-red-400 bg-red-400/10";
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${color}`}>
      {score}
    </span>
  );
}

function calcHealth(item) {
  let score = 100;
  if ((item.ctr || 0) < 1) score -= 30;
  if ((item.cpc || 0) > 5) score -= 20;
  if (item.status !== "ACTIVE") score -= 20;
  return Math.max(score, 10);
}

function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
      status === "ACTIVE" ? "bg-green-400/10 text-green-400" : "bg-gray-700 text-gray-400"
    }`}>
      {status}
    </span>
  );
}

function AdSetRow({ adSet }) {
  const [expanded, setExpanded] = useState(false);
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);

  const toggleAds = async () => {
    if (!expanded && ads.length === 0) {
      setLoadingAds(true);
      try {
        const res = await axios.get(`${BACKEND}/api/campaigns/adsets/${adSet.id}/ads`);
        setAds(res.data);
      } catch (err) {
        console.error("Failed to fetch ads", err);
      } finally {
        setLoadingAds(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <>
      <tr className="border-b border-gray-800/30 bg-gray-900/50 hover:bg-gray-800/20 transition cursor-pointer" onClick={toggleAds}>
        <td className="pl-12 pr-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-xs">{expanded ? "▼" : "▶"}</span>
            <HealthScore score={calcHealth(adSet)} />
          </div>
        </td>
        <td className="px-4 py-3">
          <p className="text-sm text-gray-300">{adSet.name}</p>
          <p className="text-xs text-gray-600 mt-0.5">
            Ad Set · {adSet.optimizationGoal || "N/A"} · Age {adSet.minAge}-{adSet.maxAge}
          </p>
        </td>
        <td className="px-4 py-3 text-right text-sm text-gray-400">EGP {(adSet.spend || 0).toFixed(2)}</td>
        <td className="px-4 py-3 text-right text-sm text-gray-400">{(adSet.clicks || 0).toLocaleString()}</td>
        <td className="px-4 py-3 text-right text-sm text-gray-400">{(adSet.ctr || 0).toFixed(2)}%</td>
        <td className="px-4 py-3 text-right text-sm text-gray-400">EGP {(adSet.cpc || 0).toFixed(2)}</td>
        <td className="px-4 py-3 text-right"><StatusBadge status={adSet.status} /></td>
      </tr>

      {expanded && (loadingAds ? (
        <tr className="bg-gray-950/50">
          <td colSpan={7} className="pl-20 py-2 text-xs text-gray-600">Loading ads...</td>
        </tr>
      ) : ads.map((ad) => (
        <tr key={ad.id} className="border-b border-gray-800/20 bg-gray-950/50 hover:bg-gray-900/30 transition">
          <td className="pl-20 pr-4 py-3"><HealthScore score={calcHealth(ad)} /></td>
          <td className="px-4 py-3">
            <p className="text-xs text-gray-400">{ad.name}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              Ad · {ad.creativeFormat || "Unknown format"}
              {ad.headline && ` · "${ad.headline}"`}
            </p>
          </td>
          <td className="px-4 py-3 text-right text-xs text-gray-500">EGP {(ad.spend || 0).toFixed(2)}</td>
          <td className="px-4 py-3 text-right text-xs text-gray-500">{(ad.clicks || 0).toLocaleString()}</td>
          <td className="px-4 py-3 text-right text-xs text-gray-500">{(ad.ctr || 0).toFixed(2)}%</td>
          <td className="px-4 py-3 text-right text-xs text-gray-500">EGP {(ad.cpc || 0).toFixed(2)}</td>
          <td className="px-4 py-3 text-right"><StatusBadge status={ad.status} /></td>
        </tr>
      )))}
    </>
  );
}

function CampaignRow({ campaign }) {
  const [expanded, setExpanded] = useState(false);
  const [adSets, setAdSets] = useState([]);
  const [loadingAdSets, setLoadingAdSets] = useState(false);

  const toggleAdSets = async () => {
    if (!expanded && adSets.length === 0) {
      setLoadingAdSets(true);
      try {
        const res = await axios.get(`${BACKEND}/api/campaigns/${campaign.id}/adsets`);
        setAdSets(res.data);
      } catch (err) {
        console.error("Failed to fetch ad sets", err);
      } finally {
        setLoadingAdSets(false);
      }
    }
    setExpanded(!expanded);
  };

  const health = calcHealth(campaign);

  return (
    <>
      <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition cursor-pointer" onClick={toggleAdSets}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">{expanded ? "▼" : "▶"}</span>
            <HealthScore score={health} />
          </div>
        </td>
        <td className="px-6 py-4">
          <p className="text-sm font-medium">{campaign.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{campaign.objective}</p>
        </td>
        <td className="px-6 py-4 text-right text-sm">EGP {(campaign.spend || 0).toFixed(2)}</td>
        <td className="px-6 py-4 text-right text-sm">{(campaign.clicks || 0).toLocaleString()}</td>
        <td className="px-6 py-4 text-right text-sm">{(campaign.ctr || 0).toFixed(2)}%</td>
        <td className="px-6 py-4 text-right text-sm">EGP {(campaign.cpc || 0).toFixed(2)}</td>
        <td className="px-6 py-4 text-right"><StatusBadge status={campaign.status} /></td>
      </tr>

      {expanded && (loadingAdSets ? (
        <tr className="bg-gray-900/50">
          <td colSpan={7} className="pl-12 py-2 text-xs text-gray-600">Loading ad sets...</td>
        </tr>
      ) : adSets.map((adSet) => <AdSetRow key={adSet.id} adSet={adSet} />))}
    </>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const businessName = localStorage.getItem("businessName");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchBusiness();
    fetchCampaigns();
  }, []);

  const fetchBusiness = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/business/${userId}`);
      setBusiness(res.data);
      localStorage.setItem("industry", res.data.industry || "business");
    } catch (err) {
      console.error("Failed to fetch business", err);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      await axios.get(`${BACKEND}/api/campaigns/sync?userId=${userId}`);
      const res = await axios.get(`${BACKEND}/api/campaigns?userId=${userId}`);
      setCampaigns(res.data);
      fetchRecommendations(res.data);
      fetchSuggestions(res.data);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const handleConnectMeta = async () => {
    try {
      const res = await axios.get(`${BACKEND}/api/meta/oauth-url?userId=${userId}`);
      window.location.href = res.data.url;
    } catch (err) {
      alert("Failed to get Meta OAuth URL");
    }
  };

  const totalSpend = campaigns.reduce((sum, c) => sum + (c.spend || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const avgCtr = campaigns.length > 0
    ? (campaigns.reduce((sum, c) => sum + (c.ctr || 0), 0) / campaigns.length).toFixed(2)
    : 0;

  const fetchRecommendations = async (campaignData) => {
    if (campaignData.length === 0) return;
    setLoadingRecs(true);
    try {
      const campaignsWithDetails = await Promise.all(
        campaignData.map(async (c) => {
          try {
            const adSetsRes = await axios.get(`${BACKEND}/api/campaigns/${c.id}/adsets`);
            return {
              name: c.name, status: c.status, spend: c.spend || 0,
              clicks: c.clicks || 0, ctr: c.ctr || 0, cpc: c.cpc || 0,
              daily_budget: c.dailyBudget || 0, impressions: c.impressions || 0,
              ad_sets: adSetsRes.data.map((as) => ({
                id: as.id, name: as.name, status: as.status,
                spend: as.spend || 0, clicks: as.clicks || 0,
                ctr: as.ctr || 0, cpc: as.cpc || 0, impressions: as.impressions || 0,
                optimization_goal: as.optimizationGoal || "",
                min_age: as.minAge || 0, max_age: as.maxAge || 0, targeting: as.targeting || "",
              })),
            };
          } catch (err) {
            return {
              name: c.name, status: c.status, spend: c.spend || 0,
              clicks: c.clicks || 0, ctr: c.ctr || 0, cpc: c.cpc || 0,
              daily_budget: c.dailyBudget || 0, impressions: c.impressions || 0, ad_sets: [],
            };
          }
        })
      );
      const payload = {
        industry: business?.industry || localStorage.getItem("industry") || "business",
        target_cpl: business?.targetCpl || 50,
        business_id: userId,
        campaigns: campaignsWithDetails,
      };
      const res = await axios.post(`${AI}/generate-recommendations`, payload);
      setRecommendations(res.data.recommendations);
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  const fetchSuggestions = async (campaignData) => {
    setLoadingSuggestions(true);
    try {
      const res = await axios.post(`${AI}/generate-campaign-suggestions`, {
        business_id: userId,
        industry: localStorage.getItem("industry") || "business",
        existing_campaigns: campaignData.map((c) => ({ name: c.name, objective: c.objective })),
        total_spend: campaignData.reduce((sum, c) => sum + (c.spend || 0), 0),
        avg_ctr: campaignData.length > 0
          ? campaignData.reduce((sum, c) => sum + (c.ctr || 0), 0) / campaignData.length
          : 0,
      });
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error("Failed to fetch suggestions", err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">AdPilot</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{businessName}</span>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition">Logout</button>
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
            <button onClick={fetchCampaigns} className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition">
              🔄 Refresh
            </button>
            <button onClick={() => navigate("/chat")} className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition">
              💬 AI Chat
            </button>
            <button onClick={() => navigate("/copy-generator")} className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition">
              ✨ AI Copy Generator
            </button>
            <button onClick={handleConnectMeta} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition">
              + Connect Account
            </button>
            <button onClick={() => navigate("/create-campaign")} className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition">
              + Create Campaign
            </button>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-1">Total spend</p>
            <p className="text-2xl font-semibold">EGP {totalSpend.toFixed(2)}</p>
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
            <button onClick={handleConnectMeta} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition">
              Connect Meta Account
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs text-gray-400 font-medium px-6 py-4">Health</th>
                  <th className="text-left text-xs text-gray-400 font-medium px-6 py-4">Campaign / Ad Set / Ad</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">Spend</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">Clicks</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">CTR</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">CPC</th>
                  <th className="text-right text-xs text-gray-400 font-medium px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <CampaignRow key={campaign.id} campaign={campaign} />
                ))}
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
              <p className="text-gray-500 text-sm">AI is analyzing your campaigns, ad sets, and ads...</p>
            </div>
          )}

          {!loadingRecs && recommendations.length > 0 && (
            <div className="flex flex-col gap-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${
                    rec.type === "warning" ? "bg-red-500/10 text-red-400" :
                    rec.type === "success" ? "bg-green-500/10 text-green-400" :
                    "bg-blue-500/10 text-blue-400"
                  }`}>
                    {rec.type === "warning" ? "⚠" : rec.type === "success" ? "↑" : "i"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white">{rec.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        rec.level === "campaign" ? "bg-blue-500/10 text-blue-400" :
                        rec.level === "adset" ? "bg-purple-500/10 text-purple-400" :
                        "bg-orange-500/10 text-orange-400"
                      }`}>
                        {rec.level === "campaign" ? "📊 Campaign" : rec.level === "adset" ? "🎯 Ad Set" : "🎨 Ad"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{rec.reasoning}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-gray-500">Confidence: {rec.confidence}%</span>
                    <button className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition">Dismiss</button>
                    <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                      rec.type === "warning" ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" :
                      rec.type === "success" ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" :
                      "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    }`}>
                      {rec.type === "warning" ? "Fix now" : rec.type === "success" ? "Scale" : "Review"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campaign Suggestions */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <h3 className="font-semibold">Campaign Suggestions</h3>
              {loadingSuggestions && <span className="text-xs text-gray-500">Analyzing opportunities...</span>}
            </div>
            <button onClick={() => fetchSuggestions(campaigns)} className="text-xs text-gray-500 hover:text-white transition">
              Refresh
            </button>
          </div>

          {loadingSuggestions && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <p className="text-gray-500 text-sm">AI is finding the best campaign opportunities for you...</p>
            </div>
          )}

          {!loadingSuggestions && suggestions.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {suggestions.map((s, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.type === "retargeting" ? "bg-purple-500/10 text-purple-400" :
                      s.type === "seasonal" ? "bg-orange-500/10 text-orange-400" :
                      s.type === "awareness" ? "bg-blue-500/10 text-blue-400" :
                      s.type === "conversion" ? "bg-green-500/10 text-green-400" :
                      "bg-gray-500/10 text-gray-400"
                    }`}>
                      {s.type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      s.urgency === "high" ? "bg-red-500/10 text-red-400" :
                      s.urgency === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-gray-500/10 text-gray-400"
                    }`}>
                      {s.urgency === "high" ? "🔥 Urgent" : s.urgency === "medium" ? "⏰ Soon" : "📅 Planned"}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{s.title}</p>
                    <p className="text-xs text-gray-400">{s.description}</p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>💰 EGP {s.suggested_budget}/day</span>
                    <span>🎯 Est. CPL: {s.estimated_cpl}</span>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg px-3 py-2">
                    <p className="text-xs text-blue-400">💡 {s.reason}</p>
                  </div>

                  <button
                    onClick={() => navigate("/create-campaign")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-lg transition"
                  >
                    Create this campaign →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;