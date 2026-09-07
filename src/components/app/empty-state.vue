<script setup lang="ts">
import { Info } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps<{
  title: string
  description?: string
  actionLabel?: string
}>()

defineEmits<{ action: [] }>()
</script>

<template>
  <div class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/15 px-4 py-8 text-center">
    <Info class="mb-2 size-6 text-muted-foreground" />
    <p class="text-sm font-medium">{{ title }}</p>
    <p v-if="description" class="mt-1 max-w-md text-sm text-muted-foreground">{{ description }}</p>
    <Button v-if="actionLabel" variant="outline" size="sm" class="mt-3" @click="$emit('action')">{{ actionLabel }}</Button>
  </div>
</template>
