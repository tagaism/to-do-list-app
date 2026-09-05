import { useEffect, useRef, useState } from "react";

export function TodoItem({
  todo,
  index,
  dragHandle,
  canReorder,
  onToggle,
  onDelete,
  onUpdate,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function startEdit() {
    setDraft(todo.title);
    setEditing(true);
  }

  function cancelEdit() {
    setDraft(todo.title);
    setEditing(false);
  }

  function saveEdit() {
    if (draft.trim() === todo.title) {
      setEditing(false);
      return;
    }
    const result = onUpdate(todo.id, draft);
    if (result?.ok) setEditing(false);
  }

  return (
    <div
      className={`todo-item${todo.completed ? " is-completed" : ""}`}
      style={{ "--i": index }}
    >
      <button
        type="button"
        className="drag-handle"
        aria-label={`Reorder ${todo.title}`}
        disabled={!canReorder}
        {...(canReorder ? dragHandle.attributes : {})}
        {...(canReorder ? dragHandle.listeners : {})}
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <circle cx="5" cy="4" r="1.2" fill="currentColor" />
          <circle cx="11" cy="4" r="1.2" fill="currentColor" />
          <circle cx="5" cy="8" r="1.2" fill="currentColor" />
          <circle cx="11" cy="8" r="1.2" fill="currentColor" />
          <circle cx="5" cy="12" r="1.2" fill="currentColor" />
          <circle cx="11" cy="12" r="1.2" fill="currentColor" />
        </svg>
      </button>

      <button
        type="button"
        className="check"
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={todo.completed ? `Mark ${todo.title} as active` : `Mark ${todo.title} as complete`}
        onClick={() => onToggle(todo.id)}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 12.5 10 16.5 18 8"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {editing ? (
        <input
          ref={inputRef}
          className="todo-title-input"
          value={draft}
          aria-label="Edit task title"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={saveEdit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              saveEdit();
            }
            if (event.key === "Escape") cancelEdit();
          }}
        />
      ) : (
        <span className="todo-title" onDoubleClick={startEdit}>
          {todo.title}
        </span>
      )}

      <div className="todo-actions">
        <button
          type="button"
          className="ghost-btn"
          onClick={startEdit}
          aria-label={`Edit ${todo.title}`}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
            <path
              d="M4 16.8V20h3.2L18.6 8.6a1.8 1.8 0 0 0 0-2.5l-1.7-1.7a1.8 1.8 0 0 0-2.5 0L4 16.8Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className="ghost-btn danger"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete ${todo.title}`}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
            <path
              d="M5 7h14M9 7V5h6v2M8 7l.8 12h6.4L16 7"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
