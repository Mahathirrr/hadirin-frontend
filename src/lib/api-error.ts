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
  switch (status) {
  case 401:
    return 'Sesi berakhir. Silakan login kembali.'
  case 403:
    return raw || 'Anda tidak memiliki akses untuk aksi ini.'
  case 404:
    return raw || 'Data tidak ditemukan.'
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
