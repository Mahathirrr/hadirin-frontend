<script setup lang="ts">
import { DropdownMenuRadioGroup } from 'reka-ui'
</script>

<template>
  <DropdownMenuRadioGroup v-bind="$attrs" data-slot="dropdown-menu-radio-group">
    <slot />
  </DropdownMenuRadioGroup>
</template>
