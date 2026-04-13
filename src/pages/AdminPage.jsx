import { getStoredHistory } from '../utils/storage';

export default function AdminPage() {
  const history = getStoredHistory();
  const highRisk = history.filter((item) => item.result.riskLevel === 'alto').length;

  return (
    <section className="dashboard-grid">
      <article className="card">
        <h2>Panel administrador</h2>
        <p>Vista operativa para seguimiento clínico y priorización de casos.</p>
      </article>

      <article className="card">
        <h2>Métricas rápidas</h2>
        <p>
          Total predicciones: <strong>{history.length}</strong>
        </p>
        <p>
          Casos de riesgo alto: <strong>{highRisk}</strong>
        </p>
      </article>
    </section>
  );
}
