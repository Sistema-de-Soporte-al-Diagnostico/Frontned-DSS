import { Navigate } from 'react-router-dom';
import { getLatestResult } from '../utils/storage';

export default function PredictionResultRedirect() {
  const historyId = getLatestResult()?.historyId;
  if (!historyId) {
    return <Navigate to="/symptoms" replace />;
  }
  return <Navigate to={`/patients/${historyId}`} replace />;
}
