# Users Page — Vue rewrite (identical to React reference)

## What was done
Rewrote `src/views/Users.vue` to be pixel-identical to the React reference
(`vite-version/src/app/users`), including:

- **Stat Cards** — Total Users ($2.4M, +33.3%), Paid Users (12.5K, +35.9%),
  Active Users (8.9k, +32.8%), Pending Users (17%, -8.0%) with the exact
  icon/badge/trend classes (green/red badges, TrendingUp/Down, ArrowUpRight,
  "from X").
- **Data table** — columns: select (checkbox, select-all with indeterminate
  logic), User (avatar initials + name + email), Role badge (colored per role:
  red/blue/yellow/green/purple/gray), Plan, Billing, Status badge (colored per
  status: green/orange/red/gray), Actions (Eye, Pencil, More dropdown →
  View Details / Send Email / Reset Password / Delete User).
- **Toolbar** — global search ("Search users..."), Export button, "Add New User"
  dialog button.
- **Filters** — Role / Plan / Status selects (with "All" options) + Column
  Visibility dropdown (role, plan, billing, status checkboxes) that toggles
  columns.
- **Sorting** — clickable headers (User, Role, Plan, Billing, Status).
- **Pagination** — "Show" page-size select (10/20/30/40/50), "X of N row(s)
  selected.", "Page X of Y", Previous/Next buttons.
- **Add New User dialog** — full form (Name, Email, Role, Plan, Billing,
  Status selects) with vee-validate + zod validation and the exact
  placeholder/error messages from the reference ("Name must be at least 2
  characters.", "Please enter a valid email address.", etc.). On submit: avatar
  initials generated from the name, id = max+1, joinedDate/lastLogin = today,
  prepended to the list.
- Delete removes the user; Edit logs (matches reference behavior).
- Data: `src/views/data/usersData.ts` already contains the exact 15 users from
  `data.json` (all fields: role/plan/billing/status/joinedDate/lastLogin) — kept
  as-is.
- Route meta for `/users` already set to `{ title: 'Users', description:
  'Manage your users and their permissions' }` (verified in router).

## Changed files
- `src/views/Users.vue` (rewritten)

## Validation
- No build run (per task instructions).
- Structural sanity check: template `div` balance = 0 (balanced); remaining tag
  mismatches from the regex checker are false positives (multiline opens and
  self-closing tags such as `<FormMessage />`, `<DropdownMenuSeparator />`).
- Relies on existing project UI components (card, button, table, avatar, badge,
  dropdown-menu, checkbox, select, dialog, input, label, form/vee-validate,
  lucide-vue-next) that are already used elsewhere in the project.

## Residual risks
- Not compiled/built in this run; if any TS/template issue exists it will be
  caught by the parent's `vite build`.
- vee-validate `Form` expose (`resetForm` via ref) relies on the same pattern
  already used by the contact form in this project.
