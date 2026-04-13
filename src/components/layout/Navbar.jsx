import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div>
        <h1>SIS-IA-VET</h1>
        <p>Sistema de soporte al diagnóstico veterinario</p>
      </div>

      <div className="navbar-right">
        <span className="user-pill">
          {user?.name} · {user?.role === 'admin' ? 'Administrador' : 'Veterinario'}
        </span>
        <NavLink className="btn btn-outline" to="/patients/new">
          Registrar paciente
        </NavLink>
        <button type="button" className="btn btn-danger" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
