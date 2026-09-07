<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import {
  ArrowUpRight,
  ChevronDown,
  Clock5,
  CreditCard,
  Download,
  EllipsisVertical,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users as UsersIcon,
} from 'lucide-vue-next'
import { computed, reactive, ref } from 'vue'
import { z } from 'zod'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import usersData from '@/views/data/usersData'

interface User {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  plan: string
  billing: string
  status: string
  joinedDate: string
  lastLogin: string
}

const users = ref<User[]>(usersData as User[])

function generateAvatar(name: string) {
  const names = name.split(' ')
  if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

// ---------- Stat cards ----------
const performanceMetrics = [
  { title: 'Total Users', current: '$2.4M', previous: '$1.8M', growth: 33.3, icon: UsersIcon },
  { title: 'Paid Users', current: '12.5K', previous: '9.2K', growth: 35.9, icon: CreditCard },
  { title: 'Active Users', current: '8.9k', previous: '6.7k', growth: 32.8, icon: UserCheck },
  { title: 'Pending Users', current: '17%', previous: '24%', growth: -8.0, icon: Clock5 },
]

// ---------- Table state ----------
const globalFilter = ref('')
const roleFilter = ref('')
const planFilter = ref('')
const statusFilter = ref('')
const columnVisibility = reactive<Record<string, boolean>>({
  role: true,
  plan: true,
  billing: true,
  status: true,
})
const hideableColumns = ['role', 'plan', 'billing', 'status']
const selected = ref<Set<number>>(new Set())
const pageIndex = ref(0)
const pageSize = ref(10)
const sortKey = ref<keyof User | ''>('')
const sortDir = ref<'asc' | 'desc'>('asc')

const filteredUsers = computed(() => {
  const q = globalFilter.value.toLowerCase()
  return users.value.filter((u) => {
    const matchesGlobal =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    const matchesRole = !roleFilter.value || u.role === roleFilter.value
    const matchesPlan = !planFilter.value || u.plan === planFilter.value
    const matchesStatus = !statusFilter.value || u.status === statusFilter.value
    return matchesGlobal && matchesRole && matchesPlan && matchesStatus
  })
})

const sortedUsers = computed(() => {
  const rows = [...filteredUsers.value]
  if (sortKey.value) {
    const key = sortKey.value
    const dir = sortDir.value === 'asc' ? 1 : -1
    rows.sort((a, b) => String(a[key]).localeCompare(String(b[key])) * dir)
  }
  return rows
})

const pageRows = computed(() => {
  const start = pageIndex.value * pageSize.value
  return sortedUsers.value.slice(start, start + pageSize.value)
})
const pageCount = computed(() => Math.max(1, Math.ceil(sortedUsers.value.length / pageSize.value)))
const selectedCount = computed(() => selected.value.size)
const allSelected = computed(() => pageRows.value.length > 0 && pageRows.value.every((r) => selected.value.has(r.id)))

function toggleSort(key: keyof User) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}
function toggleSelectAll() {
  const next = new Set(selected.value)
  const checked = allSelected.value
  pageRows.value.forEach((r) => {
    if (checked) next.delete(r.id)
    else next.add(r.id)
  })
  selected.value = next
}
function toggleRow(id: number) {
  const next = new Set(selected.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selected.value = next
}

function getStatusColor(status: string) {
  switch (status) {
    case 'Active':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
    case 'Pending':
      return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20'
    case 'Error':
      return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
    default:
      return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
  }
}
function getRoleColor(role: string) {
  switch (role) {
    case 'Admin':
      return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
    case 'Editor':
      return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
    case 'Author':
      return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
    case 'Maintainer':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
    case 'Subscriber':
      return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20'
    default:
      return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
  }
}

// ---------- Add user dialog ----------
const open = ref(false)
const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  role: z.string().min(1, 'Please select a role.'),
  plan: z.string().min(1, 'Please select a plan.'),
  billing: z.string().min(1, 'Please select a billing method.'),
  status: z.string().min(1, 'Please select a status.'),
})
const schema = toTypedSchema(userFormSchema)
const formRef = ref<{ resetForm: () => void } | null>(null)

function onSubmit(values: Record<string, unknown>) {
  const data = values as unknown as { name: string; email: string; role: string; plan: string; billing: string; status: string }
  const newUser: User = {
    id: Math.max(...users.value.map((u) => u.id)) + 1,
    name: data.name,
    email: data.email,
    avatar: generateAvatar(data.name),
    role: data.role,
    plan: data.plan,
    billing: data.billing,
    status: data.status,
    joinedDate: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString().split('T')[0],
  }
  users.value = [newUser, ...users.value]
  formRef.value?.resetForm()
  open.value = false
}

