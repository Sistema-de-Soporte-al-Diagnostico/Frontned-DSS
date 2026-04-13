import { useMemo, useState } from 'react';
import HistoryGrid from '../components/common/HistoryGrid';
import { getStoredHistory } from '../utils/storage';

export default function PatientsHistoryPage() {
  const history = getStoredHistory();

  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const pageSize = 9;

  const filteredSortedRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    const rows = q
      ? history.filter((row) => {
          const patient = row.patient?.name?.toLowerCase() || '';
          const dx = row.result?.prediction?.toLowerCase() || '';
          return patient.includes(q) || dx.includes(q);
        })
      : [...history];

    rows.sort((a, b) => {
      const left = new Date(a.createdAt).getTime();
      const right = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? right - left : left - right;
    });

    return rows;
  }, [history, query, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filteredSortedRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = filteredSortedRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const goTo = (next) => setPage(Math.min(pageCount, Math.max(1, next)));

  return (
    <section className="figma-page">
      <div className="section-header">
        <div>
          <h2 style={{ margin: 0 }}>Historial de Pacientes</h2>
          <p style={{ margin: '0.35rem 0 0', color: 'var(--muted)' }}>
            Busque diagnósticos previos y abra el detalle para seguimiento clínico.
          </p>
        </div>

        <div className="actions-row">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Buscar paciente o diagnóstico..."
            style={{
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '0.6rem 0.7rem',
              fontSize: '0.95rem',
              background: '#fff',
              minWidth: 260,
            }}
          />

          <select
            value={sortOrder}
            onChange={(event) => {
              setSortOrder(event.target.value);
              setPage(1);
            }}
          >
            <option value="desc">Más recientes</option>
            <option value="asc">Más antiguas</option>
          </select>
        </div>
      </div>

      <HistoryGrid rows={pageRows} />

      {pageCount > 1 ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <div className="actions-row">
            <button type="button" className="btn btn-outline" onClick={() => goTo(safePage - 1)} disabled={safePage <= 1}>
              Anterior
            </button>
            <span style={{ alignSelf: 'center', color: 'var(--muted)', fontWeight: 600 }}>
              Página {safePage} de {pageCount}
            </span>
            <button type="button" className="btn btn-outline" onClick={() => goTo(safePage + 1)} disabled={safePage >= pageCount}>
              Siguiente
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
