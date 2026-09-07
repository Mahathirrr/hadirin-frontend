<script setup lang="ts">
import { ref } from 'vue'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import type { ImportedTheme } from '@/types/themeCustomizer'

interface Props {
  open: boolean
  onImport: (theme: ImportedTheme) => void
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const importText = ref('')

function onOpenChange(value: boolean) {
  emit('update:open', value)
}

function processImport() {
  try {
    if (!importText.value.trim()) {
      console.error('No CSS content provided')
      return
    }
    const lightTheme: Record<string, string> = {}
    const darkTheme: Record<string, string> = {}

    const cssText = importText.value.replace(/\/\*[\s\S]*?\*\//g, '')

    const rootMatch = cssText.match(/:root\s*\{([^}]+)\}/)
    if (rootMatch) {
      const rootContent = rootMatch[1]
      const variableMatches = rootContent.matchAll(/--([^:]+):\s*([^;]+);/g)
      for (const match of variableMatches) {
        const [, variable, value] = match
        lightTheme[variable.trim()] = value.trim()
      }
    }

    const darkMatch = cssText.match(/\.dark\s*\{([^}]+)\}/)
    if (darkMatch) {
      const darkContent = darkMatch[1]
      const variableMatches = darkContent.matchAll(/--([^:]+):\s*([^;]+);/g)
      for (const match of variableMatches) {
        const [, variable, value] = match
        darkTheme[variable.trim()] = value.trim()
      }
    }

    props.onImport({ light: lightTheme, dark: darkTheme })
    onOpenChange(false)
    importText.value = ''
  } catch (error) {
    console.error('Error importing theme:', error)
  }
}
</script>

<template>
  <Dialog :open="props.open" @update:open="onOpenChange">
    <DialogContent class="max-w-4xl w-[90vw]">
      <DialogHeader>
        <DialogTitle>Import Custom CSS</DialogTitle>
        <DialogDescription>
          Paste your CSS theme below. Include both
          <code>:root</code>
          (light mode) and
          <code>.dark</code>
          (dark mode) sections with CSS variables like
          <code>--primary</code>,
          <code>--background</code>, etc. The theme will automatically switch between light and dark modes.
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4">
        <div class="space-y-2">
          <Textarea
            id="theme-css"
            class="flex max-h-[400px] min-h-[300px] w-full resize-none overflow-y-auto rounded-md border border-input bg-transparent px-3 py-2 font-mono text-sm text-foreground shadow-sm md:text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-1 focus-visible:outline-none focus-visible:ring-ring"
            :placeholder="`:root {\n  --background: 0 0% 100%;\n  --foreground: oklch(0.52 0.13 144.17);\n  --primary: #3e2723;\n  /* And more */\n}\n.dark {\n  --background: 222.2 84% 4.9%;\n  --foreground: hsl(37.50 36.36% 95.69%);\n  --primary: rgb(46, 125, 50);\n  /* And more */\n}`"
            :model-value="importText"
            @update:model-value="(v: string | undefined) => (importText = v ?? '')"
          />
        </div>
        <div class="flex justify-end gap-2">
          <Button variant="outline" class="cursor-pointer" @click="onOpenChange(false)">
            Cancel
          </Button>
          <Button class="cursor-pointer" :disabled="!importText.trim()" @click="processImport">
            Import Theme
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
