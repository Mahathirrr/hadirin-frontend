#!/usr/bin/env node
/**
 * E2E penuh Geofence + Face ID (production). Tanpa skip — reset absensi hari ini via SSH showcase.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { resetTodayAttendanceForEmails } from './lib/prod-reset.mjs'

const API_BASE = (process.env.API_BASE ?? 'https://hadirin.showcaseproject.my.id/api').replace(/\/$/, '')
const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'muhammad.mahathir.id@gmail.com'
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? 'admin123'
const studentEmail = process.env.E2E_STUDENT_EMAIL ?? 'ahmad.rizki@student.usk.ac.id'
const studentPassword = process.env.E2E_STUDENT_PASSWORD ?? 'student123'
const medanStudentEmail = process.env.E2E_MEDAN_EMAIL ?? 'siti.nurhaliza@student.usk.ac.id'
const medanStudentPassword = process.env.E2E_MEDAN_PASSWORD ?? 'student123'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixturePhoto = path.join(__dirname, 'fixtures/test-face.jpg')
const fixtureWrong = path.join(__dirname, 'fixtures/test-face-wrong.jpg')

const HQ_EMAILS = [
  'ahmad.rizki@student.usk.ac.id',
  'budi.santoso@student.usk.ac.id',
  'dewi.lestari@showcaseproject.my.id',
]
const MEDAN_EMAILS = ['siti.nurhaliza@student.usk.ac.id', 'doni.pratama@student.usk.ac.id']

if (!fs.existsSync(fixturePhoto) || !fs.existsSync(fixtureWrong)) {
  console.error('Missing e2e/fixtures/test-face.jpg or test-face-wrong.jpg')
  process.exit(1)
}

async function request(method, urlPath, { token, body, formData } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  let bodyInit
  if (formData) {
    bodyInit = formData
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    bodyInit = JSON.stringify(body)
  }
  const res = await fetch(`${API_BASE}${urlPath}`, { method, headers, body: bodyInit })
  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { raw: text }
  }
  return { status: res.status, json, text }
}

async function login(email, password) {
  const { status, json } = await request('POST', '/auth/login', { body: { email, password } })
  if (status !== 200 || !json?.token) throw new Error(`login ${email}: ${status} ${JSON.stringify(json)}`)
  return json.token
}

async function me(token) {
  const { status, json } = await request('GET', '/auth/me', { token })
  if (status !== 200) throw new Error(`me: ${status}`)
  return json
}

function workspaceIdForSlug(memberships, slugPart) {
  const m = memberships.find((x) => String(x.workspace?.slug ?? '').includes(slugPart))
  return m?.workspace_id ?? m?.workspace?.id
}

function multipartFace(employeeId, photoPath) {
  const fd = new FormData()
  fd.append('employee_id', String(employeeId))
  fd.append('photo', new Blob([fs.readFileSync(photoPath)], { type: 'image/jpeg' }), 'face.jpg')
  return fd
}

function assert(name, ok, detail) {
  if (!ok) {
    console.error(`FAIL ${name}:`, detail)
    process.exitCode = 1
    throw new Error(name)
  }
  console.log(`OK  ${name}`)
}

async function findEmployee(token, workspaceId, emailSubstring) {
  const empRes = await request('GET', `/employees?workspace_id=${workspaceId}`, { token })
  assert('list employees', empRes.status === 200, empRes)
  const list = empRes.json?.data ?? empRes.json ?? []
  const emp = list.find((e) => String(e.email ?? e.name).includes(emailSubstring))
  assert(`find employee ${emailSubstring}`, emp?.id, list.map((e) => `${e.name} <${e.email}>`))
  return Number(emp.id)
}

async function geofencePoint(token, workspaceId) {
  const geoRes = await request('GET', `/geofences?workspace_id=${workspaceId}`, { token })
  const points = geoRes.json?.data ?? geoRes.json ?? []
  assert('geofences listed', geoRes.status === 200 && points.length > 0, geoRes.status)
  const activePoint = points.find((p) => p.active !== false) ?? points[0]
  return { lat: Number(activePoint.latitude), lon: Number(activePoint.longitude) }
}

async function main() {
  console.log(`API ${API_BASE}\n=== Reset absensi hari ini (showcase) ===`)
  if (process.env.E2E_SKIP_SSH_RESET === '1') {
    console.log('SKIP reset (E2E_SKIP_SSH_RESET=1)')
  } else {
    resetTodayAttendanceForEmails([...HQ_EMAILS, ...MEDAN_EMAILS])
    console.log('OK  reset attendance today for E2E emails')
  }

  const adminToken = await login(adminEmail, adminPassword)
  const adminMe = await me(adminToken)
  const hqWs = workspaceIdForSlug(adminMe.memberships, 'hq') ?? adminMe.memberships[0]?.workspace_id
  assert('HQ workspace', hqWs, adminMe.memberships)

  const settingsRes = await request('GET', `/workspace-settings?workspace_id=${hqWs}`, { token: adminToken })
  const settings = settingsRes.json?.data ?? settingsRes.json
  assert('geofence enabled HQ', settings?.geofence_enabled === true, settings)
  assert('face_id enabled HQ', settings?.face_id_enabled === true, settings)

  const { lat, lon } = await geofencePoint(adminToken, hqWs)

  console.log('\n=== Budi — manual + geofence (admin) ===')
  const budiId = await findEmployee(adminToken, hqWs, 'budi.santoso')
  const budiOut = await request('POST', `/attendance?workspace_id=${hqWs}`, {
    token: adminToken,
    body: {
      employee_id: budiId,
      latitude: lat + 2,
      longitude: lon + 2,
      accuracy_m: 10,
      check_in_method: 'manual',
    },
  })
  assert('Budi geofence rejects outside', budiOut.status === 400, budiOut)
  const budiIn = await request('POST', `/attendance?workspace_id=${hqWs}`, {
    token: adminToken,
    body: { employee_id: budiId, latitude: lat, longitude: lon, accuracy_m: 12, check_in_method: 'manual' },
  })
  assert('Budi manual check-in inside geofence', budiIn.status === 201, budiIn)

  console.log('\n=== Ahmad — face enroll, verify gagal/benar, student check-in ===')
  const ahmadId = await findEmployee(adminToken, hqWs, 'ahmad.rizki')
  assert('face enroll Ahmad', (await request('POST', `/face-enrollments?workspace_id=${hqWs}`, {
    token: adminToken,
    formData: multipartFace(ahmadId, fixturePhoto),
  })).status === 201)

  const noGps = await request('POST', `/attendance?workspace_id=${hqWs}`, {
    token: adminToken,
    body: { employee_id: ahmadId, check_in_method: 'manual' },
  })
  assert('geofence rejects tanpa GPS', noGps.status === 400, noGps)

  const wrongVerify = await request('POST', `/face-enrollments/verify?workspace_id=${hqWs}`, {
    token: adminToken,
    formData: multipartFace(ahmadId, fixtureWrong),
  })
  assert('verify foto salah → no match', wrongVerify.status === 200 && wrongVerify.json?.match === false, wrongVerify.json)

  const okVerify = await request('POST', `/face-enrollments/verify?workspace_id=${hqWs}`, {
    token: adminToken,
    formData: multipartFace(ahmadId, fixturePhoto),
  })
  assert('verify foto benar', okVerify.status === 200 && okVerify.json?.match === true, okVerify.json)
  const faceTokenAdmin = okVerify.json?.verification_token

  const studentToken = await login(studentEmail, studentPassword)
  const studentMe = await me(studentToken)
  const studentWs = workspaceIdForSlug(studentMe.memberships, 'showcase') ?? studentMe.memberships[0]?.workspace_id
  assert('student HQ workspace', studentWs === hqWs, { studentWs, hqWs })

  const studentVerify = await request('POST', `/face-enrollments/verify?workspace_id=${hqWs}`, {
    token: studentToken,
    formData: multipartFace(ahmadId, fixturePhoto),
  })
  assert('student verify wajah', studentVerify.status === 200 && studentVerify.json?.match === true, studentVerify)
  const faceTokenStudent = studentVerify.json?.verification_token

  const ahmadIn = await request('POST', `/attendance?workspace_id=${hqWs}`, {
    token: studentToken,
    body: {
      employee_id: ahmadId,
      latitude: lat,
      longitude: lon,
      accuracy_m: 15,
      check_in_method: 'face',
      face_verification_token: faceTokenStudent,
    },
  })
  assert('student face check-in inside geofence', ahmadIn.status === 201, ahmadIn)

  const dup = await request('POST', `/attendance?workspace_id=${hqWs}`, {
    token: studentToken,
    body: {
      employee_id: ahmadId,
      latitude: lat,
      longitude: lon,
      accuracy_m: 15,
      check_in_method: 'face',
      face_verification_token: faceTokenAdmin,
    },
  })
  assert('student double check-in same day → conflict', dup.status === 409, dup)

  console.log('\n=== Dewi — face pipeline (admin) ===')
  const dewiId = await findEmployee(adminToken, hqWs, 'dewi.lestari')
  assert('Dewi enroll', (await request('POST', `/face-enrollments?workspace_id=${hqWs}`, {
    token: adminToken,
    formData: multipartFace(dewiId, fixturePhoto),
  })).status === 201)
  const dewiVerify = await request('POST', `/face-enrollments/verify?workspace_id=${hqWs}`, {
    token: adminToken,
    formData: multipartFace(dewiId, fixturePhoto),
  })
  assert('Dewi verify match', dewiVerify.json?.match === true, dewiVerify.json)
  const dewiFace = await request('POST', `/attendance?workspace_id=${hqWs}`, {
    token: adminToken,
    body: {
      employee_id: dewiId,
      latitude: lat,
      longitude: lon,
      accuracy_m: 10,
      check_in_method: 'face',
      face_verification_token: dewiVerify.json?.verification_token,
    },
  })
  assert('Dewi face check-in', dewiFace.status === 201, dewiFace)

  console.log('\n=== Medan — Siti member + geofence ===')
  const medanWs = workspaceIdForSlug(adminMe.memberships, 'medan')
  assert('Medan workspace exists', medanWs, adminMe.memberships)
  const medanSettings = await request('GET', `/workspace-settings?workspace_id=${medanWs}`, { token: adminToken })
  assert('Medan geofence on', medanSettings.json?.data?.geofence_enabled ?? medanSettings.json?.geofence_enabled, medanSettings.json)

  const { lat: mLat, lon: mLon } = await geofencePoint(adminToken, medanWs)
  const sitiId = await findEmployee(adminToken, medanWs, 'siti.nurhaliza')
  assert('Siti enroll Medan', (await request('POST', `/face-enrollments?workspace_id=${medanWs}`, {
    token: adminToken,
    formData: multipartFace(sitiId, fixturePhoto),
  })).status === 201)

  const sitiToken = await login(medanStudentEmail, medanStudentPassword)
  const sitiMe = await me(sitiToken)
  const sitiWs = workspaceIdForSlug(sitiMe.memberships, 'medan') ?? sitiMe.memberships[0]?.workspace_id
  assert('Siti workspace Medan', sitiWs === medanWs, { sitiWs, medanWs })

  const sitiVerify = await request('POST', `/face-enrollments/verify?workspace_id=${medanWs}`, {
    token: sitiToken,
    formData: multipartFace(sitiId, fixturePhoto),
  })
  assert('Siti verify', sitiVerify.json?.match === true, sitiVerify)
  const sitiIn = await request('POST', `/attendance?workspace_id=${medanWs}`, {
    token: sitiToken,
    body: {
      employee_id: sitiId,
      latitude: mLat,
      longitude: mLon,
      accuracy_m: 18,
      check_in_method: 'face',
      face_verification_token: sitiVerify.json?.verification_token,
    },
  })
  assert('Siti face check-in Medan geofence', sitiIn.status === 201, sitiIn)

  console.log('\n=== Semua E2E Geofence + Face ID production LULUS ===')
}

main().catch((e) => {
  console.error(e.message ?? e)
  process.exit(1)
})
