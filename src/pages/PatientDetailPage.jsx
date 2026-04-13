import { Navigate, useParams } from 'react-router-dom';
import PredictionCard from '../components/common/PredictionCard';
import { getStoredHistory } from '../utils/storage';

export default function PatientDetailPage() {
  const { patientId } = useParams();
  const record = getStoredHistory().find((item) => item.id === patientId);

  if (!record) {
    return <Navigate to="/history" replace />;
  }

  return (
    <section className="patient-detail-grid">
      <PredictionCard prediction={record.result} />

      <article className="card">
        <h2>Detalle del paciente</h2>
        <p>
          <strong>Nombre:</strong> {record.patient.name}
        </p>
        <p>
          <strong>Especie clínica:</strong> {record.patient.species}
        </p>
        <p>
          <strong>Raza:</strong> {record.patient.breed}
        </p>
        <p>
          <strong>ID propietario:</strong> {record.patient.ownerId}
        </p>
      </article>

      <article className="card">
        <h2>Variables clínicas enviadas</h2>
        <ul className="clinical-list">
          {Object.entries(record.variablesClinicas).map(([key, value]) => (
            <li key={key}>
              <span>{key}</span>
              <strong>{String(value)}</strong>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
