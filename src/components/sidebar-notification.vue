<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { ref } from 'vue'

import Logo from '@/components/logo.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const isVisible = ref(true)
</script>

<template>
  <Card
    v-if="isVisible"
    class="mb-3 border-neutral-200 bg-neutral-50 py-0 dark:border-neutral-700 dark:bg-neutral-800"
  >
    <CardContent class="relative p-4">
      <Button
        variant="ghost"
        size="sm"
        class="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-neutral-200 dark:hover:bg-neutral-700"
        @click="isVisible = false"
      >
        <X class="h-3 w-3" />
        <span class="sr-only">Close notification</span>
      </Button>

      <div class="pr-6">
        <h3 class="text-neutral-900 dark:text-neutral-100 mt-1 mb-2 flex items-center gap-3 font-semibold">
          <Logo :size="42" class="-mt-1" />
          <div>
            Welcome to
            <a
              href="https://shadcnstore.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              ShadcnStore
            </a>
          </div>
        </h3>
        <p class="text-muted-foreground dark:text-neutral-400 text-sm leading-relaxed">
          Explore our premium Shadcn UI
          <a
            href="https://shadcnstore.com/blocks"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary underline"
          >
            blocks
          </a>
          to build your next project faster.
        </p>
      </div>
    </CardContent>
  </Card>
</template>
