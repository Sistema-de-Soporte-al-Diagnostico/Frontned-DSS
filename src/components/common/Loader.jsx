export default function Loader({ text = 'Cargando...' }) {
  return (
    <div className="loader-wrapper" role="status" aria-live="polite">
      <span className="loader" />
      <span>{text}</span>
    </div>
  );
}
