<script setup lang="ts">
import { addDays, addHours, format, nextSaturday } from 'date-fns'
import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
} from 'lucide-vue-next'
import { ref } from 'vue'

import Calendar from './Calendar.vue'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type { Mail } from '@/views/data/mailData'

const props = defineProps<{ mail: Mail | null }>()

const selectedDate = ref<Date>(new Date())
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center p-2">
      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          :disabled="!props.mail"
          title="Archive"
          class="cursor-pointer disabled:cursor-not-allowed"
        >
          <Archive class="size-4" />
          <span class="sr-only">Archive</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          :disabled="!props.mail"
          title="Move to junk"
          class="cursor-pointer disabled:cursor-not-allowed"
        >
          <ArchiveX class="size-4" />
          <span class="sr-only">Move to junk</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          :disabled="!props.mail"
          title="Move to trash"
          class="cursor-pointer disabled:cursor-not-allowed"
        >
          <Trash2 class="size-4" />
          <span class="sr-only">Move to trash</span>
        </Button>
        <Separator orientation="vertical" class="mx-1 h-6" />
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              :disabled="!props.mail"
              title="Snooze"
              class="cursor-pointer disabled:cursor-not-allowed"
            >
              <Clock class="size-4" />
              <span class="sr-only">Snooze</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="flex w-auto p-0">
            <div class="flex flex-col gap-2 border-r px-2 py-4">
              <div class="px-4 text-sm font-medium">Snooze until</div>
              <div class="grid min-w-[250px] gap-1">
                <Button variant="ghost" class="cursor-pointer justify-start font-normal">
                  Later today
                  <span class="text-muted-foreground ml-auto">
                    {{ format(addHours(selectedDate, 4), 'E, h:mm b') }}
                  </span>
                </Button>
                <Button variant="ghost" class="cursor-pointer justify-start font-normal">
                  Tomorrow
                  <span class="text-muted-foreground ml-auto">
                    {{ format(addDays(selectedDate, 1), 'E, h:mm b') }}
                  </span>
                </Button>
                <Button variant="ghost" class="cursor-pointer justify-start font-normal">
                  This weekend
                  <span class="text-muted-foreground ml-auto">
                    {{ format(nextSaturday(selectedDate), 'E, h:mm b') }}
                  </span>
                </Button>
                <Button variant="ghost" class="cursor-pointer justify-start font-normal">
                  Next week
                  <span class="text-muted-foreground ml-auto">
                    {{ format(addDays(selectedDate, 7), 'E, h:mm b') }}
                  </span>
                </Button>
              </div>
            </div>
            <div class="p-2">
              <Calendar v-model="selectedDate" />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          :disabled="!props.mail"
          title="Reply"
          class="cursor-pointer disabled:cursor-not-allowed"
        >
          <Reply class="size-4" />
          <span class="sr-only">Reply</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          :disabled="!props.mail"
          title="Reply all"
          class="cursor-pointer disabled:cursor-not-allowed"
        >
          <ReplyAll class="size-4" />
          <span class="sr-only">Reply all</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          :disabled="!props.mail"
          title="Forward"
          class="cursor-pointer disabled:cursor-not-allowed"
        >
          <Forward class="size-4" />
          <span class="sr-only">Forward</span>
        </Button>
      </div>
      <Separator orientation="vertical" class="mx-2 h-6" />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            :disabled="!props.mail"
            class="cursor-pointer disabled:cursor-not-allowed"
          >
            <MoreVertical class="size-4" />
            <span class="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem class="cursor-pointer">Mark as unread</DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer">Star thread</DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer">Add label</DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer">Mute thread</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <Separator />
    <template v-if="props.mail">
      <div class="flex flex-1 flex-col">
        <div class="flex items-start p-4">
          <div class="flex items-start gap-4 text-sm">
            <Avatar class="cursor-pointer">
              <AvatarFallback>
                {{
                  props.mail.name
                    .split(' ')
                    .map((chunk) => chunk[0])
                    .join('')
                }}
              </AvatarFallback>
            </Avatar>
            <div class="grid gap-1">
              <div class="font-semibold">{{ props.mail.name }}</div>
              <div class="text-xs line-clamp-1">{{ props.mail.subject }}</div>
              <div class="text-xs line-clamp-1">
                <span class="font-medium">Reply-To:</span> {{ props.mail.email }}
              </div>
            </div>
          </div>
          <div v-if="props.mail.date" class="text-muted-foreground ml-auto text-xs">
            {{ format(new Date(props.mail.date), 'PPpp') }}
          </div>
        </div>
        <Separator />
        <div class="flex-1 p-4 text-sm whitespace-pre-wrap">{{ props.mail.text }}</div>
        <Separator class="mt-auto" />
        <div class="p-4">
          <form class="grid gap-4">
            <Textarea
              class="cursor-text p-4"
              :placeholder="`Reply ${props.mail.name}...`"
            />
            <div class="flex items-center">
              <Label
                for="mute"
                class="flex cursor-pointer items-center gap-2 text-xs font-normal"
              >
                <Switch id="mute" aria-label="Mute thread" /> Mute this thread
              </Label>
              <Button size="sm" class="ml-auto cursor-pointer" type="submit">
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </template>
    <div v-else class="text-muted-foreground p-8 text-center">No message selected</div>
  </div>
</template>
