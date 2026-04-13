import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import { createPatient } from '../services/patientService';
import { setDraftPatient } from '../utils/storage';

export default function PatientRegistrationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patientForm, setPatientForm] = useState({
    nombre: '',
    especie: 'Canino',
    raza: '',
    edad_anios: 2,
    edad_meses: 0,
    peso: '',
    sexo: 'Macho',
    propietario_nombre: '',
    propietario_telefono: '',
    notas: '',
    propietario_id: 1,
  });

  const handlePatientChange = (key, value) => {
    setPatientForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const patientResponse = await createPatient({
        nombre: patientForm.nombre,
        especie: patientForm.especie,
        raza: patientForm.raza,
        edad: Number(patientForm.edad_anios),
        propietario_id: Number(patientForm.propietario_id),
      });

      setDraftPatient({
        id: patientResponse.paciente_id,
        name: patientForm.nombre,
        species: patientForm.especie,
        breed: patientForm.raza,
        age: Number(patientForm.edad_anios),
        ageMonths: Number(patientForm.edad_meses),
        weightKg: Number(patientForm.peso || 0),
        sex: patientForm.sexo,
        ownerName: patientForm.propietario_nombre,
        ownerPhone: patientForm.propietario_telefono,
        notes: patientForm.notas,
        ownerId: Number(patientForm.propietario_id),
      });

      navigate('/symptoms');
    } catch (err) {
      const message = err?.response?.data?.detail || err.message || 'No se pudo registrar el paciente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="patient-form-shell">
      <div className="card form-page figma-page patient-form-card">
        <header className="page-head patient-form-head">
          <h2>Registro de Nuevo Paciente</h2>
          <p>Complete la información básica del paciente para comenzar el diagnóstico.</p>
        </header>

        <form onSubmit={handleSubmit} className="form-stack patient-form-stack">
          <div className="two-columns">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Paciente *</label>
              <input
                id="nombre"
                className="input-control"
                placeholder="Ej: Max"
                value={patientForm.nombre}
                onChange={(event) => handlePatientChange('nombre', event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="especie">Especie *</label>
              <select
                id="especie"
                className="input-control"
                value={patientForm.especie}
                onChange={(event) => handlePatientChange('especie', event.target.value)}
                required
              >
                <option value="Canino">Perro</option>
                <option value="Felino">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="raza">Raza</label>
              <input
                id="raza"
                className="input-control"
                placeholder="Ej: Golden Retriever"
                value={patientForm.raza}
                onChange={(event) => handlePatientChange('raza', event.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edad_anios">Edad *</label>
              <div className="age-grid">
                <input
                  id="edad_anios"
                  type="number"
                  min="0"
                  max="40"
                  className="input-control"
                  placeholder="Años"
                  value={patientForm.edad_anios}
                  onChange={(event) => handlePatientChange('edad_anios', event.target.value)}
                  required
                />
                <input
                  id="edad_meses"
                  type="number"
                  min="0"
                  max="11"
                  className="input-control"
                  placeholder="Meses"
                  value={patientForm.edad_meses}
                  onChange={(event) => handlePatientChange('edad_meses', event.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="peso">Peso (kg) *</label>
              <input
                id="peso"
                type="number"
                min="0"
                step="0.1"
                className="input-control"
                placeholder="15.5"
                value={patientForm.peso}
                onChange={(event) => handlePatientChange('peso', event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sexo">Sexo *</label>
              <select
                id="sexo"
                className="input-control"
                value={patientForm.sexo}
                onChange={(event) => handlePatientChange('sexo', event.target.value)}
                required
              >
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
          </div>

          <section className="owner-section">
            <h4>Información del Propietario</h4>
            <div className="two-columns">
              <div className="form-group">
                <label htmlFor="propietario_nombre">Nombre Completo</label>
                <input
                  id="propietario_nombre"
                  className="input-control"
                  placeholder="Nombre del propietario"
                  value={patientForm.propietario_nombre}
                  onChange={(event) => handlePatientChange('propietario_nombre', event.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="propietario_telefono">Teléfono</label>
                <input
                  id="propietario_telefono"
                  type="tel"
                  className="input-control"
                  placeholder="+51 999 999 999"
                  value={patientForm.propietario_telefono}
                  onChange={(event) => handlePatientChange('propietario_telefono', event.target.value)}
                />
              </div>
            </div>
          </section>

          <div className="form-group">
            <label htmlFor="notas">Notas Adicionales</label>
            <textarea
              id="notas"
              rows={3}
              className="input-control form-textarea"
              placeholder="Información relevante sobre el paciente..."
              value={patientForm.notas}
              onChange={(event) => handlePatientChange('notas', event.target.value)}
            />
          </div>

          <ErrorMessage message={error} />

          <div className="actions-row actions-end">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              Cancelar
            </button>
            <button type="submit" className="btn-gradient" style={{ width: 'auto' }} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar y Continuar'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
