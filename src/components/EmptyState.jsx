const COPY = {
  all: {
    title: "Nothing on the list",
    body: "Capture the next thing that needs your attention. It stays on this device.",
  },
  active: {
    title: "All caught up",
    body: "No open tasks. Enjoy the quiet, or add the next one.",
  },
  completed: {
    title: "No completed tasks",
    body: "Finish something and it will land here, ready to clear.",
  },
  search: {
    title: "No matches",
    body: "Try a shorter phrase, or clear the search to see everything.",
  },
};

export function EmptyState({ filter, query }) {
  const copy = query.trim() ? COPY.search : COPY[filter] ?? COPY.all;

  return (
    <div className="empty">
      <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <rect x="16" y="14" width="40" height="48" rx="8" stroke="currentColor" strokeWidth="2" opacity="0.35" />
        <rect x="22" y="10" width="40" height="48" rx="8" stroke="currentColor" strokeWidth="2" />
        <path d="M32 34h20M32 42h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path
          d="M30 24.5 33.2 27.7 39 21.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h2>{copy.title}</h2>
      <p>{copy.body}</p>
    </div>
  );
}
