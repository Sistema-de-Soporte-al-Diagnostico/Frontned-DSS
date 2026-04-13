export function normalizeProbability(probability) {
  if (probability > 1) {
    return Math.min(probability / 100, 1);
  }
  return Math.max(probability, 0);
}

export function getRiskLevel(probability) {
  const normalized = normalizeProbability(probability);
  if (normalized >= 0.75) return 'alto';
  if (normalized >= 0.45) return 'medio';
  return 'bajo';
}

export function formatPercentage(probability) {
  return `${(normalizeProbability(probability) * 100).toFixed(2)}%`;
}
