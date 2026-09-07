<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Circle,
  Clock,
  ListTodo,
  MoreHorizontal,
  PlayCircle,
  Plus,
  RefreshCcw,
  Settings2,
} from 'lucide-vue-next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

import tasksData from '@/views/data/tasksData'

interface Task {
  id: string
  title: string
  status: string
  category: string
  priority: string
}

const statuses = [
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'todo', label: 'Todo', icon: Circle },
  { value: 'in progress', label: 'In Progress', icon: PlayCircle },
  { value: 'completed', label: 'Completed', icon: CheckCircle2 },
]

const categories = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'documentation', label: 'Docs' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'refactor', label: 'Refactor' },
]

const priorities = [
  { label: 'Minor', value: 'minor' },
  { label: 'Normal', value: 'normal' },
  { label: 'Important', value: 'important' },
  { label: 'Critical', value: 'critical' },
]

const priorityColors: Record<string, string> = {
  critical: 'border-red-700 text-red-700 dark:text-red-400',
  important: 'border-orange-500 text-orange-700 dark:text-orange-400',
  normal: 'border-blue-500 text-blue-700 dark:text-blue-400',
  minor: 'border-gray-500 text-gray-700 dark:text-gray-400',
}

const tasks = ref<Task[]>(tasksData as Task[])

// filters / state
const search = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const priorityFilter = ref('all')
const sortKey = ref('')
const sortDir = ref<'asc' | 'desc'>('asc')
const pageSize = ref(10)
const pageIndex = ref(0)
const selected = ref<Set<string>>(new Set())

const columnVisibility = reactive<Record<string, boolean>>({
  title: true,
  category: true,
  status: true,
  priority: true,
})
const hideableColumns = ['title', 'category', 'status', 'priority']

const stats = computed(() => {
  const total = tasks.value.length
  const completed = tasks.value.filter((t) => t.status === 'completed').length
  const inProgress = tasks.value.filter((t) => t.status === 'in progress').length
  const pending = tasks.value.filter((t) => t.status === 'pending').length
  return { total, completed, inProgress, pending }
})

const isFiltered = computed(
  () =>
    search.value !== '' ||
    statusFilter.value !== 'all' ||
    categoryFilter.value !== 'all' ||
    priorityFilter.value !== 'all',
)

const filtered = computed(() =>
  tasks.value.filter((t) => {
    const matchesSearch =
      search.value === '' || t.title.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || t.status === statusFilter.value
    const matchesCategory = categoryFilter.value === 'all' || t.category === categoryFilter.value
    const matchesPriority = priorityFilter.value === 'all' || t.priority === priorityFilter.value
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  }),
)

const sorted = computed(() => {
  const rows = [...filtered.value]
  if (sortKey.value) {
    const key = sortKey.value as keyof Task
    const dir = sortDir.value === 'asc' ? 1 : -1
    rows.sort((a, b) => String(a[key]).localeCompare(String(b[key])) * dir)
  }
  return rows
})

const pageCount = computed(() => Math.max(1, Math.ceil(sorted.value.length / pageSize.value)))
const pageRows = computed(() => {
  const start = pageIndex.value * pageSize.value
  return sorted.value.slice(start, start + pageSize.value)
})
const selectedCount = computed(() => selected.value.size)
const allPageSelected = computed(() => pageRows.value.length > 0 && pageRows.value.every((r) => selected.value.has(r.id)))

function toggleSort(key: string) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

function toggleSelectAll() {
  const next = new Set(selected.value)
  if (allPageSelected.value) {
    pageRows.value.forEach((r) => next.delete(r.id))
  } else {
    pageRows.value.forEach((r) => next.add(r.id))
  }
  selected.value = next
}

