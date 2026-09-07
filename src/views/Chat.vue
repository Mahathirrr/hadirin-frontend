<script setup lang="ts">
import Chat from '@/components/chat/Chat.vue'
import conversations from '@/data/chat/conversations'
import messages from '@/data/chat/messages'
import users from '@/data/chat/users'
</script>

<template>
  <div class="px-4 md:px-6">
    <Chat
      :conversations="conversations"
      :messages="messages"
      :users="users"
    />
  </div>
</template>
