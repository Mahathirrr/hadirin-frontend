<script setup lang="ts">
interface Props {
  animation?: string
  delay?: number
  duration?: number
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  animation: 'fade-up',
  delay: 0,
  duration: 680,
  as: 'div',
})
</script>

<template>
  <component
    :is="props.as"
    :data-aos="props.animation"
    :data-aos-delay="props.delay"
    :data-aos-duration="props.duration"
  >
    <slot />
  </component>
</template>
