<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  label: string
  cssVar: string
  value: string
  onChange: (cssVar: string, value: string) => void
}

const props = withDefaults(defineProps<Props>(), { onChange: () => {} })

const localValue = ref(props.value)
watch(() => props.value, (v) => { localValue.value = v })

function handleColorChange(event: Event) {
  const newColor = (event.target as HTMLInputElement).value
  localValue.value = newColor
  props.onChange(props.cssVar, newColor)
}

function handleTextChange(event: Event) {
  const newValue = (event.target as HTMLInputElement).value
  localValue.value = newValue
  props.onChange(props.cssVar, newValue)
}

const displayColor = computed(() => {
  if (localValue.value && localValue.value.startsWith('#')) {
    return localValue.value
  }
  const computed = getComputedStyle(document.documentElement).getPropertyValue(props.cssVar).trim()
  if (computed && computed.startsWith('#')) {
    return computed
  }
  return '#000000'
})
</script>

<template>
  <div class="space-y-2">
    <Label :for="`color-${props.cssVar}`" class="text-xs font-medium">
      {{ props.label }}
    </Label>
    <div class="flex items-start gap-2">
      <div class="relative">
        <Button
          type="button"
          variant="outline"
          class="h-8 w-8 cursor-pointer overflow-hidden p-0"
          :style="{ backgroundColor: displayColor }"
        >
          <input
            type="color"
            :id="`color-${props.cssVar}`"
            :value="displayColor"
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            @input="handleColorChange"
          />
        </Button>
      </div>
      <Input
        type="text"
        :placeholder="`${props.cssVar} value`"
        :value="localValue"
        class="h-8 flex-1 text-xs"
        @input="handleTextChange"
      />
    </div>
  </div>
</template>
