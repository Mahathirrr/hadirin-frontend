# Mail App — Vue port result (subagent)

## What was done
Brought the Vue **Mail** app (`/mail`) in `shadcn-dashboard-landing-vue3-ts-template` to match the React reference (`vite-version/src/app/mail`) as closely as possible:

1. **`src/composables/useMail.ts`** (new) — module-scoped reactive `{ selected }` + `setState`, mirroring the React zustand `useMail` store. Shared by Mail list & display so selection syncs.
2. **`src/views/data/mailData.ts`** (new) — re-exports `mails`, `accounts`, `contacts` + types from the canonical `@/data/mail` (data already ported faithfully incl. Gmail/Vercel/iCloud SVG icon paths).
3. **`src/components/mail/Mail.vue`** (rewritten) — resizable 3-panel layout via **splitpanes** (sizes 20/32/48, min sizes, handles), mirroring the React `ResizablePanelGroup`; nav-panel collapse detection (icon-only + tooltips) when the nav pane is dragged small; Compose button, account switcher, nav groups (Inbox 128 / Drafts 9 / Sent / Junk 23 / Trash / Archive + Social 972 / Updates 342 / Forums 128 / Shopping 8 / Promotions 21); list panel with Inbox header + All mail / Unread tabs + search; display panel bound to `useMail().selected`.
4. **`src/components/mail/Calendar.vue`** (new) — native month-grid calendar (prev/next month, weekday row, day grid, selected = `bg-primary text-primary-foreground`, today = `bg-accent`) replacing react-day-picker in the Snooze popover.
5. **`src/components/mail/MailDisplay.vue`** — replaced the `<input type="date">` snooze picker with the native Calendar; kept the full toolbar (Archive/ArchiveX/Trash/Snooze popover/Reply/ReplyAll/Forward/More menu), header with avatar initials + name/subject/Reply-To + `PPpp` date, message body, reply Textarea + "Mute this thread" Switch + Send, "No message selected" empty state.
6. **`src/components/mail/MailList.vue`** — switched from the pinia store to the shared `useMail` composable; unchanged markup (unread blue dot, `formatDistanceToNow`, subject, 300-char preview, label badges with per-label variant).
7. **`src/views/Mail.vue`** — imports updated to `@/views/data/mailData`.

## Validation
- All changed SFCs parsed + compiled (script setup + template) with `@vue/compiler-sfc` — **ALL VALID**, no syntax errors.
- Full project build was intentionally **not** run (parent runs it).

## Residual risks
- splitpanes splitter bars are close to, but not pixel-identical to, react-resizable-panels' shadcn handle grip.
- Nav-panel drag-to-collapse is approximated (toggles at pane ≤ 6%).
- Native Calendar approximates react-day-picker styling (selected/today), not pixel-identical.
- `AvatarImage` has no src (matches React, which also renders initials only).
