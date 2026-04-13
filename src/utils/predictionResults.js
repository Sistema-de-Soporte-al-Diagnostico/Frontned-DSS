import { normalizeProbability } from './risk';

/** Textos de apoyo UX hasta que el backend envíe recomendaciones clínicas estructuradas. */
export function heuristicRecommendations(riskLevel, probability) {
  const p = normalizeProbability(probability);
  if (riskLevel === 'alto' || p >= 0.75) {
    return [
      'Solicite pruebas complementarias para confirmar el diagnóstico.',
      'Monitoreo estrecho del estado clínico y signos vitales.',
      'Valore derivación a especialista si la evolución es desfavorable.',
    ];
  }
  if (riskLevel === 'medio' || p >= 0.45) {
    return [
      'Repita la evaluación clínica en 24–48 horas.',
      'Documente la evolución de síntomas y la respuesta al tratamiento sintomático.',
    ];
  }
  return [
    'Observación clínica de rutina según criterio profesional.',
    'Reevalúe si aparecen nuevos signos o empeora el cuadro.',
  ];
}

function buildDescription(result, confidencePct) {
  const rawMsg = result?.raw?.mensaje;
  if (typeof rawMsg === 'string' && rawMsg.trim()) {
    return `${rawMsg.trim()} Confianza del modelo: ${confidencePct}%.`;
  }
  return `La red neuronal ha asociado los signos clínicos registrados con «${result.prediction}» como hallazgo principal, con un nivel de confianza del ${confidencePct}%. Este resultado debe interpretarse junto con el examen físico y la historia clínica.`;
}

/** Filas para la UI (hoy una sola; extensible si la API envía `alternativas`). */
export function normalizePredictionRows(record) {
  const r = record?.result;
  if (!r?.prediction) return [];

  const confidence = Math.min(100, Math.max(0, Math.round(normalizeProbability(r.probability) * 100)));

  const rows = [
    {
      disease: r.prediction,
      confidence,
      description: buildDescription(r, confidence),
      recommendations: heuristicRecommendations(r.riskLevel, r.probability),
    },
  ];

  const alt = r.raw?.alternativas;
  if (Array.isArray(alt) && alt.length) {
    alt.forEach((item, idx) => {
      if (typeof item === 'object' && item?.diagnostico) {
        const raw = Number(item.probabilidad);
        const confidencePct = Number.isFinite(raw)
          ? Math.min(100, Math.max(0, Math.round(raw > 1 ? raw : raw * 100)))
          : 0;
        const prob01 = confidencePct / 100;
        rows.push({
          disease: item.diagnostico,
          confidence: confidencePct,
          description: item.descripcion || `Alternativa ${idx + 2} sugerida por el modelo.`,
          recommendations: heuristicRecommendations(
            prob01 >= 0.75 ? 'alto' : prob01 >= 0.45 ? 'medio' : 'bajo',
            prob01,
          ),
        });
      }
    });
  }

  return rows;
}

export function confidenceTier(confidence) {
  if (confidence >= 80) return 'high';
  if (confidence >= 60) return 'mid';
  return 'low';
}
