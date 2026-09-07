<script setup lang="ts">
import { format, isThisWeek, isThisYear, isToday, isYesterday } from 'date-fns'
import { Filter, Hash, MoreVertical, Pin, Search, Settings, UserPlus, Users, VolumeX } from 'lucide-vue-next'
import { computed } from 'vue'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChatStore, type Conversation } from '@/stores/chat'

interface Props {
  conversations: Conversation[]
  selectedConversation: string | null
  selectConversation: (conversationId: string) => void
}

const props = defineProps<Props>()

const chatStore = useChatStore()

const filteredConversations = computed(() =>
  props.conversations.filter((c) =>
    c.name.toLowerCase().includes(chatStore.searchQuery.toLowerCase()),
  ),
)

const sortedConversations = computed(() =>
  [...filteredConversations.value].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
  }),
)

function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  if (isToday(date)) return format(date, 'h:mm a')
  if (isYesterday(date)) return 'Yesterday'
  if (isThisWeek(date)) return format(date, 'EEEE')
  if (isThisYear(date)) return format(date, 'MMM d')
  return format(date, 'dd/MM/yy')
}

function getOnlineStatus(conversation: Conversation): boolean {
  if (conversation.type === 'direct' && conversation.participants.length === 1) {
    return Math.random() > 0.5 // Mock online status
  }
  return false
}
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden">
    <!-- Header - Hidden on mobile (handled by parent) -->
    <div class="flex h-16 flex-shrink-0 items-center justify-between border-b px-4 hidden lg:flex">
      <h2 class="text-lg font-semibold">Messages</h2>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm" class="h-8 w-8 cursor-pointer p-0">
            <MoreVertical class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem class="cursor-pointer">
            <UserPlus class="mr-2 h-4 w-4" />
            New Chat
          </DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer">
            <Filter class="mr-2 h-4 w-4" />
            Filter Messages
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="cursor-pointer">
            <Settings class="mr-2 h-4 w-4" />
            Chat Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <!-- Search -->
    <div class="flex-shrink-0 border-b px-4 py-3">
      <div class="relative">
        <Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search conversations..."
          :value="chatStore.searchQuery"
          class="cursor-text pl-9"
          @input="chatStore.setSearchQuery(($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Conversations -->
    <ScrollArea class="flex-1">
      <div class="p-2">
        <div
          v-for="conversation in sortedConversations"
          :key="conversation.id"
          :class="cn(
            'relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg p-3 transition-colors hover:bg-accent/50',
            props.selectedConversation === conversation.id
              ? 'bg-accent text-accent-foreground'
              : '',
          )"
          @click="props.selectConversation(conversation.id)"
        >
          <!-- Avatar with online indicator -->
          <div class="relative flex-shrink-0">
            <Avatar :class="cn('h-12 w-12', props.selectedConversation === conversation.id && 'ring-2 ring-background')">
              <AvatarImage :src="conversation.avatar" :alt="conversation.name" />
              <AvatarFallback class="text-sm">
                <Users v-if="conversation.type === 'group'" class="h-5 w-5" />
                <template v-else>
                  {{ conversation.name.split(' ').map((n) => n[0]).join('').slice(0, 2) }}
                </template>
              </AvatarFallback>
            </Avatar>

            <div
              v-if="conversation.type === 'direct' && getOnlineStatus(conversation)"
              class="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-background bg-green-500"
            />
            <div
              v-if="conversation.type === 'group'"
              class="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-blue-500"
            >
              <Hash class="h-2 w-2 text-white" />
            </div>
          </div>

          <!-- Content -->
          <div class="min-w-0 flex-1 overflow-hidden">
            <div class="flex min-w-0 items-center justify-between mb-1">
              <div class="flex min-w-0 flex-1 items-center gap-1 overflow-hidden pr-2">
                <h3 class="max-w-[160px] min-w-0 truncate font-medium lg:max-w-[180px]">
                  {{ conversation.name }}
                </h3>
                <Pin v-if="conversation.isPinned" class="text-muted-foreground h-3 w-3 flex-shrink-0" />
                <VolumeX v-if="conversation.isMuted" class="text-muted-foreground h-3 w-3 flex-shrink-0" />
              </div>
              <span class="flex-shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                {{ formatMessageTime(conversation.lastMessage.timestamp) }}
              </span>
            </div>

            <div class="flex min-w-0 items-center justify-between gap-2">
              <p class="max-w-[180px] min-w-0 flex-1 truncate pr-2 text-sm text-muted-foreground lg:max-w-[200px]">
                {{ conversation.lastMessage.content }}
              </p>

              <Badge
                v-if="conversation.unreadCount > 0"
                variant="default"
                class="h-5 min-w-[20px] flex-shrink-0 cursor-pointer text-xs"
              >
                {{ conversation.unreadCount > 99 ? '99+' : conversation.unreadCount }}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
