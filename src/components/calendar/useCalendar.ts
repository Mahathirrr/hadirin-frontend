import { ref, type Ref } from 'vue'

import type { CalendarEvent } from './types'

export interface UseCalendarReturn {
  selectedDate: Ref<Date>
  showEventForm: Ref<boolean>
  editingEvent: Ref<CalendarEvent | null>
  showCalendarSheet: Ref<boolean>
  events: Ref<CalendarEvent[]>
  setSelectedDate: (date: Date) => void
  setShowEventForm: (show: boolean) => void
  setEditingEvent: (event: CalendarEvent | null) => void
  setShowCalendarSheet: (show: boolean) => void
  handleDateSelect: (date: Date) => void
  handleNewEvent: () => void
  handleNewCalendar: () => void
  handleSaveEvent: (eventData: Partial<CalendarEvent>) => void
  handleDeleteEvent: (eventId: number) => void
  handleEditEvent: (event: CalendarEvent) => void
}

export function useCalendar(initialEvents: CalendarEvent[] = []): UseCalendarReturn {
  const selectedDate = ref<Date>(new Date())
  const showEventForm = ref(false)
  const editingEvent = ref<CalendarEvent | null>(null)
  const showCalendarSheet = ref(false)
  const events = ref<CalendarEvent[]>(initialEvents)

  const handleDateSelect = (date: Date) => {
    selectedDate.value = date
    // Auto-close mobile sheet when date is selected
    showCalendarSheet.value = false
  }

  const handleNewEvent = () => {
    editingEvent.value = null
    showEventForm.value = true
  }

  const handleNewCalendar = () => {
    // eslint-disable-next-line no-console
    console.log('Creating new calendar')
  }

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    // eslint-disable-next-line no-console
    console.log('Saving event:', eventData)
    showEventForm.value = false
    editingEvent.value = null
  }

  const handleDeleteEvent = (eventId: number) => {
    // eslint-disable-next-line no-console
    console.log('Deleting event:', eventId)
    showEventForm.value = false
    editingEvent.value = null
  }

  const handleEditEvent = (event: CalendarEvent) => {
    editingEvent.value = event
    showEventForm.value = true
  }

  return {
    selectedDate,
    showEventForm,
    editingEvent,
    showCalendarSheet,
    events,
    setSelectedDate: (d) => (selectedDate.value = d),
    setShowEventForm: (s) => (showEventForm.value = s),
    setEditingEvent: (e) => (editingEvent.value = e),
    setShowCalendarSheet: (s) => (showCalendarSheet.value = s),
    handleDateSelect,
    handleNewEvent,
    handleNewCalendar,
    handleSaveEvent,
    handleDeleteEvent,
    handleEditEvent,
  }
}
