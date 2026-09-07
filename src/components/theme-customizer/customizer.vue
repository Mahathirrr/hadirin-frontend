<script setup lang="ts">
import { Layout, Palette, RotateCcw, Settings, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useThemeManager } from '@/hooks/useThemeManager'
import { useTheme } from '@/hooks/useTheme'
import { useSidebarConfig } from '@/contexts/sidebarContext'
import ThemeTab from './theme-tab.vue'
import LayoutTab from './layout-tab.vue'
import ImportModal from './import-modal.vue'
import type { ImportedTheme } from '@/types/themeCustomizer'

interface Props {
  open: boolean
}

const props = defineProps<Props>()

const {
  applyImportedTheme,
  resetTheme,
  applyRadius,
  setBrandColorsValues,
} = useThemeManager()

const themeCtx = useTheme()
const isDarkMode = computed(() => themeCtx.theme === 'dark')

const { config: sidebarConfig, updateConfig: updateSidebarConfig } = useSidebarConfig()

const activeTab = ref('theme')
const selectedTheme = ref('default')
const selectedTweakcnTheme = ref('')
const selectedRadius = ref('0.5rem')
const importModalOpen = ref(false)
const importedTheme = ref<ImportedTheme | null>(null)

function handleReset() {
  selectedTheme.value = ''
  selectedTweakcnTheme.value = ''
  selectedRadius.value = '0.5rem'
  importedTheme.value = null
  setBrandColorsValues()
  resetTheme()
  applyRadius('0.5rem')
  updateSidebarConfig({ variant: 'inset', collapsible: 'offcanvas', side: 'left' })
}

function handleImport(themeData: ImportedTheme) {
  importedTheme.value = themeData
  selectedTheme.value = ''
  selectedTweakcnTheme.value = ''
  applyImportedTheme(themeData, isDarkMode.value)
}
</script>

<template>
  <Sheet :open="props.open" @update:open="$emit('update:open', $event)">
    <SheetContent
      :side="sidebarConfig.side === 'left' ? 'right' : 'left'"
      class="flex w-[400px] flex-col gap-0 overflow-hidden p-0 [&>button]:hidden"
    >
      <SheetHeader class="space-y-0 p-4 pb-2">
        <div class="flex items-center gap-2">
          <div class="rounded-lg bg-primary/10 p-2">
            <Settings class="h-4 w-4" />
          </div>
          <SheetTitle class="text-lg font-semibold">Customizer</SheetTitle>
          <div class="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon" class="h-8 w-8 cursor-pointer" @click="handleReset">
              <RotateCcw class="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" class="h-8 w-8 cursor-pointer" @click="$emit('update:open', false)">
              <X class="h-4 w-4" />
            </Button>
          </div>
        </div>
        <SheetDescription class="text-muted-foreground sr-only text-sm">
          Customize the theme and layout of your dashboard.
        </SheetDescription>
      </SheetHeader>

      <div class="flex-1 overflow-y-auto">
        <Tabs v-model="activeTab" class="flex h-full flex-col">
          <div class="py-2">
            <TabsList class="grid h-12 w-full grid-cols-2 rounded-none p-1.5">
              <TabsTrigger value="theme" class="cursor-pointer data-[state=active]:bg-background">
                <Palette class="mr-1 h-4 w-4" /> Theme
              </TabsTrigger>
              <TabsTrigger value="layout" class="cursor-pointer data-[state=active]:bg-background">
                <Layout class="mr-1 h-4 w-4" /> Layout
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="theme" class="mt-0 flex-1">
            <ThemeTab
              :selected-theme="selectedTheme"
              :selected-tweakcn-theme="selectedTweakcnTheme"
              :selected-radius="selectedRadius"
              :set-selected-theme="(v: string) => (selectedTheme = v)"
              :set-selected-tweakcn-theme="(v: string) => (selectedTweakcnTheme = v)"
              :set-selected-radius="(v: string) => (selectedRadius = v)"
              :set-imported-theme="(v: ImportedTheme | null) => (importedTheme = v)"
              :on-import-click="() => (importModalOpen = true)"
            />
          </TabsContent>

          <TabsContent value="layout" class="mt-0 flex-1">
            <LayoutTab />
          </TabsContent>
        </Tabs>
      </div>
    </SheetContent>
  </Sheet>

  <ImportModal
    :open="importModalOpen"
    :on-import="handleImport"
    @update:open="importModalOpen = $event"
  />
</template>
