<template>
  <div class="relative mx-auto max-w-5xl">
    <div class="absolute top-8 left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl lg:-top-4 lg:h-72" />

    <div class="relative overflow-hidden rounded-[1.75rem] bg-card p-3 shadow-[0_32px_80px_-30px_rgb(0_0_0/0.28)] sm:p-4">
      <div class="grid min-h-[330px] grid-cols-[58px_1fr] overflow-hidden rounded-[1.25rem] bg-muted/45 sm:grid-cols-[140px_1fr]">
        <aside class="flex flex-col justify-between bg-foreground px-3 py-5 text-background sm:px-5">
          <div>
            <div class="flex items-center gap-2">
              <div class="grid size-6 place-items-center rounded-lg bg-background text-foreground">
                <svg viewBox="0 0 32 32" class="size-4" fill="none" aria-hidden="true">
                  <path d="M5 5h10.5a3 3 0 0 1 3 3v6.5H8a3 3 0 0 1-3-3V5Z" fill="currentColor" />
                  <path d="M14 17.5h10.5a3 3 0 0 1 3 3V27H17a3 3 0 0 1-3-3v-6.5Z" fill="currentColor" />
                </svg>
              </div>
              <span class="hidden text-xs font-semibold sm:block">Hadirin</span>
            </div>
            <div class="mt-10 space-y-3">
              <div class="h-7 rounded-md bg-background/15" />
              <div class="h-7 rounded-md bg-background/8" />
              <div class="h-7 rounded-md bg-background/8" />
              <div class="h-7 rounded-md bg-background/8" />
            </div>
          </div>
          <div class="h-8 rounded-md bg-background/10" />
        </aside>

        <div class="min-w-0 p-4 sm:p-6">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <p class="text-xs text-muted-foreground">Senin, 7 September</p>
              <p class="mt-1 text-sm font-semibold sm:text-base">Selamat pagi, Admin</p>
            </div>
            <div class="size-8 rounded-full bg-foreground/10" />
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-card px-3 py-3 shadow-sm sm:px-4">
              <p class="text-[10px] text-muted-foreground sm:text-xs">Hadir hari ini</p>
              <p class="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">18 <span class="text-xs font-medium text-muted-foreground">/ 20</span></p>
            </div>
            <div class="rounded-xl bg-card px-3 py-3 shadow-sm sm:px-4">
              <p class="text-[10px] text-muted-foreground sm:text-xs">Terlambat</p>
              <p class="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">02</p>
            </div>
            <div class="hidden rounded-xl bg-card px-4 py-3 shadow-sm sm:block">
              <p class="text-xs text-muted-foreground">Menunggu cuti</p>
              <p class="mt-1 text-2xl font-semibold tracking-tight">03</p>
            </div>
          </div>

          <div class="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.8fr]">
            <div class="rounded-xl bg-card p-4 shadow-sm">
              <div class="mb-3 flex items-center justify-between">
                <p class="text-xs font-semibold">Kehadiran minggu ini</p>
                <span class="text-[10px] text-muted-foreground">7 hari terakhir</span>
              </div>
              <svg viewBox="0 0 280 88" class="h-20 w-full text-foreground" fill="none" aria-hidden="true">
                <path d="M0 70 C 28 62, 42 48, 70 50 C 98 52, 112 28, 140 32 C 168 36, 182 18, 210 22 C 238 26, 252 14, 280 16" class="stroke-foreground" stroke-width="2.5" stroke-linecap="round" />
                <path d="M0 70 C 28 62, 42 48, 70 50 C 98 52, 112 28, 140 32 C 168 36, 182 18, 210 22 C 238 26, 252 14, 280 16 V 88 H 0 Z" class="fill-foreground/8" />
              </svg>
            </div>

            <div class="hidden space-y-3 rounded-xl bg-card p-4 shadow-sm lg:block">
              <p class="text-xs font-semibold">Karyawan terbaru</p>
              <div v-for="name in ['Alya Putri', 'Raka Pratama', 'Nadia Aulia']" :key="name" class="flex items-center gap-2">
                <div class="size-6 rounded-full bg-muted" />
                <span class="text-[10px] font-medium">{{ name }}</span>
                <span class="ml-auto size-1.5 rounded-full bg-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute -right-2 bottom-0 w-36 rotate-3 sm:right-4 sm:w-44 md:right-8">
      <div class="rounded-[1.6rem] bg-foreground p-2 shadow-2xl">
        <div class="rounded-[1.2rem] bg-card px-4 py-5 text-center">
          <p class="text-[11px] font-medium text-muted-foreground">Absen masuk</p>
          <div class="mx-auto my-4 flex size-20 items-center justify-center rounded-full bg-primary/10">
            <div class="flex size-14 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary/40">
              <svg viewBox="0 0 24 24" class="size-7 text-foreground" fill="none" aria-hidden="true">
                <circle cx="12" cy="9" r="3" stroke="currentColor" stroke-width="1.8" />
                <path d="M6.5 19c.8-3 3-4.5 5.5-4.5S16.7 16 17.5 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            </div>
          </div>
          <p class="text-sm font-semibold">Face ID siap</p>
          <p class="mt-1 text-[11px] text-muted-foreground">Di dalam area kerja</p>
        </div>
      </div>
    </div>
  </div>
</template>
