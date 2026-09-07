# Calendar App — Vue Port Fixes (identical to React reference)

## What was audited
React reference: `shadcn-dashboard-landing-react-ts-template/vite-version/src/app/calendar/**`
Vue target: `shadcn-dashboard-landing-vue3-ts-template/src/components/calendar/**` + `src/views/Calendar.vue` + `src/router/index.ts`

The Vue calendar was already a faithful port (Calendar wrapper, CalendarSidebar, Calendars with visibility toggles + collapsible groups, EventForm, useCalendar composable, types, data.ts with current-month date mapping, month grid with events, list view, event detail dialog, mobile Sheet). Fixes below close the remaining gaps to pixel-identical.

## Changes made

### 1. `src/components/calendar/DatePicker.vue` (rewritten)
Mirrors the shadcn `ui/calendar` (react-day-picker) look used by the reference sidebar:
- Header: ChevronLeft/Right `size-7` ghost buttons + `MMMM yyyy` label (`flex items-center justify-center pt-1`).
- Weekdays row: `Su Mo Tu We Th Fr Sa` with `text-muted-foreground text-[0.8rem] font-normal select-none`.
- Day grid `grid grid-cols-7`; day buttons: square `aspect-square w-full` (rdp cell size), `rounded-md`, `hover:bg-accent hover:text-accent-foreground`.
- Today (not selected): `bg-accent text-accent-foreground`.
- Selected: `bg-primary text-primary-foreground`.
- Out-of-month: `text-muted-foreground opacity-50`.
- Event dot (reference `modifiersClassNames.hasEvents`): `after:absolute after:right-1 after:bottom-1 after:h-1.5 after:w-1.5 after:rounded-full after:bg-primary` (primary-foreground dot when day is selected).

### 2. `src/components/calendar/CalendarMain.vue` (script fix)
`handleEventClick` now matches the React behavior: if a parent `eventClick` handler exists (the Calendar page passes `@event-click="calendar.handleEditEvent"` → opens the EventForm), it only emits and does NOT open the local detail dialog (which previously opened a duplicate dialog on top of the EventForm). When no handler exists, the local dialog opens as fallback (same as React `if (onEventClick) ... else setShowEventDialog(true)`).

### 3. `src/router/index.ts` (route meta)
Added BaseLayout titles/descriptions so page headings match the reference pages:
- `/calendar` → `meta { title: 'Calendar', description: 'Manage your schedule and events' }`
- `/mail` → `meta { title: 'Mail', description: 'Manage your email conversations' }`
- `/users` → `meta { title: 'Users', description: 'Manage your users and their permissions' }`

## Verified identical (no change needed)
- `Calendar.vue` (component): desktop sidebar `hidden xl:block w-80 border-r`, main panel, mobile Sheet `side="left" w-80 p-0 absolute`, EventForm wiring — matches `components/calendar.tsx`.
- `CalendarSidebar.vue`: Add New Event button, DatePicker, Separator, Calendars, "New Calendar" footer — matches.
- `Calendars.vue`: `enhancedCalendars` groups (My Calendars/Favorites/Other), collapsible (default open first), color+visibility toggle buttons with Check, Eye/EyeOff on hover, MoreHorizontal dropdown (Edit/Hide/Delete) — matches.
- `EventForm.vue`: title, type select with color dots, date popover (DatePicker) `PPP`, time slots, duration, All-day/Reminder switches, location, attendees (Enter/Add, avatar initials, remove ×), description, Save/Update/Delete/Cancel — matches.
- `useCalendar.ts` / `types.ts` / `data.ts` (+ events/event-dates/calendars json): current month/year date mapping identical to reference `data.ts`.
- Month grid in `CalendarMain.vue`: 7-col header (Sun..Sat), day cells `min-h-[120px]` with today badge, `+N` overflow, event chips `slice(0,2)` with Clock icon, selected ring — matches.
- List view + event detail dialog + view-mode dropdown (Month/List) — matches.
- `QuickActions.vue` (standalone, not used by the page) — present.

## Validation
- Static review of every calendar file against the React reference (structure, class names, copy, state/behavior).
- Template balance checked (self-closing `<div/>` are valid Vue; remaining counts are walker artifacts).
- No builds run (per task instructions). No tests added (SFC-only change).

## Residual risks
- The date popover inside EventForm uses the same custom `DatePicker.vue` (visual approximation of react-day-picker), not a full reka Calendar; visually equivalent for the sidebar/popover usage.
- Drag-and-drop of events is not implemented (React reference has none in these calendar files either).
