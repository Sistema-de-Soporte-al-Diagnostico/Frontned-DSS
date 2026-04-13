import { useState } from 'react';
import { createPrediction } from '../services/predictionService';
import { addHistoryItem, setLatestResult } from '../utils/storage';

export function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitPrediction = async ({ patient, variablesClinicas }) => {
    setLoading(true);
    setError('');

    try {
      const result = await createPrediction({
        paciente_id: patient.id,
        variables_clinicas: variablesClinicas,
      });

      const historyItem = {
        id: `${result.predictionId}-${Date.now()}`,
        patient,
        variablesClinicas,
        result,
        createdAt: new Date().toISOString(),
      };

      const history = addHistoryItem(historyItem);
      setLatestResult({
        prediction: historyItem.result,
        patient: historyItem.patient,
        historyId: historyItem.id,
      });
      return { result, historyItem, history };
    } catch (err) {
      const message =
        err?.response?.data?.detail || err.message || 'No se pudo procesar la predicción.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitPrediction,
  };
}
