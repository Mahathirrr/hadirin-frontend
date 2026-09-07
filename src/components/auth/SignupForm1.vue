<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const schema = toTypedSchema(z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Minimal 6 karakter'),
}))

const { handleSubmit } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit(async (values) => {
  try {
    await auth.register(values.name, values.email, values.password)
    toast.success('Akun berhasil dibuat')
    router.push('/onboarding')
  } catch {
    toast.error(auth.error || 'Registrasi gagal')
  }
})
</script>

<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-xl">Daftar Hadirin.id</CardTitle>
      <CardDescription>Buat akun baru, lalu buat atau join workspace.</CardDescription>
    </CardHeader>
    <CardContent>
      <Form :validation-schema="schema" as="div">
        <form class="grid gap-4" @submit.prevent="onSubmit">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem><FormLabel>Nama</FormLabel><FormControl><Input placeholder="Nama lengkap" v-bind="componentField" /></FormControl><FormMessage /></FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" v-bind="componentField" /></FormControl><FormMessage /></FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" v-bind="componentField" /></FormControl><FormMessage /></FormItem>
          </FormField>
          <Button type="submit" class="w-full" :disabled="auth.loading">{{ auth.loading ? 'Memproses...' : 'Daftar' }}</Button>
        </form>
      </Form>
    </CardContent>
  </Card>
</template>
