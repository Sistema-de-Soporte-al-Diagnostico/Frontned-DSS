import { Navigate, useParams } from 'react-router-dom';
import PatientPredictionDetailView from '../components/patient/PatientPredictionDetailView';
import { getStoredHistory } from '../utils/storage';

export default function PatientDetailPage() {
  const { patientId } = useParams();
  const record = getStoredHistory().find((item) => item.id === patientId);

  if (!record) {
    return <Navigate to="/history" replace />;
  }

  return <PatientPredictionDetailView record={record} />;
}
