<script setup lang="ts">
import Calendar from '@/components/calendar/Calendar.vue'
import { events, eventDates } from '@/components/calendar/data'
</script>

<template>
  <div class="px-4 lg:px-6">
    <Calendar :events="events" :event-dates="eventDates" />
  </div>
</template>
