#!/usr/bin/env node
const API_BASE = (process.env.API_BASE ?? 'https://hadirin.showcaseproject.my.id/api').replace(/\/$/, '')

function assert(name, ok, detail) {
  if (!ok) {
    console.error('FAIL', name, detail)
    process.exit(1)
  }
  console.log('OK ', name)
}

async function main() {
  const statusRes = await fetch(`${API_BASE}/auth/google/status`)
  const status = await statusRes.json()
  assert('google status 200', statusRes.ok, statusRes.status)
  assert('google enabled', status.enabled === true, status)

  const startRes = await fetch(`${API_BASE}/auth/google/start`, { redirect: 'manual' })
  assert('start redirect', startRes.status === 302 || startRes.status === 307, startRes.status)
  const loc = startRes.headers.get('location') ?? ''
  assert('redirect google', /accounts\.google\.com/.test(loc), loc.slice(0, 80))
  assert('client_id in url', loc.includes('client_id='), '')
  const cookie = startRes.headers.get('set-cookie') ?? ''
  assert('oauth_state cookie', /oauth_state=/.test(cookie), cookie.slice(0, 60))

  console.log('\nGoogle OAuth production smoke LULUS.')
}

main()
