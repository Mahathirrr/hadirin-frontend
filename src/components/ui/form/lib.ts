import { createContext } from 'reka-ui'

import type { Ref } from 'vue'

export type FormFieldContextValue = {
  name: string
}

export type FormItemContextValue = {
  id: string
  isError: Ref<boolean>
  errorMessage: Ref<string | undefined>
}

export const [injectFormFieldContext, provideFormFieldContext] =
  createContext<FormFieldContextValue>('FormField')

export const [injectFormItemContext, provideFormItemContext] =
  createContext<FormItemContextValue>('FormItem')
