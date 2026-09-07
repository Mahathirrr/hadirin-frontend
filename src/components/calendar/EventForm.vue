<script setup lang="ts">
import { CalendarIcon, Clock, MapPin, Tag, Type, Users } from 'lucide-vue-next'
import { format } from 'date-fns'

import { computed, ref, watch } from 'vue'

import DatePicker from './DatePicker.vue'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

import { type CalendarEvent } from './types'

interface Props {
  event?: CalendarEvent | null
  open: boolean
}

const props = withDefaults(defineProps<Props>(), {
  event: null,
  open: false,
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', eventData: Partial<CalendarEvent>): void
  (e: 'delete', eventId: number): void
}>()

const eventTypes = [
  { value: 'meeting', label: 'Meeting', color: 'bg-blue-500' },
  { value: 'event', label: 'Event', color: 'bg-green-500' },
  { value: 'personal', label: 'Personal', color: 'bg-pink-500' },
  { value: 'task', label: 'Task', color: 'bg-orange-500' },
  { value: 'reminder', label: 'Reminder', color: 'bg-purple-500' },
]

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM',
]

const durationOptions = [
  '15 min', '30 min', '45 min', '1 hour', '1.5 hours', '2 hours', '3 hours', 'All day',
]

const formData = ref({
  title: props.event?.title || '',
  date: props.event?.date || new Date(),
  time: props.event?.time || '9:00 AM',
  duration: props.event?.duration || '1 hour',
  type: props.event?.type || ('meeting' as CalendarEvent['type']),
  location: props.event?.location || '',
  description: props.event?.description || '',
  attendees: props.event?.attendees || ([] as string[]),
  allDay: false,
  reminder: true,
})

watch(
  () => props.open,
  (open) => {
    if (open) {
      formData.value = {
        title: props.event?.title || '',
        date: props.event?.date || new Date(),
        time: props.event?.time || '9:00 AM',
        duration: props.event?.duration || '1 hour',
        type: props.event?.type || ('meeting' as CalendarEvent['type']),
        location: props.event?.location || '',
        description: props.event?.description || '',
        attendees: props.event?.attendees || ([] as string[]),
        allDay: false,
        reminder: true,
      }
    }
  },
)

const showCalendar = ref(false)
const newAttendee = ref('')

const selectedEventType = computed(() =>
  eventTypes.find((t) => t.value === formData.value.type),
)

function handleSave() {
  const eventData: Partial<CalendarEvent> = {
    ...formData.value,
    id: props.event?.id,
    color: eventTypes.find((t) => t.value === formData.value.type)?.color || 'bg-blue-500',
  }
  emit('save', eventData)
  emit('update:open', false)
}

function handleDelete() {
  if (props.event?.id) {
    emit('delete', props.event.id)
    emit('update:open', false)
  }
}

function addAttendee() {
  if (newAttendee.value.trim() && !formData.value.attendees.includes(newAttendee.value.trim())) {
    formData.value.attendees.push(newAttendee.value.trim())
    newAttendee.value = ''
  }
}

