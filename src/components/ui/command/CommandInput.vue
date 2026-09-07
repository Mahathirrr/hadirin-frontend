<script setup lang="ts">
import { SearchIcon } from 'lucide-vue-next'
import { useCommand } from './context'
const props = defineProps<{ class?: string; placeholder?: string }>()
const { query, setQuery } = useCommand()
</script>
<template>
  <div data-slot="command-input-wrapper" class="flex h-9 items-center gap-2 border-b px-3">
    <SearchIcon class="size-4 shrink-0 opacity-50" />
    <input
      data-slot="command-input"
      :value="query"
      :placeholder="props.placeholder"
      class="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
      @input="setQuery(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
