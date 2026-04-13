import { Link } from 'react-router-dom';
import { formatPercentage } from '../../utils/risk';
import RiskBadge from './RiskBadge';

function formatDate(dateISO) {
  return new Date(dateISO).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function HistoryGrid({ rows }) {
  if (!rows.length) {
    return <div className="card">No hay predicciones registradas todavía.</div>;
  }

  return (
    <div className="dashboard-grid">
      {rows.map((row) => (
        <article key={row.id} className="card" style={{ display: 'grid', gap: '0.65rem' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: 0 }}>{row.patient.name}</h3>
              <p style={{ margin: '0.15rem 0 0', color: 'var(--muted)' }}>{row.patient.speciesLabel}</p>
            </div>
            <RiskBadge level={row.result.riskLevel} />
          </header>

          <div>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>Diagnóstico</p>
            <strong>{row.result.prediction}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>Probabilidad</p>
              <strong>{formatPercentage(row.result.probability)}</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>Fecha</p>
              <strong>{formatDate(row.createdAt)}</strong>
            </div>
          </div>

          <div className="actions-row" style={{ justifyContent: 'flex-end' }}>
            <Link className="btn btn-outline" to={`/patients/${row.id}`}>
              Ver
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
