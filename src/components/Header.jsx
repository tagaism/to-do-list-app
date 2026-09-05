const RING = 2 * Math.PI * 18;

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function Header({ counts, theme, onToggleTheme }) {
  const ratio = counts.all === 0 ? 0 : counts.completed / counts.all;
  const offset = RING - RING * ratio;
  const label =
    counts.all === 0
      ? "A clear desk. Add the next thing worth doing."
      : `${counts.completed} of ${counts.all} complete`;

  return (
    <header className="header">
      <div className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12.5 9.5 17 19 7.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="brand">
        <h1>ToDo</h1>
        <p>{formatDate(new Date())}</p>
      </div>
      <div className="header-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M12 3v2.2M12 18.8V21M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3 12h2.2M18.8 12H21M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path
                d="M16.8 14.6A6.6 6.6 0 0 1 9.4 7.2 6.7 6.7 0 1 0 16.8 14.6Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="progress">
        <svg className="progress-ring" viewBox="0 0 46 46" aria-hidden="true">
          <circle className="track" cx="23" cy="23" r="18" />
          <circle
            className="value"
            cx="23"
            cy="23"
            r="18"
            strokeDasharray={RING}
            strokeDashoffset={offset}
            style={{ opacity: ratio === 0 ? 0 : 1 }}
          />
        </svg>
        <div>
          <strong>{counts.all === 0 ? "Ready when you are" : `${Math.round(ratio * 100)}% done`}</strong>
          <span>{label}</span>
        </div>
      </div>
    </header>
  );
}
