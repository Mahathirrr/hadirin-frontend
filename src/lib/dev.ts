/** Dev-only: skip login and use mock workspace data. Never enabled in production builds. */
export const DEV_SKIP_AUTH =
  import.meta.env.DEV && import.meta.env.VITE_DEV_SKIP_AUTH === 'true'

export const DEV_MOCK_TOKEN = 'dev-bypass-token'

export const DEV_MOCK_USER = {
  id: 1,
  name: 'Muhammad Mahathir',
  email: 'muhammad.mahathir.id@gmail.com',
} as const

export const DEV_MOCK_WORKSPACE_ID = 1

export const DEV_MOCK_MEMBERSHIPS = [
  {
    workspace_id: DEV_MOCK_WORKSPACE_ID,
    role: 'owner',
    workspace: {
      id: DEV_MOCK_WORKSPACE_ID,
      name: 'Showcase Project HQ',
      slug: 'showcase-hq',
      plan: 'pro',
    },
  },
] as const
