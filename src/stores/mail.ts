import { defineStore } from 'pinia'

import { mails } from '@/data/mail'

export interface MailConfig {
  selected: string
}

export const useMailStore = defineStore('mail', {
  state: (): MailConfig => ({
    selected: mails[0]?.id ?? '',
  }),
  actions: {
    setState(patch: Partial<MailConfig>) {
      if (patch.selected !== undefined) this.selected = patch.selected
    },
  },
})
