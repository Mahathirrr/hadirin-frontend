<script setup lang="ts">
import Mail from '@/components/mail/Mail.vue'
import { accounts, mails } from '@/views/data/mailData'
</script>

<template>
  <div class="@container/main flex flex-1 flex-col">
    <div class="h-[calc(100vh-4rem)] px-4 md:px-6">
      <Mail
        :accounts="accounts"
        :mails="mails"
        :default-layout="[20, 32, 48]"
        :default-collapsed="false"
        :nav-collapsed-size="4"
      />
    </div>
  </div>
</template>
