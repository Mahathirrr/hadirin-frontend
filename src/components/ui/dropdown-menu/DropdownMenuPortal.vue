<script setup lang="ts">
import { DropdownMenuPortal } from 'reka-ui'
</script>

<template>
  <DropdownMenuPortal v-bind="$attrs" data-slot="dropdown-menu-portal">
    <slot />
  </DropdownMenuPortal>
</template>
