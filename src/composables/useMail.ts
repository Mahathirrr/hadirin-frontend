import { reactive } from 'vue'

import { mails } from '@/data/mail'

interface Config {
  selected: string | null
}

// Module-scoped reactive store so every consumer shares the same selection
// (equivalent to the zustand `useMail` store in the React source).
const state = reactive<Config>({
  selected: mails[0]?.id ?? null,
})

export function useMail(): [Config, (newState: Partial<Config>) => void] {
  const setState = (newState: Partial<Config>) => {
    Object.assign(state, newState)
  }
  return [state, setState]
}