function deleteUser(id: number) {
  users.value = users.value.filter((u) => u.id !== id)
}
function editUser(user: User) {
  // eslint-disable-next-line no-console
  console.log('Edit user:', user)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="@container/main px-4 lg:px-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="m in performanceMetrics" :key="m.title" class="border">
          <CardContent class="space-y-4">
            <div class="flex items-center justify-between">
              <component :is="m.icon" class="text-muted-foreground size-6" />
              <Badge
                variant="outline"
                :class="
                  m.growth >= 0
                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400'
                    : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400'
                "
              >
                <template v-if="m.growth >= 0">
                  <TrendingUp class="me-1 size-3" />
                  +{{ m.growth }}%
                </template>
                <template v-else>
                  <TrendingDown class="me-1 size-3" />
                  {{ m.growth }}%
                </template>
              </Badge>
            </div>

            <div class="space-y-2">
              <p class="text-muted-foreground text-sm font-medium">{{ m.title }}</p>
              <div class="text-2xl font-bold">{{ m.current }}</div>
              <div class="text-muted-foreground flex items-center gap-2 text-sm">
                <span>from {{ m.previous }}</span>
                <ArrowUpRight class="size-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <div class="@container/main mt-8 px-4 lg:mt-12 lg:px-6">
      <div class="w-full space-y-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-1 items-center space-x-2">
            <div class="relative max-w-sm flex-1">
              <Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                v-model="globalFilter"
                placeholder="Search users..."
                class="pl-9"
              />
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <Button variant="outline" class="cursor-pointer">
              <Download class="mr-2 size-4" />
              Export
            </Button>
            <Dialog v-model:open="open">
              <DialogTrigger as-child>
                <Button class="cursor-pointer">
                  <Plus class="mr-2 h-4 w-4" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form
                  ref="formRef"
                  :validation-schema="schema"
                  class="space-y-4"
                  @submit="onSubmit"
                >
                  <FormField v-slot="{ componentField }" name="name">
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <FormField v-slot="{ componentField }" name="email">
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ field }" name="role">
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select :model-value="field.value" @update:model-value="field.onChange">
                          <FormControl>
                            <SelectTrigger class="w-full cursor-pointer">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Author">Author</SelectItem>
                            <SelectItem value="Editor">Editor</SelectItem>
                            <SelectItem value="Maintainer">Maintainer</SelectItem>
                            <SelectItem value="Subscriber">Subscriber</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                    <FormField v-slot="{ field }" name="plan">
                      <FormItem>
                        <FormLabel>Plan</FormLabel>
                        <Select :model-value="field.value" @update:model-value="field.onChange">
                          <FormControl>
                            <SelectTrigger class="w-full cursor-pointer">
                              <SelectValue placeholder="Select plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ field }" name="billing">
                      <FormItem>
                        <FormLabel>Billing</FormLabel>
                        <Select :model-value="field.value" @update:model-value="field.onChange">
                          <FormControl>
                            <SelectTrigger class="w-full cursor-pointer">
                              <SelectValue placeholder="Select billing" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Auto Debit">Auto Debit</SelectItem>
                            <SelectItem value="UPI">UPI</SelectItem>
                            <SelectItem value="Paypal">Paypal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                    <FormField v-slot="{ field }" name="status">
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select :model-value="field.value" @update:model-value="field.onChange">
                          <FormControl>
                            <SelectTrigger class="w-full cursor-pointer">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Error">Error</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                  <DialogFooter>
                    <Button type="submit" class="cursor-pointer">Save User</Button>
                  </DialogFooter>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div class="grid gap-2 sm:grid-cols-4 sm:gap-4">
          <div class="space-y-2">
            <Label for="role-filter" class="text-sm font-medium">Role</Label>
            <Select :model-value="roleFilter" @update:model-value="roleFilter = $event === 'all' ? '' : $event">
              <SelectTrigger class="w-full cursor-pointer" id="role-filter">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Author">Author</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Maintainer">Maintainer</SelectItem>
                <SelectItem value="Subscriber">Subscriber</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="plan-filter" class="text-sm font-medium">Plan</Label>
            <Select :model-value="planFilter" @update:model-value="planFilter = $event === 'all' ? '' : $event">
              <SelectTrigger class="w-full cursor-pointer" id="plan-filter">
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="status-filter" class="text-sm font-medium">Status</Label>
            <Select :model-value="statusFilter" @update:model-value="statusFilter = $event === 'all' ? '' : $event">
              <SelectTrigger class="w-full cursor-pointer" id="status-filter">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Error">Error</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label for="column-visibility" class="text-sm font-medium">Column Visibility</Label>
            <DropdownMenu>
              <DropdownMenuTrigger as-child id="column-visibility">
                <Button variant="outline" class="w-full cursor-pointer">
                  Columns <ChevronDown class="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
          </div>
        </div>

        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div class="flex items-center justify-center px-2">
                    <Checkbox :checked="allSelected" @update:checked="toggleSelectAll" aria-label="Select all" />
                  </div>
                </TableHead>
                <TableHead class="cursor-pointer" @click="toggleSort('name')">User</TableHead>
                <TableHead v-if="columnVisibility.role" class="cursor-pointer" @click="toggleSort('role')">Role</TableHead>
                <TableHead v-if="columnVisibility.plan" class="cursor-pointer" @click="toggleSort('plan')">Plan</TableHead>
                <TableHead v-if="columnVisibility.billing" class="cursor-pointer" @click="toggleSort('billing')">Billing</TableHead>
                <TableHead v-if="columnVisibility.status" class="cursor-pointer" @click="toggleSort('status')">Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="user in pageRows"
                :key="user.id"
                :data-state="selected.has(user.id) ? 'selected' : undefined"
              >
                <TableCell>
                  <div class="flex items-center justify-center px-2">
                    <Checkbox :checked="selected.has(user.id)" @update:checked="toggleRow(user.id)" aria-label="Select row" />
                  </div>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-3">
                    <Avatar class="h-8 w-8">
                      <AvatarFallback class="text-xs font-medium">{{ user.avatar }}</AvatarFallback>
                    </Avatar>
                    <div class="flex flex-col">
                      <span class="font-medium">{{ user.name }}</span>
                      <span class="text-muted-foreground text-sm">{{ user.email }}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell v-if="columnVisibility.role">
                  <Badge variant="secondary" :class="getRoleColor(user.role)">{{ user.role }}</Badge>
                </TableCell>
                <TableCell v-if="columnVisibility.plan">
                  <span class="font-medium">{{ user.plan }}</span>
                </TableCell>
                <TableCell v-if="columnVisibility.billing">
                  <span class="text-sm">{{ user.billing }}</span>
                </TableCell>
                <TableCell v-if="columnVisibility.status">
                  <Badge variant="secondary" :class="getStatusColor(user.status)">{{ user.status }}</Badge>
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Button variant="ghost" size="icon" class="h-8 w-8 cursor-pointer">
                      <Eye class="size-4" />
                      <span class="sr-only">View user</span>
                    </Button>
                    <Button variant="ghost" size="icon" class="h-8 w-8 cursor-pointer" @click="editUser(user)">
                      <Pencil class="size-4" />
                      <span class="sr-only">Edit user</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button variant="ghost" size="icon" class="h-8 w-8 cursor-pointer">
                          <EllipsisVertical class="size-4" />
                          <span class="sr-only">More actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem class="cursor-pointer">View Details</DropdownMenuItem>
                        <DropdownMenuItem class="cursor-pointer">Send Email</DropdownMenuItem>
                        <DropdownMenuItem class="cursor-pointer">Reset Password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" class="cursor-pointer" @click="deleteUser(user.id)">
                          <Trash2 class="mr-2 size-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow v-if="pageRows.length === 0">
                <TableCell :colspan="7" class="h-24 text-center">No results.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div class="flex items-center justify-between space-x-2 py-4">
          <div class="flex items-center space-x-2">
            <Label for="page-size" class="text-sm font-medium">Show</Label>
            <Select :model-value="String(pageSize)" @update:model-value="pageSize = Number($event)">
              <SelectTrigger class="w-20 cursor-pointer" id="page-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectItem v-for="s in [10, 20, 30, 40, 50]" :key="s" :value="String(s)">{{ s }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="text-muted-foreground hidden flex-1 text-sm sm:block">
            {{ selectedCount }} of {{ filteredUsers.length }} row(s) selected.
          </div>
          <div class="flex items-center space-x-6 lg:space-x-8">
            <div class="hidden items-center space-x-2 sm:flex">
              <p class="text-sm font-medium">Page</p>
              <strong class="text-sm">{{ pageIndex + 1 }} of {{ pageCount }}</strong>
            </div>
            <div class="flex items-center space-x-2">
              <Button variant="outline" size="sm" class="cursor-pointer" :disabled="pageIndex === 0" @click="pageIndex--">
                Previous
              </Button>
              <Button variant="outline" size="sm" class="cursor-pointer" :disabled="pageIndex >= pageCount - 1" @click="pageIndex++">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
