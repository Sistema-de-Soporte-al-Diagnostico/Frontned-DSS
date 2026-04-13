import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import Loader from '../components/common/Loader';
import { useAuth } from '../hooks/useAuth';

function Icon({ children }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function StethoscopeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 2v6a4 4 0 0 0 8 0V2" />
      <path d="M8 15a4 4 0 0 0 8 0v-3" />
      <path d="M16 12V8" />
      <circle cx="18" cy="8" r="2" />
    </svg>
  );
}

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(true);
  const [form, setForm] = useState({
    email: 'vet@clinica.com',
    password: 'Vet12345',
  });

  const destination = location.state?.from || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(form, { remember });
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.');
    }
  };

  return (
    <main className="login-page">
      <section className="card login-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            className="login-logo"
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700))',
              boxShadow: '0 10px 22px rgba(37, 99, 235, 0.25)',
              marginBottom: '0.9rem',
            }}
          >
            <StethoscopeIcon />
          </div>
          <h2 style={{ margin: 0 }}>VetDiagnosis AI</h2>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--color-text-secondary)' }}>
            Sistema de Soporte al Diagnóstico Veterinario
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form-stack">
          <div>
            <label className="input-label" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <Icon>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </Icon>
              </span>
              <input
                id="email"
                type="email"
                placeholder="veterinario@clinica.com"
                className="input-control with-left"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="password">
              Contraseña
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <Icon>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </Icon>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-control with-left with-right"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <Icon>
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a21.78 21.78 0 0 1 5.06-6.94" />
                      <path d="M1 1l22 22" />
                      <path d="M9.9 9.9a3 3 0 0 0 4.24 4.24" />
                      <path d="M14.12 14.12 9.88 9.88" />
                      <path d="M12 4c7 0 10 8 10 8a21.66 21.66 0 0 1-4.24 5.94" />
                    </>
                  ) : (
                    <>
                      <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  )}
                </Icon>
              </button>
            </div>
          </div>

          <div className="login-links">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>Recordarme</span>
            </label>

            <a
              className="login-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setError('Recuperación de contraseña aún no implementada.');
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <ErrorMessage message={error} />

          <button type="submit" className="btn-gradient" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            ¿No tienes una cuenta?{' '}
            <a
              className="login-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setError('El registro/solicitud de acceso aún no está habilitado en esta versión.');
              }}
            >
              Solicitar Acceso
            </a>
          </div>
        </form>

        {loading ? <Loader text="Validando credenciales..." /> : null}
      </section>
    </main>
  );
}
