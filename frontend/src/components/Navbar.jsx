import { NavLink } from 'react-router-dom'
import { Mic, Video, BarChart3, History } from 'lucide-react'

function Navbar() {
  const linkBase =
    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition"

  const linkInactive =
    "text-gray-600 hover:text-blue-600 hover:bg-blue-50"

  const linkActive =
    "text-blue-600 bg-blue-100"

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">

        {/* BRAND */}
        <NavLink to="/" className="flex items-center gap-3 font-semibold text-lg text-gray-900">
          <Mic className="text-blue-600 w-7 h-7" />
          <span>Habla Bien IA</span>
        </NavLink>

        {/* LINKS */}
        <div className="flex items-center gap-2">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/camera"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <Video size={18} />
            <span className="hidden sm:inline">Grabar</span>
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <BarChart3 size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </NavLink>

          <NavLink
            to="/historial"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <History size={18} />
            <span className="hidden sm:inline">Historial</span>
          </NavLink>

        </div>
      </div>
    </nav>
  )
}

export default Navbar