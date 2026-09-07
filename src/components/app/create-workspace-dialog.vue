<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

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
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const auth = useAuthStore()
const name = ref('')
const submitting = ref(false)

watch(() => props.open, (open) => {
  if (!open) name.value = ''
})

async function submit() {
  const trimmed = name.value.trim()
  if (!trimmed) return

  submitting.value = true
  try {
    await auth.createWorkspace(trimmed)
    toast.success('Workspace berhasil dibuat')
    emit('update:open', false)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Gagal membuat workspace')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="z-[130] sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Buat workspace baru</DialogTitle>
        <DialogDescription>
          Masukkan nama workspace yang ingin Anda tambahkan. Anda akan langsung berpindah ke workspace baru ini.
        </DialogDescription>
      </DialogHeader>
      <Input v-model="name" placeholder="Contoh: Presence Ops" @keyup.enter="submit" />
      <DialogFooter>
        <Button :disabled="submitting || !name.trim()" @click="submit">
          Buat workspace baru
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
