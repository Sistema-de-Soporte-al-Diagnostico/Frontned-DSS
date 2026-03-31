import React from 'react';
import DiagnosticoForm from './components/DiagnosticoForm';

function App() {
  const styles = {
    appContainer: {
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      boxSizing: 'border-box'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      color: '#1a365d',
      fontSize: '2.5rem',
      margin: '0 0 10px 0',
      fontWeight: 'bold'
    },
    subtitle: {
      color: '#4a5568',
      fontSize: '1.2rem',
      margin: 0
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
      width: '100%',
      maxWidth: '600px',
      padding: '30px',
      boxSizing: 'border-box'
    }
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Charming Vet</h1>
        <p style={styles.subtitle}>Sistema de Diagnóstico con Inteligencia Artificial</p>
      </header>

      <main style={styles.card}>
        <DiagnosticoForm />
      </main>
    </div>
  );
}

export default App;
