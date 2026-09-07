<script setup lang="ts">
import { Check, ChevronRight, Eye, EyeOff, MoreHorizontal, Plus } from 'lucide-vue-next'

import { ref } from 'vue'

import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CalendarItem {
  id: string
  name: string
  color: string
  visible: boolean
  type: 'personal' | 'work' | 'shared'
}

interface CalendarGroup {
  name: string
  items: CalendarItem[]
}

interface Props {
  calendars?: { name: string; items: string[] }[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'calendarToggle', id: string, visible: boolean): void
  (e: 'calendarEdit', id: string): void
  (e: 'calendarDelete', id: string): void
  (e: 'newCalendar'): void
}>()

// Enhanced calendar data with colors and visibility
const enhancedCalendars: CalendarGroup[] = [
  {
    name: 'My Calendars',
    items: [
      { id: 'personal', name: 'Personal', color: 'bg-blue-500', visible: true, type: 'personal' },
      { id: 'work', name: 'Work', color: 'bg-green-500', visible: true, type: 'work' },
      { id: 'family', name: 'Family', color: 'bg-pink-500', visible: true, type: 'personal' },
    ],
  },
  {
    name: 'Favorites',
    items: [
      { id: 'holidays', name: 'Holidays', color: 'bg-red-500', visible: true, type: 'shared' },
      { id: 'birthdays', name: 'Birthdays', color: 'bg-purple-500', visible: true, type: 'personal' },
    ],
  },
  {
    name: 'Other',
    items: [
      { id: 'travel', name: 'Travel', color: 'bg-orange-500', visible: false, type: 'personal' },
      { id: 'reminders', name: 'Reminders', color: 'bg-yellow-500', visible: true, type: 'personal' },
      { id: 'deadlines', name: 'Deadlines', color: 'bg-red-600', visible: true, type: 'work' },
    ],
  },
]

const calendarData = ref<CalendarGroup[]>(enhancedCalendars.map(g => ({ ...g, items: [...g.items] })))

function handleToggleVisibility(id: string) {
  const target = calendarData.value.flatMap(g => g.items).find(c => c.id === id)
  const nextVisible = target ? !target.visible : true
  calendarData.value = calendarData.value.map(group => ({
    ...group,
    items: group.items.map(item =>
      item.id === id ? { ...item, visible: !item.visible } : item,
    ),
  }))
  if (target) {
    emit('calendarToggle', id, nextVisible)
  }
}
</script>

<template>
  <div class="space-y-4">
    <div v-for="(calendar, index) in calendarData" :key="calendar.name">
      <Collapsible :default-open="index === 0" class="group/collapsible">
        <CollapsibleTrigger
          class="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center justify-between rounded-md p-2"
        >
          <span class="text-sm font-medium">{{ calendar.name }}</span>
          <div class="flex items-center gap-1">
            <div
              v-if="index === 0"
              class="hover:bg-accent group-hover/collapsible:opacity-100 flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm opacity-0"
              @click.stop="emit('newCalendar')"
            >
              <Plus class="h-3 w-3" />
            </div>
            <ChevronRight class="group-data-[state=open]/collapsible:rotate-90 h-4 w-4 transition-transform" />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div class="mt-2 space-y-1">
            <div v-for="item in calendar.items" :key="item.id" class="group/calendar-item">
              <div class="hover:bg-accent/50 flex items-center justify-between rounded-md p-2">
                <div class="flex flex-1 items-center gap-3">
                  <!-- Color & visibility toggle -->
                  <button
                    type="button"
                    :class="cn(
                      'flex aspect-square size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border transition-all',
                      item.visible ? cn('border-transparent text-white', item.color) : 'border-border bg-transparent',
                    )"
                    @click="handleToggleVisibility(item.id)"
                  >
                    <Check v-if="item.visible" class="size-3" />
                  </button>

                  <span
                    :class="cn('flex-1 cursor-pointer truncate text-sm', !item.visible && 'text-muted-foreground')"
                    @click="handleToggleVisibility(item.id)"
                  >
                    {{ item.name }}
                  </span>

                  <div class="group-hover/calendar-item:opacity-100 opacity-0">
                    <Eye v-if="item.visible" class="text-muted-foreground h-3 w-3" />
                    <EyeOff v-else class="text-muted-foreground h-3 w-3" />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <div
                        class="hover:bg-accent group-hover/calendar-item:opacity-100 flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm p-0 opacity-0"
                        @click.stop
                      >
                        <MoreHorizontal class="h-3 w-3" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="right">
                      <DropdownMenuItem class="cursor-pointer" @select="emit('calendarEdit', item.id)">
                        Edit calendar
                      </DropdownMenuItem>
                      <DropdownMenuItem class="cursor-pointer" @select="handleToggleVisibility(item.id)">
                        {{ item.visible ? 'Hide' : 'Show' }} calendar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="text-destructive cursor-pointer" @select="emit('calendarDelete', item.id)">
                        Delete calendar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  </div>
</template>
