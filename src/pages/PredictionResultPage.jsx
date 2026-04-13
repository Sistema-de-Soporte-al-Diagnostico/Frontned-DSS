import { Link, Navigate, useLocation } from 'react-router-dom';
import PredictionCard from '../components/common/PredictionCard';
import { getLatestResult } from '../utils/storage';

export default function PredictionResultPage() {
  const location = useLocation();
  const latest = getLatestResult();
  const { prediction, patient, historyId } = location.state || latest || {};

  if (!prediction || !patient) {
    return <Navigate to="/symptoms" replace />;
  }

  return (
    <section className="result-page">
      <PredictionCard prediction={prediction} />

      <article className="card">
        <h2>Paciente evaluado</h2>
        <p>
          <strong>Nombre:</strong> {patient.name}
        </p>
        <p>
          <strong>Especie:</strong> {patient.species}
        </p>
        <p>
          <strong>Raza:</strong> {patient.breed}
        </p>
        <p>
          <strong>Edad:</strong> {patient.age} años
        </p>

        <div className="actions-row">
          <Link className="btn btn-primary" to="/patients/new">
            Registrar otro paciente
          </Link>
          <Link className="btn btn-outline" to={`/patients/${historyId}`}>
            Ver detalle
          </Link>
        </div>
      </article>
    </section>
  );
}
