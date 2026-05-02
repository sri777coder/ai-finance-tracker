import { useEffect, useState } from "react"
import { analyticsAPI } from "../services/api"
import { Link } from "react-router-dom"

const categoryColors = {
  "Food & Dining":    "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Transport":        "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Shopping":         "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Bills & Utilities":"bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "Entertainment":    "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Health":           "bg-green-500/10 text-green-400 border-green-500/20",
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([analyticsAPI.getSummary(), analyticsAPI.getTransactions()])
      .then(([s, t]) => { setSummary(s.data); setTransactions(t.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    </div>
  )

  if (!summary || summary.message) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">📂</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">No data yet</h2>
        <p className="text-gray-400 mb-6 text-sm">Upload a CSV file to see your AI-powered financial insights</p>
        <Link to="/upload"
          className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-colors">
          Upload CSV →
        </Link>
      </div>
    </div>
  )

  const cards = [
    { label: "Total Spent",        value: `₹${summary.total_spent?.toLocaleString()}`,         icon: "💸", color: "indigo" },
    { label: "Monthly Average",    value: `₹${summary.avg_monthly?.toLocaleString()}`,          icon: "📅", color: "purple" },
    { label: "Next Month Forecast",value: `₹${summary.forecast_next_month?.toLocaleString()}`,  icon: "🔮", color: "blue" },
    { label: "Anomalies Found",    value: summary.anomaly_count,                                icon: "🚨", color: "red" },
  ]

  const colorMap = {
    indigo: "border-indigo-500/20 bg-indigo-500/5",
    purple: "border-purple-500/20 bg-purple-500/5",
    blue:   "border-blue-500/20 bg-blue-500/5",
    red:    "border-red-500/20 bg-red-500/5",
  }

  const textMap = {
    indigo: "text-indigo-400",
    purple: "text-purple-400",
    blue:   "text-blue-400",
    red:    "text-red-400",
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Your AI-powered financial overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map(card => (
          <div key={card.label}
            className={`bg-white rounded-xl border p-5 ${colorMap[card.color]}`}>
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{card.label}</span>
              <span className="text-xl">{card.icon}</span>
            </div>
            <div className={`text-2xl font-bold ${textMap[card.color]}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Top Category + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Category */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Top Category</h2>
          <div className="text-2xl font-bold text-gray-800 mb-1">{summary.top_category}</div>
          <p className="text-gray-400 text-sm">Highest spending category</p>
          <Link to="/analytics" className="inline-block mt-4 text-indigo-500 text-sm hover:text-indigo-600 font-medium">
            View full breakdown →
          </Link>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {transactions.slice(0, 6).map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
                    {t.category === "Food & Dining" ? "🍔" :
                     t.category === "Transport" ? "🚗" :
                     t.category === "Shopping" ? "🛍️" :
                     t.category === "Health" ? "💊" :
                     t.category === "Entertainment" ? "🎬" : "💡"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate w-48">{t.description}</p>
                    <p className="text-xs text-gray-400">{t.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">₹{t.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[t.category] || "bg-gray-100 text-gray-500"}`}>
                    {t.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}