<script setup lang="ts">
import { computed, ref } from 'vue'

import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Account {
  label: string
  email: string
  iconPath: string
}

interface Props {
  isCollapsed: boolean
  accounts: Account[]
}

const props = defineProps<Props>()

const selectedAccount = ref(props.accounts[0]?.email ?? '')
const current = computed(() =>
  props.accounts.find((a) => a.email === selectedAccount.value),
)
</script>

<template>
  <Select v-model="selectedAccount">
    <SelectTrigger
      :class="cn(
        'flex items-center gap-2 w-full',
        props.isCollapsed &&
          'flex size-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden',
      )"
      aria-label="Select account"
    >
      <SelectValue placeholder="Select an account">
        <template v-if="current">
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="size-4 shrink-0 text-foreground"
          >
            <path :d="current.iconPath" fill="currentColor" />
          </svg>
          <span :class="cn('ml-2', props.isCollapsed && 'hidden')">
            {{ current.label }}
          </span>
        </template>
      </SelectValue>
    </SelectTrigger>
    <SelectContent position="popper" class="w-full">
      <SelectItem v-for="account in props.accounts" :key="account.email" :value="account.email">
        <div class="flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path :d="account.iconPath" fill="currentColor" />
          </svg>
          {{ account.email }}
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>
