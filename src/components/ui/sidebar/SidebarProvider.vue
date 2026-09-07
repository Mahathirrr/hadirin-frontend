<script setup lang="ts">
import { TooltipProvider } from '@/components/ui/tooltip'

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useMobile'

import {
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  provideSidebar,
} from './context'

interface Props {
  class?: string
  defaultOpen?: boolean
  style?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: true,
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const isMobile = useIsMobile()

const open = ref(props.defaultOpen)
const openMobile = ref(false)

const openProp = ref<boolean | undefined>(undefined)

const displayOpen = computed(() => openProp.value ?? open.value)

function setOpen(value: boolean) {
  openProp.value = undefined
  open.value = value
  emit('update:open', value)
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
}

function toggleSidebar() {
  if (isMobile.value) {
    openMobile.value = !openMobile.value
  } else {
    setOpen(!displayOpen.value)
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    toggleSidebar()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

provideSidebar({
  state: computed(() => (displayOpen.value ? 'expanded' : 'collapsed')),
  open: displayOpen,
  setOpen,
  openMobile,
  setOpenMobile: (v: boolean) => {
    openMobile.value = v
  },
  isMobile,
  toggleSidebar,
})

const depth = props.style ?? {}
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <div
      data-slot="sidebar-wrapper"
      :style="{ '--sidebar-width': SIDEBAR_WIDTH, '--sidebar-width-icon': SIDEBAR_WIDTH_ICON, ...depth }"
      :class="cn(
        'group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
        props.class,
      )"
    >
      <slot />
    </div>
  </TooltipProvider>
</template>
