import React, { useState } from 'react';
import './AdvancedSearchBar.css';

interface AdvancedSearchBarProps {
  search: string;
  setSearch: (val: string) => void;
  genre: string;
  setGenre: (val: string) => void;
  minRating: string;
  setMinRating: (val: string) => void;
  genres: string[];
}

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  search,
  setSearch,
  genre,
  setGenre,
  minRating,
  setMinRating,
  genres,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="advanced-search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search movies ..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setShowFilters(true)}
        />
        <span className="search-icon">🎬</span>
        <button className="filter-toggle" onClick={() => setShowFilters(f => !f)}>
          {showFilters ? '▲ Filters' : '▼ Filters'}
        </button>
      </div>
      {showFilters && (
        <div className="filters-panel">
          <select
            value={genre}
            onChange={e => setGenre(e.target.value)}
            className="filter-select"
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <input
            type="number"
            className="filter-rating"
            placeholder="Min rating"
            min="0"
            max="10"
            step="0.1"
            value={minRating}
            onChange={e => setMinRating(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchBar;
