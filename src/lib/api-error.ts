export class ApiError extends Error {
  status: number
  retryIn?: number

  constructor(message: string, status: number, retryIn?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.retryIn = retryIn
  }
}

export function friendlyApiMessage(status: number, raw: string, retryIn?: number): string {
  const lower = raw.toLowerCase()
  switch (status) {
  case 400:
    if (lower.includes('email')) return 'Format email tidak valid.'
    if (lower.includes('password') && lower.includes('min')) return 'Password minimal 6 karakter.'
    return raw || 'Data yang dikirim tidak valid.'
  case 401:
    if (lower.includes('invalid email or password')) return 'Email atau password salah.'
    if (lower.includes('google sign-in')) return 'Akun ini memakai Google. Silakan login dengan Google.'
    return raw || 'Sesi berakhir. Silakan login kembali.'
  case 403:
    return raw || 'Anda tidak memiliki akses untuk aksi ini.'
  case 404:
    return raw || 'Data tidak ditemukan.'
  case 409:
    if (lower.includes('already registered')) return 'Email sudah terdaftar.'
    return raw || 'Data sudah ada.'
  case 429:
    if (retryIn && retryIn > 0) {
      return `Terlalu banyak permintaan. Coba lagi dalam ${retryIn} detik.`
    }
    return 'Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.'
  case 503:
    return 'Layanan sementara tidak tersedia. Coba lagi nanti.'
  default:
    return raw || `Permintaan gagal (${status})`
  }
}
