<script setup lang="ts">
import { ArrowRight, Blocks, LayoutDashboard, Rocket } from 'lucide-vue-next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { assetUrl } from '@/lib/utils'

const SHADCN_BLOCKS_URL = 'https://shadcnstore.com/blocks'

function openBlocks() {
  window.open(SHADCN_BLOCKS_URL, '_blank')
}
</script>

<template>
  <div class="fixed z-50 right-4 bottom-8 flex flex-col items-end gap-2 md:right-6 lg:right-8">
    <HoverCard :open-delay="100" :close-delay="100">
      <HoverCardTrigger as-child>
        <Button
          size="lg"
          class="from-slate-900 to-slate-400 cursor-pointer bg-gradient-to-br px-6 py-3 font-bold text-white shadow-lg"
          style="min-width: 180px"
          @click="openBlocks()"
        >
          Upgrade to Pro
          <Rocket :size="30" class="ml-1" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent class="relative mr-4 mb-3 animate-in fade-in slide-in-from-bottom-4 rounded-xl border border-border bg-background p-3 shadow-2xl md:mr-6 lg:mr-8 w-90">
        <div class="flex flex-col items-center gap-3 text-center">
          <a :href="SHADCN_BLOCKS_URL" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <img
              :src="assetUrl('hero-images-container.png')"
              alt="Dashboard Preview"
              class="rounded-lg border shadow-lg"
              :width="400"
              :height="300"
            />
          </a>
          <h3 class="flex items-center gap-2 py-2 text-lg font-bold">
            <Rocket :size="18" class="text-primary" />
            Unlock Premium Blocks
            <Badge variant="destructive" class="rounded-full px-2 py-0.5 text-xs shadow">Live</Badge>
          </h3>
          <p class="text-muted-foreground mb-4 text-sm">
            Get access to exclusive premium blocks and dashboards for your next project. Elevate your UI instantly!
          </p>
          <div class="mt-2 flex w-full flex-row justify-center gap-2">
            <div class="relative w-1/2">
              <a :href="SHADCN_BLOCKS_URL" target="_blank" rel="noopener noreferrer">
                <Button class="flex w-full cursor-pointer items-center justify-center" variant="default">
                  <Blocks :size="16" />
                  Pro Blocks
                  <ArrowRight :size="16" />
                </Button>
              </a>
            </div>
            <div class="relative w-1/2">
              <Button class="flex w-full items-center justify-center" variant="default" disabled>
                <LayoutDashboard :size="16" />
                Pro Dashboards
              </Button>
              <span class="absolute -top-5 -right-1">
                <Badge variant="outline" class="rounded-full border-yellow-400 bg-yellow-400 px-2 py-0.5 text-xs text-yellow-900 shadow">Coming soon</Badge>
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </div>
</template>
