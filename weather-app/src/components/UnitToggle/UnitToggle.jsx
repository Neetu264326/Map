import './UnitToggle.css';

export default function UnitToggle({ unit, onToggle }) {
  return (
    <div className="unit-toggle">
      <button
        className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
        onClick={() => onToggle('metric')}
      >
        °C
      </button>
      <span className="unit-separator">/</span>
      <button
        className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
        onClick={() => onToggle('imperial')}
      >
        °F
      </button>
    </div>
  );
}
