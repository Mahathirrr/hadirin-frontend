<script setup lang="ts">
import { format, isToday, isYesterday } from 'date-fns'
import { CheckCheck, Copy, MoreHorizontal, Reply, Trash2 } from 'lucide-vue-next'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Message, User } from '@/stores/chat'

interface Props {
  messages: Message[]
  users: User[]
  currentUserId?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentUserId: 'current-user',
})

const bottomRef = ref<HTMLElement | null>(null)
let prevCount = 0
let isInitial = true

const CURRENT_USER = {
  id: 'current-user',
  name: 'You',
  avatar: 'https://notion-avatars.netlify.app/api/avatar/?preset=male-7',
  status: 'online' as const,
  email: 'you@example.com',
  lastSeen: new Date().toISOString(),
  role: 'Developer',
  department: 'Engineering',
}

function getUserById(userId: string): User | undefined {
  if (userId === props.currentUserId) return CURRENT_USER as User
  return props.users.find((user) => user.id === userId)
}

function nameInitials(user?: User): string {
  if (!user?.name) return ''
  return user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  if (isToday(date)) return format(date, 'HH:mm')
  if (isYesterday(date)) return `Yesterday ${format(date, 'HH:mm')}`
  return format(date, 'MMM d, HH:mm')
}

function groupMessagesByDay(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = []
  messages.forEach((message) => {
    const messageDate = format(new Date(message.timestamp), 'yyyy-MM-dd')
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.date === messageDate) {
      lastGroup.messages.push(message)
    } else {
      groups.push({ date: messageDate, messages: [message] })
    }
  })
  return groups
}

function formatDateHeader(dateString: string): string {
  const date = new Date(dateString)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEEE, MMMM d')
}

function shouldShowAvatar(message: Message, index: number, msgs: Message[]): boolean {
  if (message.senderId === props.currentUserId || index === 0) return false
  return msgs[index - 1].senderId !== message.senderId
}

function shouldShowName(message: Message, index: number, msgs: Message[]): boolean {
  if (message.senderId === props.currentUserId || index === 0) return false
  return msgs[index - 1].senderId !== message.senderId
}

function isConsecutiveMessage(message: Message, index: number, msgs: Message[]): boolean {
  if (index === 0) return false
  const prev = msgs[index - 1]
  const timeDiff =
    new Date(message.timestamp).getTime() - new Date(prev.timestamp).getTime()
  return prev.senderId === message.senderId && timeDiff < 5 * 60 * 1000
}

const messageGroups = computed(() => groupMessagesByDay(props.messages))

// Auto-scroll to bottom on new messages (not initial)
watch(
  () => props.messages.length,
  async (count) => {
    if (isInitial) {
      isInitial = false
      prevCount = count
      return
    }
    if (count > prevCount && bottomRef.value) {
      await nextTick()
      bottomRef.value.scrollIntoView({ behavior: 'smooth' })
    }
    prevCount = count
  },
)

onMounted(async () => {
  await nextTick()
  if (bottomRef.value) {
    bottomRef.value.scrollIntoView()
  }
})
</script>

<template>
  <ScrollArea class="flex-1 px-4">
    <div class="space-y-4 py-4">
      <template v-for="group in messageGroups" :key="group.date">
        <div>
          <!-- Date separator -->
          <div class="flex items-center justify-center py-2">
            <div class="bg-background rounded-full border px-3 py-1 text-xs text-muted-foreground">
              {{ formatDateHeader(group.date) }}
            </div>
          </div>

          <!-- Messages for this day -->
          <div class="space-y-1">
            <div
              v-for="(message, messageIndex) in group.messages"
              :key="message.id"
              :class="cn(
                'group flex gap-3',
                message.senderId === props.currentUserId && 'flex-row-reverse',
                isConsecutiveMessage(message, messageIndex, group.messages) &&
                  message.senderId !== props.currentUserId &&
                  'ml-12',
              )"
            >
              <!-- Avatar -->
              <div v-if="message.senderId !== props.currentUserId" class="w-8">
                <Avatar
                  v-if="shouldShowAvatar(message, messageIndex, group.messages) && getUserById(message.senderId)"
                  class="h-8 w-8 cursor-pointer"
                >
                  <AvatarImage
                    :src="getUserById(message.senderId)?.avatar || ''"
                    :alt="getUserById(message.senderId)?.name"
                  />
                  <AvatarFallback class="text-xs">
                    {{ nameInitials(getUserById(message.senderId)) }}
                  </AvatarFallback>
                </Avatar>
              </div>

              <!-- Message content -->
              <div
                :class="cn(
                  'max-w-[70%] flex-1',
                  message.senderId === props.currentUserId && 'flex flex-col items-end',
                )"
              >
                <div
                  v-if="
                    shouldShowName(message, messageIndex, group.messages) &&
                    getUserById(message.senderId) &&
                    message.senderId !== props.currentUserId
                  "
                  class="text-foreground mb-1 text-sm font-medium"
                >
                  {{ getUserById(message.senderId)?.name }}
                </div>

                <div class="group/message relative">
                  <div
                    :class="cn(
                      'rounded-lg px-3 py-2 text-sm break-words',
                      message.senderId === props.currentUserId ? 'bg-primary text-primary-foreground' : 'bg-muted',
                      isConsecutiveMessage(message, messageIndex, group.messages) && 'mt-1',
                    )"
                  >
                    <p>{{ message.content }}</p>

                    <div v-if="message.reactions.length > 0" class="mt-2 flex gap-1">
                      <div
                        v-for="(reaction, idx) in message.reactions"
                        :key="idx"
                        :class="cn(
                          'inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1 text-xs',
                          'bg-background/90 shadow-sm backdrop-blur-sm',
                        )"
                      >
                        <span>{{ reaction.emoji }}</span>
                        <span class="text-muted-foreground">{{ reaction.count }}</span>
                      </div>
                    </div>

                    <div
                      :class="cn(
                        'mt-1 flex items-center gap-1 text-xs',
                        message.senderId === props.currentUserId
                          ? 'text-primary-foreground/70 justify-end'
                          : 'text-muted-foreground',
                      )"
                    >
                      <span>{{ formatMessageTime(message.timestamp) }}</span>
                      <span v-if="message.isEdited" class="italic">(edited)</span>
                      <div v-if="message.senderId === props.currentUserId">
                        <CheckCheck class="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  <!-- Message actions -->
                  <div class="absolute top-0 right-0 opacity-0 group-hover/message:opacity-100">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="sm" class="h-6 w-6 cursor-pointer p-0">
                          <MoreHorizontal class="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem class="cursor-pointer">
                          <Reply class="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem class="cursor-pointer">
                          <Copy class="mr-2 h-4 w-4" />
                          Copy
                        </DropdownMenuItem>
                        <template v-if="message.senderId === props.currentUserId">
                          <DropdownMenuSeparator />
                          <DropdownMenuItem class="cursor-pointer text-destructive">
                            <Trash2 class="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </template>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Scroll anchor -->
      <div ref="bottomRef" />
    </div>
  </ScrollArea>
</template>
