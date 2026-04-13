import { getRiskLevel, normalizeProbability } from '../utils/risk';
import httpClient from './httpClient';

export async function createPrediction(payload) {
  const response = await httpClient.post('/predecir/', payload);
  const data = response.data;

  const probability =
    typeof data.probabilidad_porcentaje === 'number'
      ? data.probabilidad_porcentaje / 100
      : normalizeProbability(data.probability ?? 0);

  return {
    predictionId: data.prediccion_id,
    prediction: data.diagnostico,
    probability,
    riskLevel: data.risk_level || getRiskLevel(probability),
    raw: data,
  };
}
