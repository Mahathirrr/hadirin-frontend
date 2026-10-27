<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deferDialogAction } from '@/lib/defer-open'
import { workspaceBadgeClass } from '@/lib/display'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits<{
  'open-create': []
  'open-join': []
}>()

const auth = useAuthStore()

const displayName = computed(() => auth.workspaceName)

const workspaceInitial = computed(() =>
  (auth.activeMembership?.workspace.name || auth.workspaceName).charAt(0).toUpperCase(),
)

const badgeClass = computed(() =>
  workspaceBadgeClass(auth.activeMembership?.workspace.id ?? auth.workspaceId ?? 0),
)

function openCreate(event: Event) {
  deferDialogAction(() => emit('open-create'), event)
}

function openJoin(event: Event) {
  deferDialogAction(() => emit('open-join'), event)
}
</script>

<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger
      class="group inline-flex w-full max-w-full min-w-0 cursor-pointer items-center gap-1.5 border-0 bg-transparent px-0 py-0 text-sm text-zinc-300 shadow-none outline-none transition-colors hover:bg-transparent hover:text-white focus-visible:ring-0 data-[state=open]:bg-transparent data-[state=open]:text-white md:max-w-[13rem] md:w-auto"
    >
      <span
        class="flex size-[18px] shrink-0 items-center justify-center rounded-[4px] text-[10px] font-bold text-white"
        :class="badgeClass"
      >
        {{ workspaceInitial }}
      </span>
      <span class="truncate font-medium">{{ displayName }}</span>
      <ChevronDown class="size-3.5 shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-300 group-data-[state=open]:text-zinc-300" />
    </DropdownMenuTrigger>

    <DropdownMenuContent align="start" :side-offset="6" class="z-[120] w-60 border-border bg-popover p-1.5 text-popover-foreground shadow-lg">
      <DropdownMenuLabel class="px-2 py-1.5 text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        Workspace
      </DropdownMenuLabel>

      <DropdownMenuItem
        v-for="membership in auth.memberships"
        :key="membership.workspace_id"
        class="cursor-pointer rounded-md px-2 py-2"
        @select="auth.setWorkspace(membership.workspace_id)"
      >
        <span
          class="mr-2.5 size-2 shrink-0 rounded-full"
          :class="membership.workspace_id === auth.workspaceId ? 'bg-primary' : 'bg-muted-foreground/40'"
        />
        <span class="truncate">{{ membership.workspace.name }}</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator class="my-1" />

      <DropdownMenuItem class="cursor-pointer rounded-md px-2 py-2" @select="openCreate">
        Buat perusahaan baru
      </DropdownMenuItem>
      <DropdownMenuItem class="cursor-pointer rounded-md px-2 py-2" @select="openJoin">
        Gabung perusahaan
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
