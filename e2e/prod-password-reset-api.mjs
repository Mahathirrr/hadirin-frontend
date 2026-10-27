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
  const statusRes = await fetch(`${API_BASE}/auth/password-reset/status`)
  const status = await statusRes.json()
  assert('password-reset status 200', statusRes.ok, statusRes.status)
  assert('password-reset enabled', status.enabled === true, status)

  const forgotRes = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'muhammad.mahathir.id@gmail.com' }),
  })
  const forgot = await forgotRes.json()
  assert('forgot-password 200', forgotRes.ok, forgotRes.status)
  assert('forgot generic message', typeof forgot.message === 'string' && forgot.message.length > 10, forgot)

  const badReset = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: 'invalid-token', password: 'newpass123' }),
  })
  assert('bad reset 400', badReset.status === 400, badReset.status)

  console.log('\nPassword reset production smoke LULUS.')
}

main()
