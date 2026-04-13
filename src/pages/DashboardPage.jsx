import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getStoredHistory } from '../utils/storage';

function Icon({ children }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function formatTodayLong() {
  return new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatPatientDate(dateISO) {
  const date = new Date(dateISO);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const time = date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

  if (isSameDay(date, now)) return `Hoy, ${time}`;
  if (isSameDay(date, yesterday)) return `Ayer, ${time}`;

  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

function computeStats(history) {
  const uniquePatients = new Set(history.map((row) => `${row.patient?.name ?? ''}::${row.patient?.ownerId ?? ''}`)).size;

  const now = new Date();
  const todayCount = history.filter((row) => isSameDay(new Date(row.createdAt), now)).length;

  const total = history.length;
  const lowRisk = history.filter((row) => row.result?.riskLevel === 'bajo').length;
  const successRate = total ? Math.round((lowRisk / total) * 100) : 0;

  const highRisk = history.filter((row) => row.result?.riskLevel === 'alto').length;

  return {
    activePatients: uniquePatients,
    todayConsults: todayCount,
    aiDx: total,
    successRate,
    highRisk,
  };
}

function statusFromRow(row) {
  const createdAt = new Date(row.createdAt);
  const now = new Date();
  if (isSameDay(createdAt, now)) return 'Activo';

  const risk = row.result?.riskLevel;
  if (risk === 'alto') return 'Revisión';
  if (risk === 'medio') return 'Seguimiento';
  return 'Completado';
}

function statusColors(status) {
  if (status === 'Activo') return { bg: 'var(--color-success-50)', fg: 'var(--color-success-700)' };
  if (status === 'Revisión') return { bg: 'var(--color-warning-50)', fg: 'var(--color-warning-700)' };
  if (status === 'Seguimiento') return { bg: 'var(--color-primary-50)', fg: 'var(--color-primary-700)' };
  return { bg: 'var(--color-neutral-100)', fg: 'var(--color-neutral-700)' };
}

function statColorPalette(color) {
  const palettes = {
    primary: { bg: 'var(--color-primary-50)', fg: 'var(--color-primary-600)' },
    success: { bg: 'var(--color-success-50)', fg: 'var(--color-success-600)' },
    warning: { bg: 'var(--color-warning-50)', fg: 'var(--color-warning-600)' },
    danger: { bg: 'var(--color-danger-50)', fg: 'var(--color-danger-600)' },
  };
  return palettes[color] || palettes.primary;
}

function SpeciesIcon({ speciesLabel }) {
  const species = (speciesLabel || '').toLowerCase();

  if (species.includes('perro') || species.includes('canino')) {
    return (
      <Icon>
        <path d="M6 10V7a2 2 0 0 1 2-2h1l1-2h4l1 2h1a2 2 0 0 1 2 2v3" />
        <path d="M7 10h10l1 3v5H6v-5l1-3z" />
        <circle cx="10" cy="13" r="1" />
        <circle cx="14" cy="13" r="1" />
      </Icon>
    );
  }

  if (species.includes('gato') || species.includes('felino')) {
    return (
      <Icon>
        <path d="M8 8 6 4 4 8v6a8 8 0 0 0 16 0V8l-2-4-2 4" />
        <circle cx="10" cy="13" r="1" />
        <circle cx="14" cy="13" r="1" />
        <path d="M10 17h4" />
      </Icon>
    );
  }

  return (
    <Icon>
      <path d="M12 2c3 0 4 2 4 4s-1 4-4 4-4-2-4-4 1-4 4-4z" />
      <path d="M4 22c1-4 5-6 8-6s7 2 8 6" />
    </Icon>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const history = getStoredHistory();

  const sorted = [...history].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const recent = sorted.slice(0, 5);
  const stats = computeStats(history);

  const statCards = [
    {
      label: 'Pacientes Activos',
      value: String(stats.activePatients),
      color: 'primary',
      trend: stats.activePatients ? `${stats.activePatients} total` : '—',
      icon: (
        <Icon>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <circle cx="17" cy="8" r="3" />
        </Icon>
      ),
    },
    {
      label: 'Consultas Hoy',
      value: String(stats.todayConsults),
      color: 'success',
      trend: stats.todayConsults ? `+${stats.todayConsults}` : '+0',
      icon: (
        <Icon>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </Icon>
      ),
    },
    {
      label: 'Diagnósticos IA',
      value: String(stats.aiDx),
      color: 'warning',
      trend: stats.highRisk ? `${stats.highRisk} alto` : '0 alto',
      icon: (
        <Icon>
          <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v1" />
          <path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v1" />
          <path d="M8 22v-3" />
          <path d="M16 22v-3" />
          <path d="M9 14h6" />
          <path d="M10 18h4" />
          <path d="M7 11h10" />
        </Icon>
      ),
    },
    {
      label: 'Tasa de Éxito',
      value: `${stats.successRate}%`,
      color: 'danger',
      trend: stats.aiDx ? `${stats.successRate}% bajo` : '—',
      icon: (
        <Icon>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
        </Icon>
      ),
    },
  ];

  return (
    <section className="figma-page dash-stack">
      <div className="dash-header">
        <div>
          <h3 style={{ margin: 0 }}>
            Bienvenido{user?.name ? `, ${user.name}` : ''}
          </h3>
          <p className="dash-subtitle">Hoy es {formatTodayLong()}</p>
        </div>

        <Link to="/patients/new" className="btn-gradient" style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Icon>
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </Icon>
          </span>
          Nuevo Paciente
        </Link>
      </div>

      <div className="stat-grid">
        {statCards.map((stat) => {
          const palette = statColorPalette(stat.color);
          return (
            <div key={stat.label} className="stat-card">
              <div className="stat-top">
                <div className="stat-icon" style={{ background: palette.bg, color: palette.fg }}>
                  {stat.icon}
                </div>
                <span className="pill" style={{ background: 'var(--color-success-50)', color: 'var(--color-success-700)' }}>
                  {stat.trend}
                </span>
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="list-card">
        <div className="list-head">
          <h4 style={{ margin: 0 }}>Pacientes Recientes</h4>
          <Link className="login-link" to="/history">
            Ver todos
          </Link>
        </div>

        {recent.length ? (
          <div>
            {recent.map((row) => {
              const status = statusFromRow(row);
              const colors = statusColors(status);
              const speciesLabel = row.patient?.speciesLabel || row.patient?.species || '—';
              const breed = row.patient?.breed || '—';

              return (
                <div key={row.id} className="list-item">
                  <div className="avatar" aria-hidden="true">
                    <SpeciesIcon speciesLabel={speciesLabel} />
                  </div>

                  <div className="list-meta">
                    <div className="list-name">{row.patient?.name || 'Paciente'}</div>
                    <div className="list-sub">
                      {speciesLabel} • {breed}
                    </div>
                  </div>

                  <div className="list-date">{formatPatientDate(row.createdAt)}</div>

                  <div>
                    <span className="badge" style={{ background: colors.bg, color: colors.fg }}>
                      {status}
                    </span>
                  </div>

                  <Link className="icon-btn" to={`/patients/${row.id}`} aria-label="Ver detalle">
                    <Icon>
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </Icon>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
            Aún no hay pacientes evaluados.
          </div>
        )}
      </div>
    </section>
  );
}
