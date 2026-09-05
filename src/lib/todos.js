export const STORAGE_KEY = "todos";

export function normalizeTitle(title) {
  return String(title ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createTodo(title) {
  return {
    id: createId(),
    title: normalizeTitle(title),
    completed: false,
    createdAt: Date.now(),
  };
}

export function migrateTodos(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((todo, index) => {
      if (!todo || typeof todo !== "object") return null;
      const title = normalizeTitle(todo.title);
      if (!title) return null;

      const completed =
        typeof todo.completed === "boolean"
          ? todo.completed
          : todo.status === false;

      return {
        id: typeof todo.id === "string" && todo.id ? todo.id : createId(),
        title,
        completed,
        createdAt:
          typeof todo.createdAt === "number" ? todo.createdAt : Date.now() + index,
      };
    })
    .filter(Boolean);
}

export function loadTodos(storage = localStorage, key = STORAGE_KEY) {
  try {
    const parsed = JSON.parse(storage.getItem(key));
    return migrateTodos(parsed);
  } catch {
    return [];
  }
}

export function saveTodos(todos, storage = localStorage, key = STORAGE_KEY) {
  storage.setItem(key, JSON.stringify(todos));
}

export function isDuplicate(todos, title, exceptId) {
  const normalized = normalizeTitle(title).toLowerCase();
  if (!normalized) return false;
  return todos.some(
    (todo) =>
      todo.id !== exceptId && todo.title.toLowerCase() === normalized
  );
}

export function addTodo(todos, title) {
  const normalized = normalizeTitle(title);
  if (!normalized) {
    return { ok: false, code: "empty", todos };
  }
  if (isDuplicate(todos, normalized)) {
    return { ok: false, code: "duplicate", todos, title: normalized };
  }
  return { ok: true, todos: [...todos, createTodo(normalized)], title: normalized };
}

export function toggleTodo(todos, id) {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

export function removeTodo(todos, id) {
  return todos.filter((todo) => todo.id !== id);
}

export function updateTodoTitle(todos, id, title) {
  const normalized = normalizeTitle(title);
  if (!normalized) {
    return { ok: false, code: "empty", todos };
  }
  if (isDuplicate(todos, normalized, id)) {
    return { ok: false, code: "duplicate", todos, title: normalized };
  }
  return {
    ok: true,
    title: normalized,
    todos: todos.map((todo) =>
      todo.id === id ? { ...todo, title: normalized } : todo
    ),
  };
}

export function reorderTodos(todos, activeId, overId) {
  const from = todos.findIndex((todo) => todo.id === activeId);
  const to = todos.findIndex((todo) => todo.id === overId);
  if (from < 0 || to < 0 || from === to) return todos;
  const next = todos.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function clearCompleted(todos) {
  return todos.filter((todo) => !todo.completed);
}

export function filterTodos(todos, { filter = "all", query = "" } = {}) {
  const needle = query.trim().toLowerCase();
  return todos.filter((todo) => {
    if (filter === "active" && todo.completed) return false;
    if (filter === "completed" && !todo.completed) return false;
    if (needle && !todo.title.toLowerCase().includes(needle)) return false;
    return true;
  });
}

export function countTodos(todos) {
  const completed = todos.reduce(
    (total, todo) => total + (todo.completed ? 1 : 0),
    0
  );
  return {
    all: todos.length,
    active: todos.length - completed,
    completed,
  };
}
