<script setup lang="ts">
import { ref } from 'vue'
import { ScanFace } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const open = defineModel<boolean>('open', { default: false })
defineProps<{
  employeeName?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  confirm: [file: File]
}>()

const preview = ref('')
const file = ref<File | null>(null)

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0] ?? null
  file.value = f
  if (preview.value) URL.revokeObjectURL(preview.value)
  preview.value = f ? URL.createObjectURL(f) : ''
}

function submit() {
  if (!file.value) return
  emit('confirm', file.value)
}

function onOpenChange(v: boolean) {
  open.value = v
  if (!v) {
    file.value = null
    if (preview.value) URL.revokeObjectURL(preview.value)
    preview.value = ''
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <ScanFace class="size-5" />
          Verifikasi wajah
        </DialogTitle>
        <DialogDescription>
          {{
            employeeName
              ? `Ambil atau unggah foto wajah ${employeeName} (foto yang sama dengan saat enrollment).`
              : 'Ambil atau unggah foto wajah untuk verifikasi check-in.'
          }}
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-3">
        <div class="grid gap-1.5">
          <Label>Foto wajah</Label>
          <Input type="file" accept="image/jpeg,image/png,image/webp" capture="user" @change="onFileChange" />
        </div>
        <img v-if="preview" :src="preview" alt="Pratinjau wajah" class="max-h-48 rounded-lg border object-contain" />
      </div>
      <DialogFooter>
        <Button variant="outline" :disabled="loading" @click="open = false">Batal</Button>
        <Button :disabled="!file || loading" @click="submit">
          {{ loading ? 'Memverifikasi…' : 'Verifikasi & check-in' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
