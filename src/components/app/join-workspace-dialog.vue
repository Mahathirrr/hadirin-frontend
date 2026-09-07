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
const inviteCode = ref('')
const submitting = ref(false)

watch(() => props.open, (open) => {
  if (!open) inviteCode.value = ''
})

async function submit() {
  const trimmed = inviteCode.value.trim()
  if (!trimmed) return

  submitting.value = true
  try {
    await auth.joinWorkspace(trimmed)
    toast.success('Berhasil bergabung ke workspace')
    emit('update:open', false)
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Invitation code tidak valid')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('update:open', $event)">
    <DialogContent class="z-[130] sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Gabung workspace</DialogTitle>
        <DialogDescription>
          Masukkan invitation code dari workspace tujuan. Jika berhasil, workspace akan langsung menjadi aktif.
        </DialogDescription>
      </DialogHeader>
      <Input
        v-model="inviteCode"
        placeholder="Contoh: HDR-A1B2-C3D4"
        class="uppercase"
        @keyup.enter="submit"
      />
      <DialogFooter>
        <Button :disabled="submitting || !inviteCode.trim()" @click="submit">
          Gabung workspace
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
