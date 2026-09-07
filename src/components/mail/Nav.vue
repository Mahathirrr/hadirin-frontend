<script setup lang="ts">
import type { Component } from 'vue'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface MailLink {
  title: string
  label?: string
  icon: Component
  variant: 'default' | 'ghost'
}

interface Props {
  isCollapsed: boolean
  links: MailLink[]
}

const props = defineProps<Props>()
</script>

<template>
  <div
    :data-collapsed="props.isCollapsed"
    class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
  >
    <nav
      class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
    >
      <template v-for="(link, index) in props.links" :key="index">
        <Tooltip v-if="props.isCollapsed" :delay-duration="0">
          <TooltipTrigger as-child>
            <button
              :class="cn(
                buttonVariants({ variant: link.variant, size: 'icon' }),
                'size-9 cursor-pointer',
                link.variant === 'default' &&
                  'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
              )"
            >
              <component :is="link.icon" class="size-4" />
              <span class="sr-only">{{ link.title }}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" class="flex items-center gap-4">
            {{ link.title }}
            <Badge
              v-if="link.label"
              class="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full cursor-pointer"
            >
              {{ link.label }}
            </Badge>
          </TooltipContent>
        </Tooltip>
        <button
          v-else
          :class="cn(
            buttonVariants({ variant: link.variant, size: 'sm' }),
            link.variant === 'default' &&
              'group dark:bg-muted dark:text-foreground dark:hover:bg-muted dark:hover:text-foreground',
            'justify-start cursor-pointer',
          )"
        >
          <component :is="link.icon" class="mr-2 size-4" />
          {{ link.title }}
          <span
            v-if="link.label"
            :class="cn(
              'ml-auto',
              link.variant === 'default' && 'text-background dark:text-muted-foreground',
            )"
          >
            {{ link.label }}
          </span>
        </button>
      </template>
    </nav>
  </div>
</template>
