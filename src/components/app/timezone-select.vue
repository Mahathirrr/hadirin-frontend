<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { INDONESIA_WORKSPACE_TIMEZONES, timezoneLabel } from '@/lib/timezone'

const model = defineModel<string>({ required: true })

defineProps<{
  disabled?: boolean
  placeholder?: string
}>()
</script>

<template>
  <Select v-model="model" :disabled="disabled">
    <SelectTrigger class="min-w-0 w-full max-w-full [&_[data-slot=select-value]]:truncate">
      <SelectValue :placeholder="placeholder ?? 'Zona waktu'">
        {{ timezoneLabel(model) }}
      </SelectValue>
    </SelectTrigger>
    <SelectContent class="max-w-[min(calc(100vw-2rem),18rem)]">
      <SelectItem
        v-for="z in INDONESIA_WORKSPACE_TIMEZONES"
        :key="z.value"
        :value="z.value"
        class="truncate"
      >
        {{ z.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
