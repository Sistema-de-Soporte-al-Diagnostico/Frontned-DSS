import React, { useState } from 'react';
import { enviarPrediccion } from '../services/api';

const DiagnosticoForm = () => {
  const [formData, setFormData] = useState({
    paciente_id: '',
    especie: '0',
    edad: '',
    temperatura: '',
    frecuencia_cardiaca: '',
    vomito: '0',
    diarrea: '0'
  });

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    setError(null);

    // Estructura corregida para coincidir con PrediccionCreate en el backend
    const payload = {
      paciente_id: parseInt(formData.paciente_id, 10),
      variables_clinicas: {
        especie: parseFloat(formData.especie),
        edad: parseFloat(formData.edad),
        temperatura: parseFloat(formData.temperatura),
        frecuencia_cardiaca: parseFloat(formData.frecuencia_cardiaca),
        vomito: parseFloat(formData.vomito),
        diarrea: parseFloat(formData.diarrea),
      }
    };

    try {
      const data = await enviarPrediccion(payload);
      setResultado(data);
    } catch (err) {
      setError('Hubo un error al obtener el diagnóstico. Revisa la consola para más detalles.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2d3748' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box' },
    select: { width: '100%', padding: '8px', boxSizing: 'border-box' },
    button: { padding: '10px 15px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' },
    resultBox: { marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9ff' },
    errorBox: { marginTop: '20px', padding: '15px', border: '1px solid #f5c6cb', borderRadius: '5px', backgroundColor: '#f8d7da', color: '#721c24' }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ color: '#2d3748' }}>Diagnóstico Clínico Veterinario</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>ID del Paciente</label>
          <input
            style={styles.input}
            type="number"
            name="paciente_id"
            value={formData.paciente_id}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Especie</label>
          <select style={styles.select} name="especie" value={formData.especie} onChange={handleChange}>
            <option value="0">Perro</option>
            <option value="1">Gato</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Edad (años)</label>
          <input
            style={styles.input}
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            required
            step="any"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Temperatura (°C)</label>
          <input
            style={styles.input}
            type="number"
            name="temperatura"
            value={formData.temperatura}
            onChange={handleChange}
            required
            step="0.1"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Frecuencia Cardíaca (lpm)</label>
          <input
            style={styles.input}
            type="number"
            name="frecuencia_cardiaca"
            value={formData.frecuencia_cardiaca}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Presencia de Vómito</label>
          <select style={styles.select} name="vomito" value={formData.vomito} onChange={handleChange}>
            <option value="0">No</option>
            <option value="1">Sí</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Presencia de Diarrea</label>
          <select style={styles.select} name="diarrea" value={formData.diarrea} onChange={handleChange}>
            <option value="0">No</option>
            <option value="1">Sí</option>
          </select>
        </div>

        <button style={{ ...styles.button, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Obtener Diagnóstico'}
        </button>
      </form>

      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {resultado && (
        <div style={{ ...styles.resultBox, color: '#2d3748' }}>
          <h3>Resultado del Diagnóstico</h3>
          <p>
            <strong>Estado: </strong>
            <span style={{ color: resultado.diagnostico === 'Enfermo' ? 'red' : 'green', fontWeight: 'bold' }}>
              {resultado.diagnostico || (resultado.enfermo ? 'Enfermo' : 'Sano')}
            </span>
          </p>
          {resultado.probabilidad_porcentaje !== undefined && (
            <p>
              <strong>Probabilidad de enfermedad: </strong>
              {resultado.probabilidad_porcentaje}%
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticoForm;