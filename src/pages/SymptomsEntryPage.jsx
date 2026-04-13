import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import Loader from '../components/common/Loader';
import { CLINICAL_FIELDS, SPECIES_OPTIONS } from '../constants/clinicalFields';
import { usePrediction } from '../hooks/usePrediction';
import { clearDraftPatient, getDraftPatient } from '../utils/storage';

const defaultClinical = CLINICAL_FIELDS.reduce((acc, field) => {
  acc[field.key] = field.defaultValue;
  return acc;
}, {});

function speciesLabel(value) {
  return SPECIES_OPTIONS.find((item) => item.value === value)?.label || 'No definido';
}

function groupByCategory(fields) {
  return fields.reduce((acc, field) => {
    const category = field.category || 'Otros';
    acc[category] = acc[category] || [];
    acc[category].push(field);
    return acc;
  }, {});
}

function isBinarySelect(field) {
  if (field.type !== 'select' || !Array.isArray(field.options) || field.options.length !== 2) return false;
  const optionValues = field.options.map((opt) => Number(opt.value));
  return optionValues.includes(0) && optionValues.includes(1);
}

function categoryColor(category) {
  const map = {
    'Sistema digestivo': 'primary',
    'Sistema respiratorio': 'success',
    'Sistema nervioso': 'warning',
    'Piel y pelaje': 'danger',
    'Ojos y oídos': 'primary',
    Comportamiento: 'success',
    Paciente: 'primary',
    'Signos vitales': 'warning',
    'Sistema Digestivo': 'primary',
    'Sistema Respiratorio': 'success',
    'Sistema Nervioso': 'warning',
    'Piel y Pelaje': 'danger',
    'Ojos y Oídos': 'primary',
  };

  return map[category] || 'primary';
}

