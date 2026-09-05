import { useId, useState } from "react";

export function Composer({ onAdd }) {
  const id = useId();
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const result = onAdd(value);
    if (result?.ok) setValue("");
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={id}>
        Add a task
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="What needs doing?"
        autoComplete="off"
        autoFocus
        maxLength={160}
      />
      <button className="primary-btn" type="submit">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        Add
      </button>
    </form>
  );
}
