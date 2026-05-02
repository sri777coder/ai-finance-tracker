import { Link, useLocation, useNavigate } from "react-router-dom"
import useAuthStore from "../store/authStore"

const navItems = [
  { path: "/dashboard", icon: "⊞", label: "Dashboard" },
  { path: "/upload",    icon: "↑", label: "Upload" },
  { path: "/analytics", icon: "◈", label: "Analytics" },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate("/") }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-[#0F1117] flex flex-col justify-between py-6 px-4 shrink-0">

        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 px-3 mb-10">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">F</div>
            <span className="text-white font-semibold text-lg">FinanceAI</span>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const active = pathname === item.path
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${active
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-[#1A1D27] hover:text-white"
                    }`}>
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User info */}
        <div className="border-t border-[#2E3148] pt-4">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.username}</p>
              <p className="text-gray-500 text-xs truncate w-32">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-gray-400 hover:text-red-400 text-sm rounded-lg hover:bg-[#1A1D27] transition-all">
            → Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}