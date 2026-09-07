<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  size?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), { size: 32 })
const uid = useId().replace(/:/g, '')
</script>

<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="props.class"
    aria-hidden="true"
  >
    <defs>
      <linearGradient :id="`${uid}-bg`" x1="10" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.55" stop-color="#f1f5f9" />
        <stop offset="1" stop-color="#cbd5e1" />
      </linearGradient>
      <linearGradient :id="`${uid}-rim`" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.9" />
        <stop offset="1" stop-color="#64748b" stop-opacity="0.35" />
      </linearGradient>
      <linearGradient :id="`${uid}-bar-a`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5eead4" />
        <stop offset="1" stop-color="#0d9488" />
      </linearGradient>
      <linearGradient :id="`${uid}-bar-b`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#334155" />
        <stop offset="0.45" stop-color="#1e293b" />
        <stop offset="1" stop-color="#0f172a" />
      </linearGradient>
      <linearGradient :id="`${uid}-shine`" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.55" />
        <stop offset="0.35" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <filter :id="`${uid}-shadow`" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#0f172a" flood-opacity="0.18" />
      </filter>
      <filter :id="`${uid}-bar-shadow`" x="-40%" y="-20%" width="180%" height="140%">
        <feDropShadow dx="0" dy="1.2" stdDeviation="1" flood-color="#020617" flood-opacity="0.35" />
      </filter>
    </defs>

    <g :filter="`url(#${uid}-shadow)`">
      <rect x="4" y="4" width="40" height="40" rx="12" :fill="`url(#${uid}-bg)`" />
      <rect
        x="4.8"
        y="4.8"
        width="38.4"
        height="38.4"
        rx="11.2"
        fill="none"
        :stroke="`url(#${uid}-rim)`"
        stroke-width="1"
      />
      <ellipse cx="18" cy="13" rx="10" ry="4.5" fill="#ffffff" opacity="0.45" />
    </g>

    <g :filter="`url(#${uid}-bar-shadow)`">
      <rect
        x="11.5"
        y="26"
        width="5.2"
        height="11"
        rx="2.6"
        :fill="`url(#${uid}-bar-a)`"
        transform="rotate(-6 14 31.5)"
      />
      <rect
        x="19.2"
        y="21"
        width="5.4"
        height="16"
        rx="2.7"
        :fill="`url(#${uid}-bar-b)`"
        transform="rotate(-2 22 29)"
      />
      <rect
        x="27"
        y="15.5"
        width="5.6"
        height="21.5"
        rx="2.8"
        :fill="`url(#${uid}-bar-b)`"
        transform="rotate(4 30 26)"
      />
    </g>

    <rect
      x="11.5"
      y="26"
      width="2"
      height="11"
      rx="1"
      :fill="`url(#${uid}-shine)`"
      opacity="0.35"
      transform="rotate(-6 14 31.5)"
    />
    <rect
      x="19.2"
      y="21"
      width="2"
      height="16"
      rx="1"
      :fill="`url(#${uid}-shine)`"
      opacity="0.28"
      transform="rotate(-2 22 29)"
    />
    <rect
      x="27"
      y="15.5"
      width="2.2"
      height="21.5"
      rx="1"
      :fill="`url(#${uid}-shine)`"
      opacity="0.22"
      transform="rotate(4 30 26)"
    />

    <circle cx="34.2" cy="14.8" r="3.1" fill="#10b981" />
    <circle cx="34.2" cy="14.8" r="3.1" fill="none" stroke="#ffffff" stroke-width="1.1" opacity="0.85" />
    <path
      d="M32.7 14.8l1 1 2.3-2.4"
      stroke="#ffffff"
      stroke-width="1.35"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
