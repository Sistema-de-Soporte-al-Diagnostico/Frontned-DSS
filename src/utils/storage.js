const HISTORY_KEY = 'sis_ia_vet_history';
const DRAFT_PATIENT_KEY = 'sis_ia_vet_draft_patient';
const LATEST_RESULT_KEY = 'sis_ia_vet_latest_result';

export function getStoredHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function addHistoryItem(item) {
  const history = getStoredHistory();
  const updated = [item, ...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  saveHistory(updated);
  return updated;
}

export function setDraftPatient(patient) {
  localStorage.setItem(DRAFT_PATIENT_KEY, JSON.stringify(patient));
}

export function getDraftPatient() {
  try {
    const raw = localStorage.getItem(DRAFT_PATIENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraftPatient() {
  localStorage.removeItem(DRAFT_PATIENT_KEY);
}

export function setLatestResult(payload) {
  localStorage.setItem(LATEST_RESULT_KEY, JSON.stringify(payload));
}

export function getLatestResult() {
  try {
    const raw = localStorage.getItem(LATEST_RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
