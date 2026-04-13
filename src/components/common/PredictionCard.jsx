import { formatPercentage } from '../../utils/risk';
import RiskBadge from './RiskBadge';

export default function PredictionCard({ prediction }) {
  if (!prediction) return null;

  const isPositive = prediction.prediction?.toLowerCase().includes('enfer');
  const probability = typeof prediction.probability === 'number' ? prediction.probability : 0;
  const pct = Math.max(0, Math.min(100, Math.round(probability * 100)));

  return (
    <section className="card prediction-card" aria-live="polite" style={{ display: 'grid', gap: '0.9rem' }}>
      <header className="prediction-header">
        <div>
          <h2 style={{ margin: 0 }}>Resultados de Predicción</h2>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--muted)' }}>Salida del modelo IA y nivel de riesgo.</p>
        </div>
        <RiskBadge level={prediction.riskLevel} />
      </header>

      <div className="prediction-main">
        <p className="prediction-label">Diagnóstico estimado</p>
        <p className={`prediction-value ${isPositive ? 'alert' : 'healthy'}`}>{prediction.prediction}</p>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.75rem' }}>
          <p style={{ margin: 0, color: 'var(--muted)' }}>Probabilidad de enfermedad</p>
          <strong style={{ fontSize: '1.25rem' }}>{formatPercentage(probability)}</strong>
        </div>
        <div
          style={{
            marginTop: '0.5rem',
            background: 'var(--border)',
            borderRadius: 999,
            overflow: 'hidden',
            height: 10,
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: isPositive ? 'var(--danger)' : 'var(--success)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
