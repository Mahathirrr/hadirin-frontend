<script setup lang="ts">
import {
  Dices,
  ExternalLink,
  Moon,
  Palette,
  Sun,
  Upload,
} from 'lucide-vue-next'

import ColorPicker from '@/components/color-picker.vue'
import '@/components/theme-customizer/circular-transition.css'
import { computed } from 'vue'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { baseColors, radiusOptions } from '@/config/themeCustomizerConstants'
import { colorThemes, tweakcnThemes } from '@/config/themeData'
import { useThemeManager } from '@/hooks/useThemeManager'
import { useCircularTransition } from '@/hooks/useCircularTransition'
import { useTheme } from '@/hooks/useTheme'
import type { ImportedTheme } from '@/types/themeCustomizer'

interface Props {
  selectedTheme: string
  selectedTweakcnTheme: string
  selectedRadius: string
  setSelectedTheme: (theme: string) => void
  setSelectedTweakcnTheme: (theme: string) => void
  setSelectedRadius: (radius: string) => void
  setImportedTheme: (theme: ImportedTheme | null) => void
  onImportClick: () => void
}

const props = defineProps<Props>()

const {
  brandColorsValues,
  setBrandColorsValues,
  applyTheme,
  applyTweakcnTheme,
  applyRadius,
  handleColorChange,
} = useThemeManager()

const themeCtx = useTheme()

const isDarkMode = computed(() => themeCtx.theme === 'dark')

const { toggleTheme } = useCircularTransition()

function handleRandomShadcn() {
  const randomTheme = colorThemes[Math.floor(Math.random() * colorThemes.length)]
  props.setSelectedTheme(randomTheme.value)
  props.setSelectedTweakcnTheme('')
  setBrandColorsValues()
  props.setImportedTheme(null)
  applyTheme(randomTheme.value, isDarkMode.value)
}

function handleRandomTweakcn() {
  const randomTheme = tweakcnThemes[Math.floor(Math.random() * tweakcnThemes.length)]
  props.setSelectedTweakcnTheme(randomTheme.value)
  props.setSelectedTheme('')
  setBrandColorsValues()
  props.setImportedTheme(null)
  applyTweakcnTheme(randomTheme.preset, isDarkMode.value)
}

function handleRadiusSelect(radius: string) {
  props.setSelectedRadius(radius)
  applyRadius(radius)
}

function handleLightMode(event: MouseEvent) {
  if (isDarkMode.value === false) return
  toggleTheme(event)
}

function handleDarkMode(event: MouseEvent) {
  if (isDarkMode.value === true) return
  toggleTheme(event)
}

function openTweakcn() {
  window.open('https://tweakcn.com/editor/theme', '_blank')
}
</script>

<template>
  <div class="space-y-6 p-4">
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
        :model-value="props.selectedTheme"
        @update:model-value="(value: string) => { props.setSelectedTheme(value); props.setSelectedTweakcnTheme(''); setBrandColorsValues(); props.setImportedTheme(null); applyTheme(value, isDarkMode) }"
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
                  <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: (theme.preset.styles as any).light.primary }" />
                  <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: (theme.preset.styles as any).light.secondary }" />
                  <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: (theme.preset.styles as any).light.accent }" />
                  <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: (theme.preset.styles as any).light.muted }" />
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
        :model-value="props.selectedTweakcnTheme"
        @update:model-value="(value: string) => { props.setSelectedTweakcnTheme(value); props.setSelectedTheme(''); setBrandColorsValues(); props.setImportedTheme(null); const preset = tweakcnThemes.find(t => t.value === value)?.preset; if (preset) applyTweakcnTheme(preset, isDarkMode) }"
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
                  <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: (theme.preset.styles as any).light.primary }" />
                  <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: (theme.preset.styles as any).light.secondary }" />
                  <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: (theme.preset.styles as any).light.accent }" />
                  <div class="h-3 w-3 rounded-full border border-border/20" :style="{ backgroundColor: (theme.preset.styles as any).light.muted }" />
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
          class="relative cursor-pointer rounded-md border p-3 transition-colors"
          :class="props.selectedRadius === option.value ? 'border-primary' : 'border-border hover:border-border/60'"
          @click="handleRadiusSelect(option.value)"
        >
          <div class="text-center">
            <div class="text-xs font-medium">{{ option.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <Separator />

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

    <!-- Import Theme Button -->
    <div class="space-y-3">
      <Button variant="outline" size="lg" class="w-full cursor-pointer" @click="props.onImportClick">
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
        <AccordionContent class="mt-0 space-y-3 border-t border-border bg-muted/20 px-0 pt-2 pb-4">
          <div v-for="color in baseColors" :key="color.cssVar" class="flex items-center justify-between">
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
        <Palette class="text-primary h-4 w-4" />
        <span class="text-sm font-medium">Advanced Customization</span>
      </div>
      <p class="text-muted-foreground text-xs">
        For advanced theme customization with real-time preview, visual color picker, and hundreds of prebuilt themes, visit
        <a
          href="https://tweakcn.com/editor/theme"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary cursor-pointer font-medium hover:underline"
        >
          tweakcn.com
        </a>
      </p>
      <Button variant="outline" size="sm" class="w-full cursor-pointer" @click="openTweakcn">
        <ExternalLink class="mr-1.5 h-3.5 w-3.5" />
        Open Tweakcn
      </Button>
    </div>
  </div>
</template>
