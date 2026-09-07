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
        <RouterLink to="/" class="flex items-center gap-2 font-medium">
          <Logo :size="24" class="text-primary" />
          Hadirin.id
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
    <div class="bg-muted relative hidden lg:block">
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
        alt="Kantor modern"
        class="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  </div>
</template>
