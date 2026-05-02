import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authAPI } from "../services/api"
import useAuthStore from "../store/authStore"

export default function Login() {
  const [form, setForm]     = useState({ email: "", password: "" })
  const [error, setError]   = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await authAPI.login(form)
      login(res.data.user, res.data.access_token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0F1117] flex">

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[#1A1D27] border-r border-[#2E3148] flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white">F</div>
          <span className="text-white font-semibold text-lg">FinanceAI</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            AI-powered<br />financial clarity
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            3 custom ML models working together to classify, forecast, and protect your finances.
          </p>
        </div>
        <p className="text-gray-600 text-sm">Built with PyTorch · scikit-learn · FastAPI</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 mb-8 text-sm">Sign in to your account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">EMAIL</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-[#1A1D27] border border-[#2E3148] text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                required />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium mb-1.5 block">PASSWORD</label>
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-[#1A1D27] border border-[#2E3148] text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 mt-2">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            No account?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Create one
            </Link>
          </p>
          <p className="text-center mt-4">
            <Link to="/" className="text-gray-600 hover:text-gray-400 text-xs">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}