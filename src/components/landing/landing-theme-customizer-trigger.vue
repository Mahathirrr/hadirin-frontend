<script setup lang="ts">
import { Settings } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()
</script>

<template>
  <Button
    size="icon"
    class="fixed top-1/2 right-4 z-50 h-12 w-12 -translate-y-1/2 cursor-pointer rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <Settings class="h-5 w-5" />
  </Button>
</template>
