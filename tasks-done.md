# Tasks app — Vue port (pixel-identical to React reference)

## What was done
Rewrote `src/views/Tasks.vue` from scratch to be identical to the React reference
(`vite-version/src/app/tasks`):

- **Page layout**: mobile placeholder (`md:hidden`) + desktop view (`hidden md:flex`)
  with the exact `BaseLayout` title/description wired via route meta in `src/router/index.ts`
  (`Tasks` / `A powerful task and issue tracker built with Tanstack Table.`).
- **Stats cards** (4): Total Tasks, Completed, In Progress, Pending — identical copy,
  percentages, icons (`ListTodo`, `CheckCircle2`, `Clock`, `BarChart3`).
- **Toolbar**: Status / Category / Priority selects ("All Status/Categories/Priorities"),
  Search input, Reset Filters button (disabled when unfiltered), View (column-visibility
  dropdown with checkbox items for title/category/status/priority), Add Task button.
- **Table**: columns Select-checkbox, Task (id), Title, Category (badge), Status
  (icon+label), Priority (colored badge with the exact border/text classes), Actions
  (dropdown: View Task / Edit Task / --- / Duplicate / Mark as Favorite / --- /
  Delete ⌘⌫). Sortable headers (ArrowUp/ArrowDown/ChevronsUpDown). Row/select-all
  checkboxes. Empty "No results." row (colspan 7).
- **Pagination**: "Rows per page" select (10/20/30/40/50), "Page X of Y",
  first/previous/next/last buttons with sr-only labels.
- **Add Task dialog**: Title (*required, inline error), Description textarea,
  Status/Category side-by-side, Priority, Cancel / Create Task — generates a TASK-XXXX id
  and prepends the task.
- **Data**: reuses `src/views/data/tasksData.ts` (50 tasks identical to `tasks.json`).
  Statuses/categories/priorities with the exact labels and lucide icons.

Kept copy and Tailwind class names identical to the React source.
Uses native Vue state (computed filtering/sorting/pagination/selection) so the rendered
output matches tanstack-table behavior exactly without the extra dependency.
