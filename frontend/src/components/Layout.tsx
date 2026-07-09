import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface NavItem {
  to: string
  label: string
  icon: string
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: '▦', end: true },
  { to: '/usuarios', label: 'Usuarios', icon: '◉' },
  { to: '/docentes', label: 'Docentes', icon: '✦' },
  { to: '/estudiantes', label: 'Estudiantes', icon: '◆' },
  { to: '/cursos', label: 'Cursos', icon: '▤' },
  { to: '/matriculas', label: 'Matrículas', icon: '⇄' },
  { to: '/constancia', label: 'Constancia', icon: '🗎' },
]

export function Layout() {
  const { logout } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-text">SISMAT</span>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>

      <div className="content-area">
        <header className="topbar">
          <div>
            <h1>Sistema de Matrícula</h1>
            <p>Escuela Profesional de Ingeniería de Sistemas — UNSA</p>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
