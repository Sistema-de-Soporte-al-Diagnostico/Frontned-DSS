const LABELS = {
  alto: 'Riesgo alto',
  medio: 'Riesgo medio',
  bajo: 'Riesgo bajo',
};

export default function RiskBadge({ level }) {
  const normalized = (level || 'bajo').toLowerCase();
  const className = `risk-badge ${normalized}`;

  return <span className={className}>{LABELS[normalized] || 'Riesgo bajo'}</span>;
}
