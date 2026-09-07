<script setup lang="ts">
import { Search } from 'lucide-vue-next'

defineProps<{ onClick?: () => void }>()
</script>

<template>
  <button
    @click="$emit('click', $event)"
    class="text-muted-foreground hover:bg-accent hover:text-accent-foreground relative inline-flex h-8 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm font-medium whitespace-nowrap shadow-sm transition-colors focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-36 lg:w-56"
  >
    <Search class="mr-2 h-3.5 w-3.5" />
    <span class="hidden lg:inline-flex">Cari...</span>
    <span class="inline-flex lg:hidden">Cari...</span>
    <kbd class="bg-muted pointer-events-none absolute top-1.5 right-1.5 hidden h-4 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
      <span class="text-xs">⌘</span>K
    </kbd>
  </button>
</template>
