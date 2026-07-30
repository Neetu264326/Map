import './SearchHistory.css';

export default function SearchHistory({ history, onSelect, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="search-history">
      <div className="history-header">
        <span className="history-title"><i className="fas fa-clock-rotate-left" /> Recent Searches</span>
        <button className="history-clear-btn" onClick={onClear} title="Clear history">
          <i className="fas fa-trash-can" />
        </button>
      </div>
      <div className="history-list">
        {history.map((city, index) => (
          <button
            className="history-item"
            key={`${city}-${index}`}
            onClick={() => onSelect(city)}
          >
            <i className="fas fa-clock-rotate-left" />
            <span>{city}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
