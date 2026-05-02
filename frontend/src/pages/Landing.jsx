import { Link } from "react-router-dom"

const features = [
  { icon: "🧠", title: "AI Classification",    desc: "Automatically categorizes every transaction using a custom trained ML model." },
  { icon: "🔮", title: "Spending Forecast",    desc: "LSTM neural network predicts your next month's spending based on your history." },
  { icon: "🚨", title: "Anomaly Detection",    desc: "Isolation Forest model flags unusual transactions before they become problems." },
  { icon: "📊", title: "Visual Analytics",     desc: "Beautiful charts and breakdowns to understand your spending patterns." },
]

const stats = [
  { value: "3",     label: "Custom ML Models" },
  { value: "100%",  label: "Classifier Accuracy" },
  { value: "Real",  label: "Time Processing" },
  { value: "Free",  label: "To Use" },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0F1117] text-white">

      {/* ── Navbar ── */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-[#2E3148]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">F</div>
          <span className="font-semibold text-lg">FinanceAI</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login"
            className="px-4 py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors">
            Sign In
          </Link>
          <Link to="/register"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-8 pt-24 pb-20 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
          Powered by Custom Trained ML Models
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Your finances,{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            understood by AI
          </span>
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your bank CSV and let our custom ML models classify transactions,
          detect anomalies, and forecast your future spending — all in seconds.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/register"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-500/25">
            Get Started Free →
          </Link>
          <Link to="/login"
            className="px-8 py-3.5 bg-[#1A1D27] hover:bg-[#222536] text-gray-300 font-semibold rounded-xl border border-[#2E3148] transition-all">
            Sign In
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-[#2E3148] bg-[#1A1D27]">
        <div className="max-w-5xl mx-auto px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-8 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">Built with real ML — not APIs</h2>
        <p className="text-gray-400 text-center mb-14 max-w-xl mx-auto">
          Every model was trained from scratch on real financial data — built for real-world use.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(f => (
            <div key={f.title}
              className="bg-[#1A1D27] border border-[#2E3148] rounded-2xl p-6 hover:border-indigo-500/40 transition-all hover:bg-[#1E2133]">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to understand your money?</h2>
          <p className="text-gray-400 mb-8">Upload your first CSV and get AI insights in under 30 seconds.</p>
          <Link to="/register"
            className="inline-block px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all hover:scale-105">
            Start for Free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#2E3148] px-8 py-6 text-center text-gray-500 text-sm">
        Built with FastAPI · React · scikit-learn · PyTorch · SQLite
      </footer>
    </div>
  )
}