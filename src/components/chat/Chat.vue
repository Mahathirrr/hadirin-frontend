<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Menu, X } from 'lucide-vue-next'

import { TooltipProvider } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import ConversationList from './ConversationList.vue'
import ChatHeader from './ChatHeader.vue'
import MessageList from './MessageList.vue'
import MessageInput from './MessageInput.vue'
import { useChatStore, type Conversation, type Message, type User } from '@/stores/chat'

interface Props {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  users: User[]
}

const props = defineProps<Props>()

const chatStore = useChatStore()
const isSidebarOpen = ref(false)

const onResize = () => {
  if (window.innerWidth >= 1024) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', onResize)

  chatStore.setConversations(props.conversations)
  chatStore.setUsers(props.users)
  Object.entries(props.messages).forEach(([conversationId, msgs]) => {
    chatStore.setMessages(conversationId, msgs)
  })
  if (!chatStore.selectedConversation && props.conversations.length > 0) {
    chatStore.setSelectedConversation(props.conversations[0].id)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

// Re-seed if props change (data arrives async)
watch(
  () => [props.conversations, props.users],
  () => {
    chatStore.setConversations(props.conversations)
    chatStore.setUsers(props.users)
    if (!chatStore.selectedConversation && props.conversations.length > 0) {
      chatStore.setSelectedConversation(props.conversations[0].id)
    }
  },
)

const currentConversation = () =>
  props.conversations.find((c) => c.id === chatStore.selectedConversation)

const currentMessages = () =>
  chatStore.selectedConversation ? chatStore.messages[chatStore.selectedConversation] || [] : []

function handleSendMessage(content: string) {
  if (!chatStore.selectedConversation) return
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    content,
    timestamp: new Date().toISOString(),
    senderId: 'current-user',
    type: 'text',
    isEdited: false,
    reactions: [],
    replyTo: null,
  }
  chatStore.addMessage(chatStore.selectedConversation, newMessage)
}

function handleToggleMute() {
  if (chatStore.selectedConversation) {
    chatStore.toggleMute(chatStore.selectedConversation)
  }
}
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <div class="bg-background flex h-full min-h-[600px] max-h-[calc(100vh-200px)] overflow-hidden rounded-lg border">
      <!-- Mobile Sidebar Overlay -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-40 bg-black/50 lg:hidden"
        @click="isSidebarOpen = false"
      />

      <!-- Conversations Sidebar - Responsive -->
      <div
        :class="`
          w-100 border-r bg-background flex-shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:relative lg:block
          fixed inset-y-0 left-0 z-50
          transition-transform duration-300 ease-in-out
        `"
      >
        <!-- Sidebar Header with Close Button (Mobile Only) -->
        <div class="bg-background flex items-center justify-between border-b p-4 lg:hidden">
          <h2 class="text-lg font-semibold">Messages</h2>
          <Button
            variant="ghost"
            size="sm"
            class="cursor-pointer"
            @click="isSidebarOpen = false"
          >
            <X class="h-4 w-4" />
          </Button>
        </div>

        <ConversationList
          :conversations="props.conversations"
          :selected-conversation="chatStore.selectedConversation"
          :select-conversation="(id: string) => {
            chatStore.setSelectedConversation(id)
            isSidebarOpen = false
          }"
        />
      </div>

      <!-- Chat Panel - Flexible Width -->
      <div class="bg-background flex min-w-0 flex-1 flex-col">
        <div class="bg-background flex h-16 items-center border-b px-4">
          <Button
            variant="ghost"
            size="sm"
            class="mr-2 cursor-pointer lg:hidden"
            @click="isSidebarOpen = true"
          >
            <Menu class="h-4 w-4" />
          </Button>

          <div class="flex-1">
            <ChatHeader
              :conversation="currentConversation() || null"
              :users="props.users"
              :toggle-mute="handleToggleMute"
            />
          </div>
        </div>

        <div class="flex min-h-0 flex-1 flex-col">
          <template v-if="chatStore.selectedConversation">
            <MessageList :messages="currentMessages()" :users="props.users" />
            <MessageInput
              :send-message="handleSendMessage"
              :placeholder="`Message ${currentConversation()?.name || ''}...`"
            />
          </template>
          <div v-else class="flex flex-1 items-center justify-center">
            <div class="text-center">
              <h3 class="mb-2 text-lg font-semibold">Welcome to Chat</h3>
              <p class="text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </TooltipProvider>
</template>
