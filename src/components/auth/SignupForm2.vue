<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAuthInputAttrs, enableAutofillGuard } from '@/lib/auth-form'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const fieldAttrs = createAuthInputAttrs()

async function onSubmit() {
  const name = `${firstName.value.trim()} ${lastName.value.trim()}`.trim()
  const trimmedEmail = email.value.trim()
  const trimmedPassword = password.value
  if (name.length < 2 || !trimmedEmail || trimmedPassword.length < 6) {
    toast.error('Lengkapi nama, email, dan password minimal 6 karakter')
    return
  }
  try {
    await auth.register(name, trimmedEmail, trimmedPassword)
    toast.success('Akun berhasil dibuat')
    router.push('/onboarding')
  } catch {
    toast.error(auth.error || 'Registrasi gagal')
  }
}
</script>

<template>
  <form
    data-auth-form
    class="flex flex-col gap-6"
    autocomplete="off"
    @submit.prevent="onSubmit"
  >
    <input type="text" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true" />
    <input type="password" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true" />

    <div class="flex flex-col items-center gap-2 text-center">
      <h1 class="text-2xl font-bold">Create your account</h1>
      <p class="text-muted-foreground text-sm text-balance">
        Enter your information to create a new Hadirin account
      </p>
    </div>

    <div class="grid gap-6">
      <div class="grid grid-cols-2 gap-3">
        <div class="grid gap-3">
          <Label for="signup-first-name">First Name</Label>
          <Input
            id="signup-first-name"
            v-model="firstName"
            placeholder="John"
            required
            v-bind="fieldAttrs.firstName"
            @focus="enableAutofillGuard($event.target)"
          />
        </div>
        <div class="grid gap-3">
          <Label for="signup-last-name">Last Name</Label>
          <Input
            id="signup-last-name"
            v-model="lastName"
            placeholder="Doe"
            required
            v-bind="fieldAttrs.lastName"
            @focus="enableAutofillGuard($event.target)"
          />
        </div>
      </div>
      <div class="grid gap-3">
        <Label for="signup-email">Email</Label>
        <Input
          id="signup-email"
          v-model="email"
          placeholder="m@example.com"
          required
          v-bind="fieldAttrs.email"
          @focus="enableAutofillGuard($event.target)"
        />
      </div>
      <div class="grid gap-3">
        <Label for="signup-password">Password</Label>
        <Input
          id="signup-password"
          v-model="password"
          required
          v-bind="fieldAttrs.password"
          @focus="enableAutofillGuard($event.target)"
        />
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
