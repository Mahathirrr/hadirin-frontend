import { nextTick, onMounted, ref } from 'vue'

/** Prevent browser/password-manager autofill on auth forms. */
export function enableAutofillGuard(el: EventTarget | null) {
  const input = el as HTMLInputElement | null
  if (!input) return
  if (input.dataset.authEmail === 'true') {
    input.type = 'email'
  }
}

function fieldSuffix() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : String(Date.now())
}

type AuthFormMode = 'login' | 'register'

export function createAuthInputAttrs(suffix = fieldSuffix(), mode: AuthFormMode = 'login') {
  const passwordAutocomplete = mode === 'login' ? 'current-password' : 'new-password'

  const email = {
    type: 'email' as const,
    inputmode: 'email' as const,
    autocomplete: 'email' as const,
    autocapitalize: 'off' as const,
    spellcheck: 'false' as const,
    name: mode === 'login' ? 'email' : 'email',
    'data-auth-email': 'true',
  }

  const password = {
    type: 'password' as const,
    autocomplete: passwordAutocomplete as 'current-password' | 'new-password',
    name: mode === 'login' ? 'password' : 'new-password',
  }

  const name = {
    type: 'text' as const,
    autocomplete: 'name' as const,
    name: 'name',
  }

  return {
    email,
    password,
    name,
    firstName: name,
    lastName: {
      type: 'text' as const,
      autocomplete: 'family-name' as const,
      name: 'family-name',
    },
    invite: {
      type: 'text' as const,
      autocomplete: 'off' as const,
      name: `hadirin-invite-${suffix}`,
      autocapitalize: 'characters' as const,
    },
    workspace: {
      type: 'text' as const,
      autocomplete: 'organization' as const,
      name: 'organization',
    },
  }
}

/** Delay auth inputs until after mount to reduce browser autofill. */
export function useAuthFieldGate() {
  const ready = ref(false)
  const formRef = ref<HTMLElement | null>(null)

  onMounted(async () => {
    await nextTick()
    ready.value = true
  })

  return { ready, formRef }
}
