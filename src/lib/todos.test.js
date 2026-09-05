import { describe, expect, it } from "vitest";
import {
  addTodo,
  clearCompleted,
  countTodos,
  filterTodos,
  isDuplicate,
  migrateTodos,
  normalizeTitle,
  reorderTodos,
  toggleTodo,
  updateTodoTitle,
} from "./todos";

describe("normalizeTitle", () => {
  it("trims and collapses whitespace", () => {
    expect(normalizeTitle("  buy   milk  ")).toBe("buy milk");
  });
});

describe("migrateTodos", () => {
  it("upgrades the legacy status field and assigns ids", () => {
    const next = migrateTodos([
      { title: "Active", status: true },
      { title: "Done", status: false },
      { title: "   " },
    ]);
    expect(next).toHaveLength(2);
    expect(next[0].completed).toBe(false);
    expect(next[1].completed).toBe(true);
    expect(next[0].id).toBeTruthy();
    expect(next[1].title).toBe("Done");
  });

  it("keeps modern records intact", () => {
    const source = [
      { id: "a", title: "Keep", completed: true, createdAt: 10 },
    ];
    expect(migrateTodos(source)).toEqual(source);
  });

  it("returns an empty list for invalid input", () => {
    expect(migrateTodos(null)).toEqual([]);
    expect(migrateTodos({})).toEqual([]);
  });
});

describe("addTodo", () => {
  it("rejects empty titles", () => {
    expect(addTodo([], "   ").code).toBe("empty");
  });

  it("rejects duplicates case-insensitively", () => {
    const existing = [{ id: "1", title: "Milk", completed: false, createdAt: 1 }];
    expect(addTodo(existing, "milk").code).toBe("duplicate");
  });

  it("appends a new task", () => {
    const result = addTodo([], "Write tests");
    expect(result.ok).toBe(true);
    expect(result.todos).toHaveLength(1);
    expect(result.todos[0].completed).toBe(false);
    expect(result.todos[0].title).toBe("Write tests");
  });
});

describe("mutations", () => {
  const seed = [
    { id: "1", title: "One", completed: false, createdAt: 1 },
    { id: "2", title: "Two", completed: true, createdAt: 2 },
    { id: "3", title: "Three", completed: false, createdAt: 3 },
  ];

  it("toggles without mutating the original", () => {
    const next = toggleTodo(seed, "1");
    expect(next[0].completed).toBe(true);
    expect(seed[0].completed).toBe(false);
  });

  it("updates a title and blocks duplicates", () => {
    expect(updateTodoTitle(seed, "1", "Two").code).toBe("duplicate");
    expect(updateTodoTitle(seed, "1", "One").ok).toBe(true);
    expect(updateTodoTitle(seed, "1", "Renamed").todos[0].title).toBe("Renamed");
  });

  it("reorders by id", () => {
    const next = reorderTodos(seed, "3", "1");
    expect(next.map((todo) => todo.id)).toEqual(["3", "1", "2"]);
  });

  it("clears completed tasks", () => {
    expect(clearCompleted(seed).map((todo) => todo.id)).toEqual(["1", "3"]);
  });
});

describe("filterTodos and counts", () => {
  const seed = [
    { id: "1", title: "Buy milk", completed: false, createdAt: 1 },
    { id: "2", title: "Read docs", completed: true, createdAt: 2 },
  ];

  it("filters by status and query", () => {
    expect(filterTodos(seed, { filter: "active" })).toHaveLength(1);
    expect(filterTodos(seed, { filter: "completed" })[0].id).toBe("2");
    expect(filterTodos(seed, { query: "MILK" })[0].id).toBe("1");
  });

  it("counts lists", () => {
    expect(countTodos(seed)).toEqual({ all: 2, active: 1, completed: 1 });
  });

  it("detects duplicates except for the same id", () => {
    expect(isDuplicate(seed, "buy milk")).toBe(true);
    expect(isDuplicate(seed, "buy milk", "1")).toBe(false);
  });
});
