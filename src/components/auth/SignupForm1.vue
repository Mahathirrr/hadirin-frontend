<script setup lang="ts">
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createAuthInputAttrs, enableAutofillGuard, useAuthFieldGate } from '@/lib/auth-form'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const fieldAttrs = createAuthInputAttrs()
const { ready, formRef } = useAuthFieldGate()

const schema = toTypedSchema(z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Minimal 6 karakter'),
}))

const { handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: { name: '', email: '', password: '' },
})

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
  <Card class="pt-1">
    <CardHeader class="text-center pt-5">
      <CardTitle class="text-xl">Daftar Hadirin</CardTitle>
      <CardDescription>Buat akun baru, lalu buat atau join workspace.</CardDescription>
    </CardHeader>
    <CardContent>
      <Form :validation-schema="schema" as="div">
        <form
          ref="formRef"
          data-auth-form
          class="grid gap-4"
          autocomplete="off"
          @submit.prevent="onSubmit"
        >
          <input type="text" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true" />
          <input type="password" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true" />

          <div v-if="!ready" class="grid gap-4">
            <div class="h-9 rounded-md border bg-muted/40" />
            <div class="h-9 rounded-md border bg-muted/40" />
            <div class="h-9 rounded-md border bg-muted/40" />
            <div class="h-9 rounded-md bg-muted/40" />
          </div>

          <template v-else>
            <FormField v-slot="{ componentField }" name="name">
              <FormItem>
                <FormLabel>Nama</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nama lengkap"
                    v-bind="{ ...componentField, ...fieldAttrs.name }"
                    @focus="enableAutofillGuard($event.target)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    v-bind="{ ...componentField, ...fieldAttrs.email }"
                    @focus="enableAutofillGuard($event.target)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    v-bind="{ ...componentField, ...fieldAttrs.password }"
                    @focus="enableAutofillGuard($event.target)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit" class="w-full" :disabled="auth.loading">
              {{ auth.loading ? 'Memproses...' : 'Daftar' }}
            </Button>
          </template>
        </form>
      </Form>
    </CardContent>
  </Card>
</template>
