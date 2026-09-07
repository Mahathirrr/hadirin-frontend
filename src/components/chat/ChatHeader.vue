<script setup lang="ts">
import {
  Bell,
  BellOff,
  Info,
  MoreVertical,
  Phone,
  Search,
  Users,
  Video,
} from 'lucide-vue-next'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Conversation, User } from '@/stores/chat'

interface Props {
  conversation: Conversation | null
  users: User[]
  toggleMute?: () => void
  toggleInfo?: () => void
}

const props = defineProps<Props>()

function getConversationUsers() {
  if (!props.conversation) return []
  return props.users.filter((user) =>
    props.conversation!.participants.includes(user.id),
  )
}

function getStatusText(): string {
  const conversation = props.conversation
  if (!conversation) return ''
  const conversationUsers = getConversationUsers()
  if (conversation.type === 'group') {
    const onlineCount = conversationUsers.filter(
      (user) => user.status === 'online',
    ).length
    return `${conversation.participants.length} members, ${onlineCount} online`
  }
  const primaryUser = conversationUsers[0]
  if (primaryUser) {
    switch (primaryUser.status) {
      case 'online':
        return 'Active now'
      case 'away':
        return 'Away'
      case 'offline':
        return `Last seen ${new Date(primaryUser.lastSeen).toLocaleDateString()}`
      default:
        return ''
    }
  }
  return ''
}

function getStatusColor(): string {
  const conversation = props.conversation
  if (!conversation) return 'text-muted-foreground'
  if (conversation.type === 'group') return 'text-muted-foreground'
  const primaryUser = getConversationUsers()[0]
  switch (primaryUser?.status) {
    case 'online':
      return 'text-green-600'
    case 'away':
      return 'text-yellow-600'
    case 'offline':
      return 'text-muted-foreground'
    default:
      return 'text-muted-foreground'
  }
}

function conversationInitials(): string {
  if (!props.conversation) return ''
  return props.conversation.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}
</script>

<template>
  <div v-if="props.conversation" class="flex h-full items-center justify-between">
    <!-- Left side - Avatar and info -->
    <div class="flex items-center gap-3">
      <Avatar class="h-10 w-10 cursor-pointer">
        <AvatarImage :src="props.conversation.avatar" :alt="props.conversation.name" />
        <AvatarFallback>
          <Users v-if="props.conversation.type === 'group'" class="h-5 w-5" />
          <template v-else>{{ conversationInitials() }}</template>
        </AvatarFallback>
      </Avatar>

      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <h2 class="truncate font-semibold">{{ props.conversation.name }}</h2>
          <BellOff
            v-if="props.conversation.isMuted"
            class="text-muted-foreground h-4 w-4"
          />
          <Badge
            v-if="props.conversation.type === 'group'"
            variant="secondary"
            class="cursor-pointer text-xs"
          >
            Group
          </Badge>
        </div>
        <p class="text-sm" :class="getStatusColor()">
          {{ getStatusText() }}
        </p>
      </div>
    </div>

    <!-- Right side - Action buttons -->
    <div class="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" class="cursor-pointer">
              <Search class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search in conversation</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" class="cursor-pointer">
              <Phone class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice call</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" class="cursor-pointer">
              <Video class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Video call</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="cursor-pointer"
              @click="props.toggleInfo"
            >
              <Info class="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Conversation info</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="cursor-pointer">
            <MoreVertical class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem class="cursor-pointer" @click="props.toggleMute">
            <Bell v-if="props.conversation.isMuted" class="mr-2 h-4 w-4" />
            <BellOff v-else class="mr-2 h-4 w-4" />
            {{ props.conversation.isMuted ? 'Unmute conversation' : 'Mute conversation' }}
          </DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer">
            <Search class="mr-2 h-4 w-4" />
            Search messages
          </DropdownMenuItem>
          <template v-if="props.conversation.type === 'group'">
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer">
              <Users class="mr-2 h-4 w-4" />
              Manage members
            </DropdownMenuItem>
          </template>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="cursor-pointer text-destructive">
            Delete conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
  <div v-else class="flex h-full items-center justify-center">
    <p class="text-muted-foreground">Select a conversation to start chatting</p>
  </div>
</template>
