#!/usr/bin/env node
const API_BASE = (process.env.API_BASE ?? 'https://hadirin.showcaseproject.my.id/api').replace(/\/$/, '')
const EMAIL = process.env.E2E_EMAIL ?? 'muhammad.mahathir.id@gmail.com'
const PASSWORD = process.env.E2E_PASSWORD ?? 'admin123'

function assert(name, ok, detail) {
  if (!ok) {
    console.error('FAIL', name, detail)
    process.exit(1)
  }
  console.log('OK ', name)
}

async function main() {
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const login = await loginRes.json()
  assert('login', loginRes.ok && login.token, loginRes.status)
  const token = login.token

  const statusRes = await fetch(`${API_BASE}/billing/status`)
  const status = await statusRes.json()
  assert('billing enabled', status.enabled === true, status)
  assert('billing sandbox', status.sandbox === true, status)

  const meRes = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
  const me = await meRes.json()
  const wsId = me.memberships?.[0]?.workspace_id
  assert('workspace', !!wsId, me)

  const plansRes = await fetch(`${API_BASE}/billing/plans`)
  const plans = await plansRes.json()
  const planId = plans.data?.[0]?.id
  assert('plans', !!planId, plans)

  const checkoutRes = await fetch(`${API_BASE}/billing/checkout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ workspace_id: wsId, plan_id: planId }),
  })
  const checkout = await checkoutRes.json()
  assert('checkout 201', checkoutRes.status === 201, checkoutRes.status)
  assert('payment url', typeof checkout.payment_url === 'string' && checkout.payment_url.length > 8, checkout)
  const orderId = checkout.order?.public_id
  assert('order public_id', !!orderId, checkout.order)

  const simRes = await fetch(`${API_BASE}/billing/sandbox/orders/${orderId}/simulate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(120_000),
  })
  const simBody = await simRes.text()
  assert('simulate', simRes.ok, `${simRes.status} ${simBody}`)

  const syncRes = await fetch(`${API_BASE}/billing/orders/${orderId}/sync`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  const synced = await syncRes.json()
  assert('sync ok', syncRes.ok, syncRes.status)
  assert('order paid', synced.status === 'paid', synced)

  const subRes = await fetch(`${API_BASE}/billing/subscription?workspace_id=${wsId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const sub = await subRes.json()
  assert('subscription active', sub.status === 'active', sub)

  console.log('\nBilling sandbox API smoke LULUS.')
}

main()
