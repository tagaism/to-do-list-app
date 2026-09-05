import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EmptyState } from "./EmptyState";
import { TodoItem } from "./TodoItem";

function SortableItem({ todo, index, canReorder, ...itemProps }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id, disabled: !canReorder });

  return (
    <li
      ref={setNodeRef}
      className={isDragging ? "is-dragging" : undefined}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        listStyle: "none",
      }}
    >
      <TodoItem
        todo={todo}
        index={index}
        canReorder={canReorder}
        dragHandle={{ attributes, listeners }}
        {...itemProps}
      />
    </li>
  );
}

export function TodoList({
  items,
  filter,
  query,
  canReorder,
  onToggle,
  onDelete,
  onUpdate,
  onReorder,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (items.length === 0) {
    return <EmptyState filter={filter} query={query} />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        onReorder(String(active.id), String(over.id));
      }}
    >
      <SortableContext items={items.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
        <ul className="todo-list">
          {items.map((todo, index) => (
            <SortableItem
              key={todo.id}
              todo={todo}
              index={index}
              canReorder={canReorder}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
