const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Done" },
];

export function Toolbar({ filter, onFilter, counts, query, onQuery }) {
  return (
    <div className="toolbar">
      <div className="filters" role="group" aria-label="Filter tasks">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="filter-btn"
            aria-pressed={filter === item.id}
            aria-label={`${item.label}, ${counts[item.id]}`}
            onClick={() => onFilter(item.id)}
          >
            {item.label}
            <span className="count" aria-hidden="true">{counts[item.id]}</span>
          </button>
        ))}
      </div>
      <div className="search">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <label className="sr-only" htmlFor="todo-search">
          Search tasks
        </label>
        <input
          id="todo-search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search"
          type="search"
        />
      </div>
    </div>
  );
}
