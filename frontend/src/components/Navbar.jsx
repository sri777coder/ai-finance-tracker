import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../store/authStore"

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate("/login") }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-blue-600">💰 FinanceAI</span>
          <div className="flex gap-6">
            <Link to="/"         className="text-gray-600 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/upload"   className="text-gray-600 hover:text-blue-600 font-medium">Upload</Link>
            <Link to="/analytics"className="text-gray-600 hover:text-blue-600 font-medium">Analytics</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">👤 {user?.username}</span>
          <button onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}