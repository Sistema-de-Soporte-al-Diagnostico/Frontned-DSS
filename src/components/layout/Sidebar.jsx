import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const menu = [
  { to: '/login', label: 'Login / Autenticación' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/patients/new', label: 'Registro de Paciente' },
  { to: '/symptoms', label: 'Ingreso de Síntomas' },
  { to: '/predictions/result', label: 'Resultados de Predicción' },
  { to: '/history', label: 'Historial de Pacientes' },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <nav>
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}
          >
            {item.label}
          </NavLink>
        ))}

        {isAdmin ? (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}
          >
            Panel administrador
          </NavLink>
        ) : null}
      </nav>
    </aside>
  );
}
