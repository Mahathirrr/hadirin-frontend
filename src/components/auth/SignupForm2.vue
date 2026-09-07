<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')

async function onSubmit() {
  const name = `${firstName.value} ${lastName.value}`.trim()
  if (name.length < 2 || !email.value || password.value.length < 6) {
    toast.error('Lengkapi nama, email, dan password minimal 6 karakter')
    return
  }
  await auth.register(name, email.value, password.value)
  toast.success('Akun berhasil dibuat')
  router.push('/onboarding')
}
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Create your account</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Enter your information to create a new Hadirin.id account
      </p>
    </div>
    <div class="grid gap-6">
      <div class="grid grid-cols-2 gap-3">
        <div class="grid gap-3">
          <Label for="firstName">First Name</Label>
          <Input id="firstName" v-model="firstName" placeholder="John" required />
        </div>
        <div class="grid gap-3">
          <Label for="lastName">Last Name</Label>
          <Input id="lastName" v-model="lastName" placeholder="Doe" required />
        </div>
      </div>
      <div class="grid gap-3">
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
      </div>
      <div class="grid gap-3">
        <Label for="password">Password</Label>
        <Input id="password" v-model="password" type="password" required />
      </div>
      <div class="flex items-center space-x-2">
        <Checkbox id="terms" required />
        <Label for="terms" class="text-sm">
          I agree to the
          <a href="#" class="underline underline-offset-4 hover:text-primary">Terms of Service</a>
          and
          <a href="#" class="underline underline-offset-4 hover:text-primary">Privacy Policy</a>
        </Label>
      </div>
      <Button type="submit" class="w-full cursor-pointer" :disabled="auth.loading">
        Create Account
      </Button>
    </div>
    <div class="text-center text-sm">
      Already have an account?
      <RouterLink to="/auth/sign-in" class="underline underline-offset-4">Sign in</RouterLink>
    </div>
  </form>
</template>
