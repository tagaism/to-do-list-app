import { useCallback, useEffect, useMemo, useState } from "react";
import {
  STORAGE_KEY,
  addTodo,
  clearCompleted,
  countTodos,
  filterTodos,
  loadTodos,
  removeTodo,
  reorderTodos,
  saveTodos,
  toggleTodo,
  updateTodoTitle,
} from "../lib/todos";

export function useTodos(storageKey = STORAGE_KEY) {
  const [todos, setTodos] = useState(() => loadTodos(localStorage, storageKey));
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    saveTodos(todos, localStorage, storageKey);
  }, [todos, storageKey]);

  const visible = useMemo(
    () => filterTodos(todos, { filter, query }),
    [todos, filter, query]
  );
  const counts = useMemo(() => countTodos(todos), [todos]);
  const canReorder = filter === "all" && query.trim() === "";

  const add = useCallback((title) => {
    const result = addTodo(todos, title);
    if (result.ok) setTodos(result.todos);
    return result;
  }, [todos]);

  const toggle = useCallback((id) => {
    setTodos((current) => toggleTodo(current, id));
  }, []);

  const remove = useCallback((id) => {
    setTodos((current) => removeTodo(current, id));
  }, []);

  const updateTitle = useCallback((id, title) => {
    const result = updateTodoTitle(todos, id, title);
    if (result.ok) setTodos(result.todos);
    return result;
  }, [todos]);

  const reorder = useCallback((activeId, overId) => {
    setTodos((current) => reorderTodos(current, activeId, overId));
  }, []);

  const clearDone = useCallback(() => {
    setTodos((current) => clearCompleted(current));
  }, []);

  const clearAll = useCallback(() => {
    setTodos([]);
  }, []);

  return {
    todos,
    visible,
    counts,
    filter,
    setFilter,
    query,
    setQuery,
    canReorder,
    add,
    toggle,
    remove,
    updateTitle,
    reorder,
    clearDone,
    clearAll,
  };
}
