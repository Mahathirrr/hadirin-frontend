<script setup lang="ts">
import { DropdownMenuGroup } from 'reka-ui'
</script>

<template>
  <DropdownMenuGroup v-bind="$attrs" data-slot="dropdown-menu-group">
    <slot />
  </DropdownMenuGroup>
</template>
