import type { LegalSection } from '@/components/legal/LegalDocumentPage.vue'

export const LEGAL_LAST_UPDATED = '27 Oktober 2026'

export const termsSections: LegalSection[] = [
  {
    id: 'pendahuluan',
    title: '1. Pendahuluan',
    paragraphs: [
      'Dokumen Syarat Layanan ("Syarat") mengatur penggunaan aplikasi dan layanan Hadirin ("Layanan") yang tersedia melalui situs hadirin.showcaseproject.my.id dan domain terkait.',
      'Dengan mendaftar, masuk, atau menggunakan Layanan, Anda menyatakan telah membaca, memahami, dan menyetujui Syarat ini serta Kebijakan Privasi Hadirin.',
    ],
  },
  {
    id: 'definisi',
    title: '2. Definisi',
    paragraphs: ['Dalam Syarat ini, istilah berikut memiliki arti:'],
    bullets: [
      'Pengguna: individu yang memiliki akun Hadirin.',
      'Perusahaan / workspace: organisasi tempat data presensi, karyawan, dan pengaturan dikelola.',
      'Admin: pengguna dengan wewenang mengelola workspace, karyawan, dan pengaturan.',
      'Langganan: paket berbayar yang memberi akses fitur sesuai batas karyawan dan fitur yang dipilih.',
    ],
  },
  {
    id: 'akun',
    title: '3. Akun dan pendaftaran',
    paragraphs: [
      'Anda wajib memberikan informasi yang benar saat pendaftaran dan menjaga kerahasiaan kata sandi akun.',
      'Anda bertanggung jawab atas aktivitas yang terjadi melalui akun Anda. Segera hubungi kami jika mengetahui penggunaan akun tanpa izin.',
      'Kami dapat menangguhkan atau menutup akun jika terdapat pelanggaran Syarat, indikasi penyalahgunaan, atau kewajiban hukum.',
    ],
  },
  {
    id: 'layanan',
    title: '4. Ruang lingkup layanan',
    paragraphs: [
      'Hadirin menyediakan software presensi dan operasional internal, termasuk antara lain absensi (GPS, QR, verifikasi wajah opsional), geofence, cuti, shift, laporan, dan fitur lain yang tercantum di aplikasi.',
      'Fitur dapat berubah, ditambah, atau dihentikan seiring pengembangan produk. Kami akan berupaya memberi pemberitahuan wajar untuk perubahan material yang memengaruhi operasional Anda.',
      'Layanan membutuhkan koneksi internet. Fitur tertentu (misalnya absensi offline penuh) mungkin belum tersedia sebagaimana dijelaskan di aplikasi.',
    ],
  },
  {
    id: 'langganan',
    title: '5. Langganan dan pembayaran',
    paragraphs: [
      'Akses penuh ke workspace produksi bergantung pada langganan aktif sesuai paket yang Anda pilih, kecuali ditentukan lain di aplikasi.',
      'Harga, durasi, dan batas karyawan mengikuti paket yang ditampilkan saat checkout. Pembayaran diproses melalui penyedia pembayaran pihak ketiga yang aman.',
      'Kegagalan perpanjangan dapat membatasi akses hingga status langganan diperbarui. Kebijakan refund, jika ada, mengikuti ketentuan yang ditampilkan pada saat transaksi atau permintaan resmi melalui kontak dukungan.',
    ],
  },
  {
    id: 'penggunaan',
    title: '6. Penggunaan yang diperbolehkan',
    paragraphs: ['Anda setuju untuk:'],
    bullets: [
      'Menggunakan Hadirin hanya untuk keperluan presensi dan operasional perusahaan yang sah.',
      'Mematuhi hukum ketenagakerjaan, perlindungan data, dan peraturan setempat yang berlaku.',
      'Tidak mencoba mengakses data workspace lain, mengganggu keamanan sistem, atau menyalahgunakan fitur biometrik/lokasi.',
      'Memastikan karyawan yang didaftarkan Face ID atau data lokasi telah diberi informasi yang memadai sesuai kebijakan perusahaan Anda.',
    ],
  },
  {
    id: 'data',
    title: '7. Data dan privasi',
    paragraphs: [
      'Pemrosesan data pribadi diatur dalam Kebijakan Privasi Hadirin, yang menjadi bagian integral dari perjanjian ini.',
      'Sebagai admin workspace, Anda bertanggung jawab atas keabsahan dasar pengumpulan data karyawan di organisasi Anda dan instruksi penggunaan Hadirin.',
    ],
  },
  {
    id: 'tanggung-jawab',
    title: '8. Batas tanggung jawab',
    paragraphs: [
      'Layanan disediakan "sebagaimana adanya" dalam batas yang diizinkan hukum. Kami berupaya menjaga ketersediaan dan keakuratan, namun tidak menjamin bebas gangguan atau kesalahan 100%.',
      'Hadirin bukan pengganti keputusan HR, payroll, atau audit legal. Keputusan operasional tetap menjadi tanggung jawab perusahaan Anda.',
      'Tanggung jawab kami terhadap kerugian tidak langsung atau konsekuensial dibatasi sejauh diizinkan peraturan perundang-undangan yang berlaku.',
    ],
  },
  {
    id: 'perubahan',
    title: '9. Perubahan Syarat',
    paragraphs: [
      'Kami dapat memperbarui Syarat ini. Tanggal "Terakhir diperbarui" akan diubah di halaman ini. Penggunaan berkelanjutan setelah perubahan dianggap sebagai penerimaan Syarat yang baru, kecuali diwajibkan oleh hukum.',
    ],
  },
  {
    id: 'hukum',
    title: '10. Hukum yang berlaku',
    paragraphs: [
      'Syarat ini diatur oleh hukum Republik Indonesia. Sengketa akan diselesaikan terlebih dahulu secara musyawarah; jika tidak tercapai, melalui pengadilan yang berwenang di Indonesia.',
    ],
  },
]

