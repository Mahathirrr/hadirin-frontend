import { toast } from 'vue-sonner'

import { getCurrentPosition, type GeoCoords } from '@/composables/useGeolocation'
import { api, type WorkspaceSettings } from '@/lib/api'

export type CheckInPayload = {
  employee_id: number
  latitude?: number
  longitude?: number
  accuracy_m?: number
  check_in_method: string
  face_verification_token?: string
}

export async function resolveCheckInCoords(settings: WorkspaceSettings): Promise<GeoCoords | null> {
  if (!settings.geofence_enabled) return null
  return getCurrentPosition()
}

export function buildAttendanceBody(
  employeeId: number,
  settings: WorkspaceSettings,
  coords: GeoCoords | null,
  opts?: { method?: string; faceToken?: string },
): CheckInPayload {
  const body: CheckInPayload = {
    employee_id: employeeId,
    check_in_method: opts?.method ?? 'manual',
  }
  if (coords) {
    body.latitude = coords.latitude
    body.longitude = coords.longitude
    body.accuracy_m = coords.accuracy_m
  }
  if (opts?.faceToken) {
    body.check_in_method = 'face'
    body.face_verification_token = opts.faceToken
  }
  if (settings.geofence_enabled && (body.latitude == null || body.longitude == null)) {
    throw new Error('Geofence aktif — lokasi GPS wajib untuk check-in.')
  }
  return body
}

export async function performFaceVerifyAndCheckIn(
  token: string,
  workspaceId: number,
  employeeId: number,
  photo: File,
  settings: WorkspaceSettings,
) {
  const coords = await resolveCheckInCoords(settings)
  const verify = await api.verifyFaceEnrollment(token, workspaceId, employeeId, photo)
  if (!verify.match || !verify.verification_token) {
    throw new Error('Wajah tidak cocok dengan enrollment. Gunakan foto yang sama dengan saat pendaftaran.')
  }
  const body = buildAttendanceBody(employeeId, settings, coords, {
    method: 'face',
    faceToken: verify.verification_token,
  })
  await api.createAttendance(token, workspaceId, body)
  toast.success('Check-in Face ID berhasil')
}

export async function performManualCheckIn(
  token: string,
  workspaceId: number,
  employeeId: number,
  settings: WorkspaceSettings,
) {
  const coords = await resolveCheckInCoords(settings)
  const body = buildAttendanceBody(employeeId, settings, coords, { method: 'manual' })
  await api.createAttendance(token, workspaceId, body)
  toast.success('Check-in berhasil')
}
