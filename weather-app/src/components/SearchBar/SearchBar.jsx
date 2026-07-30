import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import './SearchBar.css';

export default function SearchBar({ onSearch, onLocationClick, loading }) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 600);
  const inputRef = useRef(null);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <i className="fas fa-search search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        {query && (
          <button type="button" className="search-clear" onClick={handleClear} aria-label="Clear search">
            <i className="fas fa-times" />
          </button>
        )}
      </div>
      <button type="button" className="location-btn" onClick={onLocationClick} title="Use my location" disabled={loading}>
        <i className="fas fa-location-dot" />
      </button>
    </form>
  );
}
