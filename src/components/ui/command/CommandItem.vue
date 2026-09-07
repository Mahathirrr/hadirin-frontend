<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'

import { cn } from '@/lib/utils'

import { useCommand } from './context'

interface Props {
  class?: string
  value?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const ctx = useCommand()

const text = computed(() => props.value ?? '')
const matches = computed(
  () =>
    !ctx.query.value ||
    text.value.toLowerCase().includes(ctx.query.value.toLowerCase()),
)

watch(
  matches,
  (m, prev) => {
    if (m && !prev) ctx.visibleCount.value++
    if (!m && prev) ctx.visibleCount.value--
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (matches) ctx.visibleCount.value = Math.max(0, ctx.visibleCount.value - 1)
})
</script>

<template>
  <button
    v-if="matches"
    type="button"
    data-slot="command-item"
    :disabled="props.disabled"
    :class="cn(
      'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
      props.class,
    )"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