function toggleRow(id: string) {
  const next = new Set(selected.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selected.value = next
}

function resetFilters() {
  search.value = ''
  statusFilter.value = 'all'
  categoryFilter.value = 'all'
  priorityFilter.value = 'all'
}

function sortIcon(key: string) {
  if (sortKey.value !== key) return ChevronsUpDown
  return sortDir.value === 'asc' ? ArrowUp : ArrowDown
}

// ----- Add Task dialog -----
const addOpen = ref(false)
const form = reactive({
  id: '',
  title: '',
  description: '',
  status: 'todo',
  category: 'feature',
  priority: 'normal',
})
const formErrors = ref<Record<string, string>>({})

function generateTaskId() {
  const number = Math.floor(Math.random() * 9999) + 1000
  return `TASK-${number}`
}

function submitAdd() {
  if (!form.title.trim()) {
    formErrors.value = { title: 'Title is required' }
    return
  }
  const newTask: Task = {
    id: generateTaskId(),
    title: form.title,
    status: form.status,
    category: form.category,
    priority: form.priority,
  }
  tasks.value = [newTask, ...tasks.value]
  Object.assign(form, { id: '', title: '', description: '', status: 'todo', category: 'feature', priority: 'normal' })
  formErrors.value = {}
  addOpen.value = false
}

function cancelAdd() {
  Object.assign(form, { id: '', title: '', description: '', status: 'todo', category: 'feature', priority: 'normal' })
  formErrors.value = {}
  addOpen.value = false
}
</script>

<template>
  <!-- Mobile view placeholder - shows message instead of images -->
  <div class="md:hidden">
    <div class="bg-muted/20 flex h-96 items-center justify-center rounded-lg border">
      <div class="p-8 text-center">
        <h3 class="mb-2 text-lg font-semibold">Tasks Dashboard</h3>
        <p class="text-muted-foreground">
          Please use a larger screen to view the full tasks interface.
        </p>
      </div>
    </div>
  </div>

  <!-- Desktop view -->
  <div class="hidden h-full flex-1 flex-col space-y-6 px-4 md:flex md:px-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card>
        <CardContent>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-foreground text-sm font-medium">Total Tasks</p>
              <div class="mt-1 flex items-baseline gap-2">
                <span class="text-2xl font-bold">{{ stats.total }}</span>
                <span class="flex items-center gap-0.5 text-sm text-green-500">
                  <ArrowUp class="size-3.5" />
                  {{ stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0 }}%
                </span>
              </div>
            </div>
            <div class="bg-secondary rounded-lg p-3">
              <ListTodo class="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-foreground text-sm font-medium">Completed</p>
              <div class="mt-1 flex items-baseline gap-2">
                <span class="text-2xl font-bold">{{ stats.completed }}</span>
                <span class="flex items-center gap-0.5 text-sm text-green-500">
                  <ArrowUp class="size-3.5" />
                  {{ Math.round((stats.completed / stats.total) * 100) }}%
                </span>
              </div>
            </div>
            <div class="bg-secondary rounded-lg p-3">
              <CheckCircle2 class="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-foreground text-sm font-medium">In Progress</p>
              <div class="mt-1 flex items-baseline gap-2">
                <span class="text-2xl font-bold">{{ stats.inProgress }}</span>
                <span class="flex items-center gap-0.5 text-sm text-green-500">
                  <ArrowUp class="size-3.5" />
                  {{ Math.round((stats.inProgress / stats.total) * 100) }}%
                </span>
              </div>
            </div>
            <div class="bg-secondary rounded-lg p-3">
              <Clock class="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-muted-foreground text-sm font-medium">Pending</p>
              <div class="mt-1 flex items-baseline gap-2">
                <span class="text-2xl font-bold">{{ stats.pending }}</span>
                <span class="flex items-center gap-0.5 text-sm text-orange-500">
                  <ArrowUp class="size-3.5" />
                  {{ Math.round((stats.pending / stats.total) * 100) }}%
                </span>
              </div>
            </div>
            <div class="bg-secondary rounded-lg p-3">
              <BarChart3 class="size-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Data Table -->
    <Card>
      <CardHeader>
        <CardTitle>Task Management</CardTitle>
        <CardDescription>
          View, filter, and manage all your project tasks in one place
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <!-- Filter Section -->
          <div class="space-y-3">
            <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
              <!-- Status Filter -->
              <Select :model-value="statusFilter" @update:model-value="statusFilter = $event">
                <SelectTrigger class="w-full cursor-pointer">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" class="cursor-pointer">All Status</SelectItem>
                  <SelectItem v-for="status in statuses" :key="status.value" :value="status.value" class="cursor-pointer">
                    <div class="flex items-center">
                      <component :is="status.icon" class="mr-2 h-4 w-4 text-muted-foreground" />
                      {{ status.label }}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <!-- Category Filter -->
              <Select :model-value="categoryFilter" @update:model-value="categoryFilter = $event">
                <SelectTrigger class="w-full cursor-pointer">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" class="cursor-pointer">All Categories</SelectItem>
                  <SelectItem v-for="category in categories" :key="category.value" :value="category.value" class="cursor-pointer">
                    {{ category.label }}
                  </SelectItem>
                </SelectContent>
              </Select>

              <!-- Priority Filter -->
              <Select :model-value="priorityFilter" @update:model-value="priorityFilter = $event">
                <SelectTrigger class="w-full cursor-pointer">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" class="cursor-pointer">All Priorities</SelectItem>
                  <SelectItem v-for="priority in priorities" :key="priority.value" :value="priority.value" class="cursor-pointer">
                    {{ priority.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Search and Actions Section -->
          <div class="flex items-center justify-between">
            <div class="flex flex-1 items-center space-x-2">
              <Input v-model="search" placeholder="Search Task" class="w-[200px] cursor-text lg:w-[300px]" />
              <Button variant="outline" @click="resetFilters" class="cursor-pointer px-3" :disabled="!isFiltered">
                <RefreshCcw class="h-4 w-4" />
                <span class="hidden lg:block">Reset Filters</span>
              </Button>
            </div>
            <div class="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="outline" size="sm" class="ml-auto mr-2 hidden h-8 cursor-pointer lg:flex">
                    <Settings2 />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" class="w-[150px]">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    v-for="col in hideableColumns"
                    :key="col"
                    class="cursor-pointer capitalize"
                    :checked="columnVisibility[col]"
                    @update:checked="columnVisibility[col] = $event"
                  >
                    {{ col }}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog v-model:open="addOpen">
                <DialogTrigger as-child>
                  <Button variant="default" size="sm" class="cursor-pointer">
                    <Plus class="h-4 w-4" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent class="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                      Create a new task to track work and progress. Fill in the details below.
                    </DialogDescription>
                  </DialogHeader>

                  <form @submit.prevent="submitAdd" class="space-y-6">
                    <div class="space-y-2">
                      <Label for="title">Task Title *</Label>
                      <Input
                        id="title"
                        v-model="form.title"
                        placeholder="Enter task title..."
                        :class="formErrors.title ? 'border-red-500' : ''"
                      />
                      <p v-if="formErrors.title" class="text-sm text-red-500">{{ formErrors.title }}</p>
                    </div>

                    <div class="space-y-2">
                      <Label for="description">Description</Label>
                      <Textarea
                        id="description"
                        v-model="form.description"
                        placeholder="Provide additional details about the task..."
                        rows="3"
                      />
                    </div>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div class="space-y-2">
                        <Label for="status">Status</Label>
                        <Select :model-value="form.status" @update:model-value="form.status = $event">
                          <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="status in statuses" :key="status.value" :value="status.value">
                              <div class="flex items-center">
                                <component :is="status.icon" class="mr-2 h-4 w-4 text-muted-foreground" />
                                {{ status.label }}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div class="space-y-2">
                        <Label for="category">Category</Label>
                        <Select :model-value="form.category" @update:model-value="form.category = $event">
                          <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="category in categories" :key="category.value" :value="category.value">
                              {{ category.label }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div class="space-y-2">
                        <Label for="priority">Priority</Label>
                        <Select :model-value="form.priority" @update:model-value="form.priority = $event">
                          <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="priority in priorities" :key="priority.value" :value="priority.value">
                              {{ priority.label }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div class="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" class="cursor-pointer" @click="cancelAdd">
                        Cancel
                      </Button>
                      <Button type="submit" class="cursor-pointer">
                        <Plus class="mr-2 h-4 w-4" />
                        Create Task
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <!-- Table -->
          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead class="w-12">
                    <Checkbox
                      :checked="allPageSelected"
                      @update:checked="toggleSelectAll"
                      aria-label="Select all"
                      class="translate-y-[2px] cursor-pointer"
                    />
                  </TableHead>
                  <TableHead v-if="true">
                    <Button variant="ghost" size="sm" class="-ml-3 h-8 cursor-pointer hover:bg-accent" @click="toggleSort('id')">
                      <span>Task</span>
                      <component :is="sortIcon('id')" class="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead v-if="columnVisibility.title">
                    <Button variant="ghost" size="sm" class="-ml-3 h-8 cursor-pointer hover:bg-accent" @click="toggleSort('title')">
                      <span>Title</span>
                      <component :is="sortIcon('title')" class="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead v-if="columnVisibility.category">
                    <Button variant="ghost" size="sm" class="-ml-3 h-8 cursor-pointer hover:bg-accent" @click="toggleSort('category')">
                      <span>Category</span>
                      <component :is="sortIcon('category')" class="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead v-if="columnVisibility.status">
                    <Button variant="ghost" size="sm" class="-ml-3 h-8 cursor-pointer hover:bg-accent" @click="toggleSort('status')">
                      <span>Status</span>
                      <component :is="sortIcon('status')" class="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead v-if="columnVisibility.priority">
                    <Button variant="ghost" size="sm" class="-ml-3 h-8 cursor-pointer hover:bg-accent" @click="toggleSort('priority')">
                      <span>Priority</span>
                      <component :is="sortIcon('priority')" class="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead class="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="row in pageRows" :key="row.id" :data-state="selected.has(row.id) ? 'selected' : undefined">
                  <TableCell class="w-12">
                    <Checkbox
                      :checked="selected.has(row.id)"
                      @update:checked="toggleRow(row.id)"
                      aria-label="Select row"
                      class="translate-y-[2px] cursor-pointer"
                    />
                  </TableCell>
                  <TableCell>
                    <div class="w-[90px] font-medium">{{ row.id }}</div>
                  </TableCell>
                  <TableCell v-if="columnVisibility.title">
                    <div class="flex space-x-2">
                      <span class="max-w-[500px] truncate font-medium">{{ row.title }}</span>
                    </div>
                  </TableCell>
                  <TableCell v-if="columnVisibility.category">
                    <div class="flex w-[120px] items-center">
                      <Badge variant="outline">
                        {{ categories.find((c) => c.value === row.category)?.label }}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell v-if="columnVisibility.status">
                    <div class="flex w-[130px] items-center">
                      <component
                        :is="statuses.find((s) => s.value === row.status)?.icon"
                        class="mr-2 h-4 w-4 text-muted-foreground"
                      />
                      <span class="text-sm">{{ statuses.find((s) => s.value === row.status)?.label }}</span>
                    </div>
                  </TableCell>
                  <TableCell v-if="columnVisibility.priority">
                    <div class="flex items-center">
                      <Badge
                        variant="outline"
                        :class="cn('pl-2', priorityColors[row.priority])"
                      >
                        <span class="text-sm">{{ priorities.find((p) => p.value === row.priority)?.label }}</span>
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell class="w-12">
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" class="flex h-8 w-8 cursor-pointer p-0 data-[state=open]:bg-muted">
                          <MoreHorizontal />
                          <span class="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" class="w-[160px]">
                        <DropdownMenuItem class="cursor-pointer">View Task</DropdownMenuItem>
                        <DropdownMenuItem class="cursor-pointer">Edit Task</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem class="cursor-pointer">Duplicate</DropdownMenuItem>
                        <DropdownMenuItem class="cursor-pointer">Mark as Favorite</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem class="cursor-pointer" variant="destructive">
                          Delete
                          <DropdownMenuShortcut class="text-destructive">⌘⌫</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow v-if="pageRows.length === 0">
                  <TableCell :colspan="7" class="h-24 text-center">No results.</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between px-2">
            <div class="text-muted-foreground hidden flex-1 text-sm lg:block">
              {{ selectedCount }} of {{ sorted.length }} row(s) selected.
            </div>
            <div class="flex items-center space-x-6 lg:space-x-8">
              <div class="flex items-center space-x-2">
                <p class="text-sm font-medium">Rows per page</p>
                <Select :model-value="String(pageSize)" @update:model-value="pageSize = Number($event); pageIndex = 0">
                  <SelectTrigger class="h-8 w-[70px] cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem v-for="size in [10, 20, 30, 40, 50]" :key="size" :value="String(size)" class="cursor-pointer">
                      {{ size }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex items-center space-x-2">
                <Button
                  variant="outline"
                  class="hidden h-8 w-8 cursor-pointer p-0 lg:flex disabled:cursor-not-allowed"
                  @click="pageIndex = 0"
                  :disabled="pageIndex === 0"
                >
                  <span class="sr-only">Go to first page</span>
                  <ChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  class="h-8 w-8 cursor-pointer p-0 disabled:cursor-not-allowed"
                  @click="pageIndex--"
                  :disabled="pageIndex === 0"
                >
                  <span class="sr-only">Go to previous page</span>
                  <ChevronLeft />
                </Button>
                <div class="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {{ pageIndex + 1 }} of {{ pageCount }}
                </div>
                <Button
                  variant="outline"
                  class="h-8 w-8 cursor-pointer p-0 disabled:cursor-not-allowed"
                  @click="pageIndex++"
                  :disabled="pageIndex >= pageCount - 1"
                >
                  <span class="sr-only">Go to next page</span>
                  <ChevronRight />
                </Button>
                <Button
                  variant="outline"
                  class="hidden h-8 w-8 cursor-pointer p-0 lg:flex disabled:cursor-not-allowed"
                  @click="pageIndex = pageCount - 1"
                  :disabled="pageIndex >= pageCount - 1"
                >
                  <span class="sr-only">Go to last page</span>
                  <ChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
