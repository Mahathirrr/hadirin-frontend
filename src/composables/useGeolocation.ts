export type GeoCoords = {
  latitude: number
  longitude: number
  accuracy_m: number
}

export function getCurrentPosition(options?: { timeoutMs?: number; maximumAgeMs?: number }): Promise<GeoCoords> {
  const timeoutMs = options?.timeoutMs ?? 15_000
  const maximumAgeMs = options?.maximumAgeMs ?? 60_000

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Browser tidak mendukung GPS. Aktifkan lokasi atau gunakan perangkat lain.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy_m: Math.max(1, pos.coords.accuracy),
        })
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? 'Izin lokasi ditolak. Geofence aktif — izinkan lokasi untuk check-in.'
            : err.code === err.TIMEOUT
              ? 'GPS timeout. Coba lagi di area terbuka.'
              : 'Gagal membaca lokasi GPS.'
        reject(new Error(msg))
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: maximumAgeMs },
    )
  })
}
