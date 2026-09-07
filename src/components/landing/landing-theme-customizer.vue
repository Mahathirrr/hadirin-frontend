<script setup lang="ts">
import { Dices, ExternalLink, Moon, Palette, RotateCcw, Settings, Sun, Upload, X } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import '@/components/theme-customizer/circular-transition.css'
import ColorPicker from '@/components/color-picker.vue'
import ImportModal from '@/components/theme-customizer/import-modal.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { baseColors, radiusOptions } from '@/config/themeCustomizerConstants'
import { useCircularTransition } from '@/hooks/useCircularTransition'
import { useTheme } from '@/hooks/useTheme'
import { useThemeManager } from '@/hooks/useThemeManager'
import { cn } from '@/lib/utils'
import type { ImportedTheme } from '@/types/themeCustomizer'

interface Props {
  open: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

const ctx = useTheme()
const {
  brandColorsValues,
  applyImportedTheme,
  resetTheme,
  applyRadius,
  applyTheme,
  applyTweakcnTheme,
  handleColorChange,
  colorThemes,
  tweakcnThemes,
} = useThemeManager()
const { toggleTheme } = useCircularTransition()

const isDarkMode = computed(() => {
  if (ctx.theme === 'dark') return true
  if (ctx.theme === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
})

const selectedTheme = ref('default')
const selectedTweakcnTheme = ref('')
const selectedRadius = ref('0.5rem')
const importModalOpen = ref(false)

function onInteractOutside(e: { preventDefault: () => void }) {
  if (importModalOpen.value) e.preventDefault()
}
const importedTheme = ref<ImportedTheme | null>(null)

function onOpenChange(value: boolean) {
  emit('update:open', value)
}

function handleReset() {
  selectedTheme.value = ''
  selectedTweakcnTheme.value = ''
  selectedRadius.value = '0.5rem'
  importedTheme.value = null
  resetTheme()
  applyRadius('0.5rem')
}

function handleImport(themeData: ImportedTheme) {
  importedTheme.value = themeData
  selectedTheme.value = ''
  selectedTweakcnTheme.value = ''
  applyImportedTheme(themeData, isDarkMode.value)
}

function handleRandomShadcn() {
  const randomTheme = colorThemes[Math.floor(Math.random() * colorThemes.length)]
  selectedTheme.value = randomTheme.value
  selectedTweakcnTheme.value = ''
  importedTheme.value = null
  applyTheme(randomTheme.value, isDarkMode.value)
}

function handleRandomTweakcn() {
  const randomTheme = tweakcnThemes[Math.floor(Math.random() * tweakcnThemes.length)]
  selectedTweakcnTheme.value = randomTheme.value
  selectedTheme.value = ''
  importedTheme.value = null
  applyTweakcnTheme(randomTheme.preset, isDarkMode.value)
}

function handleRadiusSelect(radius: string) {
  selectedRadius.value = radius
  applyRadius(radius)
}

function handleLightMode(event: MouseEvent) {
  if (!isDarkMode.value) return
  toggleTheme(event)
}

function handleDarkMode(event: MouseEvent) {
  if (isDarkMode.value) return
  toggleTheme(event)
}

function openTweakcnEditor() {
  window.open('https://tweakcn.com/editor/theme', '_blank')
}

// Re-apply themes when theme mode changes
watch(
  [isDarkMode, importedTheme, selectedTheme, selectedTweakcnTheme],
  () => {
    if (importedTheme.value) {
      applyImportedTheme(importedTheme.value, isDarkMode.value)
    } else if (selectedTheme.value) {
      applyTheme(selectedTheme.value, isDarkMode.value)
    } else if (selectedTweakcnTheme.value) {
      const selectedPreset = tweakcnThemes.find((t) => t.value === selectedTweakcnTheme.value)?.preset
      if (selectedPreset) {
        applyTweakcnTheme(selectedPreset, isDarkMode.value)
      }
    }
  },
  { deep: false },
)
</script>

<template>
  <Sheet :open="props.open" @update:open="onOpenChange">
    <SheetContent
      side="right"
      class="pointer-events-auto flex w-[400px] flex-col gap-0 overflow-hidden p-0 [&>button]:hidden"
      @interact-outside="onInteractOutside"
    >
      <SheetHeader class="space-y-0 p-4 pb-2">
        <div class="flex items-center gap-2">
          <div class="rounded-lg bg-primary/10 p-2">
            <Settings class="h-4 w-4" />
          </div>
          <SheetTitle class="text-lg font-semibold">Theme Customizer</SheetTitle>
          <div class="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon" class="h-8 w-8 cursor-pointer" @click="handleReset">
              <RotateCcw class="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" class="h-8 w-8 cursor-pointer" @click="onOpenChange(false)">
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>
        <SheetDescription class="text-sm text-muted-foreground">
          Customize the theme and colors of your landing page.
        </SheetDescription>
      </SheetHeader>

      <div class="flex-1 space-y-6 overflow-y-auto p-4">
        <!-- Mode Section -->
        <div class="space-y-3">
          <Label class="text-sm font-medium">Mode</Label>
          <div class="grid grid-cols-2 gap-2">
            <Button
              :variant="!isDarkMode ? 'secondary' : 'outline'"
              size="sm"
              class="mode-toggle-button relative cursor-pointer overflow-hidden"
              @click="handleLightMode"
            >
              <Sun class="mr-1 h-4 w-4 transition-transform duration-300" />
              Light
            </Button>
            <Button
              :variant="isDarkMode ? 'secondary' : 'outline'"
              size="sm"
              class="mode-toggle-button relative cursor-pointer overflow-hidden"
              @click="handleDarkMode"
            >
              <Moon class="mr-1 h-4 w-4 transition-transform duration-300" />
              Dark
            </Button>
          </div>
        </div>

        <Separator />

        <!-- Shadcn UI Theme Presets -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <Label class="text-sm font-medium">Shadcn UI Theme Presets</Label>
            <Button variant="outline" size="sm" class="cursor-pointer" @click="handleRandomShadcn">
              <Dices class="mr-1.5 h-3.5 w-3.5" />
              Random
            </Button>
          </div>

          <Select
            :model-value="selectedTheme"
            @update:model-value="(value: string) => {
              selectedTheme = value
              selectedTweakcnTheme = ''
              importedTheme = null
              applyTheme(value, isDarkMode)
            }"
          >
            <SelectTrigger class="w-full cursor-pointer">
              <SelectValue placeholder="Choose Shadcn Theme" />
            </SelectTrigger>
            <SelectContent class="max-h-60">
              <div class="p-2">
                <SelectItem
                  v-for="theme in colorThemes"
                  :key="theme.value"
                  :value="theme.value"
                  class="cursor-pointer"
                >
                  <div class="flex items-center gap-2">
                    <div class="flex gap-1">
                      <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: theme.preset.styles.light.primary }" />
                      <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: theme.preset.styles.light.secondary }" />
                      <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: theme.preset.styles.light.accent }" />
                      <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: theme.preset.styles.light.muted }" />
                    </div>
                    <span>{{ theme.name }}</span>
                  </div>
                </SelectItem>
              </div>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <!-- Tweakcn Theme Presets -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <Label class="text-sm font-medium">Tweakcn Theme Presets</Label>
            <Button variant="outline" size="sm" class="cursor-pointer" @click="handleRandomTweakcn">
              <Dices class="mr-1.5 h-3.5 w-3.5" />
              Random
            </Button>
          </div>

          <Select
            :model-value="selectedTweakcnTheme"
            @update:model-value="(value: string) => {
              selectedTweakcnTheme = value
              selectedTheme = ''
              importedTheme = null
              const selectedPreset = tweakcnThemes.find((t) => t.value === value)?.preset
              if (selectedPreset) applyTweakcnTheme(selectedPreset, isDarkMode)
            }"
          >
            <SelectTrigger class="w-full cursor-pointer">
              <SelectValue placeholder="Choose Tweakcn Theme" />
            </SelectTrigger>
            <SelectContent class="max-h-60">
              <div class="p-2">
                <SelectItem
                  v-for="theme in tweakcnThemes"
                  :key="theme.value"
                  :value="theme.value"
                  class="cursor-pointer"
                >
                  <div class="flex items-center gap-2">
                    <div class="flex gap-1">
                      <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: theme.preset.styles.light.primary }" />
                      <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: theme.preset.styles.light.secondary }" />
                      <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: theme.preset.styles.light.accent }" />
                      <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: theme.preset.styles.light.muted }" />
                    </div>
                    <span>{{ theme.name }}</span>
                  </div>
                </SelectItem>
              </div>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <!-- Radius Selection -->
        <div class="space-y-3">
          <Label class="text-sm font-medium">Radius</Label>
          <div class="grid grid-cols-5 gap-2">
            <div
              v-for="option in radiusOptions"
              :key="option.value"
              :class="cn(
                'relative cursor-pointer rounded-md border p-3 transition-colors',
                selectedRadius === option.value ? 'border-primary' : 'border-border hover:border-border/60',
              )"
              @click="handleRadiusSelect(option.value)"
            >
              <div class="text-center">
                <div class="text-xs font-medium">{{ option.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <!-- Import Theme Button -->
        <div class="space-y-3">
          <Button variant="outline" size="lg" class="w-full cursor-pointer" @click="importModalOpen = true">
            <Upload class="mr-1.5 h-3.5 w-3.5" />
            Import Theme
          </Button>
        </div>

        <!-- Brand Colors Section -->
        <Accordion type="single" collapsible class="w-full rounded-lg border-b">
          <AccordionItem value="brand-colors" class="overflow-hidden rounded-lg border border-border">
            <AccordionTrigger class="px-4 py-3 transition-colors hover:bg-muted/50 hover:no-underline">
              <Label class="cursor-pointer text-sm font-medium">Brand Colors</Label>
            </AccordionTrigger>
            <AccordionContent class="space-y-3 border-t border-border bg-muted/20 px-4 pt-4 pb-4">
              <div
                v-for="color in baseColors"
                :key="color.cssVar"
                class="flex items-center justify-between"
              >
                <ColorPicker
                  :label="color.name"
                  :css-var="color.cssVar"
                  :value="brandColorsValues[color.cssVar] || ''"
                  :on-change="handleColorChange"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <!-- Tweakcn -->
        <div class="space-y-3 rounded-lg bg-muted p-4">
          <div class="flex items-center gap-2">
            <Palette class="h-4 w-4 text-primary" />
            <span class="text-sm font-medium">Advanced Customization</span>
          </div>
          <p class="text-xs text-muted-foreground">
            For advanced theme customization with real-time preview, visual color picker, and hundreds of prebuilt themes, visit
            <a
              href="https://tweakcn.com/editor/theme"
              target="_blank"
              rel="noopener noreferrer"
              class="cursor-pointer font-medium text-primary hover:underline"
            >
              tweakcn.com
            </a>
          </p>
          <Button
            variant="outline"
            size="sm"
            class="w-full cursor-pointer"
            @click="openTweakcnEditor"
          >
            <ExternalLink class="mr-1.5 h-3.5 w-3.5" />
            Open Tweakcn
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>

  <ImportModal v-model:open="importModalOpen" :on-import="handleImport" />
</template>
