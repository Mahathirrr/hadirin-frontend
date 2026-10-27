# Studi performa Hadirin — portofolio engineering

Dokumen ini menjelaskan **optimasi yang benar-benar diimplementasi**, **urutan keputusan**, **alasan teknis**, dan **bukti pengukuran** (bukan angka fiktif). Semua benchmark dapat diulang dengan skrip di repo.

## Ringkasan hasil (production)

Target: `https://hadirin.showcaseproject.my.id` · workspace demo `id=1` · 25 sampel + 3 warmup per endpoint · 2026-10-27.

| Endpoint | Metrik | Sebelum | Sesudah | Catatan |
|----------|--------|---------|---------|---------|
| `GET /dashboard/summary` | p50 warm (tanpa request pertama) | **141 ms** | **~44 ms** | −69% (Redis cache hit) |
| `GET /dashboard/summary` | p95 warm | **186 ms** | **~47 ms** | Stabil, varians kecil |
| `GET /attendance?limit=20` | p50 warm | **246 ms** | **143 ms** | −42% (index + filter sargable) |
| `GET /attendance?limit=20` | p95 warm | **354 ms** | **235 ms** | Beban Preload `Employee` tetap ada |

Sumber mentah: [`docs/perf/results-before.json`](perf/results-before.json), [`docs/perf/results-after.json`](perf/results-after.json).

```bash
# Ulangi pengukuran
cd hadirin-backend
E2E_EMAIL=... E2E_PASSWORD=... node scripts/perf/benchmark-api.mjs
```

## Diagram alur

![Diagram optimasi Hadirin](perf/hadirin-performance-diagram.png)

## Urutan optimasi (dan mengapa)

### 1. Query sargable (tanpa `DATE(created_at)`)

**Masalah:** Filter `DATE(created_at) = '2026-10-27'` menerapkan fungsi pada kolom sehingga Postgres **tidak bisa memakai index B-tree** pada `created_at` (non-sargable).

**Solusi:** Rentang waktu `[startOfDay, endOfDay)` dengan `created_at >= ? AND created_at < ?`.

**File:** `internal/repository/gormrepo/date_range.go`, `dashboard.go`, `attendance.go`, `public.go`.

**Alasan prioritas:** Perbaikan planner tanpa infrastruktur baru; aman untuk production; mudah diverifikasi dengan `EXPLAIN ANALYZE`.

### 2. Index komposit (partial, workspace-scoped)

**Masalah:** Dashboard memanggil ~15 agregat COUNT per request; daftar absensi filter `workspace_id` + urut `created_at`. Tanpa index yang selaras, skala data absensi memicu sequential scan.

**Solusi (migrasi `000014_performance`):**

- `attendances (workspace_id, created_at DESC) WHERE deleted_at IS NULL`
- `attendances (workspace_id, status, created_at) WHERE deleted_at IS NULL`
- `employees (workspace_id, status) WHERE deleted_at IS NULL`
- `leave_requests (workspace_id, status) WHERE deleted_at IS NULL`

**Alasan partial index:** Kolom `deleted_at` (soft delete) — index hanya baris aktif, lebih kecil & cache-friendly.

**Alasan composite:** Pola query selalu membatasi `workspace_id` dulu (multi-tenant), lalu waktu/status.

### 3. Cache Redis — dashboard summary

**Masalah:** `/dashboard/summary` menjalankan banyak query COUNT + loop 7 hari trend. UI dashboard dan landing sering **polling/refresh**; data tidak perlu real-time detik.

**Solusi:** Cache JSON per `(workspace_id, hari)` di Redis, TTL konfigurasi `DASHBOARD_CACHE_TTL_SEC` (production: **45 detik**).

**File:** `internal/usecase/dashboard.go`, `dashboard_build.go`.

**Kenapa cache (bukan hanya index):**

- Menghilangkan burst query identik saat banyak tab/user.
- TTL pendek: trade-off **staleness ≤45s** vs latensi & beban DB.
- Invalidation sederhana: key berisi tanggal kalender; rollover tengah malam otomatis key baru.

**Bukan cache untuk:** check-in/out, billing, auth — data harus konsisten & auditable.

## Frontend (perceived performance)

| Teknik | Di mana | Alasan |
|--------|---------|--------|
| Route-level code splitting | `router/index.ts` (`import()`) | Bundle awal kecil; halaman auth/dashboard dimuat on-demand |
| `loading="lazy"` gambar | Landing, auth, testimonial | TTFB/LCP landing tidak menunggu gambar below-the-fold |
| Chart data memo | `RechartsArea.vue` | Hindari recompute array saat props referensial sama |

Halaman studi kasus (Vue): `/engineering/performance` di frontend — menampilkan JSON benchmark & penjelasan singkat.

## Metodologi (best practice)

1. **Ukur dulu** — skrip `scripts/perf/benchmark-api.mjs`, laporkan p50/p95, pisahkan **cold** (request pertama) vs **warm**.
2. **Satu perubahan dominan per lapisan** — query → index → cache; dokumentasi before/after.
3. **Production-like path** — HTTPS, nginx, PM2, Postgres & Redis on-host (bukan microbench Go saja).
4. **Tidak mengklaim tanpa file JSON** — commit hasil ke `docs/perf/`.

## Environment

| Variabel | Fungsi |
|----------|--------|
| `DASHBOARD_CACHE_TTL_SEC` | TTL cache dashboard; `0` = mati (dev/test) |

## Batasan & lanjutan

- **Attendance list** masih `Preload("Employee")` — optimasi berikutnya: SELECT kolom spesifik atau materialized view laporan harian.
- **Dashboard cold** masih ~150–200 ms (cache miss) — acceptable; warm path yang dioptimalkan untuk UX repeat load.
- Upgrade Redis 6 → 7+ opsional (`GETDEL` sudah di-handle untuk password reset terpisah).

## Referensi keputusan

Lihat juga [`docs/DECISIONS.md`](DECISIONS.md) (bagian performa).
