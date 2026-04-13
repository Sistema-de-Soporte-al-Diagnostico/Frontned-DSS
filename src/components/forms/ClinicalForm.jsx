import { CLINICAL_FIELDS } from '../../constants/clinicalFields';

function toNumber(value) {
  return Number(value);
}

function groupByCategory(fields) {
  return fields.reduce((acc, field) => {
    const category = field.category || 'Otros';
    acc[category] = acc[category] || [];
    acc[category].push(field);
    return acc;
  }, {});
}

export default function ClinicalForm({ values, errors, onChange }) {
  const grouped = groupByCategory(CLINICAL_FIELDS);

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {Object.entries(grouped).map(([category, fields]) => (
        <section key={category} className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>{category}</h3>
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{fields.length} campos</span>
          </div>

          <div className="clinical-grid" style={{ marginTop: '0.75rem' }}>
            {fields.map((field) => {
              const fieldError = errors[field.key];

              return (
                <div className="form-group" key={field.key}>
                  <label htmlFor={field.key}>{field.label}</label>

                  {field.type === 'select' ? (
                    <select
                      id={field.key}
                      name={field.key}
                      value={values[field.key]}
                      onChange={(event) => onChange(field.key, toNumber(event.target.value))}
                    >
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.key}
                      name={field.key}
                      type="number"
                      value={values[field.key]}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      onChange={(event) => onChange(field.key, toNumber(event.target.value))}
                    />
                  )}

                  {fieldError ? <small className="field-error">{fieldError}</small> : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
