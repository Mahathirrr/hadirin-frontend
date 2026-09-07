import { defineStore } from 'pinia'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: 'online' | 'away' | 'offline'
  lastSeen: string
  role: string
  department: string
}

export interface Reaction {
  emoji: string
  users: string[]
  count: number
}

export interface Message {
  id: string
  content: string
  timestamp: string
  senderId: string
  type: 'text' | 'image' | 'file'
  isEdited: boolean
  reactions: Reaction[]
  replyTo: string | null
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  participants: string[]
  name: string
  avatar: string
  lastMessage: {
    id: string
    content: string
    timestamp: string
    senderId: string
  }
  unreadCount: number
  isPinned: boolean
  isMuted: boolean
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [] as Conversation[],
    messages: {} as Record<string, Message[]>,
    users: [] as User[],
    selectedConversation: null as string | null,
    searchQuery: '',
    isTyping: {} as Record<string, boolean>,
    onlineUsers: [] as string[],
  }),
  actions: {
    setConversations(conversations: Conversation[]) {
      this.conversations = conversations
    },
    setMessages(conversationId: string, messages: Message[]) {
      this.messages = { ...this.messages, [conversationId]: messages }
    },
    setUsers(users: User[]) {
      this.users = users
    },
    setSelectedConversation(conversationId: string | null) {
      this.selectedConversation = conversationId
      if (conversationId) {
        this.markAsRead(conversationId)
      }
    },
    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    addMessage(conversationId: string, message: Message) {
      this.messages = {
        ...this.messages,
        [conversationId]: [...(this.messages[conversationId] || []), message],
      }
      this.conversations = this.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                id: message.id,
                content: message.content,
                timestamp: message.timestamp,
                senderId: message.senderId,
              },
            }
          : conv,
      )
    },
    markAsRead(conversationId: string) {
      this.conversations = this.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      )
    },
    togglePin(conversationId: string) {
      this.conversations = this.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, isPinned: !conv.isPinned } : conv,
      )
    },
    toggleMute(conversationId: string) {
      this.conversations = this.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, isMuted: !conv.isMuted } : conv,
      )
    },
    setTyping(conversationId: string, isTyping: boolean) {
      this.isTyping = { ...this.isTyping, [conversationId]: isTyping }
    },
    setOnlineUsers(userIds: string[]) {
      this.onlineUsers = userIds
    },
  },
})
