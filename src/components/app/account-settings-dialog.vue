<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Laptop, MoreHorizontal, Shield, User, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createDialogDismissGuard } from '@/lib/defer-open'
import { initials, usernameFromEmail } from '@/lib/display'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const dismissGuard = createDialogDismissGuard()

const auth = useAuthStore()
const section = ref<'profile' | 'security'>('profile')
const editingName = ref(false)
const nameDraft = ref('')

const displayName = computed(() => auth.user?.name || 'Admin')
const email = computed(() => auth.user?.email || '')
const handle = computed(() => usernameFromEmail(email.value))

function openProfile() {
  section.value = 'profile'
  editingName.value = false
  nameDraft.value = displayName.value
}

function startEditProfile() {
  nameDraft.value = displayName.value
  editingName.value = true
}

function saveProfile() {
  toast.message('Update profil akan tersedia setelah endpoint PATCH /auth/me aktif di backend')
  editingName.value = false
}

function updateUsername() {
  toast.message('Update username akan tersedia setelah endpoint auth/profile siap di backend')
}

function addEmail() {
  toast.message('Tambah email akan tersedia setelah endpoint auth/email siap di backend')
}

function setPassword() {
  toast.message('Set password akan tersedia setelah endpoint auth/password di backend')
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    dismissGuard.markOpened()
    openProfile()
  }
})

function handleOpenChange(nextOpen: boolean) {
  dismissGuard.guardDismiss(nextOpen, (value) => emit('update:open', value))
}
</script>

<template>
  <Dialog :open="props.open" :modal="true" @update:open="handleOpenChange">
    <DialogContent
      :show-close-button="false"
      class="z-[130] gap-0 overflow-hidden rounded-xl border border-border/60 p-0 shadow-xl sm:max-w-4xl"
      @pointer-down-outside="dismissGuard.guardOutsideEvent"
      @interact-outside="dismissGuard.guardOutsideEvent"
      @focus-outside="dismissGuard.guardOutsideEvent"
    >
      <DialogHeader class="sr-only">
        <DialogTitle>Account settings</DialogTitle>
      </DialogHeader>

      <div class="grid min-h-[32rem] md:grid-cols-[240px_1fr]">
        <aside class="flex flex-col border-b bg-muted/30 px-6 py-8 md:border-r md:border-b-0">
          <div>
            <h2 class="text-xl font-semibold tracking-tight">Account</h2>
            <p class="mt-1 text-sm text-muted-foreground">Manage your account info.</p>
          </div>

          <nav class="mt-8 space-y-1">
            <button
              type="button"
              class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
              :class="section === 'profile'
                ? 'bg-background font-medium text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'"
              @click="openProfile"
            >
              <User class="size-4 shrink-0" />
              Profile
            </button>
            <button
              type="button"
              class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
              :class="section === 'security'
                ? 'bg-background font-medium text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'"
              @click="section = 'security'"
            >
              <Shield class="size-4 shrink-0" />
              Security
            </button>
          </nav>

          <p class="mt-auto pt-10 text-xs text-muted-foreground/80">
            Secured by <span class="font-medium text-foreground/70">Hadirin</span>
          </p>
        </aside>

        <section class="relative bg-background px-8 py-8">
          <DialogClose
            class="absolute top-6 right-6 flex size-8 cursor-pointer items-center justify-center rounded-md border border-border/80 bg-background text-muted-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X class="size-4" />
            <span class="sr-only">Close</span>
          </DialogClose>

          <div v-if="section === 'profile'" class="pr-10">
            <h3 class="text-lg font-semibold tracking-tight">Profile details</h3>

            <div class="mt-6 divide-y divide-border/80">
              <div class="flex items-center gap-6 py-5 first:pt-0">
                <p class="w-36 shrink-0 text-sm text-muted-foreground">Profile</p>
                <div class="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar class="size-10 shrink-0">
                    <AvatarFallback class="bg-violet-500 text-sm text-white">
                      {{ initials(displayName) }}
                    </AvatarFallback>
                  </Avatar>
                  <p v-if="!editingName" class="truncate font-medium">{{ displayName }}</p>
                  <input
                    v-else
                    v-model="nameDraft"
                    type="text"
                    class="h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    @keydown.enter="saveProfile"
                  >
                </div>
                <button
                  type="button"
                  class="shrink-0 cursor-pointer text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                  @click="editingName ? saveProfile() : startEditProfile()"
                >
                  {{ editingName ? 'Save profile' : 'Update profile' }}
                </button>
              </div>

              <div class="flex items-center gap-6 py-5">
                <p class="w-36 shrink-0 text-sm text-muted-foreground">Username</p>
                <p class="min-w-0 flex-1 font-medium">{{ handle }}</p>
                <button
                  type="button"
                  class="shrink-0 cursor-pointer text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                  @click="updateUsername"
                >
                  Update username
                </button>
              </div>

              <div class="py-5">
                <div class="flex items-start gap-6">
                  <p class="w-36 shrink-0 pt-0.5 text-sm text-muted-foreground">Email addresses</p>
                  <div class="min-w-0 flex-1 space-y-3">
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="font-medium">{{ email }}</p>
                      <Badge variant="secondary" class="rounded-full px-2 py-0 text-[11px] font-normal">
                        Primary
                      </Badge>
                      <button
                        type="button"
                        class="ml-auto flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Email options"
                      >
                        <MoreHorizontal class="size-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      class="cursor-pointer text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                      @click="addEmail"
                    >
                      + Add email address
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-6 py-5">
                <p class="w-36 shrink-0 text-sm text-muted-foreground">Connected accounts</p>
                <div class="flex min-w-0 flex-1 items-center gap-2.5">
                  <span class="flex size-5 items-center justify-center rounded-full bg-background text-xs font-bold shadow-sm ring-1 ring-border">
                    G
                  </span>
                  <p class="truncate font-medium">{{ handle }}</p>
                </div>
                <button
                  type="button"
                  class="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Connected account options"
                >
                  <MoreHorizontal class="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div v-else class="pr-10">
            <h3 class="text-lg font-semibold tracking-tight">Security</h3>

            <div class="mt-6 divide-y divide-border/80">
              <div class="flex items-center gap-6 py-5 first:pt-0">
                <p class="w-36 shrink-0 text-sm text-muted-foreground">Password</p>
                <div class="flex-1" />
                <button
                  type="button"
                  class="shrink-0 cursor-pointer text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                  @click="setPassword"
                >
                  Set password
                </button>
              </div>

              <div class="py-5">
                <p class="text-sm text-muted-foreground">Active devices</p>
                <div class="mt-4 flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-4">
                  <Laptop class="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  <div class="min-w-0 flex-1 space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <p class="text-sm font-medium">X11</p>
                      <Badge variant="secondary" class="rounded-full px-2 py-0 text-[11px] font-normal">
                        This device
                      </Badge>
                    </div>
                    <p class="text-sm text-muted-foreground">Firefox 145.0</p>
                    <p class="text-sm text-muted-foreground">127.0.0.1 (Local)</p>
                    <p class="text-sm text-muted-foreground">Today at 6:27 AM</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-6 py-5">
                <p class="w-36 shrink-0 text-sm text-muted-foreground">Delete account</p>
                <div class="flex-1" />
                <button
                  type="button"
                  class="shrink-0 cursor-pointer text-sm font-medium text-destructive transition-colors hover:text-destructive/80 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DialogContent>
  </Dialog>
</template>
