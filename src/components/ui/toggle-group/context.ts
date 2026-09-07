import type { InjectionKey } from 'vue'

export interface ToggleGroupContextValue {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export const ToggleGroupKey: InjectionKey<ToggleGroupContextValue> =
  Symbol('toggle-group')
