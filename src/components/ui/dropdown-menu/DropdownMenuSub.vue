<script setup lang="ts">
import { DropdownMenuSub } from 'reka-ui'
</script>

<template>
  <DropdownMenuSub v-bind="$attrs" data-slot="dropdown-menu-sub">
    <slot />
  </DropdownMenuSub>
</template>
