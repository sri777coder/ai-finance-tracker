import { useEffect, useState } from "react"
import { analyticsAPI } from "../services/api"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const COLORS = ["#6366F1","#8B5CF6","#F59E0B","#EF4444","#10B981","#06B6D4"]

const categoryColors = {
  "Food & Dining":    "bg-orange-500/10 text-orange-400",
  "Transport":        "bg-blue-500/10 text-blue-400",
  "Shopping":         "bg-pink-500/10 text-pink-400",
  "Bills & Utilities":"bg-yellow-500/10 text-yellow-400",
  "Entertainment":    "bg-purple-500/10 text-purple-400",
  "Health":           "bg-green-500/10 text-green-400",
}

export default function Analytics() {
  const [summary,      setSummary]      = useState(null)
  const [transactions, setTransactions] = useState([])
  const [anomalies,    setAnomalies]    = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    Promise.all([
      analyticsAPI.getSummary(),
      analyticsAPI.getTransactions(),
      analyticsAPI.getAnomalies()
    ]).then(([s, t, a]) => {
      setSummary(s.data)
      setTransactions(t.data)
      setAnomalies(a.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  const pieData = summary?.category_breakdown
    ? Object.entries(summary.category_breakdown).map(([name, value]) => ({ name, value: Math.round(value) }))
    : []

  const barData = summary?.monthly_trend
    ? Object.entries(summary.monthly_trend).sort().map(([month, value]) => ({
        month: month.slice(5), amount: Math.round(value)
      }))
    : []

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">AI-generated insights from your transactions</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={100} innerRadius={50}
                label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">Monthly Spending</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barSize={20}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `₹${v.toLocaleString()}`} cursor={{ fill: "#F3F4F6" }} />
              <Bar dataKey="amount" fill="#6366F1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomalies */}
      {anomalies.length > 0 && (
        <div className="bg-white rounded-xl border border-red-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-red-500">🚨</span>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Anomalies Detected</h2>
            <span className="ml-auto bg-red-50 text-red-500 text-xs font-medium px-2 py-0.5 rounded-full border border-red-100">
              {anomalies.length} flagged
            </span>
          </div>
          <div className="space-y-2">
            {anomalies.slice(0, 5).map(t => (
              <div key={t.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.date} · {t.category}</p>
                </div>
                <div className="text-red-600 font-bold text-sm">₹{t.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions table */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Recent Transactions</h2>
        <div className="space-y-1">
          {transactions.slice(0, 12).map(t => (
            <div key={t.id} className="flex items-center justify-between py-2.5 px-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-lg">
                  {t.category === "Food & Dining" ? "🍔" :
                   t.category === "Transport" ? "🚗" :
                   t.category === "Shopping" ? "🛍️" :
                   t.category === "Health" ? "💊" :
                   t.category === "Entertainment" ? "🎬" : "💡"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{t.description}</p>
                  <p className="text-xs text-gray-400">{t.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[t.category] || "bg-gray-100 text-gray-500"}`}>
                  {t.category}
                </span>
                <span className="text-sm font-semibold text-gray-800 w-24 text-right">
                  ₹{t.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}