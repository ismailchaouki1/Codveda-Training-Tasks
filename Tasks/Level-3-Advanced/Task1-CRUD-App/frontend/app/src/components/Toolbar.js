import React from 'react';
import '../Toolbar.css';

export default function Toolbar({ filters, setFilters }) {
  const { search = '', priority = '' } = filters;

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="toolbar">
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="clear-search" onClick={() => updateFilter('search', '')}>
            ✕
          </button>
        )}
      </div>

      <div className="filter-wrapper">
        <span className="filter-icon">🏷️</span>
        <select
          value={priority}
          onChange={(e) => updateFilter('priority', e.target.value)}
          className="priority-filter"
        >
          <option value="">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🔵 Low</option>
        </select>
        {priority && (
          <button className="clear-filter" onClick={() => updateFilter('priority', '')}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
