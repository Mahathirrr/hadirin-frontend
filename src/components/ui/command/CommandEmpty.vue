<script setup lang="ts">
import { useCommand } from './context'

const { visibleCount } = useCommand()
</script>

<template>
  <div v-if="visibleCount === 0" data-slot="command-empty" class="py-6 text-center text-sm">
    <slot />
  </div>
</template>
