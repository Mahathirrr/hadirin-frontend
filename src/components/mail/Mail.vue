<script setup lang="ts">
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from 'lucide-vue-next'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { ref } from 'vue'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useMail } from '@/composables/useMail'
import type { Mail } from '@/views/data/mailData'

import AccountSwitcher from './AccountSwitcher.vue'
import MailDisplay from './MailDisplay.vue'
import MailList from './MailList.vue'
import Nav from './Nav.vue'

interface Account {
  label: string
  email: string
  iconPath: string
}

interface Props {
  accounts: Account[]
  mails: Mail[]
  defaultLayout?: number[]
  defaultCollapsed?: boolean
  navCollapsedSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  defaultLayout: () => [20, 32, 48],
  defaultCollapsed: false,
  navCollapsedSize: 4,
})

const [mail] = useMail()

const navSize = ref(props.defaultCollapsed ? props.navCollapsedSize : props.defaultLayout[0])
const isCollapsed = ref(props.defaultCollapsed)

function onResized(panes: { size: number }[]) {
  const navPane = panes[0]
  if (!navPane) return
  navSize.value = Math.max(4, Math.min(20, navPane.size))
  isCollapsed.value = navPane.size <= 6
}
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <Splitpanes
      class="h-full items-stretch overflow-hidden rounded-lg border"
      :dbl-click-splitter="false"
      @resized="onResized"
    >
      <!-- Nav panel -->
      <Pane :size="navSize" :min-size="4" :max-size="20">
        <div class="flex h-full flex-col overflow-hidden">
          <div
            :class="cn(
              'flex h-[52px] items-center justify-center',
              isCollapsed ? 'h-[52px]' : 'px-2',
            )"
          >
            <AccountSwitcher :is-collapsed="isCollapsed" :accounts="props.accounts" />
          </div>
          <Separator class="mx-0" />
          <div class="m-3">
            <Button class="w-full cursor-pointer">
              {{ isCollapsed ? '' : 'Compose' }}
              <Send class="size-4" />
            </Button>
          </div>
          <Separator class="mx-0" />
          <Nav
            :is-collapsed="isCollapsed"
            :links="[
              { title: 'Inbox', label: '128', icon: Inbox, variant: 'default' },
              { title: 'Drafts', label: '9', icon: File, variant: 'ghost' },
              { title: 'Sent', label: '', icon: Send, variant: 'ghost' },
              { title: 'Junk', label: '23', icon: ArchiveX, variant: 'ghost' },
              { title: 'Trash', label: '', icon: Trash2, variant: 'ghost' },
              { title: 'Archive', label: '', icon: Archive, variant: 'ghost' },
            ]"
          />
          <Separator class="mx-0" />
          <Nav
            :is-collapsed="isCollapsed"
            :links="[
              { title: 'Social', label: '972', icon: Users2, variant: 'ghost' },
              { title: 'Updates', label: '342', icon: AlertCircle, variant: 'ghost' },
              { title: 'Forums', label: '128', icon: MessagesSquare, variant: 'ghost' },
              { title: 'Shopping', label: '8', icon: ShoppingCart, variant: 'ghost' },
              { title: 'Promotions', label: '21', icon: Archive, variant: 'ghost' },
            ]"
          />
        </div>
      </Pane>

      <Pane :size="32" :min-size="30">
        <div class="flex h-full min-w-0 flex-col border-r">
          <Tabs default-value="all" class="flex flex-1 flex-col gap-1">
            <div class="flex items-center px-4 py-1.5">
              <h1 class="text-foreground text-xl font-bold">Inbox</h1>
              <TabsList class="ml-auto">
                <TabsTrigger value="all" class="cursor-pointer">All mail</TabsTrigger>
                <TabsTrigger value="unread" class="cursor-pointer">Unread</TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div
              class="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-4 backdrop-blur"
            >
              <form>
                <div class="relative">
                  <Search
                    class="text-muted-foreground absolute top-2.5 left-2 size-4 cursor-pointer"
                  />
                  <Input placeholder="Search" class="cursor-text pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" class="m-0">
              <MailList :items="props.mails" />
            </TabsContent>
            <TabsContent value="unread" class="m-0">
              <MailList :items="props.mails.filter((item) => !item.read)" />
            </TabsContent>
          </Tabs>
        </div>
      </Pane>

      <Pane :size="48" :min-size="30">
        <div class="h-full min-w-0">
          <MailDisplay
            :mail="props.mails.find((item) => item.id === mail.selected) || null"
          />
        </div>
      </Pane>
    </Splitpanes>
  </TooltipProvider>
</template>
