import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Share2,
  Sparkles,
} from 'lucide-react';
import { fetchCompatPredictionDetail } from '../../services/predictionService';
import { confidenceTier, normalizePredictionRows } from '../../utils/predictionResults';

export default function PatientPredictionDetailView({ record }) {
  const [feedback, setFeedback] = useState('');
  const [actionBusy, setActionBusy] = useState(false);

  const patient = record.patient;
  const patientName = patient?.name || 'Paciente';
  const speciesLine = patient?.speciesLabel || patient?.species || '—';
  const results = normalizePredictionRows(record);
  const predictionId = record.result?.predictionId;

  const showFeedback = useCallback((message) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 5000);
  }, []);

  const handlePrintReport = useCallback(() => {
    window.print();
  }, []);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = `Resultados IA — ${patientName}`;
    const text = `Análisis con IA para ${patientName}.`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        showFeedback('Compartido correctamente.');
      } catch (err) {
        if (err?.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(url);
            showFeedback('Enlace copiado al portapapeles.');
          } catch {
            showFeedback('No se pudo compartir ni copiar el enlace.');
          }
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      showFeedback('Enlace copiado al portapapeles.');
    } catch {
      showFeedback('No se pudo copiar el enlace.');
    }
  }, [patientName, showFeedback]);

  const handleSaveVerify = useCallback(async () => {
    if (!predictionId) {
      showFeedback('No hay identificador de predicción para verificar en el servidor.');
      return;
    }
    setActionBusy(true);
    try {
      await fetchCompatPredictionDetail(predictionId);
      showFeedback(
        'El diagnóstico ya fue guardado en el servidor al analizar. Verificación en línea correcta.',
      );
    } catch (err) {
      const detail = err?.response?.data?.detail || err.message;
      showFeedback(
        typeof detail === 'string'
          ? `No se pudo verificar en el servidor: ${detail}`
          : 'No se pudo verificar en el servidor.',
      );
    } finally {
      setActionBusy(false);
    }
  }, [predictionId, showFeedback]);

  return (
    <div className="patient-prediction-page">
      <div className="results-ai-header">
        <div className="results-ai-header-inner">
          <div className="results-ai-icon-wrap" aria-hidden="true">
            <Sparkles size={32} strokeWidth={2} />
          </div>
          <div className="results-ai-header-text">
            <h2 className="results-ai-title">Resultados del Análisis con IA</h2>
            <p className="results-ai-subtitle">
              La red neuronal ha procesado los signos clínicos y generado las siguientes predicciones
              ordenadas por nivel de confianza. Paciente: <strong>{patientName}</strong>
            </p>
          </div>
        </div>
      </div>

      <article className="card results-patient-summary">
        <h3 className="results-section-title">Datos del paciente</h3>
        <div className="results-patient-grid">
          <p>
            <strong>Nombre:</strong> {patientName}
          </p>
          <p>
            <strong>Especie:</strong> {speciesLine}
          </p>
          <p>
            <strong>Raza:</strong> {patient?.breed ?? '—'}
          </p>
          {patient?.age != null && patient.age !== '' ? (
            <p>
              <strong>Edad:</strong> {patient.age} años
            </p>
          ) : null}
          <p>
            <strong>ID propietario:</strong> {patient?.ownerId ?? '—'}
          </p>
        </div>
      </article>

      <div className="results-disease-list">
        {results.length === 0 ? (
          <article className="card">
            <p className="results-disease-description" style={{ margin: 0 }}>
              No hay resultado de predicción asociado a este registro.
            </p>
          </article>
        ) : null}
        {results.map((result, index) => {
          const tier = confidenceTier(result.confidence);
          return (
            <article key={`${result.disease}-${index}`} className="card results-disease-card">
              <div className="results-disease-card-head">
                <div className="results-disease-title-block">
                  <div className="results-disease-title-row">
                    <h4 className="results-disease-name">{result.disease}</h4>
                    {index === 0 ? (
                      <span className="results-badge-top">Mayor probabilidad</span>
                    ) : null}
                  </div>
                </div>
                <div className="results-confidence-pct">
                  <div className="results-confidence-value">{result.confidence}%</div>
                  <div className="results-confidence-label">Confianza</div>
                </div>
              </div>

              <div className="results-confidence-bar-wrap">
                <div className="results-confidence-bar-bg">
                  <div
                    className={`results-confidence-fill results-confidence-fill--${tier}`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>

              <p className="results-disease-description">{result.description}</p>

              <div className="results-rec-block">
                <div className="results-rec-title">Recomendaciones:</div>
                <ul className="results-rec-list">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="results-rec-item">
                      <CheckCircle2
                        className="results-rec-icon"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      <div className="results-disclaimer">
        <AlertCircle className="results-disclaimer-icon" size={20} strokeWidth={2} aria-hidden="true" />
        <div className="results-disclaimer-text">
          <strong>Importante:</strong> Estos resultados son una herramienta de apoyo al diagnóstico.
          Siempre confirme con exámenes clínicos y su criterio profesional antes de establecer un
          tratamiento.
        </div>
      </div>

      <article className="card">
        <h3 className="results-section-title">Variables clínicas enviadas</h3>
        <ul className="clinical-list">
          {Object.entries(record.variablesClinicas || {}).map(([key, value]) => (
            <li key={key}>
              <span>{key}</span>
              <strong>{String(value)}</strong>
            </li>
          ))}
        </ul>
      </article>

      {feedback ? (
        <p className="results-action-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <div className="results-actions-bar no-print">
        <button type="button" className="results-action-btn results-action-btn-outline" onClick={handlePrintReport}>
          <FileText size={20} aria-hidden="true" />
          Generar Reporte
        </button>
        <button type="button" className="results-action-btn results-action-btn-outline" onClick={handleShare}>
          <Share2 size={20} aria-hidden="true" />
          Compartir
        </button>
        <button
          type="button"
          className="results-action-btn results-action-btn-primary"
          onClick={handleSaveVerify}
          disabled={actionBusy}
        >
          <Download size={20} aria-hidden="true" />
          {actionBusy ? 'Verificando…' : 'Guardar Diagnóstico'}
        </button>
      </div>

      <div className="results-footer-links no-print">
        <Link className="btn btn-outline" to="/patients/new">
          Registrar otro paciente
        </Link>
        <Link className="btn btn-outline" to="/history">
          Volver al historial
        </Link>
      </div>
    </div>
  );
}
