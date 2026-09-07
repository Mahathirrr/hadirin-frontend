import { injectFormItemContext } from './lib'

/** Convenience hook mirroring `useFormField` from shadcn. */
export function useFormField() {
  const { id, isError, errorMessage } = injectFormItemContext()
  return {
    id,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    isError,
    errorMessage,
  }
}
