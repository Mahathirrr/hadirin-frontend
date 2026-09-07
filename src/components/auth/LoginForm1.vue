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
import { ROUTES } from '@/lib/routes'

const auth = useAuthStore()
const router = useRouter()

const schema = toTypedSchema(z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Minimal 6 karakter'),
}))

const { handleSubmit } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit(async (values) => {
  try {
    await auth.login(values.email, values.password)
    toast.success('Login berhasil')
    router.push(auth.hasWorkspace ? ROUTES.summary : ROUTES.onboarding)
  } catch {
    toast.error(auth.error || 'Login gagal')
  }
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">Masuk ke Hadirin.id</CardTitle>
        <CardDescription>Gunakan akun admin atau karyawan yang sudah terdaftar.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form :validation-schema="schema" as="div">
          <form class="grid gap-4" @submit.prevent="onSubmit">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="admin@hadirin.id" v-bind="componentField" /></FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl><Input type="password" v-bind="componentField" /></FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit" class="w-full" :disabled="auth.loading">{{ auth.loading ? 'Memproses...' : 'Masuk' }}</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  </div>
</template>
