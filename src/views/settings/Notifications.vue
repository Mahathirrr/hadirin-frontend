<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Bell, Mail, MessageSquare } from 'lucide-vue-next'
import { z } from 'zod'

import BaseLayout from '@/components/layouts/base-layout.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const notificationsFormSchema = z.object({
  emailSecurity: z.boolean(),
  emailUpdates: z.boolean(),
  emailMarketing: z.boolean(),
  pushMessages: z.boolean(),
  pushMentions: z.boolean(),
  pushTasks: z.boolean(),
  emailFrequency: z.string(),
  quietHoursStart: z.string(),
  quietHoursEnd: z.string(),
  channelEmail: z.boolean(),
  channelPush: z.boolean(),
  channelSms: z.boolean(),
  orderUpdatesEmail: z.boolean(),
  orderUpdatesBrowser: z.boolean(),
  orderUpdatesApp: z.boolean(),
  invoiceRemindersEmail: z.boolean(),
  invoiceRemindersBrowser: z.boolean(),
  invoiceRemindersApp: z.boolean(),
  promotionalOffersEmail: z.boolean(),
  promotionalOffersBrowser: z.boolean(),
  promotionalOffersApp: z.boolean(),
  systemMaintenanceEmail: z.boolean(),
  systemMaintenanceBrowser: z.boolean(),
  systemMaintenanceApp: z.boolean(),
  notificationTiming: z.string(),
})

const schema = toTypedSchema(notificationsFormSchema)

function onSubmit(data: unknown) {
  // eslint-disable-next-line no-console
  console.log('Notifications settings submitted:', data)
}
</script>

