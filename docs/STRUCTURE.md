# Hadirin frontend structure

```
src/
  lib/
    api.ts           HTTP client + typed API surface
    api-error.ts     User-facing error messages
    routes.ts        Path constants
    dev.ts / dev-mock.ts   Local dev bypass (never in production)
  composables/
    useWorkspaceData.ts    Load data when workspace/token ready
    useEmployeeAccess.ts   Manager vs linked-employee rules (matches backend)
  stores/
    auth.ts          Session, workspace selection
  router/
    index.ts         Landing, auth, app shell routes
  views/
    app/             Dashboard modules (Ringkasan, Karyawan, …)
    auth/            Sign-in, onboarding
    LandingPage.vue
  components/
    app/             Shared app UI
    landing/         Marketing sections
```

Data flow: **view → composable/store → `api` → hadirin-backend**

Role rules mirror the API: **owner/admin** manage any employee; **member** only rows where `employee.user_id` matches the logged-in user.
