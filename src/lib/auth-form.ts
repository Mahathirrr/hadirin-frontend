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

export function createAuthInputAttrs(suffix = fieldSuffix()) {
  const base = {
    autocomplete: 'off',
    'data-1p-ignore': 'true',
    'data-lpignore': 'true',
    'data-form-type': 'other',
    'data-auth-field': 'true',
  } as const

  return {
    email: {
      ...base,
      type: 'email',
      inputmode: 'email',
      autocapitalize: 'off',
      spellcheck: 'false',
      name: `hadirin-email-${suffix}`,
      'data-auth-email': 'true',
    },
    password: {
      ...base,
      type: 'password',
      autocomplete: 'new-password',
      name: `hadirin-password-${suffix}`,
    },
    name: {
      ...base,
      type: 'text',
      name: `hadirin-name-${suffix}`,
    },
    firstName: {
      ...base,
      type: 'text',
      name: `hadirin-first-name-${suffix}`,
    },
    lastName: {
      ...base,
      type: 'text',
      name: `hadirin-last-name-${suffix}`,
    },
    invite: {
      ...base,
      type: 'text',
      name: `hadirin-invite-${suffix}`,
      autocapitalize: 'characters',
    },
    workspace: {
      ...base,
      type: 'text',
      name: `hadirin-workspace-${suffix}`,
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
