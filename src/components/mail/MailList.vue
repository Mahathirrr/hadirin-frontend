<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMail } from '@/composables/useMail'
import type { Mail } from '@/views/data/mailData'

interface Props {
  items: Mail[]
}

const props = defineProps<Props>()

const [mail, setMail] = useMail()

function getBadgeVariant(label: string): string {
  if (['work'].includes(label.toLowerCase())) return 'default'
  if (['personal'].includes(label.toLowerCase())) return 'outline'
  return 'secondary'
}
</script>

<template>
  <ScrollArea class="h-[calc(100vh-12rem)]">
    <div class="flex flex-col gap-2 p-4 pt-0">
      <button
        v-for="item in props.items"
        :key="item.id"
        :class="cn(
          'hover:bg-accent hover:text-accent-foreground flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all cursor-pointer',
          mail.selected === item.id && 'bg-muted',
        )"
        @click="setMail({ selected: item.id })"
      >
        <div class="flex w-full flex-col gap-1">
          <div class="flex items-center">
            <div class="flex items-center gap-2">
              <div class="font-semibold">{{ item.name }}</div>
              <span
                v-if="!item.read"
                class="flex size-2 rounded-full bg-blue-600 cursor-pointer"
              />
            </div>
            <div
              :class="cn(
                'ml-auto text-xs',
                mail.selected === item.id ? 'text-foreground' : 'text-muted-foreground',
              )"
            >
              {{
                formatDistanceToNow(new Date(item.date), {
                  addSuffix: true,
                })
              }}
            </div>
          </div>
          <div class="text-xs font-medium">{{ item.subject }}</div>
        </div>
        <div class="text-muted-foreground text-xs line-clamp-2">
          {{ item.text.substring(0, 300) }}
        </div>
        <div v-if="item.labels.length" class="flex items-center gap-2">
          <Badge
            v-for="label in item.labels"
            :key="label"
            :variant="getBadgeVariant(label) as 'default' | 'secondary' | 'outline'"
            class="cursor-pointer"
          >
            {{ label }}
          </Badge>
        </div>
      </button>
    </div>
  </ScrollArea>
</template>
