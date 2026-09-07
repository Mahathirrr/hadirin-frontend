<script setup lang="ts">
import { useRoute } from 'vue-router'

import BaseLayout from '@/components/layouts/base-layout.vue'

const route = useRoute()
</script>

<template>
  <BaseLayout
    :title="(route.meta.title as string) || undefined"
    :description="(route.meta.description as string) || undefined"
  >
    <RouterView />
  </BaseLayout>
</template>
