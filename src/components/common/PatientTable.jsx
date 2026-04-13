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

export default function PatientTable({ rows }) {
  if (!rows.length) {
    return <div className="card empty-state">No hay predicciones registradas todavía.</div>;
  }

  return (
    <div className="card table-wrapper">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Especie</th>
            <th>Diagnóstico</th>
            <th>Probabilidad</th>
            <th>Riesgo</th>
            <th>Fecha</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.patient.name}</td>
              <td>{row.patient.speciesLabel}</td>
              <td>{row.result.prediction}</td>
              <td>{formatPercentage(row.result.probability)}</td>
              <td>
                <RiskBadge level={row.result.riskLevel} />
              </td>
              <td>{formatDate(row.createdAt)}</td>
              <td>
                <Link className="inline-link" to={`/patients/${row.id}`}>
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
