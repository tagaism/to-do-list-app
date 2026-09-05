# ToDo — a quiet list

A local-first task list with a custom dark/light studio UI. Tasks live in your browser, not on a server.

**Demo:** [tagaism.github.io/to-do-list-app](https://tagaism.github.io/to-do-list-app/)

## Features

- Add, complete, inline-edit, and delete tasks
- Drag and drop to reorder (keyboard accessible)
- Filter by All / Active / Done, with live counts
- Search across titles
- Progress ring and remaining/completed stats
- Duplicate and empty-title guards
- Toasts and confirm dialogs instead of `alert` / `confirm`
- Dark and light themes, remembered across visits
- Existing v1 `localStorage` lists are migrated automatically

## Stack

- React 18 with function components and hooks
- Vite 6
- [@dnd-kit](https://docs.dndkit.com/) for sortable lists
- Custom CSS (no component library)
- Vitest + Testing Library

## Getting started

```bash
git clone https://github.com/tagaism/to-do-list-app.git
cd to-do-list-app
npm install
npm start
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

### Scripts

| Command | What it does |
| --- | --- |
| `npm start` / `npm run dev` | Vite dev server |
| `npm test` | Vitest in watch mode |
| `npm run test:run` | Vitest once |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run deploy` | Build and publish `dist/` to GitHub Pages |

## How it is put together

```
src/
  App.jsx                 UI orchestration
  index.css               Theme tokens and layout
  hooks/useTodos.js       List state, filters, persistence
  hooks/useTheme.js       Dark / light
  hooks/useToasts.js      Transient messages
  lib/todos.js            Pure domain logic (tested)
  components/             Header, composer, list, dialogs
```

The source of truth is the full todo array. Filters and search are derived, so switching tabs never drops items. Each task has a stable `id`; titles are no longer used as keys.

Legacy records stored as `{ title, status }` (where `status: true` meant active) are upgraded on load to `{ id, title, completed, createdAt }`.

## Keyboard

- `Enter` in the composer adds a task
- `Enter` saves an edit, `Escape` cancels
- Drag handle: `Space` to pick up, arrows to move, `Space` to drop

## Accessibility

- Labels on the composer, search, checkboxes, and icon buttons
- `aria-pressed` filters and `aria-checked` task toggles
- Dialogs are modal, restore focus, and close on `Escape`
- Toasts use an `aria-live` region
- Motion respects `prefers-reduced-motion`

## Deploy

GitHub Pages is configured via `"homepage"` in `package.json`. Production builds use the `/to-do-list-app/` base path.

```bash
npm run deploy
```

## License

Private project. Contribute with a focused branch and a pull request against `main`.