export const privacySections: LegalSection[] = [
  {
    id: 'pendahuluan',
    title: '1. Pendahuluan',
    paragraphs: [
      'Kebijakan Privasi ini menjelaskan bagaimana Hadirin mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi saat Anda menggunakan Layanan.',
      'Kebijakan ini disusun selaras dengan prinsip perlindungan data pribadi yang berlaku di Indonesia, termasuk Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).',
    ],
  },
  {
    id: 'pengendali',
    title: '2. Pengendali data',
    paragraphs: [
      'Pengelola layanan Hadirin (operasional hadirin.showcaseproject.my.id) bertindak sebagai pengendali data untuk data akun dan data yang diproses melalui platform.',
      'Untuk data karyawan yang dimasukkan admin workspace, perusahaan Anda dapat bertindak sebagai pengendali terhadap karyawan, sementara Hadirin memproses data atas instruksi penggunaan layanan (penyedia/pemroses sesuai konteks operasional).',
    ],
  },
  {
    id: 'data-dikumpulkan',
    title: '3. Data yang kami kumpulkan',
    bullets: [
      'Akun: nama, alamat email, kata sandi (disimpan dalam bentuk hash), foto profil jika ada (misalnya dari login Google).',
      'Data karyawan: nama, kontak, departemen, jabatan, status kepegawaian, dan data presensi terkait.',
      'Presensi: waktu check-in/out, metode absensi, catatan lokasi (koordinat GPS), data perangkat QR, log audit.',
      'Biometrik (opsional): template atau data verifikasi wajah untuk Face ID, jika diaktifkan workspace Anda.',
      'Teknis: alamat IP, log akses, identifikasi perangkat/browser, cookie atau token sesi yang diperlukan untuk keamanan.',
      'Langganan: riwayat paket, status pembayaran, identifikator transaksi dari penyedia pembayaran (bukan nomor kartu lengkap di server kami).',
    ],
    paragraphs: ['Kategori data yang dapat kami proses meliputi:'],
  },
  {
    id: 'tujuan',
    title: '4. Tujuan pemrosesan',
    bullets: [
      'Menyediakan, mengamankan, dan meningkatkan Layanan presensi.',
      'Memverifikasi identitas, mencegah penyalahgunaan, dan menjalankan langganan.',
      'Menghasilkan laporan kehadiran dan fitur operasional yang Anda gunakan.',
      'Mengirim notifikasi terkait layanan (termasuk web push jika Anda berlangganan).',
      'Memenuhi kewajiban hukum dan menanggapi permintaan resmi yang sah.',
    ],
    paragraphs: ['Data diproses untuk:'],
  },
  {
    id: 'biometrik-lokasi',
    title: '5. Data lokasi dan biometrik',
    paragraphs: [
      'Data GPS digunakan untuk geofence dan absensi berbasis lokasi saat fitur tersebut aktif. Akurasi mengikuti perangkat pengguna.',
      'Data wajah diproses untuk verifikasi absensi Face ID jika admin mengaktifkan fitur dan mendaftarkan karyawan. Data tidak digunakan untuk tujuan di luar verifikasi presensi yang dikonfigurasi workspace, kecuali diwajibkan hukum.',
      'Anda dapat meminta penghapusan enrollment wajah melalui admin workspace atau kontak dukungan, sesuai kebijakan retensi teknis.',
    ],
  },
  {
    id: 'pihak-ketiga',
    title: '6. Berbagi dengan pihak ketiga',
    paragraphs: [
      'Kami tidak menjual data pribadi Anda. Data dapat dibagikan terbatas kepada:',
    ],
    bullets: [
      'Penyedia infrastruktur (hosting, database, email transaksional) yang terikat kewajiban kerahasiaan.',
      'Penyedia pembayaran untuk memproses langganan.',
      'Penyedia autentikasi (misalnya Google) jika Anda memilih login tersebut.',
      'Otoritas publik jika diwajibkan oleh hukum yang berlaku.',
    ],
  },
  {
    id: 'retensi',
    title: '7. Retensi data',
    paragraphs: [
      'Data disimpan selama akun workspace aktif dan sesuai kebutuhan operasional, audit, atau kewajiban hukum.',
      'Anda dapat meminta penghapusan akun atau data tertentu melalui kontak dukungan. Beberapa log mungkin tetap disimpan untuk kepatuhan hukum atau keamanan dalam jangka waktu terbatas.',
    ],
  },
  {
    id: 'hak',
    title: '8. Hak subjek data',
    paragraphs: [
      'Sesuai UU PDP, Anda berhak mengajukan akses, perbaikan, penghapusan, dan pembatasan pemrosesan data pribadi, serta menarik persetujuan sejauh pemrosesan didasarkan persetujuan.',
      'Permintaan dapat diajukan ke email kontak di bawah. Kami akan merespons dalam jangka waktu yang wajar dan sesuai ketentuan hukum.',
    ],
  },
  {
    id: 'keamanan',
    title: '9. Keamanan',
    paragraphs: [
      'Kami menerapkan langkah teknis dan organisasi wajar, termasuk enkripsi transport (HTTPS), hashing kata sandi, kontrol akses berbasis peran, dan pemisahan data per workspace.',
      'Tidak ada sistem yang 100% aman. Segera laporkan jika Anda menemukan indikasi kebocoran atau akses tidak sah.',
    ],
  },
  {
    id: 'perubahan-privasi',
    title: '10. Perubahan kebijakan',
    paragraphs: [
      'Kebijakan dapat diperbarui seiring perkembangan produk atau regulasi. Perubahan material akan ditunjukkan melalui pembaruan tanggal di halaman ini atau pemberitahuan di aplikasi jika diperlukan.',
    ],
  },
]