function removeAttendee(attendee: string) {
  formData.value.attendees = formData.value.attendees.filter((a) => a !== attendee)
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>

<template>
  <Dialog :open="props.open" @update:open="(v: boolean) => emit('update:open', v)">
    <DialogContent class="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <div :class="cn('h-3 w-3 rounded-full', selectedEventType?.color)" />
          {{ props.event ? 'Edit Event' : 'Create New Event' }}
        </DialogTitle>
        <DialogDescription>
          {{ props.event ? 'Make changes to this event' : 'Add a new event to your calendar' }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6 py-4">
        <!-- Title -->
        <div class="space-y-2">
          <Label class="flex items-center gap-2">
            <Type class="h-4 w-4" />
            Event Title
          </Label>
          <Input
            placeholder="Enter event title..."
            class="text-lg font-medium"
            :value="formData.title"
            @input="(e: Event) => (formData.title = (e.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Type -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label class="flex items-center gap-2">
              <Tag class="h-4 w-4" />
              Event Type
            </Label>
            <Select
              :model-value="formData.type"
              @update:model-value="(v: string) => (formData.type = v as CalendarEvent['type'])"
            >
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="type in eventTypes" :key="type.value" :value="type.value">
                  <div class="flex items-center gap-2">
                    <div :class="cn('h-3 w-3 rounded-full', type.color)" />
                    {{ type.label }}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Date & Time -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label class="flex items-center gap-2">
              <CalendarIcon class="h-4 w-4" />
              Date
            </Label>
            <Popover :open="showCalendar" @update:open="(v: boolean) => (showCalendar = v)">
              <PopoverTrigger as-child>
                <Button variant="outline" class="w-full cursor-pointer justify-start text-left font-normal">
                  {{ format(formData.date, 'PPP') }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <DatePicker
                  :selected-date="formData.date"
                  @date-select="(d: Date) => { formData.date = d; showCalendar = false }"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div class="space-y-2">
            <Label class="flex items-center gap-2">
              <Clock class="h-4 w-4" />
              Time
            </Label>
            <Select v-model="formData.time">
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="time in timeSlots" :key="time" :value="time">{{ time }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- Duration & options -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Duration</Label>
            <Select v-model="formData.duration">
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="duration in durationOptions" :key="duration" :value="duration">
                  {{ duration }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label>Options</Label>
            <div class="flex h-10 items-center space-x-4">
              <div class="flex items-center space-x-2">
                <Switch
                  id="all-day"
                  :checked="formData.allDay"
                  @update:checked="(v: boolean) => (formData.allDay = v)"
                />
                <Label for="all-day" class="text-sm">All day</Label>
              </div>
              <div class="flex items-center space-x-2">
                <Switch
                  id="reminder"
                  :checked="formData.reminder"
                  @update:checked="(v: boolean) => (formData.reminder = v)"
                />
                <Label for="reminder" class="text-sm">Reminder</Label>
              </div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <Label class="flex items-center gap-2">
            <MapPin class="h-4 w-4" />
            Location
          </Label>
          <Input
            id="location"
            placeholder="Add location..."
            :value="formData.location"
            @input="(e: Event) => (formData.location = (e.target as HTMLInputElement).value)"
          />
        </div>

        <!-- Attendees -->
        <div class="space-y-2">
          <Label class="flex items-center gap-2">
            <Users class="h-4 w-4" />
            Attendees
          </Label>
          <div class="flex gap-2">
            <Input
              placeholder="Add attendee..."
              :value="newAttendee"
              @input="(e: Event) => (newAttendee = (e.target as HTMLInputElement).value)"
              @keypress.enter="addAttendee"
            />
            <Button variant="outline" class="cursor-pointer" @click="addAttendee">Add</Button>
          </div>
          <div v-if="formData.attendees.length > 0" class="mt-2 flex flex-wrap gap-2">
            <Badge
              v-for="(attendee, index) in formData.attendees"
              :key="index"
              variant="secondary"
              class="flex items-center gap-2 px-2 py-1"
            >
              <Avatar class="h-5 w-5">
                <AvatarFallback class="font-medium text-[10px]">{{ initials(attendee) }}</AvatarFallback>
              </Avatar>
              <span class="text-sm">{{ attendee }}</span>
              <button
                type="button"
                class="text-muted-foreground hover:text-foreground cursor-pointer"
                @click="removeAttendee(attendee)"
              >
                ×
              </button>
            </Badge>
          </div>
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Add description..."
            :value="formData.description"
            @input="(e: Event) => (formData.description = (e.target as HTMLTextAreaElement).value)"
          />
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-6">
          <Button class="flex-1 cursor-pointer" @click="handleSave">
            {{ props.event ? 'Update Event' : 'Create Event' }}
          </Button>
          <Button v-if="props.event" variant="destructive" class="cursor-pointer" @click="handleDelete">
            Delete
          </Button>
          <Button variant="outline" class="cursor-pointer" @click="emit('update:open', false)">
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
