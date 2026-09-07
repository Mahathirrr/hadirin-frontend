<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import '@/components/theme-customizer/circular-transition.css'
import { Button } from '@/components/ui/button'
import { useCircularTransition } from '@/hooks/useCircularTransition'
import { useTheme } from '@/hooks/useTheme'

interface Props {
  variant?: 'outline' | 'ghost' | 'default'
}

const props = withDefaults(defineProps<Props>(), { variant: 'outline' })

const ctx = useTheme()
const { toggleTheme } = useCircularTransition()

const isDarkMode = ref(false)
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function updateMode() {
  if (ctx.theme === 'dark') isDarkMode.value = true
  else if (ctx.theme === 'light') isDarkMode.value = false
  else isDarkMode.value = mediaQuery.matches
}

onMounted(() => {
  updateMode()
  mediaQuery.addEventListener('change', updateMode)
})

watch(() => ctx.theme, updateMode)

onBeforeUnmount(() => mediaQuery.removeEventListener('change', updateMode))

function handleToggle(event: MouseEvent) {
  toggleTheme(event)
}
</script>

<template>
  <Button
    :variant="props.variant"
    size="icon"
    @click="handleToggle"
    class="mode-toggle-button relative cursor-pointer overflow-hidden"
  >
    <Sun
      v-if="isDarkMode"
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-300"
    />
    <Moon v-else class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-300" />
    <span class="sr-only">Switch to {{ isDarkMode ? 'light' : 'dark' }} mode</span>
  </Button>
</template>
