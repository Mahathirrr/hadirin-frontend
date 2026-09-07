<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import Logo from '@/components/logo.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/lib/routes'

const auth = useAuthStore()
const router = useRouter()
const workspaceName = ref('')
const inviteCode = ref('')
const submitting = ref(false)

async function handleCreate() {
  if (!workspaceName.value.trim()) return
  submitting.value = true
  try {
    await auth.createWorkspace(workspaceName.value.trim())
    toast.success('Workspace berhasil dibuat')
    router.push(ROUTES.summary)
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Gagal membuat workspace')
  } finally {
    submitting.value = false
  }
}

async function handleJoin() {
  if (!inviteCode.value.trim()) return
  submitting.value = true
  try {
    await auth.joinWorkspace(inviteCode.value.trim())
    toast.success('Berhasil bergabung ke workspace')
    router.push(ROUTES.summary)
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Token undangan tidak valid')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-6 md:p-10">
      <div class="flex justify-center gap-2 md:justify-start">
        <RouterLink to="/" class="flex items-center gap-2.5 font-semibold tracking-tight">
          <Logo :size="32" />
          <span>Hadirin</span>
        </RouterLink>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-md">
          <div class="mb-6 text-center">
            <h1 class="text-2xl font-bold">Pilih workspace</h1>
            <p class="text-muted-foreground text-sm">Buat workspace baru atau join dengan token undangan.</p>
          </div>
          <Tabs default-value="create">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="create">Buat Workspace</TabsTrigger>
              <TabsTrigger value="join">Join Workspace</TabsTrigger>
            </TabsList>
            <TabsContent value="create" class="space-y-4 pt-4">
              <div class="grid gap-3">
                <Label>Nama workspace</Label>
                <Input v-model="workspaceName" placeholder="Contoh: me hq" />
              </div>
              <Button class="w-full" :disabled="submitting" @click="handleCreate">Buat Workspace</Button>
            </TabsContent>
            <TabsContent value="join" class="space-y-4 pt-4">
              <div class="grid gap-3">
                <Label>Token undangan</Label>
                <Input v-model="inviteCode" placeholder="HDR-XXXX-XXXX" class="uppercase" />
              </div>
              <Button class="w-full" :disabled="submitting" @click="handleJoin">Gabung Workspace</Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    <div class="bg-muted relative hidden lg:flex flex-col justify-between p-10 text-white overflow-hidden">
      <img
        src="/auth/onboarding-bg.jpg"
        alt="Kantor Modern Hadirin"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40" />
      <div class="relative z-10 flex items-center gap-2.5 font-semibold tracking-tight">
        <Logo :size="30" />
        <span class="text-xl text-white">Hadirin Workspace</span>
      </div>
      <div class="relative z-10 max-w-md rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md shadow-2xl">
        <p class="text-sm font-medium leading-relaxed text-zinc-200">
          "Ruang kerja kolaboratif untuk mengelola shift kerja, persetujuan cuti, rekap absensi, dan laporan kehadiran instan."
        </p>
        <div class="mt-4 flex items-center gap-2 text-xs text-zinc-400">
          <span class="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
          <span>Setup cepat dalam kurang dari 2 menit</span>
        </div>
      </div>
    </div>
  </div>
</template>
