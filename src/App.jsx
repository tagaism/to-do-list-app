import { useCallback, useState } from "react";
import { Composer } from "./components/Composer";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Header } from "./components/Header";
import { ToastStack } from "./components/ToastStack";
import { TodoList } from "./components/TodoList";
import { Toolbar } from "./components/Toolbar";
import { useTheme } from "./hooks/useTheme";
import { useToasts } from "./hooks/useToasts";
import { useTodos } from "./hooks/useTodos";

const MESSAGES = {
  empty: ["error", "A task needs a name."],
  duplicate: ["warning", "That task is already on the list."],
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { toasts, push, dismiss } = useToasts();
  const todos = useTodos();
  const [confirm, setConfirm] = useState(null);

  const announce = useCallback(
    (result, successText) => {
      if (result.ok) {
        push("success", successText);
        return;
      }
      const [type, text] = MESSAGES[result.code] ?? ["error", "Could not save that task."];
      push(type, result.code === "duplicate" && result.title ? `${result.title} is already on the list.` : text);
    },
    [push]
  );

  function handleAdd(title) {
    const result = todos.add(title);
    announce(result, `${result.title ?? title} is on the list.`);
    return result;
  }

  function handleUpdate(id, title) {
    const result = todos.updateTitle(id, title);
    announce(result, "Task updated.");
    return result;
  }

  function handleToggle(id) {
    const current = todos.todos.find((todo) => todo.id === id);
    todos.toggle(id);
    if (current && !current.completed) {
      push("success", `${current.title} is done.`);
    }
  }

  function handleDelete(id) {
    const current = todos.todos.find((todo) => todo.id === id);
    todos.remove(id);
    if (current) push("success", `${current.title} removed.`);
  }

  return (
    <div className="app">
      <main className="shell">
        <Header counts={todos.counts} theme={theme} onToggleTheme={toggleTheme} />
        <Composer onAdd={handleAdd} />
        <Toolbar
          filter={todos.filter}
          onFilter={todos.setFilter}
          counts={todos.counts}
          query={todos.query}
          onQuery={todos.setQuery}
        />
        <TodoList
          items={todos.visible}
          filter={todos.filter}
          query={todos.query}
          canReorder={todos.canReorder}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onReorder={todos.reorder}
        />
        <footer className="footer">
          <span>
            <kbd>Enter</kbd> add · <kbd>Double-click</kbd> edit
            {todos.canReorder ? " · drag to reorder" : " · show all to reorder"}
          </span>
          <span>
            {todos.counts.completed > 0 && (
              <button
                type="button"
                className="text-btn"
                onClick={() =>
                  setConfirm({
                    title: "Clear completed tasks?",
                    body: `${todos.counts.completed} completed ${todos.counts.completed === 1 ? "task" : "tasks"} will be removed.`,
                    confirmLabel: "Clear completed",
                    onConfirm: () => {
                      todos.clearDone();
                      push("success", "Completed tasks cleared.");
                    },
                  })
                }
              >
                Clear completed
              </button>
            )}
            {todos.counts.all > 1 && (
              <button
                type="button"
                className="danger-btn"
                onClick={() =>
                  setConfirm({
                    title: "Clear the whole list?",
                    body: "This removes every task stored in this browser.",
                    confirmLabel: "Clear list",
                    onConfirm: () => {
                      todos.clearAll();
                      push("success", "List cleared.");
                    },
                  })
                }
              >
                Clear list
              </button>
            )}
          </span>
        </footer>
      </main>
      <ToastStack toasts={toasts} onDismiss={dismiss} />
      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        body={confirm?.body}
        confirmLabel={confirm?.confirmLabel}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          confirm?.onConfirm();
          setConfirm(null);
        }}
      />
    </div>
  );
}
