# Hadirin Frontend

Vue 3 frontend for the Hadirin workforce attendance platform.

## Stack

- Vue 3, TypeScript, Vite, Tailwind CSS v4, shadcn-vue

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE` | empty | Leave empty in production for same-origin `/api` proxy |
| `VITE_API_URL` | `http://localhost:8080/api` | Local dev API URL |

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
VITE_API_BASE="" npm run build
```

Live site: https://hadirin.showcaseproject.my.id
