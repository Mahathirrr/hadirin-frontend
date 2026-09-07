# Chat — Vue 3 port aligned to React reference (done)

## What was fixed (vs React reference)

- **Router**: `/chat` route now carries `meta: { title: 'Chat', description: 'Team communication and messaging' }` so the BaseLayout shell shows the exact heading like the React page.
- **`src/components/chat/ChatHeader.vue`**: rewritten to match the reference exactly:
  - Status logic: group → `"X members, Y online"`; direct → `"Active now"` / `"Away"` / `"Last seen <date>"`.
  - Status color: `text-green-600` (online), `text-yellow-600` (away), `text-muted-foreground` (offline/group).
  - Action buttons (Search / Phone / Video / Info) now wrapped in `Tooltip` + `TooltipContent` with the exact labels.
- **`src/components/chat/ConversationList.vue`**:
  - Sidebar header now `hidden lg:flex` (hidden on mobile, handled by parent) — matches reference.
  - Name/time row now `mb-1` — matches reference spacing.
- **`src/components/chat/MessageList.vue`**: avatar/name/consecutive helpers now operate on the **per-day group array** (`group.messages`) instead of the global array — fixing avatar/name/consecutive grouping inside each day separator (reference behaviour).
- **`src/components/chat/MessageInput.vue`**: added the `"You are typing..."` indicator (isTyping state set on input, reset on send) — matches reference.

## Already-faithful (verified, no change needed)

- `src/views/Chat.vue` + `src/components/chat/Chat.vue`: full layout (sidebar `w-100`, mobile overlay + hamburger, chat panel, header, message list, message input, empty "Welcome to Chat" state), store wiring via `@/stores/chat` (all zustand actions ported: setConversations, setMessages, setUsers, setSelectedConversation+markAsRead, setSearchQuery, addMessage, togglePin, toggleMute, setTyping, setOnlineUsers).
- Data (`src/data/chat/{conversations,messages,users}.ts`) matches React JSON (5 users, 6 conversations, 6 message maps).
- Search filter + pinned-first/time-sorted conversation list; time formatting (`h:mm a`, Yesterday, weekday, `MMM d`, `dd/MM/yy`); unread badge; online dot / group hash indicator.
- Message bubbles (own = right/primary, others = left/muted), reactions chips, `CheckCheck` read status, edited marker, per-message actions dropdown (Reply/Copy/Delete), auto-scroll on new message, date separators (Today/Yesterday/`EEEE, MMMM d`).
- Message input: textarea auto-resize, attach dropdown (Photo or video / Document), emoji + more buttons, Send/Mic toggle, Enter-to-send.

## Validation

- `npm run build` (vite build) passes cleanly.
- No browser tool available in this subagent run; structural/type verification via build + code review only.