function Icon({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function validateClinical(values) {
  const errors = {};

  CLINICAL_FIELDS.forEach((field) => {
    const value = values[field.key];

    if (field.required && (value === '' || Number.isNaN(value))) {
      errors[field.key] = 'Campo obligatorio';
      return;
    }

    if (typeof field.min === 'number' && value < field.min) {
      errors[field.key] = `Debe ser mayor o igual a ${field.min}`;
      return;
    }

    if (typeof field.max === 'number' && value > field.max) {
      errors[field.key] = `Debe ser menor o igual a ${field.max}`;
    }
  });

  return errors;
}

export default function SymptomsEntryPage() {
  const navigate = useNavigate();
  const { submitPrediction, loading: predictionLoading, error: predictionError } = usePrediction();
  const draftPatient = getDraftPatient();

  const [clinicalValues, setClinicalValues] = useState(defaultClinical);
  const [clinicalErrors, setClinicalErrors] = useState({});
  const [error, setError] = useState('');

  const groupedFields = useMemo(() => groupByCategory(CLINICAL_FIELDS), []);
  const binaryFields = useMemo(
    () => CLINICAL_FIELDS.filter((field) => isBinarySelect(field) && field.key !== 'especie'),
    [],
  );
  const selectedSymptoms = useMemo(
    () => binaryFields.filter((field) => Number(clinicalValues[field.key]) === 1).map((field) => field.label),
    [binaryFields, clinicalValues],
  );

  const canSubmit = useMemo(
    () => !predictionLoading && selectedSymptoms.length > 0,
    [predictionLoading, selectedSymptoms.length],
  );

  if (!draftPatient) {
    return <Navigate to="/patients/new" replace />;
  }

  const handleClinicalChange = (key, value) => {
    setClinicalValues((prev) => ({ ...prev, [key]: value }));
    setClinicalErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const clearSelectedSymptoms = () => {
    setClinicalValues((prev) => {
      const next = { ...prev };
      binaryFields.forEach((field) => {
        next[field.key] = 0;
      });
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validation = validateClinical(clinicalValues);
    if (Object.keys(validation).length) {
      setClinicalErrors(validation);
      setError('Corrige los campos clínicos para continuar.');
      return;
    }

    try {
      const patient = {
        ...draftPatient,
        speciesLabel: speciesLabel(clinicalValues.especie),
      };

      await submitPrediction({
        patient,
        variablesClinicas: clinicalValues,
      });

      clearDraftPatient();
      navigate('/predictions/result');
    } catch (err) {
      setError(err.message || 'No se pudo completar el análisis de síntomas.');
    }
  };

  return (
    <section className="card form-page figma-page symptoms-shell">
      <header className="symptoms-head">
        <div>
          <h2>Selección de Signos Clínicos</h2>
          <p>
            Marque todos los síntomas observados en el paciente: <strong>{draftPatient.name}</strong>
          </p>
        </div>
        <div className="symptoms-counter">
          <div className="value">{selectedSymptoms.length}</div>
          <div className="label">Seleccionados</div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="form-stack">
        <div className="symptom-grid">
          {Object.entries(groupedFields).map(([category, fields]) => {
            const color = categoryColor(category);
            return (
              <section key={category} className="symptom-card">
                <div className={`symptom-card-title color-${color}`}>{category}</div>
                <div className="symptom-card-body">
                  {fields.map((field) => {
                    const fieldError = clinicalErrors[field.key];

                    if (isBinarySelect(field) && field.key !== 'especie') {
                      const checked = Number(clinicalValues[field.key]) === 1;

                      return (
                        <label key={field.key} className="symptom-check-row">
                          <span className={`symptom-check ${checked ? `checked color-${color}` : ''}`}>
                            {checked ? (
                              <Icon>
                                <polyline points="20 6 9 17 4 12" />
                              </Icon>
                            ) : null}
                            <input
                              type="checkbox"
                              className="symptom-hidden-input"
                              checked={checked}
                              onChange={() => handleClinicalChange(field.key, checked ? 0 : 1)}
                            />
                          </span>
                          <span className={`symptom-label ${checked ? 'active' : ''}`}>{field.label}</span>
                        </label>
                      );
                    }

                    if (field.type === 'select') {
                      return (
                        <div key={field.key} className="form-group">
                          <label htmlFor={field.key}>{field.label}</label>
                          <select
                            id={field.key}
                            className="input-control"
                            value={clinicalValues[field.key]}
                            onChange={(event) => handleClinicalChange(field.key, Number(event.target.value))}
                          >
                            {field.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {fieldError ? <small className="field-error">{fieldError}</small> : null}
                        </div>
                      );
                    }

                    return (
                      <div key={field.key} className="form-group">
                        <label htmlFor={field.key}>{field.label}</label>
                        <input
                          id={field.key}
                          type="number"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          className="input-control"
                          value={clinicalValues[field.key]}
                          onChange={(event) => {
                            const raw = event.target.value;
                            handleClinicalChange(field.key, raw === '' ? '' : Number(raw));
                          }}
                        />
                        {fieldError ? <small className="field-error">{fieldError}</small> : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {selectedSymptoms.length ? (
          <section className="symptoms-summary">
            <div className="symptoms-summary-icon">
              <Icon>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </Icon>
            </div>
            <div>
              <div className="symptoms-summary-title">Síntomas seleccionados:</div>
              <div className="symptoms-summary-text">{selectedSymptoms.join(', ')}</div>
            </div>
          </section>
        ) : null}

        <ErrorMessage message={error || predictionError} />

        <div className="actions-row actions-end symptoms-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/patients/new')}>
            Volver a paciente
          </button>
          <button type="button" className="btn btn-outline" onClick={clearSelectedSymptoms}>
            Limpiar selección
          </button>
          <button type="submit" className="btn-gradient symptoms-submit" disabled={!canSubmit}>
            <span className="symptoms-submit-icon" aria-hidden="true">
              <Icon>
                <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v1" />
                <path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v1" />
                <path d="M8 22v-3" />
                <path d="M16 22v-3" />
                <path d="M9 14h6" />
                <path d="M10 18h4" />
              </Icon>
            </span>
            {predictionLoading ? 'Analizando...' : 'Analizar con IA'}
          </button>
        </div>
      </form>

      {predictionLoading ? <Loader text="Procesando síntomas..." /> : null}
    </section>
  );
}
