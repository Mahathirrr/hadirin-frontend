<script setup lang="ts">
import { onMounted } from 'vue'
import { Toaster } from 'vue-sonner'

import ThemeProvider from '@/components/theme-provider.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

onMounted(() => auth.init())
</script>

<template>
  <ThemeProvider default-theme="light" storage-key="hadirin-theme">
    <div class="font-sans antialiased" style="font-family: var(--font-inter)">
      <RouterView />
      <Toaster rich-colors position="top-right" />
    </div>
  </ThemeProvider>
</template>
