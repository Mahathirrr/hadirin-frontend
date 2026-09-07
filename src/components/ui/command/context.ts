import { inject, provide, type Ref } from 'vue'

export interface CommandContextValue {
  query: Ref<string>
  setQuery: (value: string) => void
  visibleCount: Ref<number>
}

const CommandContextKey = Symbol('command-context')

export function provideCommand(value: CommandContextValue) {
  provide(CommandContextKey, value)
}

export function useCommand(): CommandContextValue {
  const ctx = inject<CommandContextValue>(CommandContextKey)
  if (!ctx) throw new Error('Command components must be used within <Command>')
  return ctx
}