<template>
  <BaseLayout>
    <div class="space-y-6 px-4 lg:px-6">
      <div>
        <h1 class="text-3xl font-bold">Notifications</h1>
        <p class="text-muted-foreground">Configure how you receive notifications.</p>
      </div>

      <Form :validation-schema="schema" class="space-y-6" @submit="onSubmit">
        <div class="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what email notifications you want to receive.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="space-y-4">
                <FormField v-slot="{ field }" name="emailSecurity">
                  <FormItem class="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox :checked="field.checked" @update:checked="field.onChange" />
                    </FormControl>
                    <div class="space-y-1">
                      <FormLabel>Security alerts</FormLabel>
                      <p class="text-sm text-muted-foreground">Get notified when there are security events on your account.</p>
                    </div>
                  </FormItem>
                </FormField>
                <FormField v-slot="{ field }" name="emailUpdates">
                  <FormItem class="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox :checked="field.checked" @update:checked="field.onChange" />
                    </FormControl>
                    <div class="space-y-1">
                      <FormLabel>Product updates</FormLabel>
                      <p class="text-sm text-muted-foreground">Receive updates about new features and improvements.</p>
                    </div>
                  </FormItem>
                </FormField>
                <FormField v-slot="{ field }" name="emailMarketing">
                  <FormItem class="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox :checked="field.checked" @update:checked="field.onChange" />
                    </FormControl>
                    <div class="space-y-1">
                      <FormLabel>Marketing emails</FormLabel>
                      <p class="text-sm text-muted-foreground">Receive emails about our latest offers and promotions.</p>
                    </div>
                  </FormItem>
                </FormField>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Configure browser and mobile push notifications.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="space-y-4">
                <FormField v-slot="{ field }" name="pushMessages">
                  <FormItem class="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox :checked="field.checked" @update:checked="field.onChange" />
                    </FormControl>
                    <div class="space-y-1">
                      <FormLabel>New messages</FormLabel>
                      <p class="text-sm text-muted-foreground">Get notified when you receive new messages.</p>
                    </div>
                  </FormItem>
                </FormField>
                <FormField v-slot="{ field }" name="pushMentions">
                  <FormItem class="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox :checked="field.checked" @update:checked="field.onChange" />
                    </FormControl>
                    <div class="space-y-1">
                      <FormLabel>Mentions</FormLabel>
                      <p class="text-sm text-muted-foreground">Get notified when someone mentions you.</p>
                    </div>
                  </FormItem>
                </FormField>
                <FormField v-slot="{ field }" name="pushTasks">
                  <FormItem class="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox :checked="field.checked" @update:checked="field.onChange" />
                    </FormControl>
                    <div class="space-y-1">
                      <FormLabel>Task updates</FormLabel>
                      <p class="text-sm text-muted-foreground">Get notified about task assignments and updates.</p>
                    </div>
                  </FormItem>
                </FormField>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Notification Frequency</CardTitle>
            <CardDescription>Control how often you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField v-slot="{ field }" name="emailFrequency">
              <FormItem>
                <FormLabel>Email Frequency</FormLabel>
                <Select :model-value="field.value" @update:model-value="field.onChange">
                  <FormControl>
                    <SelectTrigger class="w-full"><SelectValue placeholder="Select frequency" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="hourly">Hourly digest</SelectItem>
                    <SelectItem value="daily">Daily digest</SelectItem>
                    <SelectItem value="weekly">Weekly digest</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormItem>
              <FormLabel>Quiet Hours</FormLabel>
              <div class="flex space-x-2">
                <FormField v-slot="{ field }" name="quietHoursStart">
                  <Select :model-value="field.value" @update:model-value="field.onChange">
                    <FormControl>
                      <SelectTrigger class="w-50"><SelectValue placeholder="Start" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="22:00">10:00 PM</SelectItem>
                      <SelectItem value="23:00">11:00 PM</SelectItem>
                      <SelectItem value="00:00">12:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <span class="self-center">to</span>
                <FormField v-slot="{ field }" name="quietHoursEnd">
                  <Select :model-value="field.value" @update:model-value="field.onChange">
                    <FormControl>
                      <SelectTrigger class="w-50"><SelectValue placeholder="End" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="06:00">6:00 AM</SelectItem>
                      <SelectItem value="07:00">7:00 AM</SelectItem>
                      <SelectItem value="08:00">8:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </FormItem>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              We need permission from your browser to show notifications.
              <Button variant="link" class="p-0 h-auto text-primary" type="button">Request Permission</Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-[200px]">TYPE</TableHead>
                    <TableHead class="text-center">EMAIL</TableHead>
                    <TableHead class="text-center">BROWSER</TableHead>
                    <TableHead class="text-center">APP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell class="font-medium">Order updates</TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="orderUpdatesEmail"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="orderUpdatesBrowser"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="orderUpdatesApp"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell class="font-medium">Invoice reminders</TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="invoiceRemindersEmail"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="invoiceRemindersBrowser"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="invoiceRemindersApp"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell class="font-medium">Promotional offers</TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="promotionalOffersEmail"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="promotionalOffersBrowser"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="promotionalOffersApp"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell class="font-medium">System maintenance</TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="systemMaintenanceEmail"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="systemMaintenanceBrowser"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                    <TableCell class="text-center"><FormField v-slot="{ field }" name="systemMaintenanceApp"><FormItem><FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl></FormItem></FormField></TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div class="space-y-4">
                <FormField v-slot="{ field }" name="notificationTiming">
                  <FormItem>
                    <FormLabel>When should we send you notifications?</FormLabel>
                    <Select :model-value="field.value" @update:model-value="field.onChange">
                      <FormControl><SelectTrigger class="w-full max-w-sm"><SelectValue placeholder="Select timing" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="online">Only When I'm online</SelectItem>
                        <SelectItem value="always">Always</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>Choose your preferred notification channels for different types of alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <FormField v-slot="{ field }" name="channelEmail">
                <FormItem class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <Mail class="h-5 w-5 text-muted-foreground" />
                    <div>
                      <FormLabel class="font-medium mb-1">Email</FormLabel>
                      <div class="text-sm text-muted-foreground">Receive notifications via email</div>
                    </div>
                  </div>
                  <FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl>
                </FormItem>
              </FormField>
              <Separator />
              <FormField v-slot="{ field }" name="channelPush">
                <FormItem class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <Bell class="h-5 w-5 text-muted-foreground" />
                    <div>
                      <FormLabel class="font-medium mb-1">Push Notifications</FormLabel>
                      <div class="text-sm text-muted-foreground">Receive browser push notifications</div>
                    </div>
                  </div>
                  <FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl>
                </FormItem>
              </FormField>
              <Separator />
              <FormField v-slot="{ field }" name="channelSms">
                <FormItem class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <MessageSquare class="h-5 w-5 text-muted-foreground" />
                    <div>
                      <FormLabel class="font-medium mb-1">SMS</FormLabel>
                      <div class="text-sm text-muted-foreground">Receive notifications via SMS</div>
                    </div>
                  </div>
                  <FormControl><Checkbox :checked="field.checked" @update:checked="field.onChange" /></FormControl>
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>

        <div class="flex space-x-2">
          <Button type="submit" class="cursor-pointer">Save Preferences</Button>
          <Button variant="outline" type="reset" class="cursor-pointer">Cancel</Button>
        </div>
      </Form>
    </div>
  </BaseLayout>
</template>
